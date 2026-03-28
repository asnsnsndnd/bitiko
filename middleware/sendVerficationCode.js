import nodemailer from "nodemailer";
import { configDotenv } from "dotenv";
configDotenv();

export const SendMail = (userEmail, code) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      host: "74.125.136.108", // IPv4 address of smtp.gmail.com
      port: 465,
      secure: true,
      auth: {
        // በ Render Dashboard ላይ ያሉት ስሞች Case-sensitive መሆናቸውን አረጋግጥ
        user: process.env.Email_user, 
        pass: process.env.EMail_pass  // እዚህ ጋር የግድ 16 ዲጂት App Password ተጠቀም
      },
      tls: {
        rejectUnauthorized: false,
        servername: 'smtp.gmail.com'
      }
    });

    const mailOption = {
      from: `"Ethio Store" <${process.env.Email_user}>`,
      to: userEmail,
      subject: "Ethio Store Verification Code",
      text: `Your code is ${code}. It expires in 10 minutes.`,
      html: `<b>Your verification code is: ${code}</b>`
    };

    // በ Callback መልክ መጠቀም በ Production ላይ ስህተትን ይቀንሳል
    transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        console.error("Mail Error:", error);
        return reject(error);
      }
      console.log("Email sent: " + info.response);
      resolve(info);
    });
  });
};