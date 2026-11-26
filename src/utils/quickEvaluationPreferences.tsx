
import type {
    AreaWeights,
    EvaluationArea,
    EvaluationGoal,
    OptionalEvaluationArea,
} from "@/types/quickEvaluation";

// Default weights for each goal.
// These are starting priorities, not editable in Quick Evaluation.

const GOAL_WEIGHT_PRESETS: Record<EvaluationGoal, AreaWeights> = {
    money: {
        financial: 60,
        learning: 20,
        satisfaction: 20,
    },

    careerGrowth: {
        financial: 20,
        learning: 60,
        satisfaction: 20,
    },

    satisfaction: {
        financial: 20,
        learning: 20,
        satisfaction: 60,
    },

    balanced: {
        financial: 1,
        learning: 1,
        satisfaction: 1,
    },
};

export function calculateQuickEvaluationWeights(
    mainGoal: EvaluationGoal,
    includedOptionalAreas: OptionalEvaluationArea[]
): AreaWeights {

    const uniqueOptionalAreas = [
        ...new Set(includedOptionalAreas),
    ];

    const includedAreas: EvaluationArea[] = [
        "financial",
        ...uniqueOptionalAreas,
    ];

    const preset = GOAL_WEIGHT_PRESETS[mainGoal];

    const totalOriginalWeight = includedAreas.reduce(
        (total, area) => total + preset[area],
        0
    );

    if (totalOriginalWeight <= 0) {
        throw new Error("At least one evaluation area must be included.");
    }

    const weights: AreaWeights = {
        financial: 0,
        learning: 0,
        satisfaction: 0,
    };

    let assignedWeight = 0;

    includedAreas.forEach((area, index) => {
        const isLastArea = index === includedAreas.length - 1;

        if (isLastArea) {
            // Ensure the final weights always total exactly 100.
            weights[area] = Number((100 - assignedWeight).toFixed(1));
            return;
        }

        const normalisedWeight =
            (preset[area] / totalOriginalWeight) * 100;

        const roundedWeight = Number(normalisedWeight.toFixed(1));

        weights[area] = roundedWeight;
        assignedWeight += roundedWeight;
    });

    return weights;
}

export function getRequiredOptionalArea(
    goal: EvaluationGoal
): OptionalEvaluationArea | null {
    if (goal === "careerGrowth") return "learning";
    if (goal === "satisfaction") return "satisfaction";

    return null;
}
