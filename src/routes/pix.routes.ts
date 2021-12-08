import { Router } from 'express';

import userAuthenticated from '../middlewares/userAuthenticated';

const pixRouter = Router();
// const pixController = new UserController();

pixRouter.use(userAuthenticated);

// pixRouter.post('/signin', userController.signin);
// pixRouter.post('/signin', userController.signin);
// pixRouter.get('/signin', userController.signin);

export default pixRouter;
