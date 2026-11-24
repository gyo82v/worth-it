
// ============================================
// BASIC TYPES
// ============================================

export type EvaluationArea =
    | "financial"
    | "learning"
    | "satisfaction";

export type EvaluationGoal =
    | "money"
    | "careerGrowth"
    | "satisfaction"
    | "balanced"
    | "custom";

export type EvaluationPeriod = "week" | "month" | "year";

export type Rating = 1 | 2 | 3 | 4 | 5;

// A question can have a rating or be marked as not applicable.
// Unanswered questions are not valid in a completed evaluation.
export type RatingAnswer = Rating | "notApplicable";

export type RequirementAnswer =
    | "yes"
    | "no"
    | "notApplicable";

export type AreaWeights = Record<EvaluationArea, number>;

export type OptionalEvaluationArea = Exclude<
    EvaluationArea,
    "financial"
>;


// ============================================
// EVALUATION PREFERENCES
// ============================================

export type EvaluationPreferences = {
    mainGoal: EvaluationGoal;

    // ISO 4217 currency code, e.g. EUR, GBP, USD.
    currency: string;

    // Minimum acceptable effective net earnings per hour.
    // Null means no personal financial target is set.
    minimumHourlyEarnings: number | null;

    // Areas the user wants to evaluate.
    includedOptionalAreas: OptionalEvaluationArea[];
    includeAreas: EvaluationArea[]

    // Importance of each area, expressed as percentages.
    // Excluded areas must have a weight of 0.
    // Included areas' weights must total 100.
    weights: AreaWeights;
};


// ============================================
// EVALUATION INPUTS
// ============================================

// FINANCIAL

export type FinancialInput = {
    period: EvaluationPeriod;

    // All financial values use the selected currency
    // and refer to the selected period.

    // Take-home income after taxes.
    incomeAfterTax: number;

    // Monetary value of additional benefits
    // such as free meals or accommodation.
    benefitsValue: number;

    // Additional expenses caused by the job.
    jobExpenses: number;

    // All hours refer to the same selected period.
    hours: {
        work: number;
        commuting: number;
        workingAtHome: number;
        other: number;
    };
};


// LEARNING

export type LearningInput = {
    skillDevelopment: RatingAnswer;
    careerRelevance: RatingAnswer;
    networking: RatingAnswer;

    // Contextual indicators, not included in the average score.
    requiredForCredits: RequirementAnswer;
    requiredForCurriculum: RequirementAnswer;
};


// SATISFACTION

export type SatisfactionInput = {
    colleagues: RatingAnswer;
    management: RatingAnswer;
    workLifeBalance: RatingAnswer;
    stressManageability: RatingAnswer;
};


// COMPLETE EVALUATION INPUT

export type QuickEvaluationInput = {
    jobTitle?: string;

    // An area can be absent when it is excluded
    // from the current evaluation.
    financial: FinancialInput;
    learning?: LearningInput;
    satisfaction?: SatisfactionInput;
};


// ============================================
// AREA RESULTS
// ============================================

// FINANCIAL RESULT

export type FinancialAreaResult = {
    // Income + benefits - job-related expenses.
    netEarningsAfterJobExpenses: number;

    // Net earnings divided by total committed hours.
    effectiveHourlyEarnings: number;

    totalHours: number;

    // Score from 0 to 100.
    // Null when no minimum hourly target is available.
    financialScore: number | null;
};


// LEARNING AND SATISFACTION RESULTS

export type RatingAreaResult = {
    // Average of applicable ratings, from 1 to 5.
    // Null when all questions are not applicable.
    averageRating: number | null;

    // Normalised score from 0 to 100.
    // Null when no applicable ratings are available.
    score: number | null;
};


// COMBINED AREA RESULTS

export type QuickEvaluationAreaResults = {
    financial: FinancialAreaResult;
    learning?: RatingAreaResult;
    satisfaction?: RatingAreaResult;
};


// ============================================
// OVERALL EVALUATION RESULT
// ============================================

export type QuickEvaluationVerdict =
    | "notWorthIt"
    | "probablyNotWorthIt"
    | "mixed"
    | "worthIt"
    | "definitelyWorthIt";

export type QuickEvaluationResult = {
    // Original information provided by the user.
    input: QuickEvaluationInput;

    // Snapshot of preferences and weights used.
    // Later preference changes must not affect this result.
    preferences: EvaluationPreferences;

    // Results of the three individual areas.
    areaResults: QuickEvaluationAreaResults;

    // Final weighted score from 0 to 100.
    // Null when a positively weighted area has no valid score.
    overallScore: number | null;

    // Null when an overall score cannot be calculated.
    verdict: QuickEvaluationVerdict | null;

    evaluatedAt: Date;
};


// ============================================
// SAVED EVALUATIONS
// ============================================

export type SavedQuickEvaluation = {
    id: string;
    userId: string;
    savedAt: Date;

    result: QuickEvaluationResult;
};


// ============================================
// SHARING
// ============================================

export type QuickEvaluationShareOptions = {
    // Whether to include actual hourly earnings
    // in the generated share summary.
    includeHourlyEarnings: boolean;
};



