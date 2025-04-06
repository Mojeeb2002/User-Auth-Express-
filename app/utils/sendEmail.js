import nodemailer from 'nodemailer';
import { GMAIL_PASS, GMAIL_USER, APP_URL } from '../config/env.js';


export const sendEmail = async (email, username, token) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS,
    },
  });

  const verificationLink = `${APP_URL}/api/auth/verify-email/${token}`;

  // Define the email content with inline styles or external styles
  const emailHtml = `
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f9;
                        color: #333;
                        padding: 20px;
                    }
                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: white;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }
                    h2 {
                        color:rgb(0, 0, 0);
                    }
                    .btn {
                        display: inline-block;
                        background-color: rgb(0, 0, 0);
                        color: rgb(255, 255, 255);
                        font-size: 16px;
                        padding: 10px 20px;
                        text-decoration: none;
                        border-radius: 5px;
                    }
                    .footer {
                        margin-top: 20px;
                        font-size: 12px;
                        color: #888;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Welcome, ${username}!</h2>
                    <p>Thank you for registering. To verify your email, click the button below:</p>
                    <a href="${verificationLink}" class="btn">Verify Email</a>
                    <p class="footer">If you did not register, please ignore this email.</p>
                </div>
            </body>
        </html>
    `;

  const mailOptions = {
    from: GMAIL_USER,
    to: email,
    subject: "Email Verification",
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};


export const sendPasswordResetEmail = async (email, username, code) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS,
    },
  });

  // Define the email content with inline styles or external styles
  const emailHtml = `
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f9;
                        color: #333;
                        padding: 20px;
                    }
                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: white;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }
                    h2 {
                        color:rgb(0, 0, 0);
                    }
                    .btn {
                        display: inline-block;
                        background-color: rgb(0, 0, 0);
                        color: rgb(255, 255, 255);
                        font-size: 16px;
                        padding: 10px 20px;
                        text-decoration: none;
                        border-radius: 5px;
                    }
                    .footer {
                        margin-top: 20px;
                        font-size: 12px;
                        color: #888;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Welcome, ${username}!</h2>
                    <p>To reset your password, Use the code below:</p>
                    <h1>${code}</h1>
                    <p class="footer">If you did not requiest password reset, please ignore this email.</p>
                </div>
            </body>
        </html>
    `;

  const mailOptions = {
    from: GMAIL_USER,
    to: email,
    subject: "Password Reset",
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};