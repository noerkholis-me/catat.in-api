import { PrismaService } from "@/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { AuthResponseDto } from "./dto/auth-response.dto";
import * as bcrypt from "bcrypt";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, fullName, password } = registerDto;

    const existingUser = await this.prisma.user.findUnique({ where: { email, deletedAt: null } });

    if (existingUser) {
      throw new ConflictException("Email sudah terdaftar");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: { email, fullName, password: hashedPassword },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        currentStreak: true,
        longestStreak: true,
      },
    });

    const accessToken = this.generateToken(user.id, user.email);
    const refreshToken = this.generateRefreshToken(user.id, user.email);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({ where: { email, deletedAt: null } });
    if (!user) throw new UnauthorizedException("Email atau password salah");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException("Email atau password salah");

    const accessToken = this.generateToken(user.id, user.email);
    const refreshToken = this.generateRefreshToken(user.id, user.email);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
      },
    };
  }

  async refresh(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId, deletedAt: null } });
    if (!user) throw new UnauthorizedException("User tidak ditemukan");

    const accessToken = this.generateRefreshToken(user.id, user.email);
    return { accessToken };
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        currentStreak: true,
        longestStreak: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException("User tidak ditemukan");
    }

    return user;
  }

  async getProfile(userId: string) {
    return this.validateUser(userId);
  }

  private generateToken(userId: string, email: string): string {
    const payload = { sub: userId, email };

    return this.jwtService.sign(payload, { secret: process.env.JWT_SECRET, expiresIn: "15m" });
  }

  private generateRefreshToken(userId: string, email: string): string {
    const payload = { sub: userId, email };

    return this.jwtService.sign(payload, { secret: process.env.JWT_SECRET });
  }
}
