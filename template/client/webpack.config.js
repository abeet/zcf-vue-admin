const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

console.log('env.NODE_ENV:', process.env.NODE_ENV)
const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'dev'
module.exports = {
  mode: env ? (env === 'prod' ? 'production' : 'development') : 'development',
  entry: {
    app: './source/app.js',
    login: './source/login.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  watch: false,
  cache: true,
  externals: {
    // 库已经在页面中引入，使用全局变量代替对库的引用，库内容不用再打包到app.js中
    vue: 'Vue',
    lodash: '_',
    axios: 'axios',
    'axios-mock-adapter': 'AxiosMockAdapter',
    'vue-router': 'VueRouter',
    'element-ui': 'ELEMENT',
    'vue-i18n': 'VueI18n',
    echarts: 'echarts'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }, {
        test: /\.js$/,
        use: {
          loader: 'babel-loader?cacheDirectory=true',
          options: createBabelOptions(env)
        }
      }, {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }, {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 2048, // 2K左右
            name: 'assets/images/[name].[ext]'
          }
        }]
      }, {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 2048, // 2K左右
            name: 'assets/media/[name].[ext]'
          }
        }]
      }, {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 2048, // 2K左右
            name: 'assets/fonts/[name].[ext]'
          }
        }]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}

function createBabelOptions(env) {
  env = env || 'dev'

  const babelrc = {
    'presets': [
      [
        'env', {
          'targets': {
            'browsers': ['edge >= 15']
          },
          'modules': false,
          'useBuiltIns': false
        }
      ]
    ]
  }
  if (env !== 'dev') {
    babelrc.presets[0][1].targets.browsers = ['ie >= 9']
    babelrc.plugins = [
      'transform-class-properties',
      'transform-object-rest-spread'
    ]
  }
  return babelrc
}
