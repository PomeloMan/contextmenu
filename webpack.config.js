const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // npm install clean-webpack-plugin --save-dev
const HtmlWebpackPlugin = require('html-webpack-plugin'); // npm install --save-dev html-webpack-plugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // npm install --save-dev mini-css-extract-plugin

module.exports = {
  entry: {
    'contextmenu': './main_demo.ts',
    'contextmenu.min': './main.ts'
  },
  output: {
    filename: 'js/[name].js', //打包输出文件名
    // chunkFilename: '[chunkhash].js', //第三方库打包输出文件名 [id][name][chunkhash]
    path: path.resolve(__dirname, 'dist') //打包输出文件目录，'__dirname'是node.js中的一个全局变量，它指向当前执行脚本所在的目录。
  },
  module: {
    rules: [
      //npm install --save-dev typescript ts-loader
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(css|sass|scss)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [
    new webpack.BannerPlugin('v1.0.0'),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.html',
      chunks: ['contextmenu']
    }),
    new MiniCssExtractPlugin({
      filename: 'css/styles.min.css',
      // filename: 'css/[name].css',
      // chunkFilename: 'css/[chunkhash].min.css'
    })
  ],
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true, // 启用gzip压缩
    historyApiFallback: true, //不跳转
    inline: true, //实时刷新
    hot: true
  }
};