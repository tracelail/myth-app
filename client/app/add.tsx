import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";

import { colors, serif } from "../constants/theme";
import { createEntry } from "../lib/api";

const ENTRY_CATEGORIES = [
  "Greek Myth",
  "Norse Myth",
  "Folklore",
  "Cryptid",
  "Other",
] as const;

export default function AddEntry() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Greek Myth");
  const [tags, setTags] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  const canSubmit = title.trim().length > 0 && body.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSaving(true);
    try {
      await createEntry({
        title: title.trim(),
        category,
        tags: tags.trim(),
        body: body.trim(),
      });
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Fenrir"
          placeholderTextColor={colors.faint}
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryRow}>
          {ENTRY_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catOption, category === cat && styles.catOptionActive]}
              onPress={() => setCategory(cat)}
            >
              <Text
                style={[
                  styles.catOptionText,
                  category === cat && styles.catOptionTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Tags</Text>
        <TextInput
          style={styles.input}
          value={tags}
          onChangeText={setTags}
          placeholder="e.g. punishment, trickster, water"
          placeholderTextColor={colors.faint}
        />

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={body}
          onChangeText={setBody}
          multiline
          textAlignVertical="top"
          placeholder="Write about this creature or myth…"
          placeholderTextColor={colors.faint}
        />

        <TouchableOpacity
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={saving || !canSubmit}
        >
          <Text style={styles.submitBtnText}>
            {saving ? "Inscribing…" : "Add to Grimoire"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 60 },
  label: {
    color: colors.dim,
    fontFamily: serif,
    fontSize: 13,
    marginBottom: 6,
    marginTop: 18,
  },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: serif,
    fontSize: 15,
  },
  textarea: { minHeight: 150, paddingTop: 10 },
  categoryRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  catOption: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  catOptionActive: { borderColor: colors.accent },
  catOptionText: { color: colors.dim, fontFamily: serif, fontSize: 13 },
  catOptionTextActive: { color: colors.accent },
  submitBtn: {
    marginTop: 30,
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  submitBtnDisabled: { opacity: 0.45 },
  submitBtnText: {
    color: colors.background,
    fontFamily: serif,
    fontSize: 16,
  },
});
