
// ============================================
// IMPORTS
// ============================================

import type {
    EvaluationPreferences,
    Rating,
    RatingAnswer,
    FinancialInput,
    LearningInput,
    SatisfactionInput,
    FinancialAreaResult,
    RatingAreaResult,
    QuickEvaluationInput,
    QuickEvaluationAreaResults,
    QuickEvaluationResult,
    QuickEvaluationVerdict,
} from "@/types/quickEvaluation";


// ============================================
// CONSTANTS
// ============================================

// Initial V1 verdict boundaries.
// We can adjust these after testing.

export const QUICK_EVALUATION_VERDICT_THRESHOLDS = {
    notWorthIt: 20,
    probablyNotWorthIt: 40,
    mixed: 60,
    worthIt: 80,
} as const;


// ============================================
// VALIDATION HELPERS
// ============================================

function validateNonNegative(
    value: number,
    fieldName: string
): void {
    if (!Number.isFinite(value) || value < 0) {
        throw new Error(`${fieldName} must be a valid non-negative number.`);
    }
}

function validatePreferences(
    preferences: EvaluationPreferences
): void {
    const { weights, includedOptionalAreas, minimumHourlyEarnings } =
        preferences;

    if (
        minimumHourlyEarnings !== null &&
        (!Number.isFinite(minimumHourlyEarnings) ||
            minimumHourlyEarnings <= 0)
    ) {
        throw new Error("Minimum hourly earnings must be greater than zero.");
    }

    if (
        new Set(includedOptionalAreas).size !==
        includedOptionalAreas.length
    ) {
        throw new Error("Optional evaluation areas cannot contain duplicates.");
    }

    const areas = [
        "financial",
        "learning",
        "satisfaction",
    ] as const;

    let totalWeight = 0;

    for (const area of areas) {
        const weight = weights[area];

        if (!Number.isFinite(weight) || weight < 0 || weight > 100) {
            throw new Error(`Invalid weight for ${area}.`);
        }

        totalWeight += weight;
    }

    if (Math.abs(totalWeight - 100) > 0.01) {
        throw new Error("Evaluation weights must total 100%.");
    }

    if (weights.financial <= 0) {
        throw new Error("Financial must always have a positive weight.");
    }

    for (const area of ["learning", "satisfaction"] as const) {
        const isIncluded = includedOptionalAreas.includes(area);
        const weight = weights[area];

        if (isIncluded && weight <= 0) {
            throw new Error(`${area} must have a positive weight when included.`);
        }

        if (!isIncluded && weight !== 0) {
            throw new Error(`${area} must have a weight of zero when excluded.`);
        }
    }
}


// ============================================
// 1. FINANCIAL AREA
// ============================================

export function calculateFinancialAreaResult(
    input: FinancialInput,
    minimumHourlyEarnings: number | null
): FinancialAreaResult {

    validateNonNegative(input.incomeAfterTax, "Income");
    validateNonNegative(input.benefitsValue, "Benefits");
    validateNonNegative(input.jobExpenses, "Job expenses"); 
    validateNonNegative(input.totalCommittedHours,"Total committed hours");

    const totalHours = input.totalCommittedHours;

    if (totalHours <= 0) {
        throw new Error("Total committed hours must be greater than zero.");
    }

    if (
        minimumHourlyEarnings !== null &&
        (!Number.isFinite(minimumHourlyEarnings) ||
            minimumHourlyEarnings <= 0)
    ) {
        throw new Error("Minimum hourly earnings must be greater than zero.");
    }

    const netEarningsAfterJobExpenses =
        input.incomeAfterTax +
        input.benefitsValue -
        input.jobExpenses;

    const effectiveHourlyEarnings =
        netEarningsAfterJobExpenses / totalHours;

    const financialScore =
        minimumHourlyEarnings === null
            ? null
            : Math.min(
                  100,
                  Math.max(
                      0,
                      (effectiveHourlyEarnings / minimumHourlyEarnings) * 100
                  )
              );

    return {
        netEarningsAfterJobExpenses,
        effectiveHourlyEarnings,
        totalHours,
        financialScore,
    };
}


// ============================================
// SHARED RATING CALCULATION
// ============================================

function calculateRatingAreaResult(
    answers: RatingAnswer[]
): RatingAreaResult {

    const applicableRatings = answers.filter(
        (answer): answer is Rating => answer !== "notApplicable"
    );

    if (applicableRatings.length === 0) {
        return {
            averageRating: null,
            score: null,
        };
    }

    const averageRating =
        applicableRatings.reduce(
            (total, rating) => total + rating,
            0
        ) / applicableRatings.length;

    const score = ((averageRating - 1) / 4) * 100;

    return {
        averageRating,
        score,
    };
}


// ============================================
// 2. LEARNING AREA
// ============================================

export function calculateLearningAreaResult(
    input: LearningInput
): RatingAreaResult {

    return calculateRatingAreaResult([
        input.skillDevelopment,
        input.careerRelevance,
        input.networking,
    ]);
}


// ============================================
// 3. SATISFACTION AREA
// ============================================

export function calculateSatisfactionAreaResult(
    input: SatisfactionInput
): RatingAreaResult {

    return calculateRatingAreaResult([
        input.colleagues,
        input.management,
        input.workLifeBalance,
        input.stressManageability,
    ]);
}


// ============================================
// 4. OVERALL SCORE
// ============================================

type WeightedAreaResult = {
    score: number | null;
    weight: number;
};

export function calculateOverallScore(
    areas: WeightedAreaResult[]
): number | null {

    // Every positively weighted area must have a valid score.
    if (areas.some((area) => area.score === null)) {
        return null;
    }

    const total = areas.reduce(
        (sum, area) => sum + (area.score ?? 0) * area.weight,
        0
    );

    return Math.min(100, Math.max(0, total / 100));
}


// ============================================
// VERDICT
// ============================================

function calculateVerdict(
    score: number | null
): QuickEvaluationVerdict | null {

    if (score === null) {
        return null;
    }

    const thresholds = QUICK_EVALUATION_VERDICT_THRESHOLDS;

    if (score < thresholds.notWorthIt) {
        return "notWorthIt";
    }

    if (score < thresholds.probablyNotWorthIt) {
        return "probablyNotWorthIt";
    }

    if (score < thresholds.mixed) {
        return "mixed";
    }

    if (score < thresholds.worthIt) {
        return "worthIt";
    }

    return "definitelyWorthIt";
}


// ============================================
// 5. COMPLETE QUICK EVALUATION
// ============================================

export function calculateQuickEvaluationResult(
    input: QuickEvaluationInput,
    preferences: EvaluationPreferences,
    evaluatedAt: Date = new Date()
): QuickEvaluationResult {

    validatePreferences(preferences);

    if (!(evaluatedAt instanceof Date) ||
        !Number.isFinite(evaluatedAt.getTime())) {
        throw new Error("Invalid evaluation date.");
    }

    // Financial is always mandatory.
    const financial = calculateFinancialAreaResult(
        input.financial,
        preferences.minimumHourlyEarnings
    );

    const areaResults: QuickEvaluationAreaResults = {
        financial,
    };

    const weightedAreas: WeightedAreaResult[] = [
        {
            score: financial.financialScore,
            weight: preferences.weights.financial,
        },
    ];

    // Learning is optional.
    if (preferences.includedOptionalAreas.includes("learning")) {

        if (!input.learning) {
            throw new Error("Learning input is required for this evaluation.");
        }

        const learning = calculateLearningAreaResult(input.learning);

        areaResults.learning = learning;

        weightedAreas.push({
            score: learning.score,
            weight: preferences.weights.learning,
        });
    }

    // Satisfaction is optional.
    if (preferences.includedOptionalAreas.includes("satisfaction")) {

        if (!input.satisfaction) {
            throw new Error("Satisfaction input is required for this evaluation.");
        }

        const satisfaction = calculateSatisfactionAreaResult(
            input.satisfaction
        );

        areaResults.satisfaction = satisfaction;

        weightedAreas.push({
            score: satisfaction.score,
            weight: preferences.weights.satisfaction,
        });
    }

    const overallScore = calculateOverallScore(weightedAreas);

    const verdict = calculateVerdict(overallScore);

    // Create snapshots to prevent later preference or input changes
    // from altering the completed evaluation.
    const inputSnapshot: QuickEvaluationInput = {
    ...input,
    financial: {
        ...input.financial,
    },
};

    if (!preferences.includedOptionalAreas.includes("learning")) {
        delete inputSnapshot.learning;
    } else if (input.learning) {
        inputSnapshot.learning = { ...input.learning };
    }

    if (!preferences.includedOptionalAreas.includes("satisfaction")) {
        delete inputSnapshot.satisfaction;
    } else if (input.satisfaction) {
        inputSnapshot.satisfaction = { ...input.satisfaction };
    }

    const preferencesSnapshot: EvaluationPreferences = {
        ...preferences,
        includedOptionalAreas: [...preferences.includedOptionalAreas],
        weights: { ...preferences.weights },
    };

    return {
        input: inputSnapshot,
        preferences: preferencesSnapshot,
        areaResults,
        overallScore,
        verdict,
        evaluatedAt: new Date(evaluatedAt.getTime()),
    };
}
