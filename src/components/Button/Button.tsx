import React from "react";
import { Pressable, Text, StyleSheet, Image } from "react-native";
import { getStyles } from "../../styles/MainStyle";
import { useTheme } from "../../contexts/ThemeContext";

interface ButtonProps {
  variant: string;
  enabled?: boolean;
  text?: string;
  fullWidth?: boolean;
  onPress?: () => void;
}

export default function Button({
  variant = "primary",
  enabled = true,
  text,
  fullWidth = false,
  onPress,
}: ButtonProps) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  return (
    <Pressable
      style={[
        styles.button,
        variant == "primary" ? styles.buttonPrimary : styles.buttonSecondary,
        fullWidth ? styles.buttonFullWidth : null,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          variant == "primary" ? styles.buttonPrimaryText : styles.buttonSecondaryText,
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
}
