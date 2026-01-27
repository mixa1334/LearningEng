import { useTranslation } from "@/src/hooks/useTranslation";
import { StyleSheet, View } from "react-native";
import TranslationCard from "./TranslationCard";

export default function TranslationsList() {
    const { translations } = useTranslation();

    return (
        <View style={styles.listContent}>
            {translations.map((translation) => (
                <TranslationCard key={translation.id} translation={translation} />
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