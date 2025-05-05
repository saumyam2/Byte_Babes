from PyPDF2 import PdfReader


def extract_text(file):
    """
    Extract text from a PDF file-like object.

    Parameters:
        file: A file-like object (e.g., from request.files['file'])

    Returns:
        Extracted text as a string.
    """
    text = ""
    pdf_reader = PdfReader(file)
    for page in pdf_reader.pages:
        text += page.extract_text() or ""
    return text.strip()
