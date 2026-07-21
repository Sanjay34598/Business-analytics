import os

helper = '''import os
analysis_dir = os.environ.get("ANALYSIS_DIR", "")
if analysis_dir:
    for sub in ["dataset", "processed", "models", "reports", "reports/charts", "logs"]:
        os.makedirs(os.path.join(analysis_dir, sub), exist_ok=True)
'''

for root, _, files in os.walk('ml'):
    for file in files:
        if file.endswith('.py') and file != 'utils.py':
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            if 'ANALYSIS_DIR' in content and 'analysis_dir = os.environ' not in content:
                content = helper + '\n' + content
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f'Added helper to {filepath}')
