import * as nodemailer from "nodemailer";
import * as Handlebars from "handlebars";
import * as path from "path";
import * as fs from "fs";

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private templates: Record<string, Handlebars.TemplateDelegate> = {};

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get("SMTP_HOST"),
      port: this.configService.get("SMTP_PORT"),
      secure: this.configService.get("SMTP_SECURE") === "true",
      auth: {
        user: this.configService.get("SMTP_USER"),
        pass: this.configService.get("SMTP_PASS"),
      },
    });

    const tmplDir = path.join(__dirname, "templates");
    const files = ["welcome.hbs"];
    files.forEach((file) => {
      const source = fs.readFileSync(path.join(tmplDir, file), "utf-8");
      this.templates[file.replace(".hbs", "")] = Handlebars.compile(source);
    });
  }

  async sendWelcome(user: { id: string; fullName: string; email: string }) {
    const html = this.templates["welcome"]({
      fullName: user.fullName,
      appUrl: this.configService.get("APP_URL"),
      currentYear: new Date().getFullYear(),
      unsubscribeToken: this.makeUnsubscribeToken(user.id, user.email),
    });

    await this.transporter.sendMail({
      from: `"Catat.in" <${this.configService.get("SMTP_FROM")}>`,
      to: user.email,
      subject: "Selamat datang di Catat.in!",
      html,
    });
  }

  private makeUnsubscribeToken(userId: string, email: string): string {
    // simple JWT – you can replace with your own JWT service
    const jwt = require("jsonwebtoken");
    return jwt.sign({ userId, email }, this.configService.get("JWT_SECRET"), { expiresIn: "30d" });
  }
}
