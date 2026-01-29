import { useTranslationData } from "@/src/hooks/useTranslation";
import { StyleSheet, View } from "react-native";
import TranslationCard from "./TranslationCard";

export default function TranslationsList() {
    const { translationIds } = useTranslationData();

    return (
        <View style={styles.listContent}>
            {translationIds.map((id) => (
                <TranslationCard key={id} translationId={id} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    listContent: {
        backgroundColor: "transparent",
        gap: 20,
        paddingBottom: 8,
        paddingHorizontal: 8,
    },
});