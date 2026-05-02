import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { colors, serif } from "../constants/theme";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor={colors.background} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.gold,
          headerTitleStyle: { fontFamily: serif, fontStyle: "italic" },
          contentStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: "The Grimoire", headerSubtitle: "Myths · Folklore · Cryptids" }}
        />
        <Stack.Screen name="add" options={{ title: "Add Entry" }} />
        <Stack.Screen name="oracle" options={{ title: "Oracle" }} />
        <Stack.Screen name="entry/[id]" options={{ title: "" }} />
      </Stack>
    </>
  );
}
