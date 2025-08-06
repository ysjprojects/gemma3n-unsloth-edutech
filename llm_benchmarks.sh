#!/bin/bash

BASE_MODEL_PATH=${4:-"unsloth/gemma-3n-E4B-it"}
MODEL_PATH=$1
OUTPUT_PATH=$2
SELECTED_TASKS=$3

should_run_task() {
    local task=$1
    if [ -z "$SELECTED_TASKS" ]; then
        return 0
    fi
    if [[ " $SELECTED_TASKS " =~ " $task " ]]; then
        return 0
    fi
    return 1
}

# create the output directory if it doesn't exist
mkdir -p "$OUTPUT_PATH"

# build MODEL_ARGS based on whether MODEL_PATH is provided
if [ -n "$MODEL_PATH" ]; then
  MODEL_ARGS="pretrained=$BASE_MODEL_PATH,peft=$MODEL_PATH"
else
  MODEL_ARGS="pretrained=$BASE_MODEL_PATH"
fi

tasks=("humaneval" "humaneval_plus" "mbpp" "mbpp_plus")

for task in "${tasks[@]}"; do
    if ! should_run_task "$task"; then
        continue
    fi
    export HF_ALLOW_CODE_EVAL=1
    echo "Running evaluation for task: $task"
    lm-eval --model hf \
        --model_args "$MODEL_ARGS" \
        --tasks "$task" \
        --batch_size 4 \
        --output_path "$OUTPUT_PATH$task" \
        --confirm_run_unsafe_code \
        --log_samples
done

echo "All tasks have been evaluated. Results are saved in $OUTPUT_PATH."
