import { jest, describe, it, expect } from '@jest/globals';

// 1. Define the mock function
const sendMailMock = jest.fn();
// Default behavior: success
(sendMailMock as any).mockResolvedValue({ messageId: 'mock-id' });

// 2. Mock 'nodemailer' before importing the service
jest.unstable_mockModule('nodemailer', () => ({
  default: {
    createTransport: jest.fn().mockReturnValue({
      sendMail: sendMailMock,
    }),
  },
}));

jest.unstable_mockModule('../../config/env.js', () => ({
  config_vars: {
    mail: { provider: 'smtp' },
    email: {
      from: 'no-reply@test.com',
      adminNotify: 'admin@test.com',
      smtp: {
        host: 'localhost',
        port: 587,
        secure: false,
        user: 'user',
        pass: 'pass',
      },
    },
  },
}));

// 3. Import the service (after mocking)
const { mailService } = await import('../../services/mail.service.js');

describe('MailService (Functional)', () => {
  it('sendOtp calls transporter.sendMail', async () => {
    await mailService.sendOtp('test@example.com', '123456');

    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'test@example.com',
        subject: expect.stringContaining('OTP'),
        text: expect.stringContaining('123456'),
      })
    );
  });

  it('sendLeadConfirmation calls transporter.sendMail', async () => {
    await mailService.sendLeadConfirmation('lead@example.com', {
      name: 'John Doe',
      leadId: '123',
      service: 'SOP',
      appUrl: 'http://localhost:3000'
    });

    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'lead@example.com',
        subject: expect.stringContaining('Request Received'),
      })
    );
  });
});
