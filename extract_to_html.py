import json
import os
import re

def extract_code_blocks(text):
    code_blocks = {
        'html': '',
        'css': '',
        'javascript': ''
    }
    
    pattern = r"```(html|css|js|javascript)\n(.*?)```"
    matches = re.finditer(pattern, text, re.DOTALL)
    
    for match in matches:
        lang = match.group(1)
        code = match.group(2).strip()
        
        if lang == 'html':
            code_blocks['html'] = code
        elif lang == 'css':
            code_blocks['css'] = code
        elif lang in ['js', 'javascript']:
            code_blocks['javascript'] = code
    
    # If no HTML found in code blocks, try to find HTML directly
    if not code_blocks['html']:
        html_pattern = r"<!DOCTYPE html>.*?</html>"
        html_match = re.search(html_pattern, text, re.DOTALL)
        if html_match:
            code_blocks['html'] = html_match.group(0)
    
    return code_blocks

def process_json_file(jsonl_file_path, base_dir, curr_dir):
    data = []
    with open(jsonl_file_path, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                json_object = json.loads(line.strip())
                data.append(json_object)
            except json.JSONDecodeError as e:
                print(f"Error decoding JSON on line: {line.strip()} - {e}")
    
    for i, item in enumerate(data, 1):
        print(type(item))
        prompt = item['conversations'][0]['value']
        output = item['conversations'][1]['value']
        
        task_dir = os.path.join(base_dir, f'task_{i}', curr_dir)
        
        if os.path.exists(task_dir):
            print(f"Task {i} directory already exists.")
        else:
            os.makedirs(task_dir, exist_ok=True)
        
        
        # Extract code blocks
        code_blocks = extract_code_blocks(output)
        
        # Write HTML file (create empty if none found)
        html_content = code_blocks['html'] or '<!DOCTYPE html>\n<html>\n<head>\n<title></title>\n</head>\n<body>\n</body>\n</html>'
        with open(os.path.join(task_dir, 'index.html'), 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        # Write CSS file if exists
        if code_blocks['css']:
            with open(os.path.join(task_dir, 'styles.css'), 'w', encoding='utf-8') as f:
                f.write(code_blocks['css'])
        
        # Write JavaScript file if exists
        if code_blocks['javascript']:
            with open(os.path.join(task_dir, 'index.js'), 'w', encoding='utf-8') as f:
                f.write(code_blocks['javascript'])
        
        # Write raw.txt with prompt and output
        with open(os.path.join(task_dir, 'raw.txt'), 'w', encoding='utf-8') as f:
            f.write(f"Prompt:\n{prompt}\n\nOutput:\n{output}")

if __name__ == "__main__":
    import sys
    json_file_path = sys.argv[1] if len(sys.argv) > 1 else 'data_processed/test_responses_dpo_lora-r-64_gemma-3n-E4B-it.jsonl'
    base_dir = sys.argv[2] if len(sys.argv) > 2 else "data_eval"
    output_dir = sys.argv[3] if len(sys.argv) > 3 else "dpo-r64-dataset-html"

    process_json_file(json_file_path, base_dir, output_dir)
