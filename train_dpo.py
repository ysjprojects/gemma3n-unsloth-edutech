from unsloth import FastModel, PatchDPOTrainer
import torch
import os


def load_model_and_tokenizer(model_name: str = "unsloth/gemma-3n-E4B-it"):
    model, tokenizer = FastModel.from_pretrained(
        model_name=model_name,
        dtype=None,
        max_seq_length=32768,
        full_finetuning=False,
        load_in_8bit=False,
        load_in_4bit=False,
    )

    from unsloth.chat_templates import get_chat_template
    tokenizer = get_chat_template(tokenizer, chat_template = "gemma-3")

    return model, tokenizer

def load_lora_model(base_model):
    model = FastModel.get_peft_model(
        base_model,
        finetune_vision_layers = False,
        finetune_language_layers = True,
        finetune_attention_modules = True,
        finetune_mlp_modules = True,
        r = 64,
        lora_alpha = 64,
        lora_dropout = 0,
        bias="none",
        random_state=3407,
    )
    return model

def formatting_dpo_prompts_func(examples, tokenizer):
    """
    Correctly formats a batch of examples for DPO training.
    
    The function iterates over each example in the batch ('examples'), 
    constructs the conversation history for both the 'chosen' and 'rejected'
    responses, and then applies the chat template.
    """
    # Initialize lists to store the formatted strings for the entire batch
    all_chosen = []
    all_rejected = []
    
    # Get the list of prompts, chosen responses, and rejected responses from the batch
    prompts = examples["prompt"]
    chosen_responses = examples["chosen"]
    rejected_responses = examples["rejected"]
    
    # Iterate over each example in the batch
    for i in range(len(prompts)):
        # Format the chosen conversation
        chosen_messages = [
            {"role": "user", "content": prompts[i]},
            {"role": "assistant", "content": chosen_responses[i]}
        ]
        # apply_chat_template expects a list of dictionaries
        formatted_chosen = tokenizer.apply_chat_template(
            chosen_messages, 
            tokenize=False, 
            add_generation_prompt=False
        ).removeprefix('<bos>')
        all_chosen.append(formatted_chosen)
        
        # Format the rejected conversation
        rejected_messages = [
            {"role": "user", "content": prompts[i]},
            {"role": "assistant", "content": rejected_responses[i]}
        ]
        # apply_chat_template expects a list of dictionaries
        formatted_rejected = tokenizer.apply_chat_template(
            rejected_messages, 
            tokenize=False, 
            add_generation_prompt=False
        ).removeprefix('<bos>')
        all_rejected.append(formatted_rejected)

    # Return a dictionary where values are lists of formatted strings
    return {
        "text_chosen": all_chosen,
        "text_rejected": all_rejected,
    }

def format(example):
    prompt = [
        {
            "role": "user",
            "content": [{"type": "text", "text": example["prompt"]}],
        },
    ]
    chosen = [
        {
            "role": "assistant",
            "content": [{"type": "text", "text": example["chosen"]}],
        },
    ]
    rejected = [
        {
            "role": "assistant",
            "content": [{"type": "text", "text": example["rejected"]}],
        },
    ]

    return {"prompt": prompt, "chosen": chosen, "rejected": rejected}
    
def prepare_dpo_data(data_path: str, tokenizer):
    from datasets import load_dataset
    
    dataset = load_dataset("json", data_files=data_path, split="train")
    '''dataset = dataset.map(
        lambda example: formatting_dpo_prompts_func(example, tokenizer), 
        batched=True,
        num_proc=os.cpu_count()//2,
        remove_columns=["chosen", "rejected", "prompt"],
    )'''

    dataset = dataset.map(
        lambda example: format(example),
        remove_columns=dataset.column_names,
    )

    return dataset


def train_dpo(model, tokenizer, train_dataset, eval_dataset=None, use_wandb=True, output_dir="./models", **kwargs):
    from trl import DPOTrainer, DPOConfig
    
    if use_wandb:
        import wandb
        wandb.init(project="gemma3n-unsloth-edutech", name=f"dpo_lora-r-64_gemma-3n-E4B-it")
        report_to = "wandb"
    else:
        report_to = "none"
    
    os.makedirs(output_dir, exist_ok=True)

    trainer = DPOTrainer(
        model = model,
        processing_class= tokenizer.tokenizer,
        train_dataset = train_dataset,
        eval_dataset = eval_dataset,
        args = DPOConfig(
            max_grad_norm = 1.0,
            per_device_train_batch_size = 1,  # Smaller batch size for DPO
            gradient_accumulation_steps = 16,  # Increase GA to maintain effective batch size
            warmup_ratio = 0.03,
            num_train_epochs = 1,  # DPO typically needs fewer epochs
            learning_rate = 1e-7,  # Much lower learning rate for DPO
            logging_steps = 10,
            optim = "paged_adamw_8bit",
            weight_decay = 0.01,
            lr_scheduler_type = "cosine",
            seed = 3407,
            report_to = report_to,
            output_dir = output_dir,
            save_strategy = "steps",
            save_steps = 100,
            save_total_limit = 5,
            beta = 0.25,  # DPO beta parameter (strength of preference optimization)
            remove_unused_columns = False,
            max_length = 10248,
            max_prompt_length = 2048,
            max_completion_length = 8192,
        ),
    )

    trainer_stats = trainer.train()

    # Save final model
    model.save_pretrained_merged(output_dir, tokenizer, save_method = "merged_16bit",)
    print(f"Final model saved to {output_dir}")
    return trainer, trainer_stats


if __name__ == "__main__":
    PatchDPOTrainer()

    torch._dynamo.config.cache_size_limit = 32

    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--model_name", type=str, default="/data/gemma3n-unsloth-edutech/models/merged/sft_lora-r-16_gemma-3n-E4B-it")
    parser.add_argument("--train_data_path", type=str, default="data_processed/dpo_dataset.json")
    parser.add_argument("--eval_data_path", type=str, default=None)
    parser.add_argument("--output_dir", type=str, default="models/dpo_lora-r-64_gemma-3n-E4B-it")
    parser.add_argument("--use_wandb", action="store_true", default=True)
    parser.add_argument("--beta", type=float, default=0.1, help="DPO beta parameter")
    args = parser.parse_args()
    
    model, tokenizer = load_model_and_tokenizer(args.model_name)
    model = load_lora_model(model)
    train_dataset = prepare_dpo_data(args.train_data_path, tokenizer)
    
    if args.eval_data_path:
        eval_dataset = prepare_dpo_data(args.eval_data_path, tokenizer)
    else:
        eval_dataset = None
        
    train_dpo(model, tokenizer, train_dataset, eval_dataset, args.use_wandb, args.output_dir, beta=args.beta)
