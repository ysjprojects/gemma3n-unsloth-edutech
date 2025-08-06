import torch
import json
import uuid
import time
import multiprocessing
import os
from unsloth import FastLanguageModel
from queue import Empty

# Configuration
MAX_MODELS = 4  # Number of model instances on single GPU
MODEL_PATH = "unsloth/gemma-3n-E4B-it"
#MODEL_PATH="/data/gemma3n-unsloth-edutech/models/dpo_lora-r-64_gemma-3n-E4B-it"
PROMPTS_FILE = "data_processed/test_prompts.json"
OUTPUT_FILE = "data_processed/test_responses_gemma-3n-E4B-it-oneshot.jsonl"
#OUTPUT_FILE = "data_processed/test_responses_dpo_lora-r-64_gemma-3n-E4B-it.jsonl"
DEVICE = "cuda:0"  # Single GPU device
NUM_PROMPTS = 20
LOAD_IN_4BIT = False
FEWSHOT = True

with open("fewshot.json", "r") as f:
    fewshots = json.load(f)
FEWSHOT_EXAMPLE = fewshots[0]["htmlContent"]

def load_model_with_memory_fraction(model_path: str, device: str, memory_fraction: float):
    """Load model on specific GPU device with memory fraction limit"""
    print(f"🔄 Loading model on {device} with {memory_fraction:.2f} memory fraction...")
    
    # Set CUDA device
    torch.cuda.set_device(device)
    
    # Set memory fraction for this process
    if memory_fraction < 1.0:
        torch.cuda.set_per_process_memory_fraction(memory_fraction, device=device)
    
    try:
        model, tokenizer = FastLanguageModel.from_pretrained(
            model_name=model_path,
            max_seq_length=32768,
            load_in_4bit=LOAD_IN_4BIT,  # Keep 4-bit to save memory
            device_map={"": device},
        )
        
        print(f"✅ Model loaded successfully on {device}")
        
        # Print GPU memory usage
        if torch.cuda.is_available():
            memory_used = torch.cuda.memory_allocated(device) / 1e9
            memory_total = torch.cuda.get_device_properties(device).total_memory / 1e9
            print(f"📊 GPU Memory: {memory_used:.2f}GB / {memory_total:.2f}GB used")
        
        return model, tokenizer
        
    except Exception as e:
        print(f"❌ Failed to load model: {e}")
        raise

def augment_prompt(prompt_text, fewshot=False):
    """Augment the prompt with additional information"""
    if fewshot:
        prompt_text = prompt_text + "\n\nbelow is an example of how the frontend structure should look like:\n" + FEWSHOT_EXAMPLE
    prompt_text = prompt_text + "\n\nPlease only generate the code and do not include any other text."
    return prompt_text

def generate_response(model, tokenizer, prompt_text, generation_config, fewshot=False):
    """Generate response for a single prompt"""
    try:
        prompt_text = augment_prompt(prompt_text, fewshot)
        # Format the prompt into the required chat template structure
        messages = [{
            "role": "user",
            "content": [{"type": "text", "text": prompt_text}]
        }]
        
        # Tokenize the input
        inputs = tokenizer.apply_chat_template(
            messages,
            add_generation_prompt=True,
            return_tensors="pt",
            tokenize=True,
            return_dict=True,
        )
        
        # Move to the same device as model
        device = next(model.parameters()).device
        inputs = {k: v.to(device) if hasattr(v, 'to') else v for k, v in inputs.items()}

        # Generate output tokens
        with torch.no_grad():
            outputs = model.generate(**inputs, **generation_config)

        # Decode the generated tokens, skipping the prompt part
        generated_text = tokenizer.batch_decode(
            outputs[:, inputs['input_ids'].shape[1]:], 
            skip_special_tokens=True
        )[0]
        
        # Clean up tensors to free memory
        del inputs, outputs
        torch.cuda.empty_cache()
        
        return generated_text.strip()
    
    except Exception as e:
        print(f"❌ Error generating response: {e}")
        return f"Error: {str(e)}"

def worker_process(process_id: int, task_queue, result_queue, device: str, memory_fraction: float, fewshot: bool = False):
    """Worker process that loads model and processes tasks"""
    try:
        print(f"🚀 Starting worker {process_id} on {device}")
        
        # Load model with memory fraction
        model, tokenizer = load_model_with_memory_fraction(MODEL_PATH, device, memory_fraction)
        
        # Generation configuration
        generation_config = {
            "max_new_tokens": 8192,
            "temperature": 1.0,
            "top_p": 0.95,
            "top_k": 64,
        }
        
        print(f"✅ Worker {process_id} ready for inference")
        
        # Process tasks from queue
        processed_count = 0
        while True:
            try:
                # Get task with timeout to avoid hanging
                task = task_queue.get(timeout=5)
                if task is None:  # Poison pill to stop worker
                    print(f"🛑 Worker {process_id} stopping after processing {processed_count} tasks")
                    break
                
                task_id, prompt = task
                start_time = time.time()
                
                print(f"🔄 Worker {process_id} processing task {task_id}: '{prompt[:50]}...'")
                
                # Generate response
                generated_text = generate_response(model, tokenizer, prompt, generation_config, fewshot)
                
                # Create result
                result = {
                    "task_id": task_id,
                    "prompt": prompt,
                    "response": generated_text,
                    "worker_id": process_id,
                    "device": device,
                    "time_taken": time.time() - start_time
                }
                
                result_queue.put(result)
                processed_count += 1
                
                print(f"✅ Worker {process_id} completed task {task_id} in {result['time_taken']:.2f}s "
                      f"(total: {processed_count})")
                
                # Optional: Clear cache periodically to prevent memory buildup
                if processed_count % 10 == 0:
                    torch.cuda.empty_cache()
                
            except Empty:
                # Timeout - check if there are more tasks
                continue
            except Exception as e:
                print(f"❌ Worker {process_id} error: {e}")
                # Put error result
                if 'task' in locals() and task is not None:
                    task_id = task[0] if isinstance(task, tuple) else "unknown"
                    result_queue.put({
                        "task_id": task_id,
                        "error": str(e),
                        "worker_id": process_id
                    })
                
    except Exception as e:
        print(f"❌ Fatal error in worker {process_id}: {e}")

def save_result_to_file(result, output_file):
    """Save individual result to JSONL file"""
    if "error" in result:
        print(f"⚠️ Skipping error result: {result}")
        return
    
    # Create ShareGPT format
    conversation = {
        "id": str(uuid.uuid4()),
        "conversations": [
            {"from": "human", "value": result["prompt"]},
            {"from": "gpt", "value": result["response"]}
        ],
        "metadata": {
            "worker_id": result["worker_id"],
            "device": result["device"],
            "time_taken": result["time_taken"]
        }
    }
    
    # Append to file
    with open(output_file, 'a', encoding='utf-8') as f:
        f.write(json.dumps(conversation, ensure_ascii=False) + "\n")

def check_gpu_memory():
    """Check available GPU memory"""
    if torch.cuda.is_available():
        device = torch.cuda.current_device()
        memory_total = torch.cuda.get_device_properties(device).total_memory / 1e9
        memory_allocated = torch.cuda.memory_allocated(device) / 1e9
        memory_cached = torch.cuda.memory_reserved(device) / 1e9
        
        print(f"🎮 GPU {device} Memory Status:")
        print(f"   Total: {memory_total:.2f}GB")
        print(f"   Allocated: {memory_allocated:.2f}GB")
        print(f"   Cached: {memory_cached:.2f}GB")
        print(f"   Available: {memory_total - memory_cached:.2f}GB")
        
        return memory_total
    return 0

def main():
    print(f"🚀 Starting single-GPU multiprocessing inference with {MAX_MODELS} model instances")
    
    # Check GPU availability and memory
    if not torch.cuda.is_available():
        print("❌ CUDA not available!")
        return
    
    total_memory = check_gpu_memory()
    if total_memory == 0:
        print("❌ Could not determine GPU memory!")
        return
    
    # Calculate memory fraction per process (leave some buffer)
    memory_fraction = 0.9 / MAX_MODELS  # Use 90% of total memory divided by number of processes
    print(f"💾 Each model will use ~{memory_fraction:.2f} of GPU memory")
    
    # Load prompts
    with open(PROMPTS_FILE, "r") as f:
        prompts_list = json.load(f)
    prompts_list = prompts_list[:NUM_PROMPTS]
    
    print(f"📝 Loaded {len(prompts_list)} prompts")
    
    # Create queues
    task_queue = multiprocessing.Queue()
    result_queue = multiprocessing.Queue()
    
    # Clear output file
    with open(OUTPUT_FILE, 'w') as f:
        pass
    
    # Start worker processes
    processes = []
    for i in range(MAX_MODELS):
        process = multiprocessing.Process(
            target=worker_process,
            args=(i, task_queue, result_queue, DEVICE, memory_fraction, FEWSHOT)
        )
        process.start()
        processes.append(process)
        
        # Small delay between starting processes to avoid memory conflicts
        time.sleep(2)
    
    print(f"✅ Started {len(processes)} worker processes on {DEVICE}")
    
    # Add all tasks to queue
    for task_id, prompt in enumerate(prompts_list):
        task_queue.put((task_id, prompt))
    
    print(f"📤 Added {len(prompts_list)} tasks to queue")
    
    # Collect results
    completed_tasks = 0
    start_time = time.time()
    
    while completed_tasks < len(prompts_list):
        try:
            result = result_queue.get(timeout=300)  # 300 second timeout for single GPU
            completed_tasks += 1
            
            # Save result immediately
            save_result_to_file(result, OUTPUT_FILE)
            
            # Progress update
            elapsed = time.time() - start_time
            rate = completed_tasks / elapsed if elapsed > 0 else 0
            eta = (len(prompts_list) - completed_tasks) / rate if rate > 0 else 0
            
            print(f"📊 Progress: {completed_tasks}/{len(prompts_list)} "
                  f"({completed_tasks/len(prompts_list)*100:.1f}%) "
                  f"Rate: {rate:.2f} tasks/sec "
                  f"ETA: {eta/60:.1f} minutes")
            
        except Empty:
            print("⏰ Timeout waiting for results, checking if workers are alive...")
            alive_workers = sum(1 for p in processes if p.is_alive())
            print(f"👥 Alive workers: {alive_workers}/{len(processes)}")
            if alive_workers == 0:
                print("❌ No workers alive, exiting")
                break
    
    # Send poison pills to stop workers
    for _ in range(MAX_MODELS):
        task_queue.put(None)
    
    # Wait for processes to finish
    print("🛑 Stopping workers...")
    for process in processes:
        process.join(timeout=30)
        if process.is_alive():
            print(f"⚠️ Force terminating worker {process.pid}")
            process.terminate()
    
    total_time = time.time() - start_time
    print(f"\n🎉 Completed! Processed {completed_tasks} prompts in {total_time/60:.2f} minutes")
    print(f"📁 Results saved to '{OUTPUT_FILE}'")
    print(f"⚡ Average rate: {completed_tasks/total_time:.2f} tasks/sec")
    
    # Final memory check
    print("\n" + "="*50)
    check_gpu_memory()

if __name__ == "__main__":
    # Set multiprocessing start method
    multiprocessing.set_start_method("spawn", force=True)
    main()
