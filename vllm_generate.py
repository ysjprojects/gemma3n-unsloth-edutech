from vllm import LLM, SamplingParams

# Create a sampling params object.
sampling_params = SamplingParams(temperature=1.0, top_p=0.95, top_k=64, max_tokens=8192)

# Create an LLM.
llm = LLM(
    model='unsloth/gemma-3n-E4B-it',
    trust_remote_code=True,
    dtype="auto",
    max_model_len=32768,
    enforce_eager=True,
    gpu_memory_utilization=0.3,
)

# Generate texts from the prompts.
prompts = [
    "Implement an interactive, Duolingo-style educational quiz for grade school students focused on basic electrical systems. The quiz should be self-contained within a single HTML file, using only JavaScript, HTML, and CSS. The visual design should be bright and engaging, using a color scheme of `#FFD700` (gold), `#FF6347` (tomato), `#4682B4` (steel blue), and `#90EE90` (light green) to represent different electrical components and states.\n\nFeatures:\n- The quiz will present one question at a time, centered on the screen. Each question will have a clear, concise statement about electrical systems.\n- Below each question, a set of multiple-choice answer options will be displayed as distinct, clickable buttons. There will always be four options.\n- A prominent 'Check' button will be present below the answer options. This button will initially be disabled until an answer is selected.\n- Upon clicking 'Check', immediate visual feedback will be provided. If the answer is correct, the selected answer button will turn `#90EE90` (light green), and a positive feedback message (e.g., 'Correct! Great job!') will appear. If incorrect, the selected answer button will turn `#FF6347` (tomato), and a negative feedback message (e.g., 'Oops! Try again.') will appear. The correct answer button will also be highlighted in `#90EE90` (light green) if the user chose incorrectly.\n- After a correct answer is submitted, the 'Check' button will be replaced by a 'Next' button, allowing the user to proceed to the next question.\n- The quiz will consist of the following questions, answers, and correct options:\n    1. Question: What do we call the path that electricity flows through?\n       Options: A) River, B) Circuit, C) Road, D) Wire\n       Correct: B) Circuit\n    2. Question: Which of these is a good conductor of electricity?\n       Options: A) Rubber, B) Wood, C) Copper, D) Plastic\n       Correct: C) Copper\n    3. Question: What makes a light bulb glow?\n       Options: A) Water, B) Heat, C) Electricity, D) Air\n       Correct: C) Electricity\n    4. Question: What is used to turn an electrical device on or off?\n       Options: A) Button, B) Switch, C) Knob, D) Lever\n       Correct: B) Switch\n    5. Question: Which of these is NOT safe to put into an electrical outlet?\n       Options: A) A plug, B) A fork, C) A charger, D) A lamp cord\n       Correct: B) A fork\n- The quiz should maintain a consistent layout and styling throughout.\n- The background of the entire page should be a soft, inviting color, such as `#F0F8FF` (AliceBlue).\n\nUser Actions:\n- **Select Answer:** The user can click on any of the four answer option buttons. Clicking an option will highlight it (e.g., with a border or a slight background change to `#4682B4` (steel blue)) and enable the 'Check' button.\n- **Check Answer:** After selecting an answer, the user can click the 'Check' button. This action will evaluate the selected answer, provide visual feedback, and update the UI accordingly (e.g., replacing 'Check' with 'Next' on correct answers).\n- **Next Question:** After a correct answer has been submitted and the 'Next' button appears, the user can click it to advance to the subsequent question. If it's the last question, a 'Quiz Complete!' message should be displayed instead of a new question.\nNote:\n- Your output should be implemented in JavaScript with HTML and CSS.\n- Ensure to only generate HTML file and nothing else!!\n",
]

outputs = llm.generate(prompts, sampling_params)

# Print the outputs.
for output in outputs:
    prompt = output.prompt
    generated_text = output.outputs[0].text
    print(f"Prompt: {prompt!r}, Generated text: {generated_text!r}")

