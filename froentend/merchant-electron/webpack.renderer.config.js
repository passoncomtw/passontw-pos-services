const rules = require('./webpack.rules');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css']
  },
  // 使用最簡單的 devtool 選項，避免 eval 問題
  devtool: 'source-map',
  // 在 development 模式下運行
  mode: 'development',
};
