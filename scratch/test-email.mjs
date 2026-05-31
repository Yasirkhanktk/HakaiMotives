import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_S9KRSyLP_MQGhtLtSkainnwMFsiuLcDwH');

async function testEmail() {
  try {
    console.log("Testing Resend API Key:", process.env.RESEND_API_KEY ? "Loaded from env" : "Using hardcoded fallback");
    const { data, error } = await resend.emails.send({
      from: 'Hakai Motives <onboarding@resend.dev>',
      to: 'yasirkhanktk@gmail.com', // Let's try sending to a gmail.
      subject: 'Test email from Hakai Motives',
      html: '<p>It works!</p>',
    });

    if (error) {
      console.error("Resend returned an error:", error);
    } else {
      console.log("Email sent successfully! ID:", data?.id);
    }
  } catch (err) {
    console.error("Caught error sending email:", err);
  }
}

testEmail();
