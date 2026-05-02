import { Platform } from "react-native";

export const colors = {
  background: "#0d0c0a",
  surface: "#161410",
  card: "#1c1916",
  border: "#2e2820",
  accent: "#c9853a",
  gold: "#e8c46a",
  text: "#e8dfd0",
  dim: "#9a8f7e",
  faint: "#5a5248",
} as const;

export const categoryColors: Record<string, string> = {
  "Greek Myth": "#7b9fc7",
  "Norse Myth": "#8fba8f",
  Folklore: "#c9a06a",
  Cryptid: "#a07fc0",
  Other: "#9a8f7e",
};

export const CATEGORIES = [
  "All",
  "Greek Myth",
  "Norse Myth",
  "Folklore",
  "Cryptid",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

// Georgia on iOS, generic serif on Android
export const serif = Platform.OS === "ios" ? "Georgia" : "serif";
