import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

import { categoryColors, colors, serif } from "../constants/theme";
import type { Entry } from "../lib/api";

export default function EntryCard({ entry }: { entry: Entry }) {
  const catColor = categoryColors[entry.category] ?? colors.dim;
  const tags = entry.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/entry/${entry.id}`)}
    >
      <Text style={[styles.category, { color: catColor }]}>
        {entry.category.toUpperCase()}
      </Text>
      <Text style={styles.title}>{entry.title}</Text>
      <Text style={styles.preview} numberOfLines={2}>
        {entry.body.replace(/\n/g, " ")}
      </Text>
      {tags.length > 0 && (
        <Text style={styles.tags}>{tags.join(" · ")}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 14,
  },
  category: {
    fontSize: 10,
    letterSpacing: 1.2,
    fontFamily: serif,
    marginBottom: 4,
  },
  title: {
    color: colors.gold,
    fontFamily: serif,
    fontStyle: "italic",
    fontSize: 18,
    marginBottom: 6,
  },
  preview: {
    color: colors.text,
    fontFamily: serif,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  tags: {
    color: colors.faint,
    fontFamily: serif,
    fontStyle: "italic",
    fontSize: 12,
  },
});
