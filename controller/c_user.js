// import { getAllUser } from '../models/db_user';
import User from '../models/test_user';

const getUserInfo = async ctx => {
    console.log('获取用户信息');

    // const dataList = await getAllUser()
    // console.log(dataList)

    // 查询
    // const res = await User.findAll();
    // console.log(res);

    // 查询某一天
    // const res = await User.findAll({ where: { id: 1 } });
    // console.log(res);

    // 新增
    // await User.create({
    //     name: '李四',
    //     sex: '男'
    // });

    // 更新
    // await User.update({
    //     name: '张三111'
    // }, {
    //     where: { id: 1 }
    // })

    // 删除
    // await User.destroy({
    //     where: { id: 5 }
    // })


    ctx.body = {
        name: '老三',
        age: 18
    }
}

const addUserInfo = async ctx => {
    console.log('添加用户');
}

const editUserInfo = async ctx => {
    console.log('修改用户信息');
}

const delUserInfo = async ctx => {
    console.log('删除用户');
}

module.exports = {
    getUserInfo,
    addUserInfo,
    editUserInfo,
    delUserInfo
}
