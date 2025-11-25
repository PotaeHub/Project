import express from 'express';
import { getProfile } from '../controllers/profile.js';
import { verifyAuthToken } from '../middlewares/authToken.js';
const router = express.Router();


router.get('/profile', verifyAuthToken, getProfile);


export default router;