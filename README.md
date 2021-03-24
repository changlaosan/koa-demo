## 前言
最近对koa这个框架接触颇多，毕竟也属于node模块的东西，就多了解了一些，就在这里留下一些自己的心得。
之后如果我司某位前端也需要自己写接口，可以借鉴，入手会快一些。
当然，这只是快速入手，写一些简单增删改查，一些复杂业务需要借鉴官方文档。
## 一、安装
```bash
npm i -y // 初始化一个webpack
npm i koa koa-router -s // 安装koa以及路由
// 安装babel，方便使用新语法
npm install --save babel-core
npm install --save babel-preset-env或者es2015
npm install babel-cli -g
// 新建.babelrc文件
{
    "presets": [
     "env"或者"es2015"
    ],
    "plugins": []
}
// 修改webpack.json，可灵活配置
"main": "app.js" // main，入口文件名称
"scripts": { // 运行命令
    "start": "nodemon --exec babel-node app.js"
}
```
## 二、入口文件
1、手动新建一个app.js入口文件
```bash
// 导入koa
import Koa from 'koa';
// 实例化Koa对象
const app = new Koa();
// 对于任何请求，app将调用该异步函数处理请求
app.use(async (ctx, next) => {
    await next();
    ctx.response.type = 'text/html';
    ctx.response.body = '<h1>Hello, koa2!</h1>';
});
// 监听端口
app.listen(3000， () => console.log('server Connected'));
```
2、运行npm start，就可以通过访问本地端口查看了
## 三、中间件
这算是koa的执行逻辑吧，搞清楚我们就能愉快的写代码了。核心代码如下：
```bash
app.use(async (ctx, next) => {
    await next();
    ctx.response.type = 'text/html';
    ctx.response.body = '<h1>Hello, koa2!</h1>';
});
// 每一个http请求，koa都会调用app.use()注册的async函数，自带两个参数
// ctx：内部封装了请求的request和response变量
// next: 顾名思义，回调函数
// 我们可以对ctx进行操作，并设置返回内容
// 那为什么需要调用await next()
// koa把很多async函数组成一个处理链，每个async函数都可以做一些自己的事情，然后用await next()来调用下一个async函数
// 这一个个的async函数就是我们的中间件
其中，这些中间件可以进行组合，链式调用，例如：
app.use(async (ctx, next) => {
    console.log(`${ctx.request.method} ${ctx.request.url}`);
    await next();
});
app.use(async (ctx, next) => {
    await next();
    ctx.response.type = 'text/html';
    ctx.response.body = '<h1>Hello, koa2!</h1>';
});
// 因为是链式调用，所以app.use()的调用顺序，就是代码的执行顺序
// 那如何其中一个中间件没有调用await next()，后续代码就不会再执行了。当然不接收next参数，就不需要再主动调用了
// 这可以应用到判断用户权限，如下：
app.use(async (ctx, next) => {
    if (await checkUserPermission(ctx)) {
        await next();
    } else {
        ctx.response.status = 403;
    }
});
```
## 四、路由
这里我们使用koa-router，它可以将请求的的URL和方法，匹配到对应的逻辑代码中。
<br />
1、安装
```bash
npm install koa-router --save
```
2、调用
```bash
import Koa from 'koa';
import Router from 'koa-router'; // 引入koa-router
const app = new Koa();
const router = new Router(); // 创建路由，支持传递参数
// 指定一个url匹配
router.get('/', async ctx => {
    ctx.type = 'html';
    ctx.body = '<h1>hello world!</h1>';
})
// 调用router.routes()来组装匹配好的路由，返回一个合并好的中间件
// 调用router.allowedMethods()获得一个中间件，当发送了不符合的请求时，会返回 `405 Method Not Allowed` 或 `501 Not Implemented`
app.use(router.routes());
app.use(router.allowedMethods({ 
    // throw: true, // 抛出错误，代替设置响应头状态
    // notImplemented: () => '不支持当前请求所需要的功能',
    // methodNotAllowed: () => '不支持的请求方式'
}));
app.listen(3000， () => console.log('server Connected'));
```
3、请求方法
Koa-router 请求方式： get 、 put 、 post 、 patch 、 delete 、 del ；
使用方法就是 router.方式() ，比如 router.get() 和 router.post()
而 router.all() 会匹配所有的请求方法
```bash
router.get('/', async (ctx) => {
    ctx.type = 'html';
    ctx.body = '<h1>hello world!</h1>';
})
    .get("/users", async (ctx) => {
        ctx.body = '获取用户列表';
    })
    .get("/users/:id", async (ctx) => {
        const { id } = ctx.params
        ctx.body = `获取id为${id}的用户`;
    })
    .post("/users", async (ctx) => {
        ctx.body = `创建用户`;
    })
    .put("/users/:id", async (ctx) => {
        const { id } = ctx.params
        ctx.body = `修改id为${id}的用户`;
    })
    .del("/users/:id", async (ctx) => {
        const { id } = ctx.params
        ctx.body = `删除id为${id}的用户`;
    })
    .all("/users/:id", async (ctx) => {
        ctx.body = ctx.params;
    });
```
4、获取参数
```bash
// params参数
router.get('/:category/:title', (ctx, next) => {
  console.log(ctx.params);
  // => { category: 'programming', title: 'how-to-node' }
});
// query参数
router.get("/users", async (ctx) => {
    console.log('查询参数', ctx.query);
    ctx.body = '获取用户列表';
})
```
5、使用中间件
```bash
router.get(
  '/users/:id',
  (ctx, next) => {
    ...
    next();
  },
  ctx => {...}
);
```
6、设置路由前缀
```bash
router.prefix('/api/user')
```
7、路由嵌套
```bash
// 有些路由设计很多模块，这时就需要用到嵌套
var forums = new Router();
var posts = new Router();
posts.get('/', (ctx, next) => {...});
posts.get('/:pid', (ctx, next) => {...});
forums.use('/forums/:fid/posts', posts.routes(), posts.allowedMethods());
// responds to "/forums/123/posts" and "/forums/123/posts/123"
app.use(forums.routes());
```
8、拆分路由
app.js文件
```bash
const Koa = require('koa'); // 引入koa
const router = require('./routes');
const app = new Koa(); // 创建koa应用
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000， () => console.log('server Connected'));
routes/index.js导出整个路由模块
const router = require('koa-router')()
const user = require('./user')
...
router.use('/', user.routes(), user.allowedMethods())
...
module.exports = router
routes/user.js某模块
const Router = require('koa-router');
const router = new Router();
router.get("/", async (ctx) => {
    ...
});
module.exports = router;
```
## 五、连接数据库
1、mysql连接池
```bash
// 步骤一
// 连接数据库，首先需要mysql，所以需要安装
npm install mysql -s
// 步骤二
// 选择一个数据库，本地新建config.js，记录数据库信息，例
const config = {
    mysql: {
        host: '192.168.3.112',
        user: 'root',
        password: '123456',
        database: 'meeting',
        // port: '3306',
        charset: 'utf8mb4'
    }
}
export default config;
// 步骤三
// 建立连接池，新建db.js
import mysql from 'mysql';
import config from './config';
const pool = mysql.createPool(config.mysql)
let query = function (sql, values) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    connection.release()
                })
            }
        })
    })
}
export default query
// 步骤四
// 中间件内部调用，这里提取中间件、sql命令等
import query from '../db';
const selectAll = async () => {
  const sql = 'SELECT * FROM users'
  const dataList = await query(sql)
  return dataList
}
const getData = async () => {
  let dataList = await selectAll()
  console.log( dataList )
}
```
2、使用sequelize
```bash
// 步骤一
// 没说的，安装依赖呗
npm install --save sequelize
// 数据库安装驱动程序,选择以下之一:
npm install --save pg pg-hstore # Postgres
npm install --save mysql2
npm install --save mariadb
npm install --save sqlite3
npm install --save tedious # Microsoft SQL Server
// 步骤二
// 连接数据库，新建db.js
import Sequelize from 'sequelize';
import config from './config';
const { host, database, user, password } = config.mysql;
const mysqlUrl = `mysql://${user}:${password}@${host}/${database}`;
export default new Sequelize(mysqlUrl, {
    logging: false
    // 各种参数配置，参考文档：
    // https://sequelize.org/master/class/lib/sequelize.js~Sequelize.html#instance-constructor-constructor
});
// 步骤三
// 建立一个模型，每个表对应一个表，新建models/user.js
import Sequelize from 'sequelize';
import db from '../db';
const user = db.define('user', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: Sequelize.STRING },
    sex: { type: Sequelize.STRING }
}, {
    timestamps: false, // 不加时间戳
    tableName: 'testUesr', // 表名
    freezeTableName: true // 强制表名称等于模型名称
});
export default user;
// 步骤四
// 同步模型，app.js
import db from './db';
(async () => {
    try {
        // 如果表不存在,则创建该表(如果已经存在,则不执行任何操作)
        await db.sync({});
        console.info('Database connected');
    } catch (err) {
        console.error(err);
    }
})();
// 步骤五
// 简单应用，某一个中间件的控制器内部调用
import User from '../models/test_user';
const getUserInfo = async ctx => {
    // 查询
    const res = await User.findAll();
    console.log(res);
    // 查询某一条
    const res = await User.findAll({ where: { id: 1 } });
    console.log(res);
    // 新增
    await User.create({
        name: '李四',
        sex: '男'
    });
    // 更新
    await User.update({
        name: '张三111'
    }, {
        where: { id: 1 }
    })
    // 删除
    await User.destroy({
        where: { id: 5 }
    })
}
```
## 参考文献
自己写的一个简单的koa模型，git仓库地址：<br />
https://git.lug.ustc.edu.cn/laosan/koa-demo.git<br />
我与望海潮一起做的小程序的git仓库地址：<br />
https://gitee.com/qxgitlab/qx-meeting-koa.git<br />
我借鉴的某位大佬的koa笔记，git地址：<br />
https://github.com/chenshenhai/koa2-note<br />
廖雪峰的koa笔记，博客地址：<br />
https://www.liaoxuefeng.com/wiki/1022910821149312/1023025933764960<br />
koa官网：<br />
https://koa.bootcss.com/#introduction<br />
koa-router简述：<br />
https://www.jianshu.com/p/f169c342b4d5<br />
Sequelize 官网：<br />
https://www.sequelize.com.cn/<br />
