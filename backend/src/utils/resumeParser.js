import pdfParse from "pdf-parse";

const SKILL_VOCABULARY = [
  "python",
  "java",
  "javascript",
  "typescript",
  "react",
  "node.js",
  "fastapi",
  "django",
  "flask",
  "mongodb",
  "sql",
  "machine learning",
  "deep learning",
  "nlp",
  "data analysis",
  "pandas",
  "numpy",
  "scikit-learn",
  "tailwind",
  "docker",
  "git",
  "html",
  "css",
];

export async function extractTextFromPdf(buffer) {
  const parsed = await pdfParse(buffer);
  return parsed.text || "";
}

function extractSection(text, heading) {
  const pattern = new RegExp(`${heading}\\s*(.*?)(?:\\n[A-Z][A-Za-z ]+\\n|$)`, "is");
  const match = text.match(pattern);
  if (!match) return [];

  return match[1]
    .split("\n")
    .map((line) => line.replace(/^[•\-]\s*/, "").trim())
    .filter(Boolean);
}

export function parseResume(text) {
  const normalizedText = text.toLowerCase().replace(/\s+/g, " ").trim();
  const skills = SKILL_VOCABULARY.filter((skill) => normalizedText.includes(skill)).sort();

  let education = extractSection(text, "Education");
  let projects = extractSection(text, "Projects");

  if (education.length === 0) {
    education = (text.match(/(B\.?Tech|M\.?Tech|B\.?Sc|M\.?Sc|Bachelor|Master)[^\n]+/gi) || []).slice(0, 5);
  }

  if (projects.length === 0) {
    projects = (text.match(/(?:Project|Built|Developed)\s*[:\-]?\s*([^\n]+)/gi) || [])
      .map((item) => item.replace(/(?:Project|Built|Developed)\s*[:\-]?\s*/i, "").trim())
      .slice(0, 5);
  }

  return {
    skills,
    education: education.slice(0, 5),
    projects: projects.slice(0, 5),
    raw_text: text.slice(0, 5000),
  };
}
