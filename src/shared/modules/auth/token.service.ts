import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entities/token.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { IJWTPayload } from './jwt-payload';
import { UnauthorizedException } from 'src/shared/exceptions/unauthorized.exception';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepo: Repository<RefreshToken>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async updateUserRefreshToken(user: User, refreshToken: string) {
    const pastRefreshToken = await this.refreshTokenRepo.findOne({
      where: {
        user: { id: user.id },
      },
      relations: { user: true },
    });
    if (pastRefreshToken) {
      await this.refreshTokenRepo.update(
        { user: { id: user.id } },
        { token: refreshToken },
      );
    } else {
      const newRefreshToken = await this.refreshTokenRepo.create({
        token: refreshToken,
        user,
      });
      await this.refreshTokenRepo.save(newRefreshToken);
    }
    return;
  }

  async refreshAccessToken(refreshToken: string) {
    const refreshTokenIsValid = await this.jwtService
      .verifyAsync(refreshToken)
      .catch(() => null);

    if (refreshTokenIsValid) {
      const { username, id, email }: IJWTPayload = this.jwtService.decode(
        refreshToken,
      ) as IJWTPayload;

      const tokens = await this.generateTokens({ username, email, id });

      const updatedToken = await this.refreshTokenRepo.update(
        { user: { id: id }, token: refreshToken },
        { token: tokens.accessToken },
      );
      if (updatedToken.affected == 0) {
        throw new UnauthorizedException('Invalid refresh token.');
      }
      return tokens;
    }
    throw new UnauthorizedException('Invalid refresh token.');
  }

  async generateTokens(jwtPayload: IJWTPayload) {
    const accessToken = this.jwtService.sign(jwtPayload, {
      expiresIn: this.configService.get('ACCESS_TOKEN_TTL'),
    });
    const refreshToken = this.jwtService.sign(jwtPayload, {
      expiresIn: this.configService.get('REFRESH_TOKEN_TTL'),
    });
    return {
      accessToken,
      refreshToken,
    };
  }
}
