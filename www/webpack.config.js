var path = require('path');
var webpack = require('webpack');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
  entry: {
    //单页面开发的入口文件
     // app:"./src/app.js",       

     // 已下为多文件开发入口
     page1:"./production/entry/page1.js",
     page2:"./production/entry/page2.js",
  },
  output: {
    //单页配置
    // path: path.resolve(__dirname, './src/dist/'),
    // publicPath: '/dist/',         //线上
    // publicPath: '/src/dist/',        //本地测试

    // 多页配置
    path: path.resolve(__dirname, './production/js/dist/'),        
    // // publicPath: '/js/dist/',                                    //线上
    publicPath: '/production/js/dist/',                            //本地测试   测试：/production/app.html    线上： /app.html    
    filename: '[name].js',
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules'),
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      },
        {
            test: /\.css$/,
            loader:'style-loader!css-loader'
            // loader: ExtractTextPlugin.extract("style-loader", "css-loader")
        },
         {
            test: /\.scss$/,
            loader:'style-loader!css-loader!sass-loader'
            // loader: ExtractTextPlugin.extract("style-loader", "css-loader", "sass-loader")
        }, 
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.html$/,
        loader: 'vue-html'
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    noInfo: false,
    // proxy: [
    //   {
    //       context:['/menu','/system/carousel','/area'],
    //       target:"http://fresh.hixiaoyuan.cn",
    //       changeOrigin: true,
    //       secure: false
    //   }
    // ]
  },
  devtool: '#eval-source-map',
  resolve: {
        extensions: ['', '.js', '.css', '.scss', '.vue'],
        alias: {
            'vue$': path.resolve(__dirname)+'/node_modules/vue/dist/vue.js'
        },
          externals:{
              $:'window.$',
              ajax:"window.axios"
          }
   }
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ])
}
