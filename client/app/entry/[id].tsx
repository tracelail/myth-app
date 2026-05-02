import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { categoryColors, colors, serif } from "../../constants/theme";
import { deleteEntry, getEntries, type Entry } from "../../lib/api";

export default function EntryDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [entry, setEntry] = useState<Entry | null>(null);

  useEffect(() => {
    getEntries().then((entries) => {
      setEntry(entries.find((e) => e.id === Number(id)) ?? null);
    });
  }, [id]);

  if (!entry) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Opening the grimoire…</Text>
      </View>
    );
  }

  const catColor = categoryColors[entry.category] ?? colors.dim;
  const tags = entry.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const paragraphs = entry.body.split("\n\n");

  const handleDelete = () => {
    Alert.alert(
      "Remove Entry",
      `Remove "${entry.title}" from the grimoire?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            await deleteEntry(entry.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={[styles.category, { color: catColor }]}>
        {entry.category.toUpperCase()}
      </Text>
      <Text style={styles.title}>{entry.title}</Text>
      {tags.length > 0 && (
        <Text style={styles.tags}>{tags.join(" · ")}</Text>
      )}
      <View style={styles.divider} />
      {paragraphs.map((p, i) => (
        <Text key={i} style={styles.body}>
          {p}
        </Text>
      ))}
      <Text style={styles.date}>
        Added{" "}
        {new Date(entry.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </Text>
      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Text style={styles.deleteBtnText}>Remove entry</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 60 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    color: colors.dim,
    fontFamily: serif,
    fontStyle: "italic",
    fontSize: 16,
  },
  category: {
    fontSize: 11,
    letterSpacing: 1.2,
    fontFamily: serif,
    marginBottom: 8,
  },
  title: {
    color: colors.gold,
    fontFamily: serif,
    fontStyle: "italic",
    fontSize: 26,
    marginBottom: 10,
  },
  tags: {
    color: colors.faint,
    fontFamily: serif,
    fontStyle: "italic",
    fontSize: 14,
    marginBottom: 14,
  },
  divider: { height: 1, backgroundColor: colors.border, marginBottom: 18 },
  body: {
    color: colors.text,
    fontFamily: serif,
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 16,
  },
  date: {
    color: colors.faint,
    fontFamily: serif,
    fontStyle: "italic",
    fontSize: 13,
    marginTop: 8,
    marginBottom: 24,
  },
  deleteBtn: {
    borderWidth: 1,
    borderColor: "#7a2020",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "rgba(122, 32, 32, 0.15)",
  },
  deleteBtnText: { color: "#c0504a", fontFamily: serif, fontSize: 15 },
});
