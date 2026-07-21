# Notificaciones de reserva — Agendar Sesión

El sitio (`index.html`) vive en GitHub Pages, que solo sirve archivos
estáticos. Por eso el envío de **correo** y de **WhatsApp** se resuelven de
dos formas distintas:

## 1. Correo electrónico — EmailJS (sin backend)

El correo se envía directamente desde el navegador del visitante usando
[EmailJS](https://www.emailjs.com), así que no necesitas desplegar nada
aparte del sitio.

Pasos:

1. Crea una cuenta gratuita en https://www.emailjs.com.
2. Agrega un **Email Service** (por ejemplo, conectando el Gmail
   `tatitarodcr@gmail.com`) y copia su **Service ID**.
3. Crea un **Email Template** con estas variables (deben llamarse exactamente
   así, EmailJS las reemplaza automáticamente):
   - `{{from_name}}` — nombre completo
   - `{{from_email}}` — correo del cliente
   - `{{whatsapp}}` — número de WhatsApp
   - `{{tipo_sesion}}` — sesión elegida
   - `{{modalidad}}` — virtual o presencial
   - `{{fecha_hora}}` — fecha y hora de la cita
   - `{{to_email}}` — úsalo en el campo "To Email" del template (o escribe
     directamente `tatitarodcr@gmail.com` ahí)
4. Copia el **Template ID**.
5. En **Account → General**, copia tu **Public Key**.
6. En `index.html`, busca el bloque `EMAILJS_PUBLIC_KEY` / `EMAILJS_SERVICE_ID`
   / `EMAILJS_TEMPLATE_ID` (sección "MODAL AGENDAR") y reemplaza los 3
   valores de ejemplo por los tuyos.
7. (Recomendado) En el dashboard de EmailJS, bajo **Account → Security**,
   restringe el Public Key a tu dominio (`https://nayrab55.github.io`) para
   que nadie más pueda usarlo desde otro sitio.

Con eso, cada reserva confirmada te llegará automáticamente a
`tatitarodcr@gmail.com`.

## 2. WhatsApp — función serverless con Twilio

Un mensaje de WhatsApp automático **no se puede enviar directamente desde el
navegador**: requiere credenciales secretas (Twilio o Meta) que nunca deben
quedar expuestas en el código público del sitio. La solución es una pequeña
función que corre en un servidor y guarda esas credenciales de forma privada.

Ya está lista en `api/notify-whatsapp.js`, en formato compatible con
[Vercel](https://vercel.com) (plan gratuito, no requiere tarjeta).

Pasos:

1. Crea una cuenta en https://www.twilio.com y activa el
   [WhatsApp Sandbox](https://www.twilio.com/docs/whatsapp/sandbox) (gratis
   para pruebas) o un número de WhatsApp Business aprobado si quieres algo
   más permanente.
2. Copia tu **Account SID** y **Auth Token** desde el dashboard de Twilio.
3. Ve a https://vercel.com, inicia sesión con tu cuenta de GitHub e importa
   este mismo repositorio (`Nayrab55/TA-ROD`) como un nuevo proyecto. Vercel
   detecta automáticamente la carpeta `api/` y publica
   `notify-whatsapp.js` como un endpoint.
4. En **Project Settings → Environment Variables** del proyecto de Vercel,
   agrega (ver `api/.env.example`):
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_WHATSAPP_FROM` — el número de WhatsApp de Twilio, formato
     `whatsapp:+14155238886`
   - `TWILIO_WHATSAPP_TO` — tu número de WhatsApp (donde quieres recibir el
     aviso), formato `whatsapp:+50688215669`
   - `ALLOWED_ORIGIN` — `https://nayrab55.github.io`
5. Despliega. Vercel te dará una URL como
   `https://ta-rod-notify.vercel.app/api/notify-whatsapp`.
6. En `index.html`, busca `WHATSAPP_NOTIFY_ENDPOINT` (misma sección que el
   correo) y pega ahí esa URL.

Con eso, cada vez que alguien confirme una reserva, el sitio le pedirá a esa
función que le mande el mensaje de WhatsApp — las credenciales de Twilio
nunca salen del servidor.

Si prefieres no configurar Twilio por ahora, puedes dejar
`WHATSAPP_NOTIFY_ENDPOINT` vacío: el sitio simplemente no intentará mandar el
WhatsApp, pero el correo seguirá funcionando con normalidad.
