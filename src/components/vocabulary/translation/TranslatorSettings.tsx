import { useTranslationActions, useTranslationData } from "@/src/hooks/useTranslation";
import { SPACING_MD } from "@/src/resources/constants/layout";
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, Switch, Text } from "react-native-paper";
import { CustomModalDialog } from "../../common/CustomModalDialog";
import { useLanguageContext } from "../../common/LanguageProvider";
import { useAppTheme } from "../../common/ThemeProvider";
import { ValuePickerDialog } from "../../common/ValuePickerDialog";
import { TranslatorEngine } from "@/src/entity/types";

interface TranslatorSettingsProps {
    readonly visible: boolean;
    readonly onClose: () => void;
}

export default function TranslatorSettings({ visible, onClose }: TranslatorSettingsProps) {
    const { text } = useLanguageContext();
    const theme = useAppTheme();
    const { translatorEngine, deleteTranslationAfterAddingToVocabulary, clearTranslatorInputField } = useTranslationData();
    const { setTranslatorEngine, setDeleteTranslationAfterAddingToVocabulary, setClearTranslatorInputField } = useTranslationActions();
    const [isTranslatorEnginePickerVisible, setIsTranslatorEnginePickerVisible] = useState(false);

    const translatorEngineOptions = useMemo(() => [
        { value: TranslatorEngine.FREE_API, key: "free_api", label: text("translator_engine_free_api") },
        { value: TranslatorEngine.YANDEX_API, key: "yandex_api", label: text("translator_engine_yandex_api") },
    ], [text]);

    const handleDeleteTranslationAfterAddingToVocabulary = (value: boolean) => {
        setDeleteTranslationAfterAddingToVocabulary(value);
    };
    const handleClearTranslatorInputField = (value: boolean) => {
        setClearTranslatorInputField(value);
    };

    return (
        <CustomModalDialog title={text("translator_settings_title")} description={text("translator_settings_description")} visible={visible} onClose={onClose}>
            <View style={{ marginTop: SPACING_MD }}>
                <View style={styles.switcherSettingRow}>
                    <Text>{text("translator_settings_delete_translation_after_adding_to_vocabulary")}</Text>
                    <Switch value={deleteTranslationAfterAddingToVocabulary} onValueChange={handleDeleteTranslationAfterAddingToVocabulary} />
                </View>
                <View style={styles.switcherSettingRow}>
                    <Text>{text("translator_settings_clear_translator_input_field")}</Text>
                    <Switch value={clearTranslatorInputField} onValueChange={handleClearTranslatorInputField} />
                </View>
                <View style={styles.switcherSettingRow}>
                    <Text>{text("translator_engine_title", { translatorEngine })}</Text>
                    <IconButton style={{ backgroundColor: theme.colors.primary }}
                        iconColor={theme.colors.onPrimary} icon="chevron-down" onPress={() => setIsTranslatorEnginePickerVisible(true)} />
                    <ValuePickerDialog
                        entityTitle={text("translator_engine")}
                        description={text("translator_engine_description")}
                        visible={isTranslatorEnginePickerVisible}
                        onClose={() => setIsTranslatorEnginePickerVisible(false)}
                        options={translatorEngineOptions}
                        onSelectOption={setTranslatorEngine}
                    />
                </View>
            </View>
        </CustomModalDialog>
    );
}

const styles = StyleSheet.create({
    switcherSettingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 8,
        marginBottom: 16,
        width: "100%",
    },
});