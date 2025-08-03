const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";
  const envName = env.env || (isProduction ? "prod" : "test");
  const envConfig = require(path.resolve(
    __dirname,
    "config",
    `${envName}.json`
  ));
  const definePluginConfig = {
    "process.env.USER_DATA_SPREADSHEET_ID": JSON.stringify(
      envConfig.USER_DATA_SPREADSHEET_ID
    ),
    "process.env.ASSETS_DATA_SPREADSHEET_ID": JSON.stringify(
      envConfig.ASSETS_DATA_SPREADSHEET_ID
    ),
    "process.env.LOANS_DATA_SPREADSHEET_ID": JSON.stringify(
      envConfig.LOANS_DATA_SPREADSHEET_ID
    ),
  };
  if (process.env.GEMINI_API_KEY) {
    definePluginConfig["process.env.API_KEY"] = JSON.stringify(
      process.env.GEMINI_API_KEY
    );
    definePluginConfig["process.env.GEMINI_API_KEY"] = JSON.stringify(
      process.env.GEMINI_API_KEY
    );
  }

  return {
    entry: "./index.tsx",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isProduction ? "[name].[contenthash].js" : "[name].js",
      clean: true,
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".jsx"],
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: [/node_modules/, /scripts/],
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: "asset/resource",
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./index.html",
        title: "Library Management System",
      }),
      new webpack.DefinePlugin(definePluginConfig),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, "dist"),
      },
      compress: true,
      port: 3000,
      hot: true,
      open: true,
    },
    // Note: environment variables are handled via DefinePlugin above
  };
};
