import { getPayload } from 'payload'
import configPromise from '../src/payload.config'

async function run() {
  console.log("Initializing Payload...");
  const payload = await getPayload({ config: configPromise });
  
  console.log("Checking if email is configured on payload...");
  // Let's inspect the email adapter configuration
  if (!payload.email) {
    console.error("Payload email configuration is UNDEFINED. Check your environment variables.");
    process.exit(1);
  } else {
    console.log("Payload email configuration found!");
  }

  try {
    console.log("Sending email via payload.sendEmail...");
    await payload.sendEmail({
      to: 'yaskhankhattak@gmail.com',
      subject: 'Test Confirmation Email from Payload',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e1e1e1; border-radius: 8px;">
          <h2 style="text-align: center; border-bottom: 2px solid #e8192c; padding-bottom: 10px;">Payload Integration Working!</h2>
          <p>This is a test to verify that Payload successfully sends emails using your Resend adapter and API key.</p>
        </div>
      `,
    });
    console.log("Email sent successfully!");
  } catch (err) {
    console.error("Failed to send email:", err);
  }
  process.exit(0);
}

run().catch(console.error);
