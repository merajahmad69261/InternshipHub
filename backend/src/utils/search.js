export function interpretSearchQuery(query) {
  const queryLower = query.toLowerCase();
  const knownSkills = [
    "python",
    "react",
    "javascript",
    "machine learning",
    "nlp",
    "mongodb",
    "fastapi",
    "data analysis",
    "sql",
    "docker",
  ];

  const skills = knownSkills.filter((skill) => queryLower.includes(skill));
  const location = queryLower.includes("remote") ? "Remote" : "";

  let role = "";
  if (["ai", "ml", "machine learning", "nlp"].some((term) => queryLower.includes(term))) {
    role = "AI/ML";
  } else if (["web", "frontend", "react", "full stack"].some((term) => queryLower.includes(term))) {
    role = "Web Development";
  } else if (["data", "analytics", "sql"].some((term) => queryLower.includes(term))) {
    role = "Data Science";
  }

  return {
    skills,
    location,
    role,
    keywords: query
      .split(/\s+/)
      .map((item) => item.trim())
      .filter(Boolean),
  };
}
