import LottieView from "lottie-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";

export const LoadingContentSpinner = () => (
  <View style={styles.centered}>

    <LottieView
      source={require("@/assets/animations/loading_animation.json")}
      autoPlay
      loop={true}
      resizeMode="contain"
      style={styles.loadingAnimation}
    />
  </View>
);

const styles = StyleSheet.create({
  centered: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingAnimation: {
    width: 200,
    height: 100,
  },
});