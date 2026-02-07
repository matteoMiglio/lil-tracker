import pluginVue from "eslint-plugin-vue";
import vueTsEslintConfig from "@vue/eslint-config-typescript";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  {
    ignores: ["*", "!src/", "src/components/ui/"],
  },
  ...pluginVue.configs["flat/essential"],
  ...vueTsEslintConfig(),
  eslintConfigPrettier,
  {
    rules: {
      "vue/multi-word-component-names": "off",
    },
  },
];
