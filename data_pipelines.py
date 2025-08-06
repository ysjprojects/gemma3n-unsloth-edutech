import json
from typing import List, Dict, Any, Optional

def create_sft_entry(
    data_point: Dict[str, Any],
    selected_indices: Optional[List[int]] = None,
) -> List[Dict[str, Any]]:
    """
    Converts a data point into a ShareGPT-style SFT (Supervised Fine-Tuning) entry.

    Args:
        data_point: A dictionary containing 'prompt' and a list of 'responses'.
        selected_indices: A list of integer indices for the responses to include.
                          Defaults to [0] if None.

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

    return sft_examples

def create_sft_dataset(
    input_json_path: str,
    selected_indices: Optional[List[int]] = None,
    output_path: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Creates a SFT dataset by reading data points from a JSON file.

    Args:
        input_json_path: Path to the input JSON file containing the data points.
        selected_indices: Optional list of indices to select responses from each data point.
                        Defaults to [0] if None.
        output_path: Optional path to save the resulting dataset as a JSON file.

    Returns:
        A list of SFT examples in ShareGPT format.
    """
    # Read the input JSON file
    try:
        with open(input_json_path, 'r', encoding='utf-8') as f:
            data_points = json.load(f)
    except json.JSONDecodeError:
        print(f"Error: Could not parse JSON from {input_json_path}")
        return []
    except FileNotFoundError:
        print(f"Error: File not found at {input_json_path}")
        return []

    # Ensure data_points is a list
    if not isinstance(data_points, list):
        data_points = [data_points]

    # Process each data point
    sft_dataset = []
    for data_point in data_points:
        try:
            sft_examples = create_sft_entry(data_point, selected_indices)
            sft_dataset.extend(sft_examples)
        except Exception as e:
            print(f"Warning: Failed to process data point: {str(e)}")
            continue

    # Save to output file if specified
    if output_path:
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(sft_dataset, f, indent=2)
            print(f"SFT dataset successfully written to {output_path}")
        except Exception as e:
            print(f"Error: Failed to write output file: {str(e)}")

    return sft_dataset

def create_dpo_entry(
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

def create_dpo_dataset(
    input_json_path: str,
    chosen_index: int = 0,
    rejected_index: int = 1,
    output_path: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Creates a DPO dataset by reading data points from a JSON file.

    Args:
        input_json_path: Path to the input JSON file containing the data points.
        chosen_index: The index of the 'chosen' (preferred) response. Defaults to 0.
        rejected_index: The index of the 'rejected' (dispreferred) response. Defaults to 1.
        output_path: Optional path to save the resulting dataset as a JSON file.

    Returns:
        A list of SFT examples in ShareGPT format.
    """
    # Read the input JSON file
    try:
        with open(input_json_path, 'r', encoding='utf-8') as f:
            data_points = json.load(f)
    except json.JSONDecodeError:
        print(f"Error: Could not parse JSON from {input_json_path}")
        return []
    except FileNotFoundError:
        print(f"Error: File not found at {input_json_path}")
        return []

    # Ensure data_points is a list
    if not isinstance(data_points, list):
        data_points = [data_points]

    # Process each data point
    dpo_dataset = []
    for data_point in data_points:
        try:
            dpo_examples = create_dpo_entry(data_point, chosen_index, rejected_index)
            dpo_dataset.extend(dpo_examples)
        except Exception as e:
            print(f"Warning: Failed to process data point: {str(e)}")
            continue

    # Save to output file if specified
    if output_path:
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(dpo_dataset, f, indent=2)
            print(f"DPO dataset successfully written to {output_path}")
        except Exception as e:
            print(f"Error: Failed to write output file: {str(e)}")

    return dpo_dataset

# --- Demonstration ---
if __name__ == "__main__":
    sft_default = create_sft_dataset("data_processed/filtered_raw_data.json", selected_indices=[0,1], output_path="data_processed/sft_dataset_10k.json")
    print(len(sft_default))
    #dpo_default = create_dpo_dataset("data_processed/filtered_raw_data.json", output_path="data_processed/dpo_dataset.json")
    #print(len(dpo_default))
