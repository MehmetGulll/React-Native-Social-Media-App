import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

function Input({
  placeholder,
  secureTextEntry,
  onChangeText,
  keyboardType,
  value,
  maxLength,
  marginHorizontal,
  borderWidth,
  borderColor,
  placeholderTextColor,
  padding,
  borderRadius,
  color,
  paddingHorizontal,
  flex,
  onSubmitEditing,
}) {
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor}
      style={{
        borderWidth: borderWidth,
        borderColor: borderColor,
        padding: padding,
        paddingHorizontal: paddingHorizontal,
        borderRadius: borderRadius,
        color: color,
        flex: flex,
      }}
      secureTextEntry={secureTextEntry}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      value={value}
      maxLength={maxLength}
      marginHorizontal={marginHorizontal}
      borderWidth={borderWidth}
      onSubmitEditing={onSubmitEditing}
    />
  );
}

const styles = StyleSheet.create({});

export default Input;
