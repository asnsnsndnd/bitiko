import nodemailer from "nodemailer";
import { configDotenv } from "dotenv";
configDotenv();

export const SendMail = async (userEmail, code) => {
  const transporter = nodemailer.createTransport({
  // ቀጥታ የ IPv4 አድራሻ በመጠቀም IPv6ን መዝለል ይቻላል
  host: "74.125.136.108", // ይህ የ smtp.gmail.com IPv4 አድራሻ ነው
  port: 465,
  secure: true,
  auth: {
    user: process.env.Email_user,
    pass: process.env.EMail_pass
  },
  tls: {
    //
    rejectUnauthorized: false,
    servername: 'smtp.gmail.com' 
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