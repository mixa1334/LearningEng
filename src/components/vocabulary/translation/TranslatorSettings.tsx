import { TranslatorEngine } from "@/src/entity/types";
import { useTranslationActions, useTranslationData } from "@/src/hooks/useTranslation";
import { SPACING_MD } from "@/src/resources/constants/layout";
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, Switch, Text } from "react-native-paper";
import { CustomModalDialog } from "../../common/CustomModalDialog";
import { useLanguageContext } from "../../common/LanguageProvider";
import { useAppTheme } from "../../common/ThemeProvider";
import { ValuePickerDialog } from "../../common/ValuePickerDialog";
import { MaterialIcons } from "@expo/vector-icons";

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
    const handleSetTranslatorEngine = (value: TranslatorEngine) => {
        setTranslatorEngine(value);
        setIsTranslatorEnginePickerVisible(false);
    };

    const SettingRow = ({ label, value, onToggle }: { label: string, value: boolean, onToggle: (val: boolean) => void }) => (
        <View style={styles.switcherSettingRow}>
            <Text style={[styles.settingText, { color: theme.colors.onSurface }]}>{label}</Text>
            <Switch value={value} onValueChange={onToggle} />
        </View>
    );

    return (
        <CustomModalDialog title={text("translator_settings_title")} description={text("translator_settings_description")} visible={visible} onClose={onClose}>
            <View style={{ marginTop: SPACING_MD, gap: 8 }}>
                <SettingRow 
                    label={text("translator_settings_delete_translation_after_adding_to_vocabulary")}
                    value={deleteTranslationAfterAddingToVocabulary}
                    onToggle={handleDeleteTranslationAfterAddingToVocabulary}
                />
                <SettingRow 
                    label={text("translator_settings_clear_translator_input_field")}
                    value={clearTranslatorInputField}
                    onToggle={handleClearTranslatorInputField}
                />
                
                <View style={styles.engineRow}>
                    <View>
                        <Text style={[styles.settingLabel, { color: theme.colors.onSurfaceVariant }]}>{text("translator_engine")}</Text>
                        <Text style={[styles.engineValue, { color: theme.colors.onSurface }]}>{translatorEngine}</Text>
                    </View>
                    <IconButton 
                        style={{ backgroundColor: theme.colors.secondaryContainer, margin: 0 }}
                        iconColor={theme.colors.onSecondaryContainer} 
                        icon="chevron-down" 
                        onPress={() => setIsTranslatorEnginePickerVisible(true)} 
                    />
                    <ValuePickerDialog
                        entityTitle={text("translator_engine")}
                        description={text("translator_engine_description")}
                        visible={isTranslatorEnginePickerVisible}
                        onClose={() => setIsTranslatorEnginePickerVisible(false)}
                        options={translatorEngineOptions}
                        onSelectOption={handleSetTranslatorEngine}
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
        paddingVertical: 8,
    },
    settingText: {
        fontSize: 16,
        flex: 1,
        marginRight: 16,
    },
    engineRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "rgba(0,0,0,0.1)",
    },
    settingLabel: {
        fontSize: 12,
        fontWeight: "500",
        textTransform: "uppercase",
    },
    engineValue: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 4,
    },
});
