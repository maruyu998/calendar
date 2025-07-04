import 'dotenv/config';
import { z } from "zod";
import path from "path";
import * as webpack from 'webpack';
import CopyPlugin from "copy-webpack-plugin";
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";

const RUN_MODE = z.enum(["test","development","production"]).parse(process.env.RUN_MODE||"development");
const MODE = (RUN_MODE == "production") ? "production" : "development";

export default {
  mode: MODE,
  entry: {
    main: path.resolve(__dirname, 'src', 'index.tsx'),
    serviceWorker: path.resolve(__dirname, 'src', 'serviceWorker.ts')
  },
  output: {
    path: path.resolve(__dirname, "..", "build", "public"),
    filename: '[name].[contenthash].js',
    publicPath: '/',
  },
  cache: {
    type: 'filesystem',
    cacheDirectory: path.resolve(__dirname, '.webpack-cache')
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    alias: {
      "@client": path.resolve(__dirname, "src"),
      "@share": path.resolve(__dirname, "..", "share"),
      "@addon": path.resolve(__dirname, "..", "addon"),
    }
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: "babel-loader",
            options: { 
              presets: ["@babel/preset-env", "@babel/react"],
              cacheDirectory: true,
              cacheCompression: false
            },
          },{
            loader: "ts-loader",
            options: {
              configFile: path.resolve(__dirname, "tsconfig.json")
            },
          }
        ]
      },
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: path.resolve(__dirname, 'postcss.config.ts')
              }
            }
          },
          "sass-loader"
        ]
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.ProgressPlugin(),
    new CopyPlugin({
      patterns: [
        { from: "client/public", to: "" },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'template.html'),
    }),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin()
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // ベンダーライブラリを分離
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
        // React関連ライブラリ
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router)[\\/]/,
          name: 'react',
          chunks: 'all',
          priority: 20,
        },
        // UIライブラリ群
        ui: {
          test: /[\\/]node_modules[\\/](@radix-ui|@headlessui|@material-tailwind|@tremor)[\\/]/,
          name: 'ui-libs',
          chunks: 'all',
          priority: 12,
        },
        // 共通コンポーネント
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 5,
          enforce: true,
        },
      },
    },
  },
  target: "web",
  performance: {
    maxEntrypointSize: 500000,
    maxAssetSize: 500000,
  }
};