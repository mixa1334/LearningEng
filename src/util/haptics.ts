import * as engine from "expo-haptics";

class Haptics {
    enabled: boolean = true;

    setEnabled(enabled: boolean) {
        this.enabled = enabled;
    }

    softImpact() {
        if (!this.enabled) return;
        engine.impactAsync(engine.ImpactFeedbackStyle.Soft);
    }

    lightImpact() {
        if (!this.enabled) return;
        engine.impactAsync(engine.ImpactFeedbackStyle.Light);
    }

    mediumImpact() {
        if (!this.enabled) return;
        engine.impactAsync(engine.ImpactFeedbackStyle.Medium);
    }

    heavyImpact() {
        if (!this.enabled) return;
        engine.impactAsync(engine.ImpactFeedbackStyle.Heavy);
    }

    errorNotification() {
        if (!this.enabled) return;
        engine.notificationAsync(engine.NotificationFeedbackType.Error);
    }

    successNotification() {
        if (!this.enabled) return;
        engine.notificationAsync(engine.NotificationFeedbackType.Success);
    }

    warningNotification() {
        if (!this.enabled) return;
        engine.notificationAsync(engine.NotificationFeedbackType.Warning);
    }
}

export const haptics = new Haptics();