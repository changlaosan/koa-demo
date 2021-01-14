import Router from 'koa-router';
import isLogin from '../middleware/login';
import User from '../controller/c_user';

const router = new Router();

// router.prefix('/api/user');

router.get('/', User.getUserInfo);
router.post('/', User.addUserInfo);
router.put('/', User.editUserInfo);
router.del('/:id', isLogin, User.delUserInfo);

export default router;
