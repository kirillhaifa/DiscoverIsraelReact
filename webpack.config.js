const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        // Для SCSS-модулей
        test: /\.module\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[path]__[local]--[hash:base64:5]', // Генерирует имя класса с путем, именем файла и хешем
              },
              sourceMap: true,
            },
          },
          'sass-loader',
        ],
      },
      {
        // Для обычных SCSS файлов (не модульных)
        test: /\.scss$/,
        exclude: /\.module\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/public/index.html',
    }),
    new Dotenv(),
  ],
  devServer: {
    static: './dist',
    hot: true,
    watchFiles: ['src/**/*.scss', 'src/**/*.css'],
    port: 3000,
    historyApiFallback: true,
  },
};
