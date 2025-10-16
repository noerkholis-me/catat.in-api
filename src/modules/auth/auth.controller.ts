import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "./decorators/public.decorator";
import { RegisterDto } from "./dto/register.dto";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { CurrentUser } from "./decorators/current-user.decorator";

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
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Get user profile" })
  @UseGuards(JwtAuthGuard)
  @Get("profile")
  async getProfile(@CurrentUser("id") userId: string) {
    return this.authService.getProfile(userId);
  }

  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Get current user" })
  @UseGuards(JwtAuthGuard)
  @Get("me")
  async getCurrentUser(@CurrentUser() user: any) {
    return { user };
  }
}
