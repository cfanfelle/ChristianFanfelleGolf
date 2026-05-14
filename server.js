require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const Stripe = require('stripe');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const EMAIL_TO = process.env.EMAIL_TO || 'christianfanfellegolf@gmail.com';
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465;
const SMTP_SECURE = process.env.SMTP_SECURE !== 'false';
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const PUBLIC_SITE_URL = process.env.PUBLIC_SITE_URL;
const DEFAULT_DONATION_AMOUNT = process.env.DEFAULT_DONATION_AMOUNT
  ? Number(process.env.DEFAULT_DONATION_AMOUNT)
  : 10000;

const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null;

if (!EMAIL_USER || !EMAIL_PASS) {
  console.warn('Missing EMAIL_USER or EMAIL_PASS environment variables. Email sending will fail until these are provided.');
}

if (!STRIPE_SECRET_KEY) {
  console.warn('Missing STRIPE_SECRET_KEY environment variable. Stripe checkout will fail until it is provided.');
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

function getBaseUrl(req) {
  if (PUBLIC_SITE_URL) {
    return PUBLIC_SITE_URL.replace(/\/$/, '');
  }

  const protocol = req.get('x-forwarded-proto') || req.protocol;
  return `${protocol}://${req.get('host')}`;
}

app.post('/create-checkout-session', async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ success: false, error: 'Stripe is not configured yet.' });
  }

  const requestedAmount = Number(req.body.amount);
  const amount = Number.isFinite(requestedAmount) ? Math.round(requestedAmount) : DEFAULT_DONATION_AMOUNT;

  if (amount < 500 || amount > 1000000) {
    return res.status(400).json({ success: false, error: 'Donation amount must be between $5 and $10,000.' });
  }

  const baseUrl = getBaseUrl(req);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Support Christian Fanfelle Golf',
              description: 'Donation toward tournament travel, entry fees, and professional golf expenses.'
            },
            unit_amount: amount
          },
          quantity: 1
        }
      ],
      success_url: `${baseUrl}/index.html?checkout=success#support`,
      cancel_url: `${baseUrl}/index.html?checkout=cancelled#support`
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    res.status(500).json({ success: false, error: 'Unable to start checkout at this time.' });
  }
});

app.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
  }

  const mailSubject = subject && subject.trim() ? subject.trim() : 'New partner inquiry from website';
  const mailBody = `Name: ${name}\nEmail: ${email}\nSubject: ${mailSubject}\n\nMessage:\n${message}`;

  try {
    await transporter.sendMail({
      from: EMAIL_USER,
      to: EMAIL_TO,
      replyTo: email,
      subject: mailSubject,
      text: mailBody
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: 'Unable to send email at this time.' });
  }
});

app.get('/healthz', (req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
