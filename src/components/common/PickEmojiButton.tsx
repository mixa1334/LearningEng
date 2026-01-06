import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import SimpleEmojiPicker from "./SimpleEmojiPicker";
import { useAppTheme } from "./ThemeProvider";

interface PickEmojiButtonProps {
  readonly emoji?: string;
  readonly onSelectEmoji: (emoji: string) => void;
}

export default function PickEmojiButton({ emoji = "🙂", onSelectEmoji }: PickEmojiButtonProps) {
  const theme = useAppTheme();

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  return (
    <>
      {showEmojiPicker ? (
        <View style={styles.emojiPickerContainer}>
          <SimpleEmojiPicker
            onEmojiSelected={(emoji) => {
              onSelectEmoji(emoji);
              setShowEmojiPicker(false);
            }}
          />
        </View>
      ) : (
        <Button
          mode="contained-tonal"
          onPress={() => setShowEmojiPicker(true)}
          style={[
            styles.emojiButton,
            {
              backgroundColor: theme.colors.secondary,
            },
          ]}
          contentStyle={styles.emojiButtonContent}
        >
          <View style={styles.emojiInner}>
            <Text style={styles.emojiEmoji}>{emoji}</Text>
            <Text style={[styles.emojiLabel, { color: theme.colors.onSecondary }]}>Change</Text>
          </View>
        </Button>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  emojiPickerContainer: {
    height: 250,
    margin: 10,
  },
  emojiButton: {
    marginTop: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 999,
  },
  emojiButtonContent: {
    justifyContent: "center",
  },
  emojiInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  emojiEmoji: {
    fontSize: 20,
  },
  emojiLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
});
