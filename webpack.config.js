const path = require('path');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { createVariants } = require('parallel-webpack');

const baseOptions = {
  preferredDevTool: process.env.DEVTOOL || 'eval',
};

const variants = {
  entry: ['', '.popper'],
};

module.exports = createVariants(baseOptions, variants, (options) => {
  return {
    entry: `./src/index${options.entry}.js`,
    devtool: options.preferredDevTool,
    optimization: {
      minimize: true,
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            output: {
              comments: false,
            },
          },
        }),
      ],
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
      ],
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: `scribio${options.entry}.min.js`,
    },
    plugins: [
      new MinifyPlugin(),
    ],
  };
});
