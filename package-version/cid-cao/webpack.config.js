const path = require('path');

module.exports = {
  mode: "production",
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
      name: 'cidcao',
      type: 'umd',
    },
  }
};