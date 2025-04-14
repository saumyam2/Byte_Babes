# resume_parser.py
from io import BytesIO
from PyPDF2 import PdfReader


def parse_resume(file_bytes: bytes) -> str:
    """
    Extracts text content from a PDF file.
    :param file_bytes: PDF file content as bytes
    :return: Extracted text
    """
    reader = PdfReader(BytesIO(file_bytes))
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text.strip()
