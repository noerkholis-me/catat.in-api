export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    avatarUrl?: string;
    currentStreak: number;
    longestStreak: number;
  };
}
