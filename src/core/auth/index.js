import express from 'express';
import { auth as config } from '../../config';
import { User } from '../../data/models';
import localPassport from './local/passport';
import facebookPassport from './facebook/passport';
import local from './local';
import facebook from './facebook';

// Passport Configuration
localPassport(User, config);
facebookPassport(User, config);

const router = express.Router();

router.use('/local', local);
router.use('/facebook', facebook);

export default router;
