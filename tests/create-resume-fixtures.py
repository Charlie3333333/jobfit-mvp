"""Create synthetic documents for manual upload checks, never real user data."""
from pathlib import Path
from reportlab.pdfgen import canvas
from docx import Document

lines = [
    "Test Candidate", "EDUCATION", "Example College", "2020 - 2024",
    "WORK EXPERIENCE", "Acme | New York, NY | Jun 2024 - Present",
    "Customer Service Associate", "- Assisted 50 customers daily.",
    "- Resolved customer questions.", "City School | Sep 2023 - May 2024",
    "Teaching Assistant", "- Prepared classroom materials.", "SKILLS", "Excel",
]
folder = Path("/private/tmp/bestfit-import-tests")
folder.mkdir(exist_ok=True)
(folder / "resume.txt").write_text("\n".join(lines))
pdf = canvas.Canvas(str(folder / "resume.pdf"))
for i, line in enumerate(lines):
    pdf.drawString(50, 790 - i * 22, line)
pdf.save()
doc = Document()
for line in lines:
    doc.add_paragraph(line)
doc.save(folder / "resume.docx")
print(folder)
stress = ["WORK EXPERIENCE"]
for index in range(8):
    role = "Customer Service Specialist" if index < 4 else "Graphic Designer"
    stress.extend([
        f"{role} | Test Organization {index + 1} | Jan {2015 + index} - Dec {2015 + index}",
        "- Assisted customers with service requests, resolved complaints, documented customer feedback, and coordinated follow-up with the support team to clarify recurring questions and maintain reliable client communication.",
        "- Scheduled client appointments, maintained customer records, explained service options clearly, and collaborated with colleagues to address requests and provide consistent customer support across daily operations.",
        "- Organized weekly reports and shared service updates with the team to track pending requests, document recurring issues, and keep internal stakeholders informed about customer needs and next steps.",
        "- Prepared documentation for customer meetings and helped maintain a consistent record of service tasks, appointment schedules, and feedback gathered through direct client communication.",
    ])
(folder / "long-resume.txt").write_text("\n".join(stress))
