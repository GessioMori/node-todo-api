import { IEmailProvider } from "@shared/providers/emailProvider/IEmailProvider";

interface IMessage {
  to: string;
  subject: string;
  body: string;
}

export class EmailProviderInMemory implements IEmailProvider {
  private message: IMessage[] = [];

  async sendMail(to: string, subject: string, body: string): Promise<void> {
    this.message.push({
      to,
      subject,
      body,
    });
  }
}
