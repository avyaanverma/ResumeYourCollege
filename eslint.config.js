import js from "@eslint/js";

export default [
    js.configs.recommended, // Enables core rules like finding unused variables
    {
        rules: {
            "no-unused-vars": "error", // Change warning to error
            "no-console": "warn"       // Warn when console.log is left in code
        }
    }
];