module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main.ts',
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx']
  },
  // 使用最簡單的 devtool 選項
  devtool: 'source-map',
  // 在 development 模式下運行
  mode: 'development',
};
