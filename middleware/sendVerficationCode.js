
import { Resend } from 'resend';
import { config } from 'dotenv';

config(); // Load env variables

const resend = new Resend(process.env.RESEND_API_KEY);

export const SendMail = async (userEmail, code) => {
  try {
    const email = await resend.emails.send({
      from: 'onboarding@resend.dev', // or your verified domain
      to: userEmail,
      subject: 'Ethio Store Verification Code',
      html: `<p>Your verification code is: <strong>${code}</strong></p>`,
    });
    console.log('Email sent', email);
    return email;
  } catch (error) {
    console.error('Resend error', error);
    throw error;
  }
};