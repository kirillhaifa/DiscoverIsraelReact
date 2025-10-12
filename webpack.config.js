const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
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
    publicPath: isGhPages ? `/${REPO}/` : '/', // ВАЖНО
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
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|ico|svg)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
    }),
    // Генерим 404.html из того же шаблона — это даёт fallback для SPA на GH Pages
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: '404.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public/img',
          to: 'img',
        },
        {
          from: 'public/favicon.ico',
          to: 'favicon.ico',
        },
        {
          from: 'public/favicon.png',
          to: 'favicon.png',
        },
        {
          from: 'public/Styles',
          to: 'Styles',
        },
        {
          from: 'public/Fonts',
          to: 'Fonts',
        },
      ],
    }),
    new Dotenv({ systemvars: true }),
  ],
  devServer: {
    static: [
      {
        directory: path.join(__dirname, 'public'),
        publicPath: '/',
        serveIndex: false,
      },
      {
        directory: path.join(__dirname, 'dist'),
      },
    ],
    hot: true,
    watchFiles: ['src/**/*.scss', 'src/**/*.css'],
    port: 3000,
    historyApiFallback: {
      index: '/index.html'
    },
  },
};
