import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import LoadingScreenSpinner from "./LoadingScreenSpinner";

type LoadingOverlayContextType = {
    visible: boolean;
    show: () => void;
    hide: () => void;
};

const LoadingOverlayContext = createContext<LoadingOverlayContextType>({
    visible: false,
    show: () => { },
    hide: () => { },
});

export function LoadingOverlayProvider({ children }: { readonly children: React.ReactNode }) {
    const [visible, setVisible] = useState(false);

    const counterRef = useRef(0);

    const show = useCallback(() => {
        counterRef.current += 1;
        setVisible(true);
    }, []);

    const hide = useCallback(() => {
        counterRef.current = Math.max(0, counterRef.current - 1);
        if (counterRef.current === 0) setVisible(false);
    }, []);

    const value = useMemo(() => ({ visible, show, hide }), [visible, show, hide]);

    return (
        <LoadingOverlayContext.Provider value={value}>
            {children}
            {visible ? <LoadingScreenSpinner /> : null}
        </LoadingOverlayContext.Provider>
    );
}

export const useLoadingOverlay = () => useContext(LoadingOverlayContext);