const path = require('path');

module.exports = {
  mode: "development",
  entry: './src/index.js',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  output: {
    publicPath:'',
    filename: 'cidcao.js',
    path: path.resolve(__dirname, 'dist'),
    globalObject: 'this',
    library: {
      name: 'cidCao',
      type: 'umd',
    },
  }
};