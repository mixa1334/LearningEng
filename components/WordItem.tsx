import React from 'react';
import { Button, List } from 'react-native-paper';

interface Props {
  title: string;
  learned: boolean;
  onLearn: () => void;
}

export default function WordItem({ title, learned, onLearn }: Props) {
  return (
    <List.Item
      title={title}
      right={() => learned ? <List.Icon icon="check" /> : <Button onPress={onLearn}>Learn</Button>}
    />
  );
}