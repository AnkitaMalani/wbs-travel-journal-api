import { Router } from 'express';
import validateZod from '../middlewares/validateZod.js';
import verifyToken from '../middlewares/verfiyToken.js';
import { userMessageSchema } from '../zod/schemas.js';
import { createSimpleChat, createChat, getChatHistory, createPersonalChat } from '../controllers/chats.js';

const chatRouter = Router();

chatRouter.post('/simple', validateZod(userMessageSchema), createSimpleChat);
chatRouter.post('/', validateZod(userMessageSchema), createChat);
chatRouter.post('/personal', verifyToken, validateZod(userMessageSchema), createPersonalChat);
chatRouter.get('/:id', getChatHistory);

export default chatRouter;
