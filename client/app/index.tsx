import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";

import CategoryPill from "../components/CategoryPill";
import EntryCard from "../components/EntryCard";
import { CATEGORIES, colors, serif } from "../constants/theme";
import { getEntries, type Entry } from "../lib/api";

export default function GrimoireList() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    try {
      const data = await getEntries();
      setEntries(data);
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const filtered = entries.filter((e) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q || e.title.toLowerCase().includes(q) || e.body.toLowerCase().includes(q);
    const matchesCategory =
      activeCategory === "All" || e.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} />
        <Text style={styles.loadingText}>Opening the grimoire…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search the grimoire…"
        placeholderTextColor={colors.faint}
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.oracleBtn} onPress={() => router.push("/oracle")}>
          <Text style={styles.oracleBtnText}>✦  Oracle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push("/add")}>
          <Text style={styles.addBtnText}>+  Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.pillsScroll}
        contentContainerStyle={styles.pillsContent}
      >
        {CATEGORIES.map((cat) => (
          <CategoryPill
            key={cat}
            label={cat}
            active={activeCategory === cat}
            onPress={() => setActiveCategory(cat)}
          />
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(e) => e.id.toString()}
        renderItem={({ item }) => <EntryCard entry={item} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load(true);
            }}
            tintColor={colors.accent}
          />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nothing here yet — tap ✦ to summon an entry.
          </Text>
        }
        contentContainerStyle={filtered.length === 0 ? styles.emptyContainer : { paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 12 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.background,
  },
  loadingText: {
    color: colors.dim,
    fontFamily: serif,
    fontStyle: "italic",
    fontSize: 16,
  },
  search: {
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: colors.surface,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontFamily: serif,
    fontSize: 15,
  },
  buttonRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 10,
    gap: 10,
  },
  oracleBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.accent,
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: "center",
    backgroundColor: colors.surface,
  },
  oracleBtnText: { color: colors.accent, fontFamily: serif, fontSize: 15 },
  addBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: "center",
    backgroundColor: colors.surface,
  },
  addBtnText: { color: colors.text, fontFamily: serif, fontSize: 15 },
  pillsScroll: { flexGrow: 0, marginBottom: 12 },
  pillsContent: { paddingLeft: 16, paddingRight: 8 },
  emptyText: {
    color: colors.dim,
    fontFamily: serif,
    fontStyle: "italic",
    textAlign: "center",
    fontSize: 15,
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  emptyContainer: { flex: 1 },
});
