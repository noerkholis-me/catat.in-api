export class AuthResponseDto {
  accessToken: Promise<string>;
  refreshToken: Promise<string>;
  user: {
    id: string;
    email: string;
    fullName: string;
    avatarUrl?: string;
    currentStreak: number;
    longestStreak: number;
  };
}
