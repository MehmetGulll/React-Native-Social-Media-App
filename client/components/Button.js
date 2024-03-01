import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

function Button({ text, onPress, backgroundColor, color, padding,borderRadius,fontSize }) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: backgroundColor,
        alignItems: "center",
        padding: padding,
        borderRadius: borderRadius,
      }}
      onPress={onPress}
    >
      <Text style={{ color: color, fontSize: fontSize, fontWeight: "700" }}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

export default Button;
