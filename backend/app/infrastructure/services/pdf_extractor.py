import json
import re
from io import BytesIO
from pathlib import Path

from pypdf import PdfReader

from app.core.config import get_settings

settings = get_settings()


class PDFExtractor:
    @staticmethod
    def extract_text(file_path: Path) -> str:
        reader = PdfReader(str(file_path))
        pages = [page.extract_text() or "" for page in reader.pages]
        return "\n".join(pages).strip()

    @staticmethod
    def parse_sections(text: str) -> dict:
        skills = PDFExtractor._extract_skills(text)
        projects = PDFExtractor._extract_section(text, ["projects", "project"])
        education = PDFExtractor._extract_section(text, ["education", "academic"])
        experience = PDFExtractor._extract_section(text, ["experience", "work history", "employment"])
        return {
            "skills": skills,
            "projects": projects,
            "education": education,
            "experience": experience,
        }

    @staticmethod
    def _extract_skills(text: str) -> str:
        common_skills = [
            "python", "javascript", "typescript", "react", "node", "java", "sql",
            "fastapi", "django", "flask", "aws", "docker", "kubernetes", "git",
            "mongodb", "postgresql", "redis", "html", "css", "tailwind", "vue",
            "angular", "c++", "c#", "go", "rust", "machine learning", "data science",
        ]
        lower = text.lower()
        found = [skill for skill in common_skills if skill in lower]
        skills_section = PDFExtractor._extract_section(text, ["skills", "technical skills"])
        if skills_section:
            found.extend(re.split(r"[,;\n|•·]", skills_section.lower()))
        unique = sorted({s.strip() for s in found if s.strip()})
        return json.dumps(unique[:30])

    @staticmethod
    def _extract_section(text: str, keywords: list[str]) -> str:
        lines = text.split("\n")
        capture = False
        section_lines = []
        for line in lines:
            lower = line.lower().strip()
            if any(kw in lower for kw in keywords) and len(lower) < 40:
                capture = True
                continue
            if capture:
                if lower and len(lower) < 30 and lower.isupper():
                    break
                if lower in ("projects", "education", "experience", "skills", "summary"):
                    break
                section_lines.append(line)
        return "\n".join(section_lines).strip()[:2000]
