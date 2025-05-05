from markdown import markdown
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch

# Removed unused imports: BytesIO, os


def create_pdf_from_markdown(markdown_text: str, output_path: str) -> str:
    """
    Converts Markdown text (e.g. **bold**, *italic*) to a styled PDF,
    removing surrounding code fences (like ```markdown ... ``` or ``` ... ```)
    if present, and saves it to the specified file path.
    Returns the file path of the saved PDF.
    """
    # 1. Preprocess: Remove potential Markdown code fences
    processed_text = markdown_text.strip()  # Remove leading/trailing whitespace

    # Check for and remove starting fence (```markdown or ```)
    if processed_text.startswith("```markdown"):
        processed_text = processed_text[
            len("```markdown") :
        ].lstrip()  # Remove fence and leading space/newline
    elif processed_text.startswith("```"):
        processed_text = processed_text[
            len("```") :
        ].lstrip()  # Remove fence and leading space/newline

    # Check for and remove ending fence (```)
    if processed_text.endswith("```"):
        processed_text = processed_text[
            : -len("```")
        ].rstrip()  # Remove fence and trailing space/newline

    # 2. Convert Markdown to HTML using the processed text
    html_text = markdown(processed_text)

    # 3. Set up PDF document
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=1 * inch,
        rightMargin=1 * inch,
        topMargin=1 * inch,
        bottomMargin=1 * inch,
    )

    # 4. Use a suitable paragraph style (BodyText might be better than Normal)
    styles = getSampleStyleSheet()
    style = styles["BodyText"]  # Or stick with styles["Normal"] if preferred

    # 5. Build ReportLab elements from HTML
    elements = []
    # Split the HTML by lines and create Paragraphs.
    # Note: This is a basic approach. ReportLab's Paragraph handles simple HTML.
    # More complex HTML/CSS might require libraries like xhtml2pdf or WeasyPrint.
    for line in html_text.split("\n"):
        stripped_line = line.strip()
        if stripped_line:  # Avoid adding paragraphs for empty lines
            elements.append(Paragraph(stripped_line, style))
            # Removed the default Spacer(1, 12) as Paragraphs often have spaceAfter.
            # Add back a smaller spacer if needed: elements.append(Spacer(1, 6))

    # 6. Build the PDF
    try:
        doc.build(elements)
    except Exception as e:
        print(f"Error building PDF: {e}")
        raise  # Re-raise the exception to signal failure

    return output_path


# # Example usage (ensure the path exists or adjust as needed):
# markdown_input_with_fences = """
# ```markdown
# # Document Title
#
# Dear **Hiring Manager**,
#
# I am writing to apply for the position of **AI Research Engineer**.
#
# My experience includes:
# *   *Machine learning*
# *   *Natural language processing*
# *   **Deep learning**
#
# I am confident I can contribute effectively.
#
# Best regards,
# **Surabhi**
# ```
# """

# markdown_input_without_fences = """
# # Another Document
#
# This text does *not* have fences. It should work directly.
# - Point A
# - Point B
# """

# # Define the output path (make sure the directory exists)
# output_file_path_1 = "cover_letter_processed.pdf"
# output_file_path_2 = "another_document.pdf"

# try:
#     # Test with fences (should be removed)
#     pdf_path_1 = create_pdf_from_markdown(markdown_input_with_fences, output_file_path_1)
#     print(f"PDF with fences processed and saved at: {pdf_path_1}")

#     # Test without fences (should work as before)
#     pdf_path_2 = create_pdf_from_markdown(markdown_input_without_fences, output_file_path_2)
#     print(f"PDF without fences processed and saved at: {pdf_path_2}")

# except Exception as e:
#      print(f"Failed to create PDF: {e}")
