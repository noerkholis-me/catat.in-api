import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { EmailController } from "./email.controller";
import { ConfigService } from "@nestjs/config";
import * as path from "path";

@Module({
  controllers: [EmailController],
  providers: [EmailService, ConfigService],
  exports: [EmailService],
})
export class EmailModule {}
