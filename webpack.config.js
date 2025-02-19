const path = require('node:path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.js', // точка входа
  output: {
    filename: 'bundle.[contenthash].js', // имя бандла
    path: path.resolve(__dirname, 'build'), // директория для файлов сборки
    clean: true, // удаление предыдущей сборки перед созданием новой
  },
  devtool: 'source-map', // генерирование карты исходного кода
  plugins: [ // подключение плагинов
    new HtmlPlugin({
      template: 'public/index.html',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'public',
          globOptions: {
            ignore: ['**/index.html'],
          },
        },
      ],
    }),
  ],
  module: {
    rules: [ // добавление лоадеров
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
    ],
  },
};
