import Sequelize from 'sequelize';
import config from './config';

const { host, database, user, password } = config.mysql;
const mysqlUrl = `mysql://${user}:${password}@${host}/${database}`;

export default new Sequelize(mysqlUrl, {
    logging: false
    // 各种参数配置，参考文档：
    // https://sequelize.org/master/class/lib/sequelize.js~Sequelize.html#instance-constructor-constructor
});





// import mysql from 'mysql';
// import config from './config';

// const pool = mysql.createPool(config.mysql)
// let query = function (sql, values) {
//     return new Promise((resolve, reject) => {
//         pool.getConnection(function (err, connection) {
//             if (err) {
//                 reject(err)
//             } else {
//                 connection.query(sql, values, (err, rows) => {
//                     if (err) {
//                         reject(err)
//                     } else {
//                         resolve(rows)
//                     }
//                     connection.release()
//                 })
//             }
//         })
//     })
// }
// export default query

