const skillDictionary = [
  "javascript",
  "typescript",
  "node.js",
  "node",
  "express",
  "react",
  "mongodb",
  "mongoose",
  "sql",
  "mysql",
  "postgresql",
  "python",
  "java",
  "c++",
  "html",
  "css",
  "rest api",
  "jwt",
  "docker",
  "aws",
  "git",
  "github",
  "openai",
  "machine learning",
  "deep learning",
  "data science",
  "pandas",
  "numpy",
  "matplotlib",
  "power bi",
  "n8n",
  "api integration",
  "testing",
  "jest",
  "redis"
];

const normalize = (value) => value.toLowerCase().replace(/\s+/g, " ").trim();

export const extractSkills = (text) => {
  const normalizedText = normalize(text);
  return [...new Set(skillDictionary.filter((skill) => normalizedText.includes(skill)))];
};

export const extractYearsOfExperience = (text) => {
  const match = text.match(/(\d+)\+?\s*(years|yrs|year)/i);
  return match ? Number(match[1]) : 0;
};

export const extractKeywords = (text) => {
  const stopWords = new Set([
    "and",
    "the",
    "for",
    "with",
    "you",
    "are",
    "our",
    "will",
    "this",
    "that",
    "from",
    "have",
    "has",
    "into",
    "using",
    "work",
    "role"
  ]);

  return [
    ...new Set(
      normalize(text)
        .replace(/[^a-z0-9+#.\s]/g, " ")
        .split(" ")
        .filter((word) => word.length > 2 && !stopWords.has(word))
    )
  ].slice(0, 80);
};
