'use server';

import nodemailer from 'nodemailer';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM_EMAIL } = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: Number(SMTP_PORT) === 465, // true for 465, false for other ports
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});


export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: `IFC Changara <${SMTP_FROM_EMAIL}>`,
    to: email,
    subject: 'Reset Your IFC Changara Password',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Password Reset Request</h2>
        <p>You requested a password reset for your IFC Changara account. Click the button below to set a new password:</p>
        <a href="${resetLink}" style="background-color: #A076F2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request a password reset, you can safely ignore this email.</p>
        <hr/>
        <p>IFC Changara</p>
      </div>
    `,
  };

  try {
    // In a real app, you'd check if the SMTP variables are set.
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
        console.log("SMTP environment variables not set. Logging password reset link to console instead.");
        console.log(`Password reset link for ${email}: ${resetLink}`);
        return;
    }
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent to:', email);
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    // Depending on the desired behavior, you might want to throw the error
    // or handle it gracefully, maybe by falling back to console logging.
    throw new Error('Could not send password reset email.');
  }
}
