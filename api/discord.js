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
        content: `📧 Glückwunsch Milan! Du hast eine neue Bestellung für ${data.type || "Nicht angegeben"} von deinem Store erhalten!\n——————————\n🛒 Typ: ${data.type || "Nicht angegeben"}\n📆 Datum: ${data.date}\n⏰ Zeit: ${data.time}\n👤 Name: ${data.name}\n📧 Email: ${data.email}\n🏠 Adresse: ${data.street}\n📞 Telefon: ${data.phone}`
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
