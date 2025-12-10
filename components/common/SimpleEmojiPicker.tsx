import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useTheme } from "react-native-paper";

interface SimpleEmojiPickerProps {
  readonly onEmojiSelected: (emoji: string) => void;
}

const EMOJIS: string[] = [
  "😀",
  "😁",
  "😂",
  "🤣",
  "😃",
  "😄",
  "😅",
  "😉",
  "😊",
  "😇",
  "🙂",
  "🙃",
  "😋",
  "😎",
  "😍",
  "😘",
  "😗",
  "😙",
  "😚",
  "🤗",
  "🤩",
  "🤔",
  "🤨",
  "😐",
  "😴",
  "😪",
  "😷",
  "🤒",
  "🤕",
  "🤢",
  "🤮",
  "🤧",
  "🥳",
  "🤓",
  "😺",
  "😸",
  "😹",
  "😻",
  "😼",
  "😽",
  "🙀",
  "👍",
  "👎",
  "👌",
  "✌️",
  "🤞",
  "🙏",
  "👏",
  "🙌",
  "💪",
  "💡",
  "🔥",
  "⭐",
  "🌟",
  "⚡",
  "🌈",
  "☀️",
  "🌙",
  "☁️",
  "💧",
  "🍎",
  "🍌",
  "🍓",
  "🍕",
  "🍔",
  "🍟",
  "🍣",
  "🍩",
  "🍪",
  "🎂",
  "🍰",
  "☕",
  "🍵",
  "🍺",
  "⚽",
  "🏀",
  "🏈",
  "🎾",
  "🎧",
  "🎵",
  "🎶",
  "🎮",
  "🚗",
  "✈️",
  "🚀",
  "🏠",
  "🏫",
  "📚",
  "✏️",
  "📝",
  "📌",
  "📎",
  "📱",
  "💻",
  "🧠",
  "💬",
  "❤️",
  "💛",
  "💚",
  "💙",
  "💜",
  "🖤",
  "🤍",
  "🤎",
];

export default function SimpleEmojiPicker({
  onEmojiSelected,
}: SimpleEmojiPickerProps) {
  const theme = useTheme();
  const { width, height } = useWindowDimensions();

  const baseItemSize = 44;
  const minColumns = 5;
  const maxColumns = 8;
  const calculatedColumns = Math.floor(width / baseItemSize) || minColumns;
  const numColumns = Math.min(
    maxColumns,
    Math.max(minColumns, calculatedColumns)
  );
  const horizontalPadding = 8;
  const buttonSize =
    (width - horizontalPadding * 2) / numColumns - StyleSheet.hairlineWidth * 2;
  const maxHeight = Math.min(260, height * 0.35);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outlineVariant,
          maxHeight,
        },
      ]}
    >
      <FlatList
        data={EMOJIS}
        numColumns={numColumns}
        keyExtractor={(item, index) => `${item}-${index}`}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.emojiButton, { width: buttonSize, height: buttonSize }]}
            onPress={() => onEmojiSelected(item)}
          >
            <Text style={styles.emoji}>{item}</Text>
          </TouchableOpacity>
        )}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    maxHeight: 260,
    paddingVertical: 8,
  },
  listContent: {
    paddingHorizontal: 4,
  },
  emojiButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    margin: 2,
    borderRadius: 8,
  },
  emoji: {
    fontSize: 24,
  },
});


