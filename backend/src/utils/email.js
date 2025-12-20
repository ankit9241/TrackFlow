import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendEmail = async ({ to, subject, html }) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('ERROR: EMAIL_USER or EMAIL_PASS not set in environment variables');
        throw new Error('Email credentials not configured');
    }

    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to,
            subject,
            html,
        };
        console.log(`Attempting to send email to: ${to}`);
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return info;
    } catch (error) {
        console.error('Nodemailer Error Details:', {
            message: error.message,
            code: error.code,
            command: error.command,
            response: error.response,
        });
        throw error;
    }
};

export const sendVerificationEmail = async (email, token) => {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            .container { font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f9fafb; }
            .card { background: white; padding: 40px; border-radius: 24px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); border: 1px solid #f3f4f6; }
            .logo { color: #059669; font-size: 24px; font-weight: 800; margin-bottom: 24px; text-align: center; letter-spacing: -0.5px; }
            .title { font-size: 28px; font-weight: 700; color: #111827; margin-bottom: 16px; text-align: center; }
            .text { font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 32px; text-align: center; }
            .btn { display: block; width: fit-content; margin: 0 auto 32px; padding: 16px 32px; background-color: #059669; color: white !important; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; transition: background-color 0.2s; box-shadow: 0 4px 6px -1px rgba(5, 150, 105, 0.2); }
            .footer { font-size: 13px; color: #9ca3af; text-align: center; margin-top: 32px; line-height: 1.5; }
            .link { color: #059669; text-decoration: none; word-break: break-all; font-size: 14px; }
            .divider { border: 0; border-top: 1px solid #f3f4f6; margin: 32px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="card">
                <div class="logo">Track<span style="color: #10b981;">Flow</span></div>
                <h1 class="title">Verify your email</h1>
                <p class="text">Welcome to TrackFlow! We're excited to help you build lasting habits. Please click the button below to secure your account and get started.</p>
                
                <a href="${verificationUrl}" class="btn">Confirm Email Address</a>
                
                <div class="divider"></div>
                
                <p class="footer">
                    If you didn't create an account, you can safely ignore this email.<br><br>
                    Or copy this link:<br>
                    <a href="${verificationUrl}" class="link">${verificationUrl}</a>
                </p>
            </div>
        </div>
    </body>
    </html>
  `;

    return sendEmail({
        to: email,
        subject: 'Confirm your TrackFlow Account',
        html,
    });
};

export const sendContactEmail = async (contactData) => {
    const { name, email, subject, message } = contactData;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            .container { font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f9fafb; }
            .card { background: white; padding: 40px; border-radius: 24px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); border: 1px solid #f3f4f6; }
            .logo { color: #059669; font-size: 24px; font-weight: 800; margin-bottom: 24px; text-align: center; letter-spacing: -0.5px; }
            .label { font-size: 12px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
            .value { font-size: 16px; color: #111827; margin-bottom: 20px; font-weight: 500; }
            .message-box { background-color: #f9fafb; padding: 20px; border-radius: 16px; border: 1px solid #f3f4f6; color: #4b5563; line-height: 1.6; margin-top: 10px; }
            .title { font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 24px; text-align: center; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="card">
                <div class="logo">Track<span style="color: #10b981;">Flow</span></div>
                <h1 class="title">New Inquiry</h1>
                
                <div class="label">From</div>
                <div class="value">${name} (${email})</div>
                
                <div class="label">Subject</div>
                <div class="value">${subject}</div>
                
                <div class="label">Message</div>
                <div class="message-box">${message}</div>
            </div>
        </div>
    </body>
    </html>
  `;

    return sendEmail({
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: `[Contact Form] ${subject}`,
        html,
    });
};

export const sendWelcomeEmail = async (email) => {
    const loginUrl = `${process.env.CLIENT_URL}/login`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            .container { font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f9fafb; }
            .card { background: white; padding: 40px; border-radius: 24px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); border: 1px solid #f3f4f6; }
            .logo { color: #059669; font-size: 24px; font-weight: 800; margin-bottom: 24px; text-align: center; letter-spacing: -0.5px; }
            .title { font-size: 28px; font-weight: 700; color: #111827; margin-bottom: 16px; text-align: center; }
            .text { font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 32px; text-align: center; }
            .btn { display: block; width: fit-content; margin: 0 auto 32px; padding: 16px 32px; background-color: #059669; color: white !important; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; transition: background-color 0.2s; box-shadow: 0 4px 6px -1px rgba(5, 150, 105, 0.2); }
            .footer { font-size: 13px; color: #9ca3af; text-align: center; margin-top: 32px; line-height: 1.5; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="card">
                <div class="logo">Track<span style="color: #10b981;">Flow</span></div>
                <h1 class="title">Access Granted!</h1>
                <p class="text">Your account is now fully verified. You have full access to all TrackFlow features. Start building your winning streaks today!</p>
                
                <a href="${loginUrl}" class="btn">Go to Dashboard</a>
                
                <p class="footer">
                    Welcome to the community! We're glad to have you.<br>
                    — The TrackFlow Team
                </p>
            </div>
        </div>
    </body>
    </html>
  `;

    return sendEmail({
        to: email,
        subject: 'Welcome to TrackFlow - Access Granted!',
        html,
    });
};

export const sendPasswordResetEmail = async (email, resetToken) => {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .card { background: white; border-radius: 16px; padding: 48px 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
            .logo { font-size: 28px; font-weight: 700; text-align: center; margin-bottom: 32px; color: #0f172a; }
            .title { font-size: 24px; font-weight: 700; color: #0f172a; text-align: center; margin-bottom: 16px; }
            .text { font-size: 16px; color: #64748b; line-height: 1.6; text-align: center; margin-bottom: 32px; }
            .btn { display: block; width: fit-content; margin: 0 auto 32px; padding: 16px 32px; background-color: #059669; color: white !important; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; transition: background-color 0.2s; box-shadow: 0 4px 6px -1px rgba(5, 150, 105, 0.2); }
            .warning { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 8px; margin: 24px 0; }
            .warning-text { font-size: 14px; color: #92400e; margin: 0; }
            .footer { font-size: 13px; color: #9ca3af; text-align: center; margin-top: 32px; line-height: 1.5; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="card">
                <div class="logo">Track<span style="color: #10b981;">Flow</span></div>
                <h1 class="title">Reset Your Password</h1>
                <p class="text">We received a request to reset your password. Click the button below to create a new password.</p>
                
                <a href="${resetUrl}" class="btn">Reset Password</a>
                
                <div class="warning">
                    <p class="warning-text"><strong>⚠️ Security Notice:</strong> This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
                </div>
                
                <p class="footer">
                    If the button doesn't work, copy and paste this link:<br>
                    <a href="${resetUrl}" style="color: #10b981; word-break: break-all;">${resetUrl}</a><br><br>
                    — The TrackFlow Team
                </p>
            </div>
        </div>
    </body>
    </html>
  `;

    return sendEmail({
        to: email,
        subject: 'Reset Your TrackFlow Password',
        html,
    });
};
