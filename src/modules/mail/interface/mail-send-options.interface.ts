export interface SendMailOptions {
  to: string | string[];
  subject: string;
  template?: string;
  context?: Record<string, any>;
  html?: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    path?: string;
    content?: Buffer | string;
  }>;
}
