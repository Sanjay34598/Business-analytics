import subprocess

from logger import logger


def run(script):

    logger.info(f"Running {script}")

    subprocess.run(

        ["python", script],

        check=True

    )

    logger.info(f"Completed {script}")