import query from '../db';

const getAllUser = async () => {
    const sql = 'SELECT * FROM users'
    const dataList = await query(sql)
    return dataList
}

export {
    getAllUser
}
