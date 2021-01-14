export default () => async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        ctx.status = error.status || 400;
        ctx.body = { msg: error.message };
        if (error.message.includes('Error: connect')) {
            ctx.body = { msg: '服务器异常(错误代码001)，请联系管理员' };
        }
        if (error.message.includes('getaddrinfo EAI_AGAIN')) {
            ctx.body = { msg: '服务器异常(错误代码002)，请联系管理员' };
        }
        if (error.message.includes('"connect ECONNREFUSED')) {
            ctx.body = { msg: '服务器异常(错误代码003)，请联系管理员' };
        }
        if (error.message.includes('getaddrinfo ENOTFOUND')) {
            ctx.body = { msg: '服务器异常(错误代码004)，请联系管理员' };
        }
        console.error(error.stack);
    }
};
