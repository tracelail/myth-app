import { useState } from "react";
import {
  ActivityIndicator,
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
import { createEntry, oracleLookup, type OracleResult } from "../lib/api";

export default function OracleView() {
  const [subject, setSubject] = useState("");
  const [result, setResult] = useState<OracleResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async () => {
    if (!subject.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const data = await oracleLookup(subject.trim());
      setResult(data);
    } catch {
      setError("The oracle could not be reached. Is Ollama running?");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    setSaving(true);
    try {
      await createEntry(result);
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
        <Text style={styles.heading}>Consult the Oracle</Text>
        <Text style={styles.subtext}>
          Type any myth, creature, or legend. I'll generate an entry you can save.
        </Text>

        <TextInput
          style={styles.input}
          value={subject}
          onChangeText={setSubject}
          placeholder="e.g. Wendigo, Tantalus, Baba Yaga…"
          placeholderTextColor={colors.faint}
          returnKeyType="search"
          onSubmitEditing={handleLookup}
        />

        <TouchableOpacity
          style={[styles.lookupBtn, (!subject.trim() || loading) && styles.lookupBtnDisabled]}
          onPress={handleLookup}
          disabled={loading || !subject.trim()}
        >
          <Text style={styles.lookupBtnText}>
            {loading ? "Consulting the ancient texts…" : "Look up"}
          </Text>
        </TouchableOpacity>

        {loading && (
          <View style={styles.summoningRow}>
            <ActivityIndicator color={colors.accent} size="small" />
            <Text style={styles.summoningText}>Summoning…</Text>
          </View>
        )}

        {error && <Text style={styles.errorText}>{error}</Text>}

        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>✦  Generated Entry</Text>
            <Text style={styles.resultTitle}>{result.title}</Text>
            <Text style={styles.resultCategory}>{result.category.toUpperCase()}</Text>
            {result.tags ? (
              <Text style={styles.resultTags}>
                {result.tags
                  .split(",")
                  .map((t) => t.trim())
                  .join(" · ")}
              </Text>
            ) : null}
            <Text style={styles.resultBody}>{result.body}</Text>

            <TouchableOpacity
              style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={styles.saveBtnText}>
                {saving ? "Inscribing…" : "Add to Grimoire"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.discardBtn}
              onPress={() => setResult(null)}
            >
              <Text style={styles.discardBtnText}>Discard</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 60 },
  heading: {
    color: colors.gold,
    fontFamily: serif,
    fontStyle: "italic",
    fontSize: 24,
    marginBottom: 8,
  },
  subtext: {
    color: colors.dim,
    fontFamily: serif,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20,
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
    marginBottom: 12,
  },
  lookupBtn: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  lookupBtnDisabled: { opacity: 0.45 },
  lookupBtnText: { color: colors.background, fontFamily: serif, fontSize: 16 },
  summoningRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  summoningText: {
    color: colors.dim,
    fontFamily: serif,
    fontStyle: "italic",
    fontSize: 14,
  },
  errorText: {
    color: "#c0504a",
    fontFamily: serif,
    fontStyle: "italic",
    fontSize: 14,
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.accent,
    borderRadius: 10,
    padding: 18,
    marginTop: 8,
  },
  resultLabel: {
    color: colors.accent,
    fontFamily: serif,
    fontSize: 12,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  resultTitle: {
    color: colors.gold,
    fontFamily: serif,
    fontStyle: "italic",
    fontSize: 22,
    marginBottom: 4,
  },
  resultCategory: {
    color: colors.dim,
    fontFamily: serif,
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 6,
  },
  resultTags: {
    color: colors.faint,
    fontFamily: serif,
    fontStyle: "italic",
    fontSize: 13,
    marginBottom: 12,
  },
  resultBody: {
    color: colors.text,
    fontFamily: serif,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 18,
  },
  saveBtn: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { color: colors.background, fontFamily: serif, fontSize: 15 },
  discardBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  discardBtnText: { color: colors.dim, fontFamily: serif, fontSize: 15 },
});
