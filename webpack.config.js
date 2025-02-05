const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/main.js', // точка входа
  output: {
    filename: 'bundle.js', // имя бандла
    path: path.resolve(__dirname, 'build'), // директория для файлов сборки
    clean: true, // удаляем предыдущую сборку перед созданием новой
  },
  devtool: 'source-map', // генерируем карту исходного кода
  plugins: [ // Подключаем плагины
    new CopyPlugin({
      patterns: [{ from: 'public' }],
    }),
  ],
};
