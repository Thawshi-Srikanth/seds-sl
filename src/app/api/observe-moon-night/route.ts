import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { generateRegistrationEmail } from "@/utilities/generateRegistrationEmail";

function generateRegistrationCode(year: string): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let randomStr = "";
  for (let i = 0; i < 4; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `IOTMN-${year}-${randomStr}`;
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let fullName = "";
    let email = "";
    let phone = "";
    let institution = "";
    let year = "2026";
    let eventSlug = "observe-the-moon-night-2026";
    let attendanceMode: "in-person" | "virtual" | "watch-party" = "in-person";
    let equipment: "bringing-equipment" | "observer" | "astrophotography" =
      "observer";
    let selectedLocation = "";
    let notes = "";
    let paymentSlipMediaId: string | number | null = null;
    let isPaidEvent = false;

    const payload = await getPayload({ config: configPromise });

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      fullName = (formData.get("fullName") as string) || "";
      email = (formData.get("email") as string) || "";
      phone = (formData.get("phone") as string) || "";
      institution = (formData.get("institution") as string) || "";
      year = (formData.get("year") as string) || "2026";
      eventSlug =
        (formData.get("eventSlug") as string) || "observe-the-moon-night-2026";
      attendanceMode = ((formData.get("attendanceMode") as string) ||
        "in-person") as "in-person" | "virtual" | "watch-party";
      equipment = ((formData.get("equipment") as string) || "observer") as
        | "bringing-equipment"
        | "observer"
        | "astrophotography";
      selectedLocation = (formData.get("selectedLocation") as string) || "";
      notes = (formData.get("notes") as string) || "";
      isPaidEvent = formData.get("isPaid") === "true";

      const file = formData.get("paymentSlip") as File | null;
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const uploadedMedia = await payload.create({
          collection: "media",
          data: {
            alt: `Payment receipt from ${fullName}`,
          },
          file: {
            data: buffer,
            name: file.name,
            mimetype: file.type,
            size: file.size,
          },
        });
        paymentSlipMediaId = uploadedMedia.id;
      }
    } else {
      const body = await req.json();
      fullName = body.fullName || "";
      email = body.email || "";
      phone = body.phone || "";
      institution = body.institution || "";
      year = body.year || "2026";
      eventSlug = body.eventSlug || "observe-the-moon-night-2026";
      attendanceMode = (body.attendanceMode || "in-person") as
        | "in-person"
        | "virtual"
        | "watch-party";
      equipment = (body.equipment || "observer") as
        | "bringing-equipment"
        | "observer"
        | "astrophotography";
      selectedLocation = body.selectedLocation || "";
      notes = body.notes || "";
      isPaidEvent = Boolean(body.isPaid);
    }

    if (!fullName || !email || !institution) {
      return NextResponse.json(
        { error: "Full Name, Email, and Institution are required fields." },
        { status: 400 },
      );
    }

    const registrationCode = generateRegistrationCode(year);

    const registration = await payload.create({
      collection: "moon-registrations",
      data: {
        registrationCode,
        fullName,
        email,
        phone,
        institution,
        selectedLocation,
        year,
        eventSlug,
        attendanceMode,
        equipment,
        paymentSlip: paymentSlipMediaId || undefined,
        paymentStatus: isPaidEvent
          ? paymentSlipMediaId
            ? "pending"
            : "n/a"
          : "n/a",
        notes,
        status: isPaidEvent ? "pending" : "confirmed",
      },
    });

    // Fetch custom email subject and message from the Observe Moon Event CMS collection for this year
    let cmsSubject: string | undefined;
    let cmsCustomMessage: string | undefined;
    let eventDate: string | undefined;
    let eventTime: string | undefined;
    let ticketPrice: string | undefined;
    let paymentDetails: string | undefined;
    let agenda: any[] | undefined;
    try {
      const eventQuery = await payload.find({
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
        agenda = eventDoc.agenda || undefined;
      }
    } catch (cmsErr) {
      console.warn(
        "Could not fetch event CMS email template settings:",
        cmsErr,
      );
    }

    // Send confirmation email via Payload Resend Adapter (non-blocking for registration creation)
    try {
      const { subject, html, text } = generateRegistrationEmail({
        fullName,
        email,
        institution,
        selectedLocation,
        attendanceMode,
        equipment,
        year,
        isPaidEvent,
        registrationId: registrationCode,
        cmsSubject,
        cmsCustomMessage,
        eventDate,
        eventTime,
        ticketPrice,
        paymentDetails,
        agenda,
      });

      await payload.sendEmail({
        to: email,
        subject,
        html,
        text,
      });
    } catch (emailErr) {
      console.error(
        "Failed to send registration confirmation email:",
        emailErr,
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: isPaidEvent
          ? "Registration submitted! Payment slip received and pending verification."
          : "Successfully registered for Observe the Moon Night!",
        registrationId: registrationCode,
        registrationCode,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating Moon Night registration:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process registration" },
      { status: 500 },
    );
  }
}
