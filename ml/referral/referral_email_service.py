from http.client import HTTPException
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def send_email(to_email: str, subject: str, body: str):
    """
    **Helper Function: Send Email**

    *Sends an email notification to the user.*

    **Args:**
    - `to_email` (*str*): Recipient email address.
    - `subject` (*str*): Email subject.
    - `body` (*str*): Email body content.
    """
    sender_email = "surabhiwaingankar@gmail.com"
    sender_password = "tbkx roos nvgw cuwk"

    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, to_email, msg.as_string())
        server.quit()
        return {"message": "Email sent successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Email sending failed: {str(e)}")


# send_email(
#     "surabhicoder@gmail.com",
#     "Test Email",
#     "This is a test email from the mail service.",
# )
