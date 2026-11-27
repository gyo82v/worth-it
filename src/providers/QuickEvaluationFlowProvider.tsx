
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";

import type {
    EvaluationPreferences,
    QuickEvaluationResult,
} from "@/types/quickEvaluation";


interface QuickEvaluationFlowContextValue {
    preferences: EvaluationPreferences | null;
    result: QuickEvaluationResult | null;

    setPreferences: (preferences: EvaluationPreferences) => void;
    setResult: (result: QuickEvaluationResult) => void;

    clearPreferences: () => void;
    clearResult: () => void;
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

    const [result, setResultState] =
        useState<QuickEvaluationResult | null>(null);


    const setPreferences = useCallback(
        (nextPreferences: EvaluationPreferences) => {
            setPreferencesState(nextPreferences);
            setResultState(null);
        },
        []
    );


    const setResult = useCallback(
        (nextResult: QuickEvaluationResult) => {
            setResultState(nextResult);
        },
        []
    );


    const clearPreferences = useCallback(() => {
        setPreferencesState(null);
        setResultState(null);
    }, []);


    const clearResult = useCallback(() => {
        setResultState(null);
    }, []);


    const value = useMemo(
        () => ({
            preferences,
            result,
            setPreferences,
            setResult,
            clearPreferences,
            clearResult,
        }),
        [
            preferences,
            result,
            setPreferences,
            setResult,
            clearPreferences,
            clearResult,
        ]
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

