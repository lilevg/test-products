import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  public async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(loginUserDto);
    return this.generateToken(user);
  }

  public async register(registerUserDto: CreateUserDto) {
    const candidate = await this.userService.getUsersByName(
      registerUserDto.name,
    );

    if (candidate) {
      throw new HttpException(
        'User with this email already exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPassword = await bcrypt.hash(registerUserDto.password, 5);
    const user = await this.userService.register({
      ...registerUserDto,
      password: hashPassword,
    });

    return this.generateToken(user);
  }

  private async generateToken(user: User) {
    const payload = { name: user.name, id: user.id };
    return { token: this.jwtService.sign(payload) };
  }

  private async validateUser(loginUserDto: LoginUserDto) {
    const user = await this.userService.getUsersByName(loginUserDto.name);

    if (!user) {
      throw new UnauthorizedException({ message: 'This user does`n exist' });
    }

    const passwordEquals = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (user && passwordEquals) {
      return user;
    }

    throw new UnauthorizedException({ message: 'Wrong password or email' });
  }
}
