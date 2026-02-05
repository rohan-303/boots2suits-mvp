import nodemailer from 'nodemailer';

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
  // Create a transporter
  // For production, you should use environment variables for service/auth
  // For now, we'll try to use a generic SMTP or fallback to console
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 2525,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const message = {
    from: `${process.env.FROM_NAME || 'Boots2Suits'} <${process.env.FROM_EMAIL || 'noreply@boots2suits.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: options.html // You can add HTML support later
  };

  try {
    const info = await transporter.sendMail(message);
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    // In development, it's helpful to log the message content if email fails
    if (process.env.NODE_ENV !== 'production') {
      console.log('--- EMAIL PREVIEW ---');
      console.log(`To: ${options.email}`);
      console.log(`Subject: ${options.subject}`);
      console.log(`Message: ${options.message}`);
      console.log('---------------------');
    }
    // We might want to throw the error or just log it depending on requirements. 
    // For critical flows like password reset, we should probably throw so the user knows it failed.
    throw error;
  }
};

export default sendEmail;
