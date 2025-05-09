import _import from "eslint-plugin-import";
import tseslint from "typescript-eslint";
import preferArrow from "eslint-plugin-prefer-arrow";
import stylisticJs from "@stylistic/eslint-plugin-js"
import { fixupPluginRules, includeIgnoreFile } from "@eslint/compat";
import path from "node:path";
import { fileURLToPath } from "node:url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const gitignorePath = path.resolve(__dirname, ".gitignore");

export default [
  ...[...tseslint.configs.recommended].map((conf) => ({
    ...conf,
    files: ["src/**/*.ts"],
    ignores: ["dist/**/*.*", "node_modules/*", "**/*.js"],
  })),
  includeIgnoreFile(gitignorePath),
  {
    files: ["src/**/*.ts"],
    ignores: ["dist/**/*.*", "node_modules/*", "**/*.js"],
    plugins: {
      import: fixupPluginRules(_import),
      "@stylistic/js": stylisticJs,
      "prefer-arrow": preferArrow,
    },

    languageOptions: {
      parserOptions: {
        project: "tsconfig.json",
        createDefaultProgram: true,
      },
    },
    rules: {
      semi: [
        "error",
        "always",
        {
          omitLastInOneLineBlock: true,
        },
      ],

      quotes: ["error", "double"],

      "spaced-comment": [
        "error",
        "always",
        {
          markers: ["/"],
        },
      ],
      "require-await": "off",
      "@typescript-eslint/array-type": [
        "error",
        {
          default: "array",
        },
      ],
      "no-extra-semi": "error",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/consistent-type-assertions": "error",
      "@typescript-eslint/dot-notation": "error",
      "@typescript-eslint/naming-convention": "off",
      "@typescript-eslint/no-array-constructor": "error",
      "@typescript-eslint/no-empty-function": "error",
      "@typescript-eslint/no-empty-interface": "error",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-extra-non-null-assertion": "error",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-for-in-array": "error",
      "@typescript-eslint/no-implied-eval": "error",
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/no-misused-new": "error",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-parameter-properties": "off",
      "@typescript-eslint/no-this-alias": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/no-var-requires": "error",
      "@typescript-eslint/prefer-as-const": "error",
      "@typescript-eslint/prefer-for-of": "error",
      "@typescript-eslint/prefer-function-type": "error",
      "@typescript-eslint/prefer-namespace-keyword": "error",
      "@typescript-eslint/prefer-regexp-exec": "error",
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/restrict-plus-operands": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/triple-slash-reference": [
        "error",
        {
          path: "always",
          types: "prefer-import",
          lib: "always",
        },
      ],
      "@typescript-eslint/unbound-method": "off",
      "@typescript-eslint/unified-signatures": "error",
      "@stylistic/js/eol-last": ["error", "always"],
    },
  },
];
