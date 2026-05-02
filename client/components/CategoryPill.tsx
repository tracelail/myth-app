import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { categoryColors, colors, serif } from "../constants/theme";

interface Props {
  label: string;
  active: boolean;
  onPress: () => void;
}

export default function CategoryPill({ label, active, onPress }: Props) {
  const accent = label === "All" ? colors.accent : (categoryColors[label] ?? colors.dim);
  return (
    <TouchableOpacity
      style={[styles.pill, active && { borderColor: accent }]}
      onPress={onPress}
    >
      <Text style={[styles.label, active && { color: accent }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
  },
  label: {
    color: colors.dim,
    fontFamily: serif,
    fontSize: 13,
  },
});
