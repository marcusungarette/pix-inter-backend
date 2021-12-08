import md5 from 'crypto-js/md5';
import { getRepository } from 'typeorm';

import { User } from '../../entities/User';
import AppError from '../../shared/error/AppError';
import { UserSignIn } from './dtos/user.signin.dtos';
// import { UserSignUp } from './dtos/user.signup.dtos';

export default class UserService {
  async signin(user: UserSignIn) {
    const userRepository = getRepository(User);

    const { email, password } = user;
    const passwordHash = md5(password).toString();

    const existUser = await userRepository.findOne({
      where: { email, password: passwordHash },
    });

    if (!existUser) {
      throw new AppError('User does not exists!', 400);
    }

    return existUser;
  }

  //   async signup(user: UserSignUp) {}
}
