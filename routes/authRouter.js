import { Router } from 'express';
import validateZod from '../middlewares/validateZod.js';
import { userSchema, signInSchema } from '../zod/schemas.js';
import { signUp, signIn, me, signOut } from '../controllers/auth.js';
import verifyToken from '../middlewares/verfiyToken.js';
const authRouter = Router();

authRouter.route('/signup').post(validateZod(userSchema), signUp);

authRouter.route('/signin').post(validateZod(signInSchema), signIn);

authRouter.route('/me').get(verifyToken, me);

authRouter.route('/signout').delete(signOut);

export default authRouter;
