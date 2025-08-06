import os
import json


def merge_data(base_dir="data_raw", output_file="data_processed/merged_raw_data.json"):
    data = []
    for file in os.listdir(base_dir):
        if file.endswith(".json"):
            print("yo")
            with open(os.path.join(base_dir, file), "r") as f:
                data_point = json.load(f)
                data.extend(data_point)

    print(len(data))

    with open(output_file, "w") as f:
        json.dump(data, f)

def filter_by_length(file="data_processed/merged_raw_data.json", min_length=4096, max_length=16384, filter_to=5000):
    with open(file, "r") as f:
        data = json.load(f)

    filtered_data = []
    rejected_data = []

    for data_point in data:
        content_length = len(data_point['responses'][0]['completion']['files'][0]['content'])
        data_point['content_length'] = content_length
        if min_length <= content_length <= max_length:
            filtered_data.append(data_point)
            continue
        rejected_data.append(data_point)
    
    if len(filtered_data) > filter_to:
        filtered_data_sorted = sorted(filtered_data, key=lambda x: x['content_length'], reverse=True)
        threshold = filtered_data_sorted[filter_to]['content_length']
        rejected_data.extend([data_point for data_point in filtered_data if data_point['content_length'] < threshold])
        filtered_data = [data_point for data_point in filtered_data if data_point['content_length'] >= threshold]
    
    if len(filtered_data) > filter_to:
        rejected_data.extend(filtered_data[filter_to:])
        filtered_data = filtered_data[:filter_to]

    return filtered_data, rejected_data

def filter_and_save():
    filtered_data, rejected_data = filter_by_length()
    print(len(filtered_data))
    print(len(rejected_data))
    with open("data_processed/filtered_raw_data.json", "w") as f:
        json.dump(filtered_data, f)
    with open("data_processed/rejected_raw_data.json", "w") as f:
        json.dump(rejected_data, f)

if __name__ == "__main__":
    #merge_data()
    filter_and_save()
