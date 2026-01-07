import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import SimpleEmojiPicker from "./SimpleEmojiPicker";
import { useAppTheme } from "./ThemeProvider";

interface PickEmojiButtonProps {
  readonly emoji?: string;
  readonly onSelectEmoji: (emoji: string) => void;
}

export default function PickEmojiButton({ emoji, onSelectEmoji }: PickEmojiButtonProps) {
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
            {
              backgroundColor: theme.colors.secondary,
            },
          ]}
          contentStyle={styles.emojiButtonContent}
        >
          <Text style={styles.emojiEmoji}>{emoji}</Text>
        </Button>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  emojiPickerContainer: {
    height: 250,
    margin: 10,
    width: "100%",
  },
  emojiButtonContent: {},
  emojiEmoji: {
    fontSize: 20,
  },
  emojiLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
});
