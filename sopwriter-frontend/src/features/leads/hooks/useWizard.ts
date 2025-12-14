import { useReducer, useCallback } from "react";
import type { WizardState, Category } from "@/types/wizard";

const initialState: WizardState = {
    category: null,
    service: null,
    details: { name: "", email: "", phone: "", notes: "" },
};

type WizardAction =
    | { type: 'SET_CATEGORY'; payload: Category }
    | { type: 'SET_SERVICE'; payload: string }
    | { type: 'SET_DETAILS'; payload: Partial<WizardState["details"]> }
    | { type: 'RESET' };

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
    switch (action.type) {
        case 'SET_CATEGORY':
            return { ...state, category: action.payload };
        case 'SET_SERVICE':
            return { ...state, service: action.payload };
        case 'SET_DETAILS':
            return { ...state, details: { ...state.details, ...action.payload } };
        case 'RESET':
            return initialState;
        default:
            return state;
    }
}

export function useWizard() {
    const [state, dispatch] = useReducer(wizardReducer, initialState);

    const setCategory = useCallback((category: Category) => {
        dispatch({ type: 'SET_CATEGORY', payload: category });
    }, []);

    const setService = useCallback((service: string) => {
        dispatch({ type: 'SET_SERVICE', payload: service });
    }, []);

    const setDetails = useCallback((details: Partial<WizardState["details"]>) => {
        dispatch({ type: 'SET_DETAILS', payload: details });
    }, []);

    const reset = useCallback(() => {
        dispatch({ type: 'RESET' });
    }, []);

    return {
        state,
        setCategory,
        setService,
        setDetails,
        reset,
    };
}