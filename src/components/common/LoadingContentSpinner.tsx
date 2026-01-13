import React from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export const LoadingContentSpinner = () => (
  <View style={styles.centered}>
    <ActivityIndicator animating={true} size="large" />
  </View>
);

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});