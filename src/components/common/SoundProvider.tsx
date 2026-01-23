import * as UserDataService from "@/src/service/userDataService";
import { SoundEffect, soundPlayer } from "@/src/util/soundPlayer";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface SoundContextType {
    enabled: boolean;
    toggleEnabled: () => void;
    isReady: boolean;
}

const SoundContext = createContext<SoundContextType>({
    enabled: true,
    toggleEnabled: () => { },
    isReady: false,
});

export const useSoundContext = () => useContext(SoundContext);

export function useSoundPlayer() {
    return {
        playAccepted: () => soundPlayer.playEffect(SoundEffect.ACCEPTED),
        playActionSuccess: () => soundPlayer.playEffect(SoundEffect.ACTION_SUCCESS),
        playAlertPopUp: () => soundPlayer.playEffect(SoundEffect.ALERT_POP_UP),
        playDoneSuccess: () => soundPlayer.playEffect(SoundEffect.DONE_SUCCESS),
        playGoalAchieve: () => soundPlayer.playEffect(SoundEffect.GOAL_ACHIEVE),
        playRejected: () => soundPlayer.playEffect(SoundEffect.REJECTED),
        playTap: () => soundPlayer.playEffect(SoundEffect.TAP),
    };
}

export function SoundProvider({ children }: { readonly children: React.ReactNode }) {
    const [enabled, setEnabled] = useState(true);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                soundPlayer.init();
                const soundEnabled = await UserDataService.getUserSoundEnabled();
                soundPlayer.setAudioEnabled(soundEnabled);
                setEnabled(soundEnabled);
                setIsReady(true);
            } catch (error) {
                console.error("Failed to initialize sound player:", error);
                soundPlayer.setAudioEnabled(false);
                setIsReady(false);
            }
        })();
    }, []);

    const toggleEnabled = useCallback(() => {
        if (!isReady) return;
        setEnabled((prev) => {
            const newEnabled = !prev;
            soundPlayer.setAudioEnabled(newEnabled);
            UserDataService.setUserSoundEnabled(newEnabled);
            return newEnabled;
        });
    }, [isReady]);

    const value = useMemo(() => ({
        enabled,
        toggleEnabled,
        isReady,
    }), [enabled, toggleEnabled, isReady]);

    return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}