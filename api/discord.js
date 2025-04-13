export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
  
    if (req.method === "POST") {
      try {
        const data = req.body;
  
        const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  
        const discordPayload = {
          content: `📅 Neue Buchung:
          • 📆 Datum: ${data.date}
          • ⏰ Zeit: ${data.time}
          • 🏠 Adresse: ${data.street}
          • 📞 Telefon: ${data.phone}`
        };
  
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(discordPayload)
        });
  
        if (response.ok) {
          return res.status(200).json({ message: "Erfolgreich gesendet!" });
        } else {
          return res.status(500).json({ message: "Fehler beim Senden an Discord." });
        }
      } catch (error) {
        return res.status(500).json({ message: "Serverfehler", error: error.message });
      }
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  }
  