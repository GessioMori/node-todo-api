import { SES } from "aws-sdk";
import nodemailer, { Transporter } from "nodemailer";
import { injectable } from "tsyringe";
import { IEmailProvider } from "../IEmailProvider";

@injectable()
export class EtherealMailProvider implements IEmailProvider {
  private client: Transporter;

  constructor() {
    this.client = nodemailer.createTransport({
      SES: new SES({
        apiVersion: "2010-12-01",
        region: process.env.AWS_REGION,
      }),
    });
  }

  async sendMail(to: string, subject: string, body: string): Promise<void> {
    await this.client.sendMail({
      to,
      from: "Dotos! <mailer@dotos.tech>",
      subject,
      text: body,
      html: body,
    });
  }
}
