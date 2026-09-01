import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
} from '@react-email/components'
import * as React from 'react'

export interface ObserveMoonTicketEmailProps {
  fullName?: string
  email?: string
  phone?: string
  institution?: string
  selectedLocation?: string
  attendanceMode?: string
  equipment?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  emergencyContactRelation?: string
  mealPreference?: string
  dietaryRestrictions?: string
  year?: string
  registrationId?: string
}

export const ObserveMoonTicketEmail = ({
  fullName = 'Thawshi Srikanth',
  email = 'thawshi@example.com',
  phone = '+94 77 123 4567',
  institution = 'University of Colombo',
  selectedLocation = 'Colombo Observatory Lawn',
  attendanceMode = 'In-Person',
  equipment = 'Observer',
  emergencyContactName = 'S. Srikanth',
  emergencyContactPhone = '+94 71 987 6543',
  emergencyContactRelation = 'Parent',
  mealPreference = 'Vegetarian',
  dietaryRestrictions = '',
  year = '2026',
  registrationId = 'IOTMN-2026-089',
}: ObserveMoonTicketEmailProps) => {
  const previewText = `Your Registration Ticket - Observe the Moon Night ${year}`

  // Solid hex colors replacing opacity bars for email client compatibility
  const barcodePattern = [
    { width: '63%', color: '#b3b3c2' },
    { width: '36%', color: '#666673' },
    { width: '81%', color: '#8c8c9e' },
    { width: '54%', color: '#b3b3c2' },
    { width: '27%', color: '#666673' },
    { width: '72%', color: '#8c8c9e' },
    { width: '45%', color: '#b3b3c2' },
    { width: '90%', color: '#666673' },
    { width: '36%', color: '#8c8c9e' },
    { width: '63%', color: '#b3b3c2' },
    { width: '54%', color: '#666673' },
    { width: '27%', color: '#8c8c9e' },
  ]

  const fields = [
    { label: 'Email', value: email },
    { label: 'Phone', value: phone },
    { label: 'Location', value: selectedLocation },
    { label: 'Equipment', value: equipment },
    {
      label: 'Meal',
      value: mealPreference + (dietaryRestrictions ? ` (${dietaryRestrictions})` : ''),
    },
    { label: 'Attendance', value: attendanceMode },
  ]

  return (
    <Html lang="en">
      <Head>
        {/* Web font link with fallback monospace stack */}
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Preview>{previewText}</Preview>
      <Body
        style={{
          backgroundColor: '#f8fafc',
          fontFamily: "'JetBrains Mono', Consolas, Monaco, 'Courier New', Courier, monospace",
          margin: 0,
          padding: '32px 12px',
        }}
      >
        <Container style={{ maxWidth: '440px', margin: '0 auto' }}>
          {/* Section Header */}
          <Section style={{ marginBottom: '16px' }}>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '-0.5px',
                color: '#0f172a',
                fontFamily: "'JetBrains Mono', Consolas, Monaco, monospace",
                margin: '0 0 4px 0',
              }}
            >
              Your Registration Ticket
            </h2>
            <p
              style={{
                fontSize: '13px',
                color: '#64748b',
                margin: 0,
                fontFamily: "'JetBrains Mono', Consolas, Monaco, monospace",
              }}
            >
              Official pass for Observe the Moon Night {year}.
            </p>
          </Section>

          {/* ── TICKET CARD (Table Container) ── */}
          <table
            width="100%"
            border={0}
            cellPadding="0"
            cellSpacing="0"
            style={{
              backgroundColor: '#0a0a0f',
              borderRadius: '16px',
              borderCollapse: 'separate',
            }}
          >
            <tbody>
              {/* Ticket Header */}
              <tr>
                <td
                  style={{
                    padding: '24px',
                    textAlign: 'center',
                    backgroundColor: '#12122b',
                    borderBottom: '1px dashed #333346',
                    borderTopLeftRadius: '16px',
                    borderTopRightRadius: '16px',
                  }}
                >
                  <Img
                    src="/static/logo/moon-seds.png"
                    alt="Observe the Moon Night"
                    width="140"
                    height="40"
                    style={{
                      margin: '0 auto 12px auto',
                      display: 'block',
                      border: 0,
                    }}
                  />
                  <p
                    style={{
                      fontSize: '9px',
                      fontFamily: "'JetBrains Mono', Consolas, Monaco, monospace",
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '1.5px',
                      color: '#94a3b8',
                      margin: '0 0 6px 0',
                    }}
                  >
                    Observe the Moon Night · {year}
                  </p>
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: 800,
                      fontFamily: "'JetBrains Mono', Consolas, Monaco, monospace",
                      lineHeight: '1.25',
                      color: '#ffffff',
                      letterSpacing: '-0.5px',
                      margin: '0 0 4px 0',
                    }}
                  >
                    {fullName || '—'}
                  </h3>
                  <p
                    style={{
                      fontSize: '12px',
                      fontFamily: "'JetBrains Mono', Consolas, Monaco, monospace",
                      color: '#94a3b8',
                      margin: 0,
                    }}
                  >
                    {institution || '—'}
                  </p>
                </td>
              </tr>

              {/* Perforated Tear Line (Email-Safe Table Notch Pattern) */}
              <tr>
                <td style={{ backgroundColor: '#0a0a0f', padding: 0 }}>
                  <table width="100%" border={0} cellPadding="0" cellSpacing="0">
                    <tbody>
                      <tr>
                        <td
                          width="12"
                          height="24"
                          style={{
                            backgroundColor: '#f8fafc',
                            borderTopRightRadius: '12px',
                            borderBottomRightRadius: '12px',
                            height: '24px',
                            fontSize: '1px',
                            lineHeight: '1px',
                          }}
                        >
                          &nbsp;
                        </td>
                        <td
                          height="24"
                          style={{
                            borderBottom: '1.5px dashed #333346',
                            height: '12px',
                            fontSize: '1px',
                            lineHeight: '1px',
                          }}
                        >
                          &nbsp;
                        </td>
                        <td
                          width="12"
                          height="24"
                          style={{
                            backgroundColor: '#f8fafc',
                            borderTopLeftRadius: '12px',
                            borderBottomLeftRadius: '12px',
                            height: '24px',
                            fontSize: '1px',
                            lineHeight: '1px',
                          }}
                        >
                          &nbsp;
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              {/* Main Ticket Fields */}
              <tr>
                <td style={{ padding: '20px 24px', backgroundColor: '#0a0a0f' }}>
                  <table width="100%" border={0} cellPadding="0" cellSpacing="0">
                    <tbody>
                      {fields.map((f, idx) => (
                        <tr key={idx}>
                          <td style={{ paddingBottom: '14px', verticalAlign: 'top' }}>
                            <p
                              style={{
                                fontSize: '9px',
                                fontFamily:
                                  "'JetBrains Mono', Consolas, Monaco, monospace",
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '1.5px',
                                color: '#5f6577',
                                margin: '0 0 2px 0',
                              }}
                            >
                              {f.label}
                            </p>
                            <p
                              style={{
                                fontSize: '12px',
                                fontFamily:
                                  "'JetBrains Mono', Consolas, Monaco, monospace",
                                fontWeight: 700,
                                lineHeight: '1.4',
                                color: '#e2e8f0',
                                margin: 0,
                              }}
                            >
                              {f.value || '—'}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>

              {/* Second Perforated Tear Line for Stub */}
              <tr>
                <td style={{ backgroundColor: '#0a0a0f', padding: 0 }}>
                  <table width="100%" border={0} cellPadding="0" cellSpacing="0">
                    <tbody>
                      <tr>
                        <td
                          width="12"
                          height="24"
                          style={{
                            backgroundColor: '#f8fafc',
                            borderTopRightRadius: '12px',
                            borderBottomRightRadius: '12px',
                            height: '24px',
                            fontSize: '1px',
                            lineHeight: '1px',
                          }}
                        >
                          &nbsp;
                        </td>
                        <td
                          height="24"
                          style={{
                            borderBottom: '1.5px dashed #333346',
                            height: '12px',
                            fontSize: '1px',
                            lineHeight: '1px',
                          }}
                        >
                          &nbsp;
                        </td>
                        <td
                          width="12"
                          height="24"
                          style={{
                            backgroundColor: '#f8fafc',
                            borderTopLeftRadius: '12px',
                            borderBottomLeftRadius: '12px',
                            height: '24px',
                            fontSize: '1px',
                            lineHeight: '1px',
                          }}
                        >
                          &nbsp;
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              {/* Ticket Stub Section */}
              <tr>
                <td
                  style={{
                    backgroundColor: '#0f0f1a',
                    padding: '20px 24px',
                    borderBottomLeftRadius: '16px',
                    borderBottomRightRadius: '16px',
                  }}
                >
                  <div style={{ marginBottom: '16px' }}>
                    <p
                      style={{
                        fontSize: '9px',
                        fontFamily: "'JetBrains Mono', Consolas, Monaco, monospace",
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                        color: '#5f6577',
                        margin: '0 0 4px 0',
                      }}
                    >
                      Emergency
                    </p>
                    <p
                      style={{
                        fontSize: '12px',
                        fontFamily: "'JetBrains Mono', Consolas, Monaco, monospace",
                        fontWeight: 800,
                        color: '#e2e8f0',
                        margin: '0 0 2px 0',
                      }}
                    >
                      {emergencyContactName || '—'}
                    </p>
                    <p
                      style={{
                        fontSize: '10px',
                        fontFamily: "'JetBrains Mono', Consolas, Monaco, monospace",
                        color: '#737c90',
                        margin: '0 0 2px 0',
                      }}
                    >
                      {emergencyContactRelation || '—'}
                    </p>
                    <p
                      style={{
                        fontSize: '10px',
                        fontFamily: "'JetBrains Mono', Consolas, Monaco, monospace",
                        color: '#737c90',
                        margin: 0,
                      }}
                    >
                      {emergencyContactPhone || '—'}
                    </p>
                  </div>

                  {/* Barcode Strip */}
                  <div>
                    {barcodePattern.map((item, i) => (
                      <div
                        key={i}
                        style={{
                          height: '3px',
                          width: item.width,
                          backgroundColor: item.color,
                          marginBottom: '2px',
                          fontSize: '1px',
                          lineHeight: '3px',
                        }}
                      />
                    ))}
                    <p
                      style={{
                        fontSize: '8px',
                        fontFamily: "'JetBrains Mono', Consolas, Monaco, monospace",
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                        color: '#454b5a',
                        margin: '6px 0 0 0',
                      }}
                    >
                      SEDS · OBS PASS · {registrationId}
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </Container>
      </Body>
    </Html>
  )
}

export default ObserveMoonTicketEmail
