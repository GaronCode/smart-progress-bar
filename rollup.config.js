import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import styles from "rollup-plugin-styles";
import pkg from "./package.json";

export default [
    {
        input: "src/index.js", // your entry point
        output: {
            name: "SPB", // package name
            file: pkg.iife,
            format: "iife",
        },
        plugins: [
            styles(),
            resolve(),
            commonjs(),
            babel({
                exclude: ["node_modules/**"],
            }),
        ],
    },
    {
        input: "src/index.js",
        output: [{ file: pkg.module, format: "es" }],
        plugins: [
            styles(),
            babel({
                exclude: ["node_modules/**"],
            }),
        ],
    },
];
