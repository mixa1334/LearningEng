import * as UserDataService from "@/src/service/userDataService";
import { haptics } from "@/src/util/haptics";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface HapticsContextType {
    enabled: boolean;
    toggleEnabled: () => void;
}

const HapticsContext = createContext<HapticsContextType>({
    enabled: true,
    toggleEnabled: () => { },
});

export const useHapticsContext = () => useContext(HapticsContext);

export const useHaptics = () => {
    return {
        lightImpact: () => haptics.lightImpact(),
        mediumImpact: () => haptics.mediumImpact(),
        heavyImpact: () => haptics.heavyImpact(),
        softImpact: () => haptics.softImpact(),
        errorNotification: () => haptics.errorNotification(),
        successNotification: () => haptics.successNotification(),
        warningNotification: () => haptics.warningNotification(),
    };
};

export function HapticsProvider({ children }: { readonly children: React.ReactNode }) {
    const [enabled, setEnabled] = useState(true);

    useEffect(() => {
        (async () => {
            const hapticsEnabled = await UserDataService.getUserHapticsEnabled();
            setEnabled(hapticsEnabled);
            haptics.setEnabled(hapticsEnabled);
        })();
    }, []);

    const toggleEnabled = useCallback(() => {
        setEnabled((prev) => {
            const newEnabled = !prev;
            UserDataService.setUserHapticsEnabled(newEnabled);
            haptics.setEnabled(newEnabled);
            return newEnabled;
        });
    }, []);

    const value = useMemo(() => ({
        enabled,
        toggleEnabled,
    }), [enabled, toggleEnabled]);

    return <HapticsContext.Provider value={value}>{children}</HapticsContext.Provider>;
}

