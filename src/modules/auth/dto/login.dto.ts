import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: "noerkholis@gmail.com", description: "Email user" })
  @IsEmail({}, { message: "Email tidak valid" })
  email: string;

  @ApiProperty({ example: "catat.in-nurkholis25", description: "Password user" })
  @IsString()
  password: string;
}
