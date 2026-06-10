import { extractKeywords } from "./skillExtractor.js";

const uniqueLower = (items) => [...new Set(items.map((item) => item.toLowerCase().trim()))].filter(Boolean);

export const calculateMatchScore = ({ resume, job }) => {
  const resumeSkills = uniqueLower(resume.skills || []);
  const jobSkills = uniqueLower(job.requiredSkills || []);

  const matchedSkills = jobSkills.filter((skill) => resumeSkills.includes(skill));
  const missingSkills = jobSkills.filter((skill) => !resumeSkills.includes(skill));

  const skillScore = jobSkills.length ? (matchedSkills.length / jobSkills.length) * 65 : 20;
  const experienceScore =
    Number(resume.yearsOfExperience || 0) >= Number(job.minExperience || 0)
      ? 15
      : Math.max(0, (Number(resume.yearsOfExperience || 0) / Number(job.minExperience || 1)) * 15);

  const resumeKeywords = extractKeywords(resume.extractedText);
  const jobKeywords = extractKeywords(job.description);
  const keywordMatches = jobKeywords.filter((keyword) => resumeKeywords.includes(keyword));
  const keywordGaps = jobKeywords.filter((keyword) => !resumeKeywords.includes(keyword)).slice(0, 15);
  const keywordScore = jobKeywords.length ? (keywordMatches.length / jobKeywords.length) * 20 : 10;

  const score = Math.min(100, Math.round(skillScore + experienceScore + keywordScore));

  let recommendation = "not_recommended";
  if (score >= 80) recommendation = "strong_match";
  else if (score >= 65) recommendation = "good_match";
  else if (score >= 45) recommendation = "needs_improvement";

  return {
    score,
    matchedSkills,
    missingSkills,
    keywordGaps,
    recommendation,
    summary: `Candidate matched ${matchedSkills.length}/${jobSkills.length} required skills with an ATS score of ${score}.`
  };
};
