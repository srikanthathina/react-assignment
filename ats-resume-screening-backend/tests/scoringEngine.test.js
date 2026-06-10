import { calculateMatchScore } from "../src/services/scoringEngine.js";

describe("calculateMatchScore", () => {
  it("returns a strong match when resume skills satisfy job skills", () => {
    const result = calculateMatchScore({
      resume: {
        skills: ["node", "express", "mongodb", "jwt", "react"],
        yearsOfExperience: 2,
        extractedText: "Node Express MongoDB JWT React REST API testing"
      },
      job: {
        requiredSkills: ["node", "express", "mongodb", "jwt"],
        minExperience: 1,
        description: "Need Node Express MongoDB JWT REST API testing"
      }
    });

    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.recommendation).toBe("strong_match");
    expect(result.missingSkills).toHaveLength(0);
  });

  it("detects missing required skills", () => {
    const result = calculateMatchScore({
      resume: {
        skills: ["html", "css"],
        yearsOfExperience: 0,
        extractedText: "HTML CSS portfolio"
      },
      job: {
        requiredSkills: ["node", "express", "mongodb"],
        minExperience: 1,
        description: "Backend developer with Node Express MongoDB"
      }
    });

    expect(result.score).toBeLessThan(45);
    expect(result.missingSkills).toEqual(["node", "express", "mongodb"]);
  });
});
