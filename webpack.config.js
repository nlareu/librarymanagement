const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

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
          exclude: /node_modules/,
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
    // Handle environment variables similar to Vite
    ...(process.env.GEMINI_API_KEY && {
      plugins: [
        ...(module.exports.plugins || []),
        new (require("webpack").DefinePlugin)({
          "process.env.API_KEY": JSON.stringify(process.env.GEMINI_API_KEY),
          "process.env.GEMINI_API_KEY": JSON.stringify(
            process.env.GEMINI_API_KEY
          ),
        }),
      ],
    }),
  };
};
