export const SendMail = async (userEmail, code) => {
  return new Promise((resolve, reject) => { // አዲሱ አወቃቀር
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.Email_user,
        pass: process.env.EMail_pass
      }
    });

    const mailOption = {
      from: process.env.Email_user,
      to: userEmail,
      subject: "Verification Code",
      text: `Your code is ${code}`
    };

    transporter.sendMail(mailOption, (err, info) => {
      if (err) {
        console.error("Mail Error:", err);
        return reject(err); 
      }
      console.log("Email sent:", info.response);
      resolve(info); 
    });
  });
};