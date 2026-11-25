
import { calculateFinancialAreaResult, calculateLearningAreaResult,
    calculateSatisfactionAreaResult, calculateOverallScore, calculateQuickEvaluationResult } from "../quickEvaluation";
import type { FinancialInput, LearningInput,
    SatisfactionInput,  EvaluationPreferences,
    QuickEvaluationInput, } from "../../types/quickEvaluation";

const validFinancialInput: FinancialInput = {
    period: "month",
    incomeAfterTax: 2000,
    benefitsValue: 100,
    jobExpenses: 300,
    hours: {
        work: 160,
        commuting: 20,
        workingAtHome: 0,
        other: 0,
    },
};

describe("calculateFinancialAreaResult", () => {

    it("calculates net earnings and effective hourly earnings", () => {
        const result = calculateFinancialAreaResult(
            validFinancialInput,
            12
        );

        expect(result.netEarningsAfterJobExpenses).toBe(1800);
        expect(result.totalHours).toBe(180);
        expect(result.effectiveHourlyEarnings).toBe(10);
    });

    it("calculates the financial score using the minimum hourly target", () => {
        const result = calculateFinancialAreaResult(
            validFinancialInput,
            12
        );

        expect(result.financialScore).toBeCloseTo(83.3333, 4);
    });

    it("returns null financial score when no minimum target is provided", () => {
        const result = calculateFinancialAreaResult(
            validFinancialInput,
            null
        );

        expect(result.financialScore).toBeNull();
        expect(result.effectiveHourlyEarnings).toBe(10);
    });

    it("does not return a negative financial score", () => {
        const input: FinancialInput = {
            ...validFinancialInput,
            jobExpenses: 2500,
        };

        const result = calculateFinancialAreaResult(input, 12);

        expect(result.effectiveHourlyEarnings).toBeLessThan(0);
        expect(result.financialScore).toBe(0);
    });

    it("caps the financial score at 100", () => {
        const result = calculateFinancialAreaResult(
            validFinancialInput,
            8
        );

        expect(result.financialScore).toBe(100);
    });

    it("throws an error when total hours are zero", () => {
        const input: FinancialInput = {
            ...validFinancialInput,
            hours: {
                work: 0,
                commuting: 0,
                workingAtHome: 0,
                other: 0,
            },
        };

        expect(() =>
            calculateFinancialAreaResult(input, 12)
        ).toThrow("Total committed hours must be greater than zero.");
    });

    it("rejects negative expenses", () => {
        const input: FinancialInput = {
            ...validFinancialInput,
            jobExpenses: -100,
        };

        expect(() =>
            calculateFinancialAreaResult(input, 12)
        ).toThrow("Job expenses must be a valid non-negative number.");
    });

});


// ============================================
// LEARNING TESTS
// ============================================

describe("calculateLearningAreaResult", () => {

    const validLearningInput: LearningInput = {
        skillDevelopment: 5,
        careerRelevance: 3,
        networking: 1,
        requiredForCredits: "yes",
        requiredForCurriculum: "no",
    };

    it("calculates the average of all learning ratings", () => {
        const result = calculateLearningAreaResult(validLearningInput);

        expect(result.averageRating).toBe(3);
        expect(result.score).toBe(50);
    });

    it("returns 0 when all ratings are 1", () => {
        const input: LearningInput = {
            ...validLearningInput,
            skillDevelopment: 1,
            careerRelevance: 1,
            networking: 1,
        };

        const result = calculateLearningAreaResult(input);

        expect(result.averageRating).toBe(1);
        expect(result.score).toBe(0);
    });

    it("returns 100 when all ratings are 5", () => {
        const input: LearningInput = {
            ...validLearningInput,
            skillDevelopment: 5,
            careerRelevance: 5,
            networking: 5,
        };

        const result = calculateLearningAreaResult(input);

        expect(result.averageRating).toBe(5);
        expect(result.score).toBe(100);
    });

    it("ignores notApplicable ratings when calculating the average", () => {
        const input: LearningInput = {
            ...validLearningInput,
            skillDevelopment: 5,
            careerRelevance: "notApplicable",
            networking: 3,
        };

        const result = calculateLearningAreaResult(input);

        expect(result.averageRating).toBe(4);
        expect(result.score).toBe(75);
    });

    it("returns null scores when all ratings are notApplicable", () => {
        const input: LearningInput = {
            ...validLearningInput,
            skillDevelopment: "notApplicable",
            careerRelevance: "notApplicable",
            networking: "notApplicable",
        };

        const result = calculateLearningAreaResult(input);

        expect(result.averageRating).toBeNull();
        expect(result.score).toBeNull();
    });

    it("does not include academic requirements in the learning score", () => {
        const firstResult = calculateLearningAreaResult({
            ...validLearningInput,
            requiredForCredits: "yes",
            requiredForCurriculum: "yes",
        });

        const secondResult = calculateLearningAreaResult({
            ...validLearningInput,
            requiredForCredits: "no",
            requiredForCurriculum: "notApplicable",
        });

        expect(firstResult).toEqual(secondResult);
    });

});


// ============================================
// SATISFACTION TESTS
// ============================================

describe("calculateSatisfactionAreaResult", () => {

    const validSatisfactionInput: SatisfactionInput = {
        colleagues: 2,
        management: 4,
        workLifeBalance: 4,
        stressManageability: 5,
    };

    it("calculates the average of all satisfaction ratings", () => {
        const result = calculateSatisfactionAreaResult(
            validSatisfactionInput
        );

        expect(result.averageRating).toBe(3.75);
        expect(result.score).toBe(68.75);
    });

    it("returns 0 when all ratings are 1", () => {
        const input: SatisfactionInput = {
            colleagues: 1,
            management: 1,
            workLifeBalance: 1,
            stressManageability: 1,
        };

        const result = calculateSatisfactionAreaResult(input);

        expect(result.averageRating).toBe(1);
        expect(result.score).toBe(0);
    });

    it("returns 100 when all ratings are 5", () => {
        const input: SatisfactionInput = {
            colleagues: 5,
            management: 5,
            workLifeBalance: 5,
            stressManageability: 5,
        };

        const result = calculateSatisfactionAreaResult(input);

        expect(result.averageRating).toBe(5);
        expect(result.score).toBe(100);
    });

    it("ignores notApplicable ratings when calculating the average", () => {
        const input: SatisfactionInput = {
            colleagues: 4,
            management: "notApplicable",
            workLifeBalance: 2,
            stressManageability: "notApplicable",
        };

        const result = calculateSatisfactionAreaResult(input);

        expect(result.averageRating).toBe(3);
        expect(result.score).toBe(50);
    });

    it("returns null scores when all ratings are notApplicable", () => {
        const input: SatisfactionInput = {
            colleagues: "notApplicable",
            management: "notApplicable",
            workLifeBalance: "notApplicable",
            stressManageability: "notApplicable",
        };

        const result = calculateSatisfactionAreaResult(input);

        expect(result.averageRating).toBeNull();
        expect(result.score).toBeNull();
    });

});

// ============================================
// COMPLETE EVALUATION TEST DATA
// ============================================

const completeEvaluationInput: QuickEvaluationInput = {
    jobTitle: "Example job",

    financial: validFinancialInput,

    learning: {
        skillDevelopment: 4,
        careerRelevance: 3,
        networking: 5,
        requiredForCredits: "no",
        requiredForCurriculum: "yes",
    },

    satisfaction: {
        colleagues: 3,
        management: 4,
        workLifeBalance: 3,
        stressManageability: 4,
    },
};

const createPreferences = (
    overrides: Partial<EvaluationPreferences> = {}
): EvaluationPreferences => {

    const base: EvaluationPreferences = {
        mainGoal: "balanced",
        currency: "EUR",
        minimumHourlyEarnings: 10,
        includedOptionalAreas: ["learning", "satisfaction"],
        weights: {
            financial: 50,
            learning: 25,
            satisfaction: 25,
        },
    };

    return {
        ...base,
        ...overrides,
        includedOptionalAreas:
            overrides.includedOptionalAreas ?? base.includedOptionalAreas,
        weights: {
            ...base.weights,
            ...overrides.weights,
        },
    };
};


describe("calculateOverallScore", () => {

    it("calculates the weighted average of all areas", () => {
        const result = calculateOverallScore([
            { score: 100, weight: 50 },
            { score: 75, weight: 25 },
            { score: 50, weight: 25 },
        ]);

        expect(result).toBe(81.25);
    });

    it("calculates the score when only Financial is included", () => {
        const result = calculateOverallScore([
            { score: 80, weight: 100 },
        ]);

        expect(result).toBe(80);
    });

    it("returns null when a positively weighted area has no score", () => {
        const result = calculateOverallScore([
            { score: 100, weight: 50 },
            { score: null, weight: 25 },
            { score: 75, weight: 25 },
        ]);

        expect(result).toBeNull();
    });

    it("returns zero when all included areas have a zero score", () => {
        const result = calculateOverallScore([
            { score: 0, weight: 60 },
            { score: 0, weight: 40 },
        ]);

        expect(result).toBe(0);
    });

});

describe("calculateQuickEvaluationResult", () => {

    it("calculates all three areas and the overall result", () => {
        const result = calculateQuickEvaluationResult(
            completeEvaluationInput,
            createPreferences()
        );

        expect(result.areaResults.financial.financialScore).toBe(100);

        expect(result.areaResults.learning?.averageRating).toBe(4);
        expect(result.areaResults.learning?.score).toBe(75);

        expect(result.areaResults.satisfaction?.averageRating).toBe(3.5);
        expect(result.areaResults.satisfaction?.score).toBe(62.5);

        expect(result.overallScore).toBe(84.375);
        expect(result.verdict).toBe("definitelyWorthIt");
    });


    it("calculates the result when only Financial is included", () => {
        const input: QuickEvaluationInput = {
            jobTitle: "Financial only job",
            financial: validFinancialInput,
        };

        const preferences = createPreferences({
            includedOptionalAreas: [],
            weights: {
                financial: 100,
                learning: 0,
                satisfaction: 0,
            },
        });

        const result = calculateQuickEvaluationResult(input, preferences);

        expect(result.overallScore).toBe(100);
        expect(result.verdict).toBe("definitelyWorthIt");

        expect(result.areaResults).not.toHaveProperty("learning");
        expect(result.areaResults).not.toHaveProperty("satisfaction");
    });


    it("calculates the result when only Learning is additionally included", () => {
        const preferences = createPreferences({
            includedOptionalAreas: ["learning"],
            weights: {
                financial: 40,
                learning: 60,
                satisfaction: 0,
            },
        });

        const input: QuickEvaluationInput = {
            financial: validFinancialInput,
            learning: completeEvaluationInput.learning,
        };

        const result = calculateQuickEvaluationResult(input, preferences);

        // Financial: 100 * 0.4 = 40
        // Learning: 75 * 0.6 = 45

        expect(result.overallScore).toBe(85);
        expect(result.areaResults).not.toHaveProperty("satisfaction");
    });


    it("returns no overall score when the financial target is missing", () => {
        const preferences = createPreferences({
            minimumHourlyEarnings: null,
        });

        const result = calculateQuickEvaluationResult(
            completeEvaluationInput,
            preferences
        );

        expect(result.areaResults.financial.financialScore).toBeNull();

        expect(result.areaResults.learning?.score).toBe(75);
        expect(result.areaResults.satisfaction?.score).toBe(62.5);

        expect(result.overallScore).toBeNull();
        expect(result.verdict).toBeNull();
    });


    it("returns no overall score when an included area has no applicable ratings", () => {
        const input: QuickEvaluationInput = {
            financial: validFinancialInput,

            learning: {
                skillDevelopment: "notApplicable",
                careerRelevance: "notApplicable",
                networking: "notApplicable",
                requiredForCredits: "no",
                requiredForCurriculum: "no",
            },

            satisfaction: completeEvaluationInput.satisfaction,
        };

        const result = calculateQuickEvaluationResult(
            input,
            createPreferences()
        );

        expect(result.areaResults.learning?.score).toBeNull();
        expect(result.overallScore).toBeNull();
        expect(result.verdict).toBeNull();
    });


    it("throws an error when an included optional area has no input", () => {
        const input: QuickEvaluationInput = {
            financial: validFinancialInput,
            satisfaction: completeEvaluationInput.satisfaction,
        };

        expect(() =>
            calculateQuickEvaluationResult(input, createPreferences())
        ).toThrow("Learning input is required for this evaluation.");
    });


    it("does not require input for excluded areas", () => {
        const input: QuickEvaluationInput = {
            financial: validFinancialInput,
        };

        const preferences = createPreferences({
            includedOptionalAreas: [],
            weights: {
                financial: 100,
                learning: 0,
                satisfaction: 0,
            },
        });

        expect(() =>
            calculateQuickEvaluationResult(input, preferences)
        ).not.toThrow();
    });

});


describe("Evaluation preferences validation", () => {

    it("rejects weights that do not total 100", () => {
        const preferences = createPreferences({
            weights: {
                financial: 60,
                learning: 20,
                satisfaction: 10,
            },
        });

        expect(() =>
            calculateQuickEvaluationResult(
                completeEvaluationInput,
                preferences
            )
        ).toThrow("Evaluation weights must total 100%.");
    });


    it("rejects a zero financial weight", () => {
        const preferences = createPreferences({
            weights: {
                financial: 0,
                learning: 50,
                satisfaction: 50,
            },
        });

        expect(() =>
            calculateQuickEvaluationResult(
                completeEvaluationInput,
                preferences
            )
        ).toThrow("Financial must always have a positive weight.");
    });


    it("rejects a positive weight for an excluded area", () => {
        const preferences = createPreferences({
            includedOptionalAreas: ["learning"],
            weights: {
                financial: 60,
                learning: 20,
                satisfaction: 20,
            },
        });

        expect(() =>
            calculateQuickEvaluationResult(
                completeEvaluationInput,
                preferences
            )
        ).toThrow("satisfaction must have a weight of zero when excluded.");
    });


    it("rejects an included area with zero weight", () => {
        const preferences = createPreferences({
            includedOptionalAreas: ["learning"],
            weights: {
                financial: 100,
                learning: 0,
                satisfaction: 0,
            },
        });

        expect(() =>
            calculateQuickEvaluationResult(
                completeEvaluationInput,
                preferences
            )
        ).toThrow("learning must have a positive weight when included.");
    });


    it("rejects duplicate optional areas", () => {
        const preferences = createPreferences({
            includedOptionalAreas: ["learning", "learning"],
            weights: {
                financial: 50,
                learning: 50,
                satisfaction: 0,
            },
        });

        expect(() =>
            calculateQuickEvaluationResult(
                completeEvaluationInput,
                preferences
            )
        ).toThrow("Optional evaluation areas cannot contain duplicates.");
    });

});


describe("Quick evaluation verdict", () => {

    const getVerdictForScore = (score: number) => {

        const input: QuickEvaluationInput = {
            financial: {
                period: "month",
                incomeAfterTax: score * 100,
                benefitsValue: 0,
                jobExpenses: 0,
                hours: {
                    work: 100,
                    commuting: 0,
                    workingAtHome: 0,
                    other: 0,
                },
            },
        };

        const preferences = createPreferences({
            minimumHourlyEarnings: 100,
            includedOptionalAreas: [],
            weights: {
                financial: 100,
                learning: 0,
                satisfaction: 0,
            },
        });

        return calculateQuickEvaluationResult(
            input,
            preferences
        ).verdict;
    };


    it("uses the correct verdict boundaries", () => {

        expect(getVerdictForScore(19.99)).toBe("notWorthIt");

        expect(getVerdictForScore(20)).toBe("probablyNotWorthIt");

        expect(getVerdictForScore(40)).toBe("mixed");

        expect(getVerdictForScore(60)).toBe("worthIt");

        expect(getVerdictForScore(80)).toBe("definitelyWorthIt");

    });

});

describe("Evaluation snapshots", () => {

    it("keeps the original inputs and preferences unchanged", () => {

        const input: QuickEvaluationInput = {
            ...completeEvaluationInput,
            financial: {
                ...validFinancialInput,
                hours: { ...validFinancialInput.hours },
            },
            learning: { ...completeEvaluationInput.learning! },
            satisfaction: { ...completeEvaluationInput.satisfaction! },
        };

        const preferences = createPreferences();

        const result = calculateQuickEvaluationResult(
            input,
            preferences
        );

        // Modify the original input and preferences.
        input.financial.hours.work = 999;
        preferences.weights.financial = 10;
        preferences.includedOptionalAreas.pop();

        // The completed evaluation must remain unchanged.
        expect(result.input.financial.hours.work).toBe(160);
        expect(result.preferences.weights.financial).toBe(50);

        expect(result.preferences.includedOptionalAreas).toEqual([
            "learning",
            "satisfaction",
        ]);

        expect(result.overallScore).toBe(84.375);

    });


    it("stores an independent evaluation date", () => {

        const evaluatedAt = new Date("2026-11-25T10:00:00");

        const result = calculateQuickEvaluationResult(
            completeEvaluationInput,
            createPreferences(),
            evaluatedAt
        );

        expect(result.evaluatedAt).toEqual(evaluatedAt);
        expect(result.evaluatedAt).not.toBe(evaluatedAt);

    });

});

