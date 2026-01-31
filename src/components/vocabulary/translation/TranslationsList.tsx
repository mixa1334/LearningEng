import { useTranslationData } from "@/src/hooks/useTranslation";
import { StyleSheet, View } from "react-native";
import TranslationCard from "./TranslationCard";
import Animated, { FadeInDown, Layout } from "react-native-reanimated";

export default function TranslationsList() {
    const { translationIds } = useTranslationData();

    return (
        <View style={styles.listContent}>
            {translationIds.map((id, index) => (
                <Animated.View 
                    key={id} 
                    entering={FadeInDown.delay(index * 50).springify()}
                    layout={Layout.springify()}
                >
                    <TranslationCard translationId={id} />
                </Animated.View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    listContent: {
        backgroundColor: "transparent",
        gap: 16,
        paddingBottom: 16,
        paddingHorizontal: 16,
    },
});
