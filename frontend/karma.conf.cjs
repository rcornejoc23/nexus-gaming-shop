module.exports = function configureKarma(config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine"],
    files: [
      { pattern: "public/img/**/*", included: false, served: true, watched: false },
      { pattern: "tests/**/*.spec.js", watched: false }
    ],
    preprocessors: { "tests/**/*.spec.js": ["webpack"] },
    proxies: { "/img/": "/base/public/img/" },
    webpack: {
      mode: "development",
      devtool: "inline-source-map",
      module: {
        rules: [{
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [["@babel/preset-react", { runtime: "automatic" }]]
            }
          }
        }]
      },
      resolve: { extensions: [".js", ".jsx"] }
    },
    reporters: ["progress"],
    browsers: ["ChromeHeadless"],
    singleRun: true,
    autoWatch: false,
    plugins: ["karma-jasmine", "karma-chrome-launcher", "karma-webpack"]
  });
};
