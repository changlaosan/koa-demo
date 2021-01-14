import Koa from 'koa';
import router from './routes';
import db from './db';
import errorHandle from './middleware/errorHandle';

const app = new Koa();

(async () => {
    try {
        // 如果表不存在,则创建该表(如果已经存在,则不执行任何操作)
        await db.sync({});
        console.info('Database connected');
    } catch (err) {
        console.error(err);
    }
})();

app.use(errorHandle())
    .use(router.routes())
    .use(router.allowedMethods())

app.listen(5000, () => {
    console.log('server started');
})
