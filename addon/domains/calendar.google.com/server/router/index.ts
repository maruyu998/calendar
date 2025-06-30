import express from 'express';
import settingRouter from './setting';
import googlecaleventRouter from './googleCalevent';

const router = express.Router()

router.use('/setting', settingRouter);
router.use('/googlecalevent', googlecaleventRouter);

export default router;