import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

let transporter: nodemailer.Transporter | null = null;

// Initializing the transporter lazily so it doesn't block startup or throw async errors during initialization
const getTransporter = async () => {
  if (transporter) return transporter;

  const hasSMTPConfig =
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS;

  if (hasSMTPConfig) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log("📨 Mailer initialized with custom SMTP configuration.");
  } else {
    // Fallback: Create Ethereal test account for development
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log(`📨 Mailer initialized with Ethereal fallback.\n  User: ${testAccount.user}\n  Pass: ${testAccount.pass}`);
    } catch (err) {
      console.error("❌ Failed to initialize Ethereal mailer fallback:", err);
      // Create a dummy transporter so the app doesn't crash on email dispatches
      transporter = nodemailer.createTransport({
        streamConfig: true,
      } as any);
    }
  }

  return transporter;
};

// Send general email
export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const client = await getTransporter();
    const info = await client.sendMail({
      from: `"Ramana Jewells" <${process.env.SMTP_FROM || "no-reply@ramanajewells.com"}>`,
      to,
      subject,
      html,
    });

    console.log(`✉️ Email sent to ${to}: ${info.messageId}`);
    const testUrl = nodemailer.getTestMessageUrl(info);
    if (testUrl) {
      console.log(`🔗 Preview URL: ${testUrl}`);
    }
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    // Silent fail in development, do not crash checkout / request
  }
};

// 1. Password Reset Email Template
export const sendResetPasswordEmail = async (email: string, token: string) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #C9A227; text-align: center;">Ramana Jewells</h2>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <p>Hello,</p>
      <p>We received a request to reset your password. You can do so by clicking the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #C9A227; color: #1a1a2e; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      <p>If you did not request this reset, you can safely ignore this email. The link will expire in 30 minutes.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #666; text-align: center;">This is an automated message from Ramana Jewells.</p>
    </div>
  `;

  await sendEmail(email, "Reset Your Password - Ramana Jewells", html);
};

// 2. Order Invoice Email Template
export const sendOrderInvoiceEmail = async (order: any, customerEmail: string) => {
  const itemsHtml = order.items
    .map(
      (item: any) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} ${item.variant ? `(${item.variant})` : ""}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.qty}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toLocaleString("en-IN")}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price * item.qty).toLocaleString("en-IN")}</td>
    </tr>
  `
    )
    .join("");

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; color: #333;">
      <h2 style="color: #C9A227; text-align: center; margin-bottom: 5px;">Order Confirmed</h2>
      <p style="text-align: center; color: #666; font-size: 14px; margin-top: 0;">Order #${order.orderNumber}</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <p>Hello,</p>
      <p>Thank you for shopping with Ramana Jewells. Your order has been successfully placed and is now being processed.</p>
      
      <h4 style="margin-bottom: 10px;">Order Details</h4>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <thead>
          <tr style="background-color: #fcf9f2; color: #1a1a2e;">
            <th style="padding: 10px; text-align: left; border-bottom: 1.5px solid #C9A227;">Item</th>
            <th style="padding: 10px; text-align: center; border-bottom: 1.5px solid #C9A227;">Qty</th>
            <th style="padding: 10px; text-align: right; border-bottom: 1.5px solid #C9A227;">Price</th>
            <th style="padding: 10px; text-align: right; border-bottom: 1.5px solid #C9A227;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <table style="width: 100%; font-size: 14px; margin-top: 20px; border-collapse: collapse;">
        <tr>
          <td style="padding: 5px 10px; text-align: right; color: #666;">Subtotal:</td>
          <td style="padding: 5px 10px; text-align: right; font-weight: 500; width: 120px;">₹${order.subtotal.toLocaleString("en-IN")}</td>
        </tr>
        <tr>
          <td style="padding: 5px 10px; text-align: right; color: #666;">Shipping:</td>
          <td style="padding: 5px 10px; text-align: right; font-weight: 500;">${order.shippingFee === 0 ? "FREE" : `₹${order.shippingFee.toLocaleString("en-IN")}`}</td>
        </tr>
        <tr>
          <td style="padding: 5px 10px; text-align: right; color: #666;">GST (3%):</td>
          <td style="padding: 5px 10px; text-align: right; font-weight: 500;">₹${order.tax.toLocaleString("en-IN")}</td>
        </tr>
        <tr style="border-top: 1.5px solid #eee;">
          <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 16px; color: #1a1a2e;">Total:</td>
          <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 16px; color: #C9A227;">₹${order.total.toLocaleString("en-IN")}</td>
        </tr>
      </table>

      <div style="margin-top: 20px; background-color: #fcf9f2; padding: 15px; border-radius: 4px; font-size: 13px;">
        <h5 style="margin: 0 0 5px 0; color: #1a1a2e;">Delivery Address:</h5>
        <p style="margin: 0; color: #555;">
          ${order.shippingAddress.street}<br/>
          ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pin}
        </p>
      </div>

      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #666; text-align: center;">We will send another update once your package has been shipped.</p>
    </div>
  `;

  await sendEmail(customerEmail, `Your Invoice for Order #${order.orderNumber} - Ramana Jewells`, html);
};

// 3. Tracking Update Email Template
export const sendTrackingUpdateEmail = async (order: any, customerEmail: string) => {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; color: #333;">
      <h2 style="color: #C9A227; text-align: center; margin-bottom: 5px;">Your Order Has Shipped!</h2>
      <p style="text-align: center; color: #666; font-size: 14px; margin-top: 0;">Order #${order.orderNumber}</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <p>Hello,</p>
      <p>Good news! Your order from Ramana Jewells has been packed and handed over to our courier partner.</p>
      
      <div style="background-color: #fcf9f2; padding: 20px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #C9A227;">
        <h4 style="margin: 0 0 10px 0; color: #1a1a2e;">Shipment Information</h4>
        <p style="margin: 5px 0; font-size: 14px;"><strong>Courier Partner:</strong> ${order.courierPartner || "Standard Express"}</p>
        <p style="margin: 5px 0; font-size: 14px;"><strong>Tracking ID:</strong> <span style="font-family: monospace; font-size: 15px; color: #C9A227;">${order.trackingId}</span></p>
        ${order.trackingLink ? `<div style="margin-top: 15px;"><a href="${order.trackingLink}" style="background-color: #C9A227; color: #1a1a2e; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-weight: bold; display: inline-block; font-size: 14px;">Track Your Package</a></div>` : ''}
      </div>

      <p>Please note that it might take 24-48 hours for the tracking information to update on the courier portal.</p>
      
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #666; text-align: center;">If you have any questions, feel free to contact our customer support team.</p>
    </div>
  `;

  await sendEmail(customerEmail, `Your Order #${order.orderNumber} Has Shipped - Ramana Jewells`, html);
};
