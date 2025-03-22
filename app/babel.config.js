module.exports = function (api) {
    api.cache(true);
    return {
        presets: ["babel-preset-expo"],
        plugins: [
            [
                "module:react-native-dotenv",
                {
                    moduleName: "@env",
                    path: ".env",
                    blacklist: null,
                    whitelist: null,
                    safe: false,
                    allowUndefined: true,
                },
            ],
            "react-native-reanimated/plugin",
            ["@babel/plugin-transform-class-static-block", { loose: true }],
            ["@babel/plugin-transform-class-properties", { loose: true }],
            ["@babel/plugin-transform-private-methods", { loose: true }],
            ["@babel/plugin-transform-private-property-in-object", { loose: true }],
            "@babel/plugin-transform-nullish-coalescing-operator",
            "@babel/plugin-transform-optional-chaining",
        ],
    };
};
