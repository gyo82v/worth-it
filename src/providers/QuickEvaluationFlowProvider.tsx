
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";

import type { EvaluationPreferences } from "@/types/quickEvaluation";


interface QuickEvaluationFlowContextValue {
    preferences: EvaluationPreferences | null;
    setPreferences: (preferences: EvaluationPreferences) => void;
    clearPreferences: () => void;
}

const QuickEvaluationFlowContext =
    createContext<QuickEvaluationFlowContextValue | null>(null);


export function QuickEvaluationFlowProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [preferences, setPreferencesState] =
        useState<EvaluationPreferences | null>(null);

    const setPreferences = useCallback(
        (nextPreferences: EvaluationPreferences) => {
            setPreferencesState(nextPreferences);
        },
        []
    );

    const clearPreferences = useCallback(() => {
        setPreferencesState(null);
    }, []);

    const value = useMemo(
        () => ({
            preferences,
            setPreferences,
            clearPreferences,
        }),
        [preferences, setPreferences, clearPreferences]
    );

    return (
        <QuickEvaluationFlowContext.Provider value={value}>
            {children}
        </QuickEvaluationFlowContext.Provider>
    );
}


export function useQuickEvaluationFlow() {
    const context = useContext(QuickEvaluationFlowContext);

    if (!context) {
        throw new Error(
            "useQuickEvaluationFlow must be used within QuickEvaluationFlowProvider"
        );
    }

    return context;
}
