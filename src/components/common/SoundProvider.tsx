import * as UserDataService from "@/src/service/userDataService";
import { SoundEffect, soundPlayer } from "@/src/util/SoundPlayer";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface SoundContextType {
    soundEnabled: boolean;
    toggleSound: () => void;
    isSoundReady: boolean;
}

const SoundContext = createContext<SoundContextType>({
    soundEnabled: true,
    toggleSound: () => { },
    isSoundReady: false,
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
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [isSoundReady, setIsSoundReady] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                soundPlayer.init();
                const soundEnabled = await UserDataService.getUserSoundEnabled();
                soundPlayer.setAudioEnabled(soundEnabled);
                setSoundEnabled(soundEnabled);
                setIsSoundReady(true);
            } catch (error) {
                console.error("Failed to initialize sound player:", error);
                soundPlayer.setAudioEnabled(false);
                setIsSoundReady(false);
            }
        })();
    }, []);

    const toggleSound = useCallback(() => {
        if (!isSoundReady) return;
        setSoundEnabled((prev) => {
            const newEnabled = !prev;
            soundPlayer.setAudioEnabled(newEnabled);
            UserDataService.setUserSoundEnabled(newEnabled);
            return newEnabled;
        });
    }, [isSoundReady]);

    const value = useMemo(() => ({
        soundEnabled,
        toggleSound,
        isSoundReady,
    }), [soundEnabled, toggleSound, isSoundReady]);

    return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}