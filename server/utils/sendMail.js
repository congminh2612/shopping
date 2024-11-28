const nodemailer = require("nodemailer");
require("dotenv").config();

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
          </div>
        </div>
      `;
    } else if (type === "passwordReset") {
      const resetLink = `${process.env.BASE_URL}/reset-password/${data.token}`;
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
          </div>
        </div>
      `;
    } else if (type === "orderConfirmation") {
      subject = `Order Confirmation - Thank you for your purchase!`;

      // Thêm kiểm tra và xử lý dữ liệu mặc định
      const items = Array.isArray(data.items) ? data.items : [];
      const itemsHtml =
        items.length > 0
          ? items
              .map(
                (item) => `
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
                  item.productName || "Unknown Product"
                }</td>
                <td style="padding: 8px; text-align: center; border-bottom: 1px solid #ddd;">${
                  item.quantity || 0
                }</td>
                <td style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">${
                  item.priceAtPurchase || 0
                }₫</td>
              </tr>
            `
              )
              .join("")
          : `<tr><td colspan="3" style="text-align: center; padding: 8px;">No items available</td></tr>`;

      htmlContent = `
        <div style="font-family: Arial, sans-serif; background-color: #F6F8FA; padding: 40px; text-align: left;">
          <div style="max-width: 400px; margin: auto; text-align: left; background-color: #ffffff; padding: 20px; box-shadow: 0px 4px 6px rgba(0,0,0,0.1);">
            <h2 style="font-size: 20px; color: #000; margin-bottom: 20px;">Order Confirmation</h2>
            <p style="font-size: 14px; line-height: 1.5; color: #000; margin-bottom: 20px;">Thank you for your order! Here are the details of your purchase:</p>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr>
                  <th style="text-align: left; border-bottom: 2px solid #ddd; padding: 8px;">Product</th>
                  <th style="text-align: center; border-bottom: 2px solid #ddd; padding: 8px;">Quantity</th>
                  <th style="text-align: right; border-bottom: 2px solid #ddd; padding: 8px;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding: 8px; text-align: right; font-weight: bold; border-top: 2px solid #ddd;">Total:</td>
                  <td style="padding: 8px; text-align: right; font-weight: bold; border-top: 2px solid #ddd;">${
                    data.totalPrice || 0
                  }₫</td>
                </tr>
              </tfoot>
            </table>
            <p style="font-size: 14px; line-height: 1.5; color: #000;">
              Your order will be shipped to:
            </p>
            <p style="font-size: 14px; color: #000;">
              <strong>${data.customerName || "Unknown Name"}</strong><br>${
        data.customerAddress || "Unknown Address"
      }<br>${data.customerPhone || "Unknown Phone"}
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
