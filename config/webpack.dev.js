const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const cleanWebpackPlugin = require("clean-webpack-plugin");
const htmlWebpackPlugin = require("html-webpack-plugin");
const extractTextPlugin = require("extract-text-webpack-plugin")
const glob = require('glob');
const PurifyCSSPlugin = require("purifycss-webpack");
var website = {
  publicPath: "http://localhost:8888/"
}
module.exports = {
  mode: 'development',
  entry: {
    main: './src/main.js',
    main2: './src/main2.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    publicPath: website.publicPath
  },
  module: {
    rules: [{
        test: /\.css$/,
        use: extractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test: /\.(png|jpg|gif|jpeg)/, //是匹配图片文件后缀名称
        use: [{
          loader: 'url-loader', //是指定使用的loader和loader的配置参数
          options: {
            limit: 500, //是把小于500B的文件打成Base64的格式，写入JS
            outputPath: 'images/',
          }
        }]
      },
      {
        test: /\.(htm|html)$/i,
        use: ['html-withimg-loader']
      },
      {
        test: /\.less$/,
        use: extractTextPlugin.extract({
          use: [{
            loader: "css-loader"
          }, {
            loader: "less-loader"
          }],
          // use style-loader in development
          fallback: "style-loader"
        })
      },
      {
        test:/\.(jsx|js)$/,
        use:{
            loader:'babel-loader',
        },
        exclude:/node_modules/
      }
    ]
  },
  plugins: [
    new cleanWebpackPlugin(['dist'], {
      "root": path.resolve(__dirname, '../'),
      "verbose": true,
    }),
    new UglifyJsPlugin(),
    new extractTextPlugin("css/index.css"),
    new PurifyCSSPlugin({
      //这里配置了一个paths，主要是需找html模板，purifycss根据这个配置会遍历你的文件，查找哪些css被使用了。
      paths: glob.sync(path.join(__dirname, '../src/*.html')),
    }),
    new htmlWebpackPlugin({
      minify: {
        removeAttributeQuotes: true
      },
      hash: true,
      template: './src/index.html'
    })
  ],
  optimization: {

  },
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    host: 'localhost',
    compress: true,
    port: 8888
  }
}