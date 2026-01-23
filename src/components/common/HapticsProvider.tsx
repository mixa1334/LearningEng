import * as UserDataService from "@/src/service/userDataService";
import { haptics } from "@/src/util/haptics";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface HapticsContextType {
    hapticsEnabled: boolean;
    toggleHaptics: () => void;
}

const HapticsContext = createContext<HapticsContextType>({
    hapticsEnabled: true,
    toggleHaptics: () => { },
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
    const [hapticsEnabled, setHapticsEnabled] = useState(true);

    useEffect(() => {
        (async () => {
            const hapticsEnabled = await UserDataService.getUserHapticsEnabled();
            setHapticsEnabled(hapticsEnabled);
            haptics.setEnabled(hapticsEnabled);
        })();
    }, []);

    const toggleHaptics = useCallback(() => {
        setHapticsEnabled((prev) => {
            const newEnabled = !prev;
            UserDataService.setUserHapticsEnabled(newEnabled);
            haptics.setEnabled(newEnabled);
            return newEnabled;
        });
    }, []);

    const value = useMemo(() => ({
        hapticsEnabled,
        toggleHaptics,
    }), [hapticsEnabled, toggleHaptics]);

    return <HapticsContext.Provider value={value}>{children}</HapticsContext.Provider>;
}

