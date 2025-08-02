import json
from typing import List, Dict, Any, Optional

def create_sft_dataset(
    data_point: Dict[str, Any],
    selected_indices: Optional[List[int]] = None,
    output_path: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Converts a data point into a ShareGPT-style SFT (Supervised Fine-Tuning) dataset.

    Each selected response becomes a separate entry in the output list.

    Args:
        data_point: A dictionary containing 'prompt' and a list of 'responses'.
        selected_indices: A list of integer indices for the responses to include.
                          Defaults to [0] if None.
        output_path: Optional. If provided, writes the resulting JSON to this file path.

    Returns:
        A list of dictionaries formatted for SFT.
    """
    if selected_indices is None:
        selected_indices = [0]

    sft_examples = []
    prompt_text = data_point.get("prompt", "")

    for index in selected_indices:
        try:
            # Extract the response content based on the provided data structure
            response_content = data_point['responses'][index]['completion']['files'][0]['content']

            # Construct the ShareGPT SFT conversation format
            conversation = {
                "conversations": [
                    {
                        "from": "human",
                        "value": prompt_text
                    },
                    {
                        "from": "gpt",
                        "value": response_content
                    }
                ]
            }
            sft_examples.append(conversation)

        except IndexError:
            print(f"Warning: Index {index} is out of range for the available responses. Skipping.")
        except (KeyError, TypeError):
            print(f"Warning: Could not find response content at index {index} due to unexpected data structure. Skipping.")

    if output_path:
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(sft_examples, f, indent=2)
        print(f"SFT dataset successfully written to {output_path}")

    return sft_examples

def create_dpo_dataset(
    data_point: Dict[str, Any],
    chosen_index: int = 0,
    rejected_index: int = 1,
    output_path: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Converts a data point into a ShareGPT-style DPO (Direct Preference Optimization) dataset.

    Args:
        data_point: A dictionary containing 'prompt' and a list of 'responses'.
        chosen_index: The index of the 'chosen' (preferred) response. Defaults to 0.
        rejected_index: The index of the 'rejected' (dispreferred) response. Defaults to 1.
        output_path: Optional. If provided, writes the resulting JSON to this file path.

    Returns:
        A list containing a single dictionary formatted for DPO. Returns an empty list
        if data cannot be processed.
    """
    dpo_example = []
    prompt_text = data_point.get("prompt", "")

    try:
        # Extract the chosen and rejected response content
        chosen_content = data_point['responses'][chosen_index]['completion']['files'][0]['content']
        rejected_content = data_point['responses'][rejected_index]['completion']['files'][0]['content']

        # Construct the ShareGPT DPO format
        preference_data = {
            "prompt": prompt_text,
            "chosen": chosen_content,
            "rejected": rejected_content
        }
        dpo_example.append(preference_data)

    except IndexError:
        print(f"Error: Chosen index ({chosen_index}) or rejected index ({rejected_index}) is out of range. Cannot create DPO pair.")
        return []
    except (KeyError, TypeError):
        print("Error: Could not find response content due to unexpected data structure. Cannot create DPO pair.")
        return []


    if output_path:
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(dpo_example, f, indent=2)
        print(f"DPO dataset successfully written to {output_path}")

    return dpo_example

# --- Demonstration ---
if __name__ == "__main__":
    # Your provided sample data
    sample_data = {
        "prompt": "Implement an interactive, Duolingo-style educational quiz for grade school students focused on the life cycles of plants and animals. The quiz should be visually engaging and provide immediate feedback.\n\nFeatures:\n- The program should have a clean, inviting layout with a primary color scheme of soft greens (#A8E6CF), light blues (#DCEDC8), and warm yellows (#FFD3B5), with accents of a slightly darker green (#4CAF50) for interactive elements.\n- The main content area should be centrally located on the page, with a clear title at the top indicating the quiz topic: 'Life Cycles Adventure!'.\n- Each quiz question should be displayed one at a time. The question text should be large and easy to read.\n- Below the question, there should be a set of multiple-choice answer options, presented as distinct, clickable buttons or cards. Each option should be clearly labeled.\n- When an answer is selected, it should visually highlight to indicate selection (e.g., a subtle border change or background color shift).\n- A 'Check Answer' button should be present at the bottom of the quiz area. This button should be prominently displayed and easily clickable.\n- Upon clicking 'Check Answer', the selected answer should be evaluated. If correct, the selected answer option should turn green, and a positive feedback message (e.g., 'Great job!') should appear. If incorrect, the selected answer option should turn red, and a negative feedback message (e.g., 'Oops, try again!') should appear. The correct answer, if not selected, should also be highlighted in green to show the user the right answer.\n- After a correct answer is submitted, a 'Next Question' button should appear, replacing the 'Check Answer' button. This button should be distinct and encourage progression.\n- The quiz should consist of the following questions, answers, and correct options:\n    1. Question: \"Which of these is the first stage in the life cycle of a butterfly?\"\n       Options: [\"Caterpillar\", \"Egg\", \"Chrysalis\", \"Butterfly\"]\n       Correct Answer: \"Egg\"\n    2. Question: \"What do plants need to grow from a seed?\"\n       Options: [\"Sugar and salt\", \"Sunlight and water\", \"Wind and snow\", \"Rocks and sand\"]\n       Correct Answer: \"Sunlight and water\"\n    3. Question: \"Which animal lays eggs?\"\n       Options: [\"Dog\", \"Cat\", \"Chicken\", \"Cow\"]\n       Correct Answer: \"Chicken\"\n    4. Question: \"What is the process called when a caterpillar changes into a butterfly?\"\n       Options: [\"Germination\", \"Pollination\", \"Metamorphosis\", \"Photosynthesis\"]\n       Correct Answer: \"Metamorphosis\"\n    5. Question: \"What part of a plant makes new seeds?\"\n       Options: [\"Root\", \"Stem\", \"Leaf\", \"Flower\"]\n       Correct Answer: \"Flower\"\n- After the last question is answered correctly, a final celebratory message should be displayed (e.g., 'You completed the Life Cycles Adventure!'). The 'Next Question' button should disappear.\n\nUser Actions:\n- **Clicking an Answer Option:** When a user clicks on one of the multiple-choice answer options, that option should be visually marked as selected. Only one option can be selected at a time.\n- **Clicking 'Check Answer' Button:** When the user clicks this button, the program should evaluate the selected answer against the correct answer for the current question. Visual feedback (color change, message) should be provided based on correctness.\n- **Clicking 'Next Question' Button:** After a correct answer has been submitted and the 'Next Question' button appears, clicking it should clear the current question and feedback, and display the next question in the sequence.\nNote:\n- Your output should be implemented in JavaScript with HTML and CSS.\n- Ensure that the output has both index.js and index.html files\n",
        "responses": [
            {"model": "model-a", "completion": {"files": [{"filename": "index.html", "content": "<!DOCTYPE html> Response 0 Content..."}]}},
            {"model": "model-b", "completion": {"files": [{"filename": "index.html", "content": "<!DOCTYPE html> Response 1 Content..."}]}},
            {"model": "model-c", "completion": {"files": [{"filename": "index.html", "content": "<!DOCTYPE html> Response 2 Content..."}]}},
            {"model": "model-d", "completion": {"files": [{"filename": "index.html", "content": "<!DOCTYPE html> Response 3 Content..."}]}}
        ],
        "ground_truth": {"f898da69-14c6-4408-8a78-2149df2a10fb": 0, "3fefeb99-fc17-4cb8-9320-ac01d424f9d9": 1, "ca2ed54c-4679-4cd3-8c95-a34771408b0a": 2, "6cebf721-c75a-45bc-9736-d2ce6524ac48": 3},
        "metadata": {"augment_type": "UNIFIED"}
    }

    print("--- SFT Dataset Examples ---")

    # 1. Default SFT: Use only the first response (index 0)
    print("\n[SFT] Generating with default settings (index 0):")
    sft_default = create_sft_dataset(sample_data, output_path="sft_default.json")
    # print(json.dumps(sft_default, indent=2))

    # 2. Custom SFT: Select responses at indices 1 and 3
    print("\n[SFT] Generating with custom indices [1, 3]:")
    sft_custom = create_sft_dataset(sample_data, selected_indices=[1, 3], output_path="sft_custom.json")
    # print(json.dumps(sft_custom, indent=2))


    print("\n\n--- DPO Dataset Examples ---")

    # 3. Default DPO: Use index 0 as chosen, index 1 as rejected
    print("\n[DPO] Generating with default settings (chosen=0, rejected=1):")
    dpo_default = create_dpo_dataset(sample_data, output_path="dpo_default.json")
    # print(json.dumps(dpo_default, indent=2))

    # 4. Custom DPO: Use index 0 as chosen, index 3 as rejected
    print("\n[DPO] Generating with custom settings (chosen=0, rejected=3):")
    dpo_custom = create_dpo_dataset(sample_data, chosen_index=0, rejected_index=3, output_path="dpo_custom.json")
    # print(json.dumps(dpo_custom, indent=2))
