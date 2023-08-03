import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare } from 'bcryptjs';
import { UnauthorizedException } from 'src/shared/exceptions/unauthorized.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entities/token.entity';
import { TokenService } from './token.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { IJWTPayload } from './jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
  ) {}

  async login(username: string, pass: string) {
    const user = await this.usersService.findOneByUsername(username);

    if (user) {
      const isMatch = await compare(pass, user.password);

      if (!isMatch) throw new UnauthorizedException('Incorrect password.');

      const jwtPayload: IJWTPayload = {
        username: user.username,
        email: user.email,
        id: user.id,
      };

      const tokens = await this.tokenService.generateTokens(jwtPayload);
      const response = await this.tokenService.updateUserRefreshToken(
        user,
        tokens.refreshToken,
      );
      return tokens;
    }

    throw new UnauthorizedException('Incorrect username.');
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    return await this.tokenService.refreshAccessToken(
      refreshTokenDto.refreshToken,
    );
  }

  async getProfile(username: string) {
    const user = await this.usersService.findOneByUsername(username);
    const { password, ...result } = user;
    return result;
  }
}
