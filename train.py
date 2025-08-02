from unsloth import FastModel
import torch
import os

def load_model_and_tokenizer(model_name: str = "unsloth/gemma-3n-E4B-it"):
    model, tokenizer = FastModel.from_pretrained(
        model_name=model_name,
        dtype="None",
        max_seq_len=32768,
        load_in_4bit=True,
        full_finetuning=False,
        seed=3407,
    )
    return model, tokenizer

def load_lora_model(base_model):
    model = FastModel.get_peft_model(
        base_model,
        finetune_vision_layers = False,
        finetune_language_layers = True,
        finetune_attention_modules = True,
        finetune_mlp_modules = True,
        r = 16,
        lora_alpha = 32,
        lora_dropout = 0,
        bias="none",
    )
    return model

def formatting_prompts_func(examples, tokenizer):
   convos = examples["conversations"]
   texts = [tokenizer.apply_chat_template(convo, tokenize = False, add_generation_prompt = False).removeprefix('<bos>') for convo in convos]
   return { "text" : texts, }

def prepare_data(data_path: str, tokenizer):
    from datasets import load_dataset
    from unsloth.chat_templates import standard_data_formats
    dataset = load_dataset("json", data_files=data_path)
    dataset = standard_data_formats(dataset) # Assuming sharegpt data format
    dataset = dataset.map(
        lambda examples: formatting_prompts_func(examples, tokenizer), 
        batched=True, 
        num_proc=os.cpu_count()//2
    )
    return dataset

def train(model, tokenizer, train_dataset, eval_dataset=None, use_wandb=False, output_dir="./models", **kwargs):
    from trl import SFTTrainer, SFTConfig
    from unsloth.chat_templates import train_on_responses_only

    if use_wandb:
        import wandb
        wandb.init(project="gemma3n-unsloth-edutech", name=f"{model.config.model_name}-sft")
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
            per_device_train_batch_size = 1,
            gradient_accumulation_steps = 4, # Use GA to mimic batch size!
            warmup_ratio = 0.03,
            num_train_epochs = 3, # Set this for 1 full training run.
            # max_steps = 60,
            learning_rate = 2e-4, # Reduce to 2e-5 for long training runs
            logging_steps = 10,
            optim = "paged_adamw_8bit",
            weight_decay = 0.01,
            lr_scheduler_type = "linear",
            seed = 3407,
            report_to = report_to, # Use this for WandB etc
            output_dir = output_dir,
            save_strategy = "steps",
            save_steps = 500,
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
    model.save_pretrained(output_dir)
    tokenizer.save_pretrained(output_dir)
    print(f"Final model saved to {output_dir}")
    print(f"Checkpoints saved every {save_steps} steps, keeping last {save_total_limit} checkpoints")

    return trainer,trainer_stats


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--model_name", type=str, default="unsloth/gemma-3n-E4B-it")
    parser.add_argument("--train_data_path", type=str, default="data/sharegpt_cleaned.json")
    parser.add_argument("--eval_data_path", type=str, default=None)
    parser.add_argument("--output_dir", type=str, default="models/gemma-3n-E4B-it")
    parser.add_argument("--use_wandb", action="store_true")
    args = parser.parse_args()
    model, tokenizer = load_model_and_tokenizer(args.model_name)
    model = load_lora_model(model)
    train_dataset = prepare_data(args.train_data_path, tokenizer)
    if args.eval_data_path:
        eval_dataset = prepare_data(args.eval_data_path, tokenizer)
    else:
        eval_dataset = None
    train(model, tokenizer, train_dataset, eval_dataset, args.use_wandb, args.output_dir)
