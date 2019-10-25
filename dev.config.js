const path = require('path');
// eslint-disable-next-line
const HtmlPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './docs/docs.js',
  resolve: {
    alias: {
      Scribio$: path.resolve(__dirname, 'src/index.js'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  devServer: {
    port: 8080,
    hot: true,
    host: 'localhost',
    compress: true,
  },
  output: {
    path: path.join(__dirname, 'docs', 'dist'),
    filename: 'docs.js',
  },
  plugins: [
    new HtmlPlugin({
      template: './docs/index.html',
    }),
  ],
};
