# 开发准备

1. 安装node.js （8.10 或以上）
2. 全局安装yarn：npm i yarn  -g
3. 全局安装umi：yarn global add umi
4. 拉项目代码：git clone https://github.com/dadi01/dd01-member-scrm-facade.git
5. 代码拉下来后进入项目目录：cd dd01-member-scrm-facade
6. 安装依赖运行：yarn 或 npm install
7. 项目根目录下运行 `cp ./config/config.sample.ts ./config/config.local.ts` 生成自定义代理文件
8. 启动服务
  - `npm start` 进行本地 mock 服务开发
  - `yarn start:no-mock` 使用代理环境进行开发

# 文件目录说明

- config　配置文件目录（包含路由配置）
- dist　　打包后输出目录
- mock　　mock数据目录
- public 公共文件（目前只有图标文件）
- src　　 业务代码目录
- typings
- utils　工具目录

# 开发代理说明

一般来说，代理服务的话，只需要更改 ./config/config.local.ts 文件，具体代理格式参照 [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)

# 路由说明

请参照 ant-design-pro 的说明

# 开发环境说明

开发环境 -> dev
测试环境 -> test2-container
预发布环境 -> uat-container
生产环境 -> master-container 

# Layout 说明

Layout 主要是对 [ant-design-pro-layout](https://github.com/ant-design/ant-design-pro-layout/tree/master/src) 的二次开发

### NestLayout

NestLayout 在 ant-design-pro-layout 的 BasicLayout 组件基础上做了进一步的封装，主体路由级别一般需要使用该布局

#### PageHeaderWrap

重写了 pro-layout 的 PageHeaderWrap 组件，更适应自身的UI。一般来说，会在业务页面中引入改 组件作为组件外壳


# 运营部署

1、安装node.js （8.10 或以上）

2、全局安装yarn：npm i yarn  -g

3、全局安装umi：yarn global add umi

4、拉项目代码：git clone https://github.com/dadi01/dd01-member-scrm-facade.git

5、代码拉下来后进入项目目录(cd dd01-member-scrm-facade)，安装依赖运行：yarn 或 npm install

6、代码编译：(根据不同环境使用不同命令打包)

    打包dev环境：yarn run build:dev 或 npm run build:dev

    打包test环境: yarn run build:test 或 npm run build:test

    打包uat环境: yarn run build:uat 或 npm run build:uat

    打包生产环境: yarn run build:pro 或 npm run build:pro


7、将dist下文件部署到各环境

注：前面5步执行一次即可，之后每次更新代码命令：git pull，更新完代码后在进行第6、7步

# 运营部署end

