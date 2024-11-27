const nodemailer = require("nodemailer");
require("dotenv").config();

// BASE SEND MAIL FORM
// const sendMail = async (to, type, data) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     let subject, htmlContent;

//     if (type === "verification") {
//       subject = "Your Verification Code";
//       htmlContent = `
//         <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
//           <h2 style="color: #007aff;">Your Verification Code</h2>
//           <p style="font-size: 16px;">Your verification code is:</p>
//           <p style="font-size: 24px; font-weight: bold; color: #007aff;">${data.code}</p>
//           <p style="font-size: 14px; color: #666;">This code will expire in 15 minutes.</p>
//         </div>
//       `;
//     } else if (type === "passwordReset") {
//       const BASE_URL = process.env.BASE_URL;
//       const resetLink = `${BASE_URL}/reset-password/${data.token}`;
//       subject = "Reset Your Password";
//       htmlContent = `
//         <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
//           <h2 style="color: #007aff;">Password Reset Request</h2>
//           <p style="font-size: 16px;">You have requested to reset your password.</p>
//           <p style="font-size: 14px;">Click the link below to reset your password:</p>
//           <a href="${resetLink}" style="font-size: 16px; color: #007aff;">Reset Password</a>
//           <p style="font-size: 14px; color: #666;">If you did not request this, you can ignore this email.</p>
//         </div>
//       `;
//     } else {
//       throw new Error("Invalid email type provided");
//     }
//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to,
//       subject,
//       html: htmlContent,
//     });

//     console.log(`Email sent successfully to ${to}`);
//   } catch (error) {
//     console.error("Error sending email:", error.message);
//     throw new Error("Failed to send email");
//   }
// };

const sendMail = async (to, type, data) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let subject, htmlContent;

    if (type === "verification") {
      subject = `${data.code} is your SPOL verification code`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; background-color: #F6F8FA; padding: 40px; text-align: left;">
          <div style="max-width: 400px; margin: auto; text-align: left; background-color: #ffffff; padding: 20px; box-shadow: 0px 4px 6px rgba(0,0,0,0.1);">
            <h2 style="font-size: 20px; color: #000; margin-bottom: 20px;">Confirm your email address</h2>
            <p style="font-size: 14px; line-height: 1.5; color: #000; margin-bottom: 20px;">
              There's one quick step you need to complete before creating your SPOL account. Let's make sure this is the right email address for you — please confirm this is the right address to use for your new account.
            </p>
            <p style="font-size: 24px; font-weight: bold; color: #000; margin-bottom: 20px;">${data.code}</p>
            <p style="font-size: 12px; color: #666; margin-bottom: 20px;">Verification codes expire after two hours.</p>
            <p style="font-size: 14px; color: #000;">Thanks,<br>SPOL</p>
            <div style="border-top: 1px solid #ddd; margin: 20px 0;"></div>
            <p style="font-size: 12px; color: #999; margin-bottom: 5px;">SPOL Corp. 69/68 Dang Thuy Tram, Ward 13, Binh Thanh, HCM</p>
            <p style="font-size: 12px; color: #999;">
              <a href="https://example.com/help" style="color: inherit; text-decoration: none;">Help</a> | 
              <a href="https://example.com/security" style="color: inherit; text-decoration: none;">Email security tips</a>
            </p>
          </div>
        </div>
      `;
    } else if (type === "passwordReset") {
      const BASE_URL = process.env.BASE_URL;
      const resetLink = `${BASE_URL}/reset-password/${data.token}`;
      subject = "Reset Your Password";
      htmlContent = `
        <div style="font-family: Arial, sans-serif; background-color: #F6F8FA; padding: 40px; text-align: left;">
          <div style="max-width: 400px; margin: auto; text-align: left; background-color: #ffffff; padding: 20px; box-shadow: 0px 4px 6px rgba(0,0,0,0.1);">
            <h2 style="font-size: 20px; color: #000; margin-bottom: 20px;">Reset Your Password</h2>
            <p style="font-size: 14px; line-height: 1.5; color: #000; margin-bottom: 20px;">
              You have requested to reset your password. Click the link below to set a new password:
            </p>
            <a href="${resetLink}" style="display: inline-block; font-size: 16px; color: #ffffff; background-color: #000; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin-bottom: 20px;">Reset Password</a>
            <p style="font-size: 12px; color: #666; margin-bottom: 20px;">If you did not request this, you can safely ignore this email.</p>
            <p style="font-size: 14px; color: #000;">Thanks,<br>SPOL</p>
            <div style="border-top: 1px solid #ddd; margin: 20px 0;"></div>
            <p style="font-size: 12px; color: #999; margin-bottom: 5px;">SPOL Corp. 69/68 Dang Thuy Tram, Ward 13, Binh Thanh, HCM</p>
            <p style="font-size: 12px; color: #999;">
              <a href="https://example.com/help" style="color: inherit; text-decoration: none;">Help</a> | 
              <a href="https://example.com/security" style="color: inherit; text-decoration: none;">Email security tips</a>
            </p>
          </div>
        </div>
      `;
    } else {
      throw new Error("Invalid email type provided");
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent,
    });

    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Failed to send email");
  }
};

module.exports = sendMail;
