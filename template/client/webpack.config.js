const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

console.log('env.BABEL_ENV:', process.env.BABEL_ENV)
const env = process.env.BABEL_ENV ? process.env.BABEL_ENV : 'dev'
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
        exclude: [path.resolve('src/lib')],
        // `node_modules` 中的文件排除在 Babel 转译范围以外，所以还要再配置 include
        include: [
          path.resolve('src'),
          path.resolve('node_modules/vue'),
          path.resolve('node_modules/element-ui')
        ],
        use: {
          loader: 'babel-loader?cacheDirectory=true',
          options: getBabelConfig(env)
        }
      }, {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }, {
        test: /\.(png|jpg|gif|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 2048, // 2K左右
          }
        }]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}

function getBabelConfig(env) {
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
      'transform-object-rest-spread',
      'transform-runtime'
    ]
  }
  return babelrc
}
