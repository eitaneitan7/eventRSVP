import React from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  TextProps,
  TextStyle,
  StyleSheet,
  ViewStyle,
} from "react-native";

type CustomButtonProps = TouchableOpacityProps & {
  text?: string;
  textStyle?: TextStyle;
  textProps?: TextProps;
  containerStyle?: ViewStyle;
};

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  textStyle,
  textProps,
  containerStyle,
  children,
  ...rest
}) => {
  return (
    <TouchableOpacity style={[styles.button, containerStyle]} {...rest}>
      {text ? (
        <Text style={[styles.text, textStyle]} {...textProps}>
          {text}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default CustomButton;
