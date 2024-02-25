import { Service } from 'typedi';
import { LoginRequest, RegisterRequest } from '../requests/AuthRequest';
import AppDataSource from '../../libs/database';
import { MainRepository } from '../../libs/query-parser';
import { User } from '../../models/User';
import { ValidatorException } from '../exceptions/ValidatorException';
import * as jwt from 'jsonwebtoken';
import { authConfig } from '../../config/auth';

@Service()
export class AuthService {
  private userRepository = AppDataSource.getRepository(User).extend(MainRepository());

  async register(register: RegisterRequest) {
    const isExist = await this.userRepository.existsBy({ email: register.email });
    if (isExist) {
      throw new ValidatorException({ email: 'email already used' });
    }

    const entity = new User();
    entity.email = register.email;
    entity.name = register.name;
    entity.password = register.password;

    return this.userRepository.save(entity);
  }

  async login(login: LoginRequest) {
    const user = await this.userRepository.findOne({
      where: { email: login.email },
    });

    if (!user || (await user.checkPassword(login.password))) {
      throw new ValidatorException('email or password not match');
    }

    const payload = {
      id: user.id,
      email: user.email,
    };

    return {
      access: jwt.sign(payload, authConfig.JwtSecret, {
        expiresIn: authConfig.ExpiresIn,
      }),
      expiresIn: authConfig.ExpiresIn,
    };
  }
}
