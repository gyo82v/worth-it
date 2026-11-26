
import { calculateQuickEvaluationWeights } from "../quickEvaluationPreferences";

describe("calculateQuickEvaluationWeights", () => {

    it("returns balanced weights when all areas are included", () => {
        const result = calculateQuickEvaluationWeights(
            "balanced",
            ["learning", "satisfaction"]
        );

        expect(result).toEqual({
            financial: 33.3,
            learning: 33.3,
            satisfaction: 33.4,
        });
    });

    it("returns Money preset weights", () => {
        const result = calculateQuickEvaluationWeights(
            "money",
            ["learning", "satisfaction"]
        );

        expect(result).toEqual({
            financial: 60,
            learning: 20,
            satisfaction: 20,
        });
    });

    it("redistributes weights when an area is excluded", () => {
        const result = calculateQuickEvaluationWeights(
            "money",
            ["learning"]
        );

        expect(result).toEqual({
            financial: 75,
            learning: 25,
            satisfaction: 0,
        });
    });

    it("supports Financial only", () => {
        const result = calculateQuickEvaluationWeights(
            "balanced",
            []
        );

        expect(result).toEqual({
            financial: 100,
            learning: 0,
            satisfaction: 0,
        });
    });

    it("returns weights totalling 100", () => {
        const goals = [
            "money",
            "careerGrowth",
            "satisfaction",
            "balanced",
        ] as const;

        goals.forEach((goal) => {
            const result = calculateQuickEvaluationWeights(
                goal,
                ["learning", "satisfaction"]
            );

            const total =
                result.financial +
                result.learning +
                result.satisfaction;

            expect(total).toBe(100);
        });
    });
});
