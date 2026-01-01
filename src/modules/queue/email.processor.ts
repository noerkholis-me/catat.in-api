import { Process, Processor } from "@nestjs/bull";
import { EmailService } from "../email/email.service";
import { PrismaService } from "@/prisma/prisma.service";
import { Job } from "bull";

@Processor("email")
export class EmailProcessor {
  constructor(
    private emailService: EmailService,
    private prisma: PrismaService,
  ) {}

  @Process("welcome")
  async handleWelcome(job: Job<{ userId: string }>) {
    const { userId } = job.data;
    const user = await this.prisma.user.findUnique({ where: { id: userId, deletedAt: null } });
    if (!user.notificationEmail) return;

    try {
      await this.emailService.sendWelcome({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      });

      this.logEmail({ userId: user.id, type: "welcome", status: "sent" });
    } catch (error: any) {
      this.logEmail({ userId: user.id, type: "welcome", status: "sent", error: error.message });
      throw error;
    }
  }

  private async logEmail(dto: LogEmailDto) {
    await this.prisma.emailLog.create({
      data: {
        userId: dto.userId,
        emailType: dto.type,
        status: dto.status,
        subject: dto.status === "sent" ? undefined : `Failed: ${dto.type}`,
      },
    });
  }
}
