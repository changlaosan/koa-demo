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
