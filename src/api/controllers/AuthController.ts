import { Service } from 'typedi';
import { Body, JsonController, Post } from 'routing-controllers';
import { LoginRequest, RegisterRequest } from '../requests/AuthRequest';
import { AuthService } from '../services/AuthService';

@Service()
@JsonController('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async register(@Body() register: RegisterRequest) {
    return this.authService.register(register);
  }

  @Post('/login')
  async login(@Body() login: LoginRequest) {
    return this.authService.login(login);
  }
}
