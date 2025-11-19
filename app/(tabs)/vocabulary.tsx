import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

export default function VocabularyTab() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text variant="titleLarge">Welcome to EnglishLearn</Text>
      <Text>Use the Learn tab to practice your words.</Text>
    </View>
  );
}