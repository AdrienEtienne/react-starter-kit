import { Router } from 'express';
import indexNews from './news.controller';
import getContent from './contents.controller';
import user from './user';

const router = new Router();

router.get('/news', indexNews);

router.get('/contents/:path', getContent);

router.use('/users', user);

export default router;
