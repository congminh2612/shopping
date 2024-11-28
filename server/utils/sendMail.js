const nodemailer = require("nodemailer");
require("dotenv").config();

// Hàm gửi email
const sendMail = async (to, type, data) => {
  try {
    // Kiểm tra email người nhận
    if (!to) {
      throw new Error("No recipient email defined");
    }

    // Cấu hình transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // Hoặc "smtp.gmail.com" nếu cấu hình thủ công
      auth: {
        user: process.env.EMAIL_USER, // Email gửi
        pass: process.env.EMAIL_PASS, // Mật khẩu hoặc App Password của email
      },
    });

    let subject, htmlContent;

    // Tùy loại email để tạo nội dung
    if (type === "orderConfirmation") {
      subject = "Order Confirmation";
      htmlContent = `
        <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
          <h2 style="color: #007aff;">Thank you for your order!</h2>
          <p style="font-size: 16px;">Your order ID: <strong>${data.orderId}</strong></p>
          <p style="font-size: 16px;">Total Amount: <strong>$${data.totalAmount}</strong></p>
          <p style="font-size: 14px; color: #666;">We appreciate your business and hope you enjoy your purchase!</p>
          <div style="margin-top: 20px;">
            <a href="https://yourshop.example.com/orders/${data.orderId}" 
              style="display: inline-block; background-color: #007aff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Order</a>
          </div>
        </div>
      `;
    } else if (type === "passwordReset") {
      const resetLink = `${process.env.BASE_URL}/reset-password/${data.token}`;
      subject = "Password Reset Request";
      htmlContent = `
        <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
          <h2 style="color: #007aff;">Password Reset Request</h2>
          <p style="font-size: 16px;">You have requested to reset your password.</p>
          <p style="font-size: 14px; color: #666;">Click the link below to reset your password:</p>
          <div style="margin-top: 20px;">
            <a href="${resetLink}" 
              style="display: inline-block; background-color: #007aff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
          </div>
          <p style="font-size: 12px; color: #666; margin-top: 10px;">If you did not request this, you can safely ignore this email.</p>
        </div>
      `;
    } else {
      throw new Error("Invalid email type provided");
    }

    // Log email đang gửi
    console.log("Sending email to:", to);

    // Gửi email
    await transporter.sendMail({
      from: `"Your Shop" <${process.env.EMAIL_USER}>`, // Tên shop
      to, // Email người nhận
      subject,
      html: htmlContent,
    });

    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error; // Ném lỗi để Controller xử lý
  }
};

module.exports = sendMail;
