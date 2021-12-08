import { Router } from 'express';

const userRouter = Router();

userRouter.post('/signin', (request, response) => {
  return response.send('Entrando com o usuario');
});

userRouter.post('/signup', (request, response) => {
  return response.send('Criando um usuario');
});

export default userRouter;
