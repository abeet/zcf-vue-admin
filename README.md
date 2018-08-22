# zcf-vue-admin

基于 zcf+vue 的多页面后台管理系统脚手架的模板

## 安装

这是一个用于 [zcf-cli](https://github.com/abeet/zcf-cli.git) 的工程模板

``` bash
npm install -g zcf-cli
zcf init zcf-vue-admin my-project
cd my-project
cd server
mvn install
cd ../client
npm install
```

### 运行

- `server` 目录下是一个基于zcf的工程，运行java类 com.zving.Boot#main()  来启动后台服务
- `client` 目录下是一个vue工程，执行 `npm run dev` 来启动前台

