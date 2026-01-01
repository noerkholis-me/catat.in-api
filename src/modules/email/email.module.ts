import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { EmailController } from "./email.controller";
import { ConfigService } from "@nestjs/config";
import { QueueModule } from "../queue/queue.module";

@Module({
  imports: [QueueModule],
  // controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
