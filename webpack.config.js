const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const REPO = 'DiscoverIsraelReact'; // <— ИМЯ РЕПОЗИТОРИЯ
const isProd = process.env.NODE_ENV === 'production';
const isGhPages = process.env.GH_PAGES === 'true';

// На проектной странице GH Pages app живёт по пути /<repo>/
// На локали и в обычном проде — по корню '/'
const publicPath = isGhPages ? `/${REPO}/` : '/';

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    publicPath: '/DiscoverIsraelReact/', // <= ВАЖНО для GH Pages
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      { test: /\.svg$/, use: ['@svgr/webpack'] },
      {
        test: /\.module\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: { localIdentName: '[path]__[local]--[hash:base64:5]' },
              sourceMap: true,
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.scss$/,
        exclude: /\.module\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/public/index.html',
      filename: 'index.html',
    }),
    // Генерим 404.html из того же шаблона — это даёт fallback для SPA на GH Pages
    new HtmlWebpackPlugin({
      template: './src/public/index.html',
      filename: '404.html',
    }),
    new Dotenv(),
  ],
  devServer: {
    static: './dist',
    hot: true,
    watchFiles: ['src/**/*.scss', 'src/**/*.css'],
    port: 3000,
    historyApiFallback: true, // SPA fallback в dev
  },
};
