import nodemailer from 'nodemailer';
import { config_vars } from '../config/env.js';
import { sanitizeText } from '../utils/sanitize.js';
import { logger } from '../config/logger.js';


function createSmtpTransport() {
  return nodemailer.createTransport({
    host: config_vars.email.smtp.host,
    port: config_vars.email.smtp.port,
    secure: config_vars.email.smtp.secure,
    auth: {
      user: config_vars.email.smtp.user,
      pass: config_vars.email.smtp.pass,
    },
  });
}

let transporter: nodemailer.Transporter | null = null;


class MailService {
  private getTransporter() {
    if (config_vars.mail.provider === 'memory') {
      return null;
    }
    if (!transporter) {
      transporter = createSmtpTransport();
    }
    return transporter;
  }

  private async sendMail({ to, subject, text, html }: {
    to: string;
    subject: string;
    text: string;
    html?: string;
  }) {
    const transport = this.getTransporter();
    if (!transport) return;

    try {
      await transport.sendMail({
        from: config_vars.email.from,
        to,
        subject,
        text,
        html,
      });
    } catch (err) {
      logger.error(
        {
          err,
          to,
          subject,
        },
        'MAIL_SEND_FAILED'
      );
    }
  }

  async sendOtp(to: string, otp: string) {
    const subject = 'Password Reset OTP';
    const text = `Your OTP for password reset is: ${otp}

  This OTP is valid for 5 minutes.
  If you did not request this, please ignore this email.`;

    await this.sendMail({ to, subject, text });
  }

  async sendLeadConfirmation(
    to: string,
    vars: {
      name: string;
      leadId: string;
      service: string;
      appUrl: string;
    }
  ) {
    const safeName = sanitizeText(vars.name);
    const safeService = sanitizeText(vars.service);

    const subject = `Request Received — ${safeService}`;

    const text = `Hi ${safeName},

  We received your request for ${safeService}.
  Your Reference ID is: ${vars.leadId}

  Proceed to payment here:
  ${vars.appUrl}/payment?leadId=${vars.leadId}

  Thanks.`;

    const html = `
      <p>Hi ${safeName},</p>
      <p>We received your request for <strong>${safeService}</strong>.</p>
      <p>Your Reference ID is: <strong>${vars.leadId}</strong></p>
      <p>
        <a href="${vars.appUrl}/payment?leadId=${vars.leadId}">
          Click here to complete payment
        </a>
      </p>
      <p>Thanks.</p>
    `;

    await this.sendMail({ to, subject, text, html });
  }

  async sendAdminNotification(vars: {
    transactionId?: string;
    leadId: string;
    appUrl: string;
  }) {
    const subject = `Payment declared for Lead ${vars.leadId}`;

    const text = `Transaction declared.
  Transaction ID: ${sanitizeText(vars.transactionId || 'N/A')}

  Review:
  ${vars.appUrl}/admin/transactions?leadId=${vars.leadId}`;

    await this.sendMail({
      to: config_vars.email.adminNotify,
      subject,
      text,
    });
  }

  async sendUserVerification(
    to: string,
    vars: {
      name: string;
      leadId: string;
      status: 'VERIFIED' | 'REJECTED';
      note?: string;
      appUrl: string;
    }
  ) {
    const safeName = sanitizeText(vars.name);
    const safeNote = vars.note ? sanitizeText(vars.note) : '';

    const subject = `Payment ${vars.status} — Reference ${vars.leadId}`;

    const text = `Hi ${safeName},

  Your payment for reference ${vars.leadId} has been ${vars.status}.
  ${safeNote ? `\nNote from admin: ${safeNote}\n` : ''}
  View details:
  ${vars.appUrl}/leads/${vars.leadId}

  Thanks.`;

    await this.sendMail({ to, subject, text });
  }
}

export const mailService = new MailService();
// Export types
export { MailService }; // Export class type if needed

