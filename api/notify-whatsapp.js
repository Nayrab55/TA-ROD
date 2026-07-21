// Función serverless (formato Vercel) que envía una notificación de WhatsApp
// a través de Twilio cuando alguien reserva una cita en TA-ROD.
//
// GitHub Pages solo sirve archivos estáticos, así que este archivo NO se
// ejecuta ahí. Para activarlo:
//   1. Sube este repo (o solo esta carpeta) a Vercel (vercel.com, plan gratuito).
//   2. En el dashboard de Vercel, configura estas variables de entorno:
//        TWILIO_ACCOUNT_SID   -> Account SID de tu cuenta de Twilio
//        TWILIO_AUTH_TOKEN    -> Auth Token de tu cuenta de Twilio
//        TWILIO_WHATSAPP_FROM -> número de WhatsApp habilitado en Twilio,
//                                 formato 'whatsapp:+14155238886'
//        TWILIO_WHATSAPP_TO   -> tu número de WhatsApp (el que recibe el
//                                 aviso), formato 'whatsapp:+50688215669'
//        ALLOWED_ORIGIN       -> https://nayrab55.github.io (tu dominio del sitio)
//   3. Copia la URL que te da Vercel (algo como
//      https://ta-rod-notify.vercel.app/api/notify-whatsapp) y pégala en
//      WHATSAPP_NOTIFY_ENDPOINT dentro de index.html.
//
// Ver api/README.md para instrucciones más detalladas.

module.exports = async function handler(req, res) {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM, TWILIO_WHATSAPP_TO } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM || !TWILIO_WHATSAPP_TO) {
    res.status(500).json({ error: 'Faltan variables de entorno de Twilio en el servidor.' });
    return;
  }

  const { from_name, from_email, whatsapp, tipo_sesion, modalidad, fecha_hora } = req.body || {};
  if (!from_name || !from_email || !fecha_hora) {
    res.status(400).json({ error: 'Datos de la reserva incompletos.' });
    return;
  }

  const text =
    `✦ Nueva reserva en TA-ROD ✦\n\n` +
    `Nombre: ${from_name}\n` +
    `Correo: ${from_email}\n` +
    `WhatsApp: ${whatsapp || 'No indicado'}\n` +
    `Tipo de sesión: ${tipo_sesion || 'No indicado'}\n` +
    `Modalidad: ${modalidad || 'No indicada'}\n` +
    `Fecha y hora: ${fecha_hora}`;

  try {
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    const body = new URLSearchParams({
      To: TWILIO_WHATSAPP_TO,
      From: TWILIO_WHATSAPP_FROM,
      Body: text,
    });
    const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');

    const twilioRes = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    if (!twilioRes.ok) {
      const errText = await twilioRes.text();
      res.status(502).json({ error: 'Twilio rechazó el mensaje.', detail: errText });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'No se pudo enviar el mensaje de WhatsApp.', detail: String(err) });
  }
}
