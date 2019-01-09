/*
单页应用js构建任务
改动根目录下的js，则编译被改动的js
改动非根目录下js,vue，都只编译根目录下的app.js
 */
const gulp = require('gulp')
const gutil = require('gulp-util')
const watch = require('gulp-watch')
const webpack = require('webpack')
const del = require('del')
const browserSync = require('browser-sync').create()
const bsReload = browserSync.reload
const replace = require('gulp-replace')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const webpackConfig = require('./webpack.config.js')

const srcFiles = {
  lib: './source/lib/**/*',
  assets: './source/assets/**/*',
  htmlInRoot: './source/*.{html,ico}'
}

const dist = './dist'

gulp.task('copyHtml', function () {
  return gulp.src([srcFiles.htmlInRoot], { base: './source' }).pipe(gulp.dest(dist))
})
gulp.task('buildHtml', function () {
  return gulp.src([srcFiles.htmlInRoot], { base: './source' })
    .pipe(replace('<!-- replace by NODE_ENV -->', '<script>var NODE_ENV = "' + process.env.NODE_ENV + '"</script>'))
    .pipe(replace('[replace by time]', ~~(Date.now()/10000)))
    .pipe(gulp.dest(dist))
})
gulp.task('copyAssets', function () {
  return gulp.src([srcFiles.lib, srcFiles.assets], { base: './source' }).pipe(gulp.dest(dist))
})

// 在dev模式，监听js、根目录、assets目录下文件的更改，重新载入浏览器中的页面
gulp.task('dev', gulp.series('copyAssets', 'copyHtml', function (done) {
  process.env.NODE_ENV = process.env.NODE_ENV || 'dev'
  browserSync.init(dist, {
    startPath: '/', // 服务器运行时打开的页面
    server: {
      baseDir: [dist]
    },
    reloadDebounce: 1000, // 重载事件后1秒后才允许下次重载
    watchOptions: {
      ignoreInitial: true,
      ignored: ['node_modules', 'WEB-INF']
    }
  })

  webpackConfig.watch = true
  webpackConfig.devtool = 'cheap-source-map'
  webpackConfig.plugins.push(new webpack.DefinePlugin({
    NODE_ENV: JSON.stringify('dev')
  }))
  webpack(webpackConfig).watch(200, function (err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack', err)
    }
    gutil.log('webpack', stats.toString({
      colors: true,
      chunks: false,
      hash: false,
      version: false
    }))
    bsReload()
  })

  watch([srcFiles.htmlInRoot], evt => {
    bsReload()
  })
  watch([srcFiles.lib, srcFiles.assets, '!**/*.tmp', '!**/*._t_'], evt => {
    var path = evt.path
    gulp
      .src(path, { base: './source' })
      .pipe(gulp.dest(dist))
      .pipe(bsReload)
  })
}))
gulp.task('clean', function () {
  // 删除dist目录下的某些被编译出的文件
  return del(['./dist', '!./dist/node_modules/*', '!./dist/WEB-INF/*'])
})
function build(faster, analyzer) {
  return function(done){
    process.env.NODE_ENV = process.env.NODE_ENV || 'prod'
    webpackConfig.watch = false
    webpackConfig.devtool = undefined
    webpackConfig.plugins.push(new webpack.DefinePlugin({
      NODE_ENV: 'prod'
    }))
    if(analyzer){
      webpackConfig.plugins.push(new BundleAnalyzerPlugin())
    }
    if(faster){
      webpackConfig.optimization = webpackConfig.optimization || {}
      webpackConfig.optimization.minimizer = []
    }
    webpack(webpackConfig, function (err, stats) {
      if (err) {
        throw new gutil.PluginError('webpack', err)
      }
      gutil.log(
        'webpack',
        stats.toString({
          colors: true,
          chunks: false,
          hash: false,
          version: false
        })
      )
      done()
    })
  }
}
// 在build模式，仅打包，不监听
gulp.task('build', gulp.series('clean', 'copyAssets', 'buildHtml', build()))
// 在build模式，仅打包，不监听，不压缩js，更快一点
gulp.task('buildfaster', gulp.series('clean', 'copyAssets', 'buildHtml', build(true)))
// 在analyzer模式，仅打包，不监听
gulp.task('analyzer', gulp.series('clean', 'copyAssets', 'buildHtml', build(null, true)))

gulp.task('webserver', function () {
  browserSync.init(dist, {
    startPath: '/', // 服务器运行时打开的页面
    server: {
      baseDir: [dist]
    },
    reloadDebounce: 2000, // 重载事件后1秒后才允许下次重载
    port: 3000,
    ghostMode: false, // 点击，滚动和表单不要镜像到其他设备里
    codeSync: false // 不要发送任何文件改变事件给浏览器
  })
})
