const merge = require('webpack-merge');
const config = require('./webpack.config.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); //npm install --save-dev optimize-css-assets-webpack-plugin

module.exports = merge(config, {
  mode: 'production',
  devtool: 'none',
  optimization: {
    // splitChunks: {
    //   cacheGroups: {
    //     commons: {
    //       name: 'commons',
    //       chunks: 'initial', //initial(初始块)、async(按需加载块)、all(全部块)，默认为all;
    //       minChunks: 1
    //     }
    //   }
    // },
    minimizer: [
      new UglifyJSPlugin({
        test: /\.min.js($|\?)/i
      }),
      new OptimizeCSSAssetsPlugin() //css压缩
    ]
  }
});