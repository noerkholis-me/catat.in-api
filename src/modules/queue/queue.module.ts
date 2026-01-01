import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { EmailProcessor } from "./email.processor";
import { EmailService } from "../email/email.service";

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get("REDIS_HOST") || "localhost",
          port: configService.get("REDIS_PORT") || 6379,
          password: configService.get("REDIS_PASSWORD") || undefined,
        },
      }),
    }),

    BullModule.registerQueue({
      name: "email",
    }),
  ],
  providers: [EmailProcessor, EmailService],
  exports: [BullModule],
})
export class QueueModule {}
