export interface RegistrationEmailParams {
  fullName: string;
  email: string;
  institution: string;
  selectedLocation?: string;
  attendanceMode?: string;
  equipment?: string;
  year?: string;
  isPaidEvent?: boolean;
  registrationId: string | number;
  cmsSubject?: string;
  cmsCustomMessage?: string;
  eventDate?: string;
  eventTime?: string;
  ticketPrice?: string;
  paymentDetails?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  agenda?: any[];
}

export function generateRegistrationEmail(params: RegistrationEmailParams): {
  subject: string;
  html: string;
  text: string;
} {
  const {
    fullName,
    email,
    institution,
    selectedLocation,
    attendanceMode = "in-person",
    equipment = "observer",
    year = "2026",
    isPaidEvent = false,
    registrationId,
    cmsSubject,
    cmsCustomMessage,
    eventDate,
    eventTime,
    ticketPrice,
    paymentDetails,
  } = params;

  const subject =
    cmsSubject || `Registration Confirmed: Observe the Moon Night ${year}`;

  const attendanceLabel =
    attendanceMode === "virtual"
      ? "Virtual Stream"
      : attendanceMode === "watch-party"
        ? "Local Watch Group"
        : "In-Person Site";

  const equipmentLabel =
    equipment === "bringing-equipment"
      ? "Bringing Optics"
      : equipment === "astrophotography"
        ? "Astrophotography"
        : "Observer";

  const formattedDate = eventDate
    ? eventDate.includes("T")
      ? new Date(eventDate).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          timeZone: "Asia/Colombo",
        })
      : eventDate
    : "Saturday, September 19, 2026";

  const formattedTime = eventTime || "06:30 PM - 10:30 PM (SLST)";

  const displayPassCode = String(registrationId).startsWith("IOTMN")
    ? String(registrationId)
    : `IOTMN-${year}-${registrationId}`;

  const statusText = isPaidEvent ? "PENDING VERIFICATION" : "CONFIRMED PASS";
  const statusColor = isPaidEvent ? "#f97316" : "#2563eb";

  const messageText =
    cmsCustomMessage ||
    `Your registration for International Observe the Moon Night ${year} is confirmed. We look forward to exploring the lunar surface together under the night sky.`;

  const paymentSectionHtml =
    isPaidEvent && paymentDetails
      ? `<div style="border: 1px solid #7c2d12; background-color: #000000; padding: 16px 20px; margin-bottom: 24px;">
          <div style="color: #f97316; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
            PAYMENT INSTRUCTIONS
          </div>
          <div style="color: #cbd5e1; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.6; white-space: pre-line;">
            ${paymentDetails}
          </div>
          ${ticketPrice ? `<div style="margin-top: 8px; color: #fdba74; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700;">TICKET FEE: LKR ${ticketPrice}</div>` : ""}
         </div>`
      : "";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=JetBrains+Mono:wght@400;600;700;800&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Barlow', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #f8fafc;">
  
  <!-- Pure Black Page Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; padding: 40px 12px;">
    <tr>
      <td align="center">
        
        <!-- Pure Black Container with Bleeding Edge Borders -->
        <table width="560" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #000000; border: 1px solid #1e293b; border-collapse: separate;">
          
          <!-- Top Bleeding Edge Accent Bar -->
          <tr>
            <td style="height: 2px; background: linear-gradient(90deg, #2563eb 0%, #3b82f6 50%, #1e293b 100%);"></td>
          </tr>

          <!-- Minimal Header with Barlow Font -->
          <tr>
            <td style="padding: 32px 28px 24px 28px; border-bottom: 1px solid #1e293b; background-color: #000000;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="color: #2563eb; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px;">
                      SEDS SRI LANKA
                    </div>
                    <h1 style="color: #ffffff; font-family: 'Barlow', sans-serif; font-size: 22px; font-weight: 800; text-transform: uppercase; margin: 0; letter-spacing: -0.5px; line-height: 1.1;">
                      Observe the Moon Night ${year}
                    </h1>
                  </td>
                  <td align="right" style="vertical-align: top;">
                    <div style="color: ${statusColor}; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 800; border: 1px solid #1e293b; padding: 4px 10px; background-color: #000000; text-transform: uppercase; letter-spacing: 1px;">
                      ${statusText}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 28px; background-color: #000000;">

              <!-- Pass Code Box (Pure Black with Subtle Border & Barlow/JetBrains Typography) -->
              <div style="background-color: #000000; border: 1px solid #1e293b; padding: 14px 20px; margin-bottom: 24px; text-align: center;">
                <span style="color: #64748b; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-right: 8px;">
                  PASS CODE:
                </span>
                <span style="color: #2563eb; font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 800; letter-spacing: 1.5px;">
                  ${displayPassCode}
                </span>
              </div>

              <!-- Message Text in Barlow Font -->
              <div style="color: #cbd5e1; font-family: 'Barlow', sans-serif; font-size: 15px; font-weight: 400; line-height: 1.6; margin-bottom: 24px;">
                ${messageText.replace(/\n/g, "<br />")}
              </div>

              ${paymentSectionHtml}

              <!-- Registration Summary Table (Pure Black & Bleeding Edge Border) -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #1e293b; background-color: #000000; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 10px 16px; background-color: #000000; border-bottom: 1px solid #1e293b; color: #2563eb; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                    REGISTRATION SUMMARY
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px; background-color: #000000;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color: #64748b; font-family: 'JetBrains Mono', monospace; font-size: 12px; padding: 6px 0; font-weight: 700; width: 120px;">NAME:</td>
                        <td style="color: #ffffff; font-family: 'Barlow', sans-serif; font-size: 13px; padding: 6px 0; font-weight: 600;">${fullName}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-family: 'JetBrains Mono', monospace; font-size: 12px; padding: 6px 0; font-weight: 700;">EMAIL:</td>
                        <td style="color: #3b82f6; font-family: 'Barlow', sans-serif; font-size: 13px; padding: 6px 0;"><a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a></td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-family: 'JetBrains Mono', monospace; font-size: 12px; padding: 6px 0; font-weight: 700;">INSTITUTION:</td>
                        <td style="color: #cbd5e1; font-family: 'Barlow', sans-serif; font-size: 13px; padding: 6px 0;">${institution}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-family: 'JetBrains Mono', monospace; font-size: 12px; padding: 6px 0; font-weight: 700;">DATE:</td>
                        <td style="color: #ffffff; font-family: 'Barlow', sans-serif; font-size: 13px; padding: 6px 0; font-weight: 600;">${formattedDate}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-family: 'JetBrains Mono', monospace; font-size: 12px; padding: 6px 0; font-weight: 700;">TIME:</td>
                        <td style="color: #ffffff; font-family: 'Barlow', sans-serif; font-size: 13px; padding: 6px 0; font-weight: 600;">${formattedTime}</td>
                      </tr>
                      ${
                        selectedLocation
                          ? `<tr>
                        <td style="color: #64748b; font-family: 'JetBrains Mono', monospace; font-size: 12px; padding: 6px 0; font-weight: 700;">LOCATION:</td>
                        <td style="color: #f97316; font-family: 'Barlow', sans-serif; font-size: 13px; padding: 6px 0; font-weight: 700;">${selectedLocation}</td>
                      </tr>`
                          : ""
                      }
                      <tr>
                        <td style="color: #64748b; font-family: 'JetBrains Mono', monospace; font-size: 12px; padding: 6px 0; font-weight: 700;">MODE:</td>
                        <td style="color: #cbd5e1; font-family: 'Barlow', sans-serif; font-size: 13px; padding: 6px 0;">${attendanceLabel}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-family: 'JetBrains Mono', monospace; font-size: 12px; padding: 6px 0; font-weight: 700;">EQUIPMENT:</td>
                        <td style="color: #cbd5e1; font-family: 'Barlow', sans-serif; font-size: 13px; padding: 6px 0;">${equipmentLabel}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Bleeding Edge CTA Button in Barlow Font -->
              <div style="text-align: center; margin-top: 8px;">
                <a href="${process.env.WEBSITE_URL || "https://seds-sl.org"}/projects/observe-the-moon-night" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 28px; font-family: 'Barlow', sans-serif; font-size: 13px; font-weight: 700; text-transform: uppercase; text-decoration: none; border: 1px solid #3b82f6; letter-spacing: 1px;">
                  View Event Portal →
                </a>
              </div>

            </td>
          </tr>

          <!-- Minimal Pure Black Footer -->
          <tr>
            <td style="padding: 20px 28px; background-color: #000000; border-top: 1px solid #1e293b; text-align: center;">
              <p style="color: #64748b; font-family: 'Barlow', sans-serif; font-size: 12px; font-weight: 500; margin: 0;">
                Students for the Exploration & Development of Space (SEDS Sri Lanka)
              </p>
            </td>
          </tr>

          <!-- Bottom Bleeding Edge Accent Bar -->
          <tr>
            <td style="height: 1px; background-color: #1e293b;"></td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();

  const text = `
SEDS SRI LANKA • OBSERVE THE MOON NIGHT ${year}
REGISTRATION CONFIRMATION

PASS CODE: ${displayPassCode}
STATUS: ${statusText}

${messageText}

REGISTRATION SUMMARY:
• Name: ${fullName}
• Email: ${email}
• Institution: ${institution}
• Date: ${formattedDate}
• Time: ${formattedTime}
${selectedLocation ? `• Location: ${selectedLocation}\n` : ""}• Mode: ${attendanceLabel}
• Equipment: ${equipmentLabel}

${paymentDetails ? `PAYMENT INSTRUCTIONS:\n${paymentDetails}\n` : ""}
Event Portal: ${process.env.WEBSITE_URL || "https://seds-sl.org"}/projects/observe-the-moon-night

Students for the Exploration & Development of Space (SEDS Sri Lanka)
  `.trim();

  return { subject, html, text };
}
