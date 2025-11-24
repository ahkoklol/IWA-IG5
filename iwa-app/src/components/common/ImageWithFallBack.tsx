import React, { useState } from "react";
import { Image, ImageProps, View, Text, StyleSheet } from "react-native";

type Props = ImageProps & {
  fallbackText?: string;
};

export default function ImageWithFallback({ fallbackText = "Image", style, ...rest }: Props) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <View style={[styles.fallback, style as any]}>
        <Text style={styles.fallbackText}>{fallbackText}</Text>
      </View>
    );
  }

  return <Image {...rest} style={style} onError={() => setErrored(true)} />;
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ECECF0",
  },
  fallbackText: {
    color: "#9CA3AF",
  },
});
