import nodemailer from "nodemailer";
import { configDotenv } from "dotenv";
configDotenv();

export const SendMail = async (userEmail, code) => {
  const transporter = nodemailer.createTransport({
    // Using host instead of "service" gives you more control over the connection
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    // Force IPv4 to prevent the ECONNREFUSED (2a00:1450...) error
    family: 4, 
    auth: {
      user: process.env.Email_user,
      pass: process.env.EMail_pass
    },
    // Optional: Only use this if you still get "self-signed certificate" errors
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOption = {
    from: `"Ethio Store" <${process.env.Email_user}>`, // Format: "Name" <email@gmail.com>
    to: userEmail,
    subject: "Ethio Store Verification Code",
    text: `Your code is ${code}. It expires in 10 minutes.`,
    html: `<b>Your verification code is: ${code}</b>`
  };

  try {
    const info = await transporter.sendMail(mailOption);
    console.log("Email sent: " + info.response);
    return info;
  } catch (error) {
    console.error("Mail Error:", error);
    throw error; // Let the calling function handle the UI error message
  }
};