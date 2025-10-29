import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        rules: {
            "react-hooks/exhaustive-deps": "off",
            "no-empty-object-type": "off",
            "react-hooks/refs": "off",
            "react-hooks/set-state-in-effect": "off",
            "react-hooks/immutability": "off",
            "react-hooks/incompatible-library": "off",
            "react-hooks/purity": "off",
            "@typescript-eslint/no-empty-object-type": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    varsIgnorePattern: "^_",
                    argsIgnorePattern: "^_",
                    destructuredArrayIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
        },
    },
    globalIgnores([
        "**/*.js",
        "**/*.config.ts",
        "config/*.js",
        "coverage/",
        "public/",
        "storybook-static/",
        "fsd/shared/api/generated/**/*",
        "playwright-report/**/*",
    ]),
]);

export default eslintConfig;
