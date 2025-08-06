from unsloth import FastModel
import torch
import os

def load_model_and_tokenizer(model_name: str = "unsloth/gemma-3n-E4B-it"):
    model, tokenizer = FastModel.from_pretrained(
        model_name=model_name,
        dtype=None,
        max_seq_length=32768,
        load_in_8bit=False,
        load_in_4bit=False,
        full_finetuning=False,
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
        r = 16,
        lora_alpha = 16,
        lora_dropout = 0,
        bias="none",
        random_state=3407,
    )
    return model

def formatting_prompts_func(examples, tokenizer):
   convos = examples["conversations"]
   texts = [tokenizer.apply_chat_template(convo, tokenize = False, add_generation_prompt = False).removeprefix('<bos>') for convo in convos]
   return { "text" : texts, }

def prepare_data(data_path: str, tokenizer):
    from datasets import load_dataset
    from unsloth.chat_templates import standardize_data_formats
    dataset = load_dataset("json", data_files=data_path, split="train")
    print(dataset)
    dataset = standardize_data_formats(dataset) # Assuming sharegpt data format
    dataset = dataset.map(
        lambda examples: formatting_prompts_func(examples, tokenizer), 
        batched=True, 
        num_proc=os.cpu_count()//2
    )
    return dataset

def train(model, tokenizer, train_dataset, eval_dataset=None, use_wandb=True, output_dir="./models", **kwargs):
    from trl import SFTTrainer, SFTConfig
    from unsloth.chat_templates import train_on_responses_only

    if use_wandb:
        import wandb
        wandb.init(project="gemma3n-unsloth-edutech", name=f"sft_lora-r-16_gemma-3n-E4B-it")
        report_to = "wandb"
    else:
        report_to = "none"
    
    os.makedirs(output_dir, exist_ok=True)

    trainer = SFTTrainer(
        model = model,
        tokenizer = tokenizer,
        train_dataset = train_dataset,
        eval_dataset = eval_dataset, # Can set up evaluation!
        args = SFTConfig(
            dataset_text_field = "text",
            per_device_train_batch_size = 4,
            gradient_accumulation_steps = 4, # Use GA to mimic batch size!
            warmup_ratio = 0.03,
            num_train_epochs = 2,
            # max_steps = 60,
            learning_rate = 1e-5,
            logging_steps = 10,
            optim = "paged_adamw_8bit",
            weight_decay = 0.01,
            lr_scheduler_type = "cosine",
            seed = 3407,
            report_to = report_to, # Use this for WandB etc
            output_dir = output_dir,
            save_strategy = "steps",
            save_steps = 250,
            save_total_limit = 5,
        ),
    )

    trainer = train_on_responses_only(
        trainer,
        instruction_part = "<start_of_turn>user\n",
        response_part = "<start_of_turn>model\n",
    )
    trainer_stats = trainer.train()

    # Save final model
    model.save_pretrained_merged(output_dir, tokenizer, save_method = "merged_16bit",)

    print(f"Final model saved to {output_dir}")
    return trainer,trainer_stats


if __name__ == "__main__":
    torch._dynamo.config.cache_size_limit = 32

    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--model_name", type=str, default="unsloth/gemma-3n-E4B-it")
    parser.add_argument("--train_data_path", type=str, default="data_processed/sft_dataset_10k.json")
    parser.add_argument("--eval_data_path", type=str, default=None)
    parser.add_argument("--output_dir", type=str, default="models/sft_lora-r-16_gemma-3n-E4B-it")
    parser.add_argument("--use_wandb", action="store_true", default=True)
    args = parser.parse_args()
    model, tokenizer = load_model_and_tokenizer(args.model_name)
    model = load_lora_model(model)
    train_dataset = prepare_data(args.train_data_path, tokenizer)
    if args.eval_data_path:
        eval_dataset = prepare_data(args.eval_data_path, tokenizer)
    else:
        eval_dataset = None
    train(model, tokenizer, train_dataset, eval_dataset, args.use_wandb, args.output_dir)
