export function getPasswordResetTemplate(
  name: string,
  resetUrl: string,
): { subject: string; text: string; html: string } {
  const subject = 'Reset Your Brightloop Password';
  const text = `Hello ${name},\n\nYou requested a password reset for your Brightloop account.\nClick the link below to set a new password:\n\n${resetUrl}\n\nThis link will expire in 15 minutes. If you did not request this, please ignore this email.`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0b0f19; color: #f3f4f6; border-radius: 8px;">
      <h2 style="color: #6366f1;">Brightloop</h2>
      <h3>Password Reset Request</h3>
      <p>Hello ${name},</p>
      <p>We received a request to reset the password for your Brightloop account. Click the button below to choose a new password:</p>
      <div style="margin: 25px 0;">
        <a href="${resetUrl}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      <p style="color: #9ca3af; font-size: 13px;">Or copy and paste this link in your browser:<br/><a href="${resetUrl}" style="color: #818cf8;">${resetUrl}</a></p>
      <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">This link will expire in 15 minutes. If you did not request a password reset, you can safely ignore this email.</p>
    </div>
  `;

  return { subject, text, html };
}
