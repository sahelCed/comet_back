import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}


    async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email déjà utilisé');

    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { ...dto, password: hash },
    });

    return this.signToken(user.id, user.email);
  }

  async login({ email,password }: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) throw new UnauthorizedException('Identifiants invalides');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Identifiants invalides');

    return this.signToken(user.id, user.email);
  }

    private async signToken(userId: number, email: string) {
    const token = await this.jwt.signAsync({ sub: userId, email });
    return { access_token: token };
  }

}
