from unsloth import FastModel



model, tokenizer = FastModel.from_pretrained(
        model_name="/data/gemma3n-unsloth-edutech/models/sft_lora-r-16_gemma-3n-E4B-it/checkpoint-750",
        dtype=None,
        max_seq_length=32768,
        load_in_4bit=False,
    )

output_dir = "/data/gemma3n-unsloth-edutech/models/merged/sft_lora-r-16_gemma-3n-E4B-it"
model.save_pretrained_merged(output_dir, tokenizer, save_method = "merged_16bit",)
