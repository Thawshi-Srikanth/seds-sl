import type { CollectionConfig } from "payload";
import { generateRegistrationEmail } from "../utilities/generateRegistrationEmail";
import { Resend } from "resend";

export const MoonRegistrations: CollectionConfig = {
  slug: "moon-registrations",
  admin: {
    group: "Observe Moon Night",
    useAsTitle: "registrationCode",
    defaultColumns: [
      "registrationCode",
      "fullName",
      "email",
      "phone",
      "selectedLocation",
      "paymentStatus",
      "status",
      "createdAt",
    ],
  },

  access: {
    create: () => true, // Allow anyone on web to register
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },

  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        // Send confirmation email when status changes from pending to confirmed (or payment status becomes verified)
        const isNowConfirmed =
          (doc.status === "confirmed" && previousDoc?.status !== "confirmed") ||
          (doc.paymentStatus === "verified" && previousDoc?.paymentStatus !== "verified");

        const isNowRejected =
          (doc.status === "cancelled" && previousDoc?.status !== "cancelled") ||
          (doc.paymentStatus === "rejected" && previousDoc?.paymentStatus !== "rejected");

        if ((isNowConfirmed || isNowRejected) && doc.email) {
          try {
            const year = doc.year || "2026";
            const fromAddress = process.env.FROM_EMAIL || "info@seds-sl.org";
            const orgName = process.env.ORG_NAME || "SEDS Sri Lanka";

            // Fetch custom email subject and message from Observe Moon Event CMS collection for this year
            let cmsSubject: string | undefined;
            let cmsCustomMessage: string | undefined;
            let eventDate: string | undefined;
            let eventTime: string | undefined;
            let ticketPrice: string | undefined;
            let paymentDetails: string | undefined;

            try {
              const eventQuery = await req.payload.find({
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                collection: "observe-moon-events" as any,
                where: {
                  year: {
                    equals: year,
                  },
                },
                limit: 1,
              });

              if (eventQuery.docs[0]) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const eventDoc = eventQuery.docs[0] as any;
                cmsSubject = eventDoc.confirmationEmailSubject || undefined;
                cmsCustomMessage = eventDoc.confirmationEmailBody || undefined;
                eventDate = eventDoc.eventDate || undefined;
                eventTime = eventDoc.startTime
                  ? `${eventDoc.startTime}${eventDoc.endTime ? ` - ${eventDoc.endTime}` : ""}`
                  : undefined;
                ticketPrice = eventDoc.ticketPrice || undefined;
                paymentDetails = eventDoc.paymentDetails || undefined;
              }
            } catch (cmsErr) {
              req.payload.logger.warn(
                "Could not fetch Observe Moon Event CMS settings for confirmation email:",
                cmsErr,
              );
            }

            let sentWithResendTemplate = false;

            if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "dummy_key_for_build") {
              try {
                const resend = new Resend(process.env.RESEND_API_KEY);
                const templateId = isNowConfirmed
                  ? "observe-the-moon-confirmed"
                  : "payment-verification-failed";

                const subject = isNowConfirmed
                  ? (cmsSubject || `You're confirmed — Observe the Moon Night ${year}`)
                  : `Registration update — Observe the Moon Night ${year}`;

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const resendResult: any = await resend.emails.send({
                  from: `${orgName} <${fromAddress}>`,
                  to: doc.email,
                  subject,
                  // @ts-expect-error Resend SDK supports template parameter
                  template: {
                    id: templateId,
                    variables: {
                      fullName: doc.fullName,
                      year,
                      registrationCode: doc.registrationCode || doc.id,
                      ...(isNowConfirmed
                        ? {
                            eventDate: eventDate || "Saturday, September 19, 2026",
                            eventTime: eventTime || "Evening (SLST)",
                            selectedLocation: doc.selectedLocation || "In-Person",
                            customMessage: cmsCustomMessage || "",
                          }
                        : {
                            rejectionReason: "We were unable to verify your payment slip. Please check your payment details or contact our support team.",
                          }),
                    },
                  },
                });

                if (resendResult.data && !resendResult.error) {
                  sentWithResendTemplate = true;
                }
              } catch (resendErr) {
                req.payload.logger.warn("Resend template send failed, falling back to html email:", resendErr);
              }
            }

            if (!sentWithResendTemplate) {
              const { subject, html, text } = generateRegistrationEmail({
                fullName: doc.fullName,
                email: doc.email,
                phone: doc.phone,
                institution: doc.institution,
                selectedLocation: doc.selectedLocation,
                attendanceMode: doc.attendanceMode,
                equipment: doc.equipment,
                emergencyContactName: doc.emergencyContactName,
                emergencyContactPhone: doc.emergencyContactPhone,
                emergencyContactRelation: doc.emergencyContactRelation,
                mealPreference: doc.mealPreference,
                dietaryRestrictions: doc.dietaryRestrictions,
                year,
                isPaidEvent: doc.paymentStatus !== "n/a",
                registrationId: doc.registrationCode || doc.id,
                cmsSubject,
                cmsCustomMessage,
                eventDate,
                eventTime,
                ticketPrice,
                paymentDetails,
                isPendingVerification: false,
              });

              await req.payload.sendEmail({
                to: doc.email,
                subject,
                html,
                text,
              });
            }

            req.payload.logger.info(
              `Status email sent to ${doc.email} for registration ${doc.registrationCode}`,
            );
          } catch (err) {
            req.payload.logger.error(
              `Failed to send registration status email to ${doc.email}:`,
              err,
            );
          }
        }
      },
    ],
  },

  fields: [
    {
      name: "registrationCode",
      type: "text",
      unique: true,
      index: true,
      label: "Registration Pass Code (e.g. IOTMN-2026-X8K9)",
    },
    {
      name: "fullName",
      type: "text",
      required: true,
      label: "Full Name",
    },
    {
      name: "email",
      type: "email",
      required: true,
      label: "Email Address",
    },
    {
      name: "phone",
      type: "text",
      label: "Phone Number",
    },
    {
      name: "institution",
      type: "text",
      required: true,
      label: "University / School / Institution",
    },
    {
      name: "selectedLocation",
      type: "text",
      label: "Selected Observation Location Site",
    },
    {
      name: "year",
      type: "text",
      required: true,
      defaultValue: "2026",
      index: true,
      label: "Event Year",
    },
    {
      name: "eventSlug",
      type: "text",
      required: true,
      defaultValue: "observe-the-moon-night-2026",
      index: true,
      label: "Event Slug",
    },
    {
      name: "attendanceMode",
      type: "select",
      defaultValue: "in-person",
      options: [
        { label: "In-Person Observation Site", value: "in-person" },
        { label: "Virtual Stream / Online", value: "virtual" },
        { label: "Hosting Local Watch Group", value: "watch-party" },
      ],
      label: "Attendance Mode",
    },
    {
      name: "equipment",
      type: "select",
      defaultValue: "observer",
      options: [
        {
          label: "Bringing Telescope / Binoculars",
          value: "bringing-equipment",
        },
        { label: "Observer (No Equipment)", value: "observer" },
        { label: "Astrophotography Setup", value: "astrophotography" },
      ],
      label: "Equipment Brought",
    },
    {
      name: "emergencyContactName",
      type: "text",
      label: "Emergency Contact Full Name",
    },
    {
      name: "emergencyContactPhone",
      type: "text",
      label: "Emergency Contact Phone Number",
    },
    {
      name: "emergencyContactRelation",
      type: "text",
      label: "Emergency Contact Relationship (e.g. Parent, Guardian, Spouse)",
    },
    {
      name: "mealPreference",
      type: "select",
      defaultValue: "no-meal",
      options: [
        { label: "Vegetarian", value: "vegetarian" },
        { label: "Non-Vegetarian", value: "non-vegetarian" },
        { label: "Vegan", value: "vegan" },
        { label: "None / No Meal Required", value: "no-meal" },
      ],
      label: "Meal Preference",
    },
    {
      name: "dietaryRestrictions",
      type: "textarea",
      label: "Dietary Restrictions / Food Allergies",
    },
    {
      name: "paymentSlip",
      type: "upload",
      relationTo: "media",
      label: "Payment Slip / Receipt",
    },
    {
      name: "paymentStatus",
      type: "select",
      defaultValue: "n/a",
      options: [
        { label: "N/A (Free Event)", value: "n/a" },
        { label: "Pending Verification", value: "pending" },
        { label: "Payment Verified", value: "verified" },
        { label: "Payment Rejected", value: "rejected" },
      ],
      label: "Payment Verification Status",
    },
    {
      name: "notes",
      type: "textarea",
      label: "Additional Notes / Special Requests",
    },
    {
      name: "status",
      type: "select",
      defaultValue: "pending",
      options: [
        { label: "Confirmed", value: "confirmed" },
        { label: "Pending Approval", value: "pending" },
        { label: "Cancelled", value: "cancelled" },
      ],
      label: "Registration Status",
    },
  ],
};
