import sharedConfig from "@repo/tailwind-config";
import type { Config } from "tailwindcss";

const config: Pick<Config, "content" | "presets"> = {
  content: [
    "./app/**/*.tsx", 
    "../../packages/ui/src/**/*.tsx",
    "../../components/**/*.tsx"
  ],
  presets: [sharedConfig],
};

export default config;