import * as UserDataService from "@/src/service/userDataService";
import { hapticsHelper } from "@/src/util/HapticsHelper";
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
        lightImpact: () => hapticsHelper.lightImpact(),
        mediumImpact: () => hapticsHelper.mediumImpact(),
        heavyImpact: () => hapticsHelper.heavyImpact(),
        softImpact: () => hapticsHelper.softImpact(),
        errorNotification: () => hapticsHelper.errorNotification(),
        successNotification: () => hapticsHelper.successNotification(),
        warningNotification: () => hapticsHelper.warningNotification(),
    };
};

export function HapticsProvider({ children }: { readonly children: React.ReactNode }) {
    const [hapticsEnabled, setHapticsEnabled] = useState(true);

    useEffect(() => {
        (async () => {
            const hapticsEnabled = await UserDataService.getUserHapticsEnabled();
            setHapticsEnabled(hapticsEnabled);
            hapticsHelper.setEnabled(hapticsEnabled);
        })();
    }, []);

    const toggleHaptics = useCallback(() => {
        setHapticsEnabled((prev) => {
            const newEnabled = !prev;
            UserDataService.setUserHapticsEnabled(newEnabled);
            hapticsHelper.setEnabled(newEnabled);
            return newEnabled;
        });
    }, []);

    const value = useMemo(() => ({
        hapticsEnabled,
        toggleHaptics,
    }), [hapticsEnabled, toggleHaptics]);

    return <HapticsContext.Provider value={value}>{children}</HapticsContext.Provider>;
}

