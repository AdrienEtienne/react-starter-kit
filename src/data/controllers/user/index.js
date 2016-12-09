import {
  Router,
} from 'express';
import * as controller from './user.controller';
import * as auth from '../../../core/auth/auth.service';

const router = new Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:cuid', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:cuid/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:cuid', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);

export default router;
