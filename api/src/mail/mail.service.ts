import { Injectable, Logger } from '@nestjs/common';
import { getPasswordResetTemplate } from './templates/password-reset.template';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  async sendPasswordResetEmail(
    email: string,
    name: string,
    resetUrl: string,
  ): Promise<void> {
    const { subject } = getPasswordResetTemplate(name, resetUrl);

    // In development / local testing, log securely so developer can click the link
    this.logger.log(`📧 [EMAIL TO: ${email}] Subject: "${subject}"`);
    this.logger.log(`🔗 Password Reset URL: ${resetUrl}`);

    // In production, plug in Resend, AWS SES, or Nodemailer SMTP here
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    this.logger.log(
      `📧 [WELCOME EMAIL TO: ${email}] Welcome to Brightloop, ${name}!`,
    );
  }
}
