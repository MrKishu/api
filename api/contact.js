export default async function handler(req, res) {
  // --- CORS headers ---
  res.setHeader('Access-Control-Allow-Origin', 'https://drkiranms.vercel.app'); // allow only your frontend
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  // --- Get data from request ---
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  // --- Telegram API details ---
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const text =
    `New Message from Portfolio\n` +
    `Name: ${name}\n` +
    `Email: ${email}\n` +
    `Subject: ${subject}\n` +
    `Message:\n${message}`;

  try {
    // Send message to Telegram
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    });

    const data = await response.json();

    if (!data.ok) {
      return res.status(500).json({ error: "Telegram API error" });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Server error: " + err.message });
  }
}
