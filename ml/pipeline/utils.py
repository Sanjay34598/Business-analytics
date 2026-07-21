import subprocess
from logger import logger

def run(script):
    # Extract the module name (e.g., PREPROCESS from ml/preprocessing/...)
    parts = script.split('/')
    if len(parts) >= 2:
        stage_name = parts[1].upper()
    else:
        stage_name = "PIPELINE"
        
    logger.info(f"[{stage_name}]")
    logger.info(f"Started {script}")

    try:
        subprocess.run(
            ["python", script],
            check=True
        )
        logger.info(f"Finished {script}\n")
    except subprocess.CalledProcessError as e:
        logger.error(f"Failed {script}")
        logger.error(f"Reason: subprocess returned non-zero exit status {e.returncode}")
        raise