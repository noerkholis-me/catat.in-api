import { Body, Controller, Get, Post, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "./decorators/public.decorator";
import { RegisterDto } from "./dto/register.dto";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { CurrentUser } from "./decorators/current-user.decorator";
import { Response } from "express";
import { RefreshJwtAuthGuard } from "./guards/refresh-jwt-auth.guard";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: "Register new user" })
  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @ApiOperation({ summary: "Login user" })
  @Post("login")
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const { accessToken, refreshToken, user } = await this.authService.login(loginDto);

    response.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 15, // 15 mins
    });

    response.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { user };
  }

  @ApiOperation({ summary: "Refresh token" })
  @UseGuards(RefreshJwtAuthGuard)
  @Post("refresh")
  async refresh(@CurrentUser("id") userId: string, @Res({ passthrough: true }) response: Response) {
    const { accessToken } = await this.authService.refresh(userId);

    response.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 15, // 15 mins
    });

    return { message: "Token refreshed" };
  }

  @ApiOperation({ summary: "Logout" })
  @UseGuards(JwtAuthGuard)
  @Post("logout")
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return { message: "Logged out" };
  }

  @ApiOperation({ summary: "Get user profile" })
  @UseGuards(JwtAuthGuard)
  @Get("profile")
  async getProfile(@CurrentUser("id") userId: string) {
    return this.authService.getProfile(userId);
  }

  @ApiOperation({ summary: "Get current user" })
  @UseGuards(JwtAuthGuard)
  @Get("me")
  async getCurrentUser(@CurrentUser() user: any) {
    return { user };
  }
}
