import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let fullName = "";
    let email = "";
    let phone = "";
    let institution = "";
    let year = "2026";
    let eventSlug = "observe-the-moon-night-2026";
    let attendanceMode = "in-person";
    let equipment = "observer";
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
      attendanceMode =
        (formData.get("attendanceMode") as string) || "in-person";
      equipment = (formData.get("equipment") as string) || "observer";
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
      attendanceMode = body.attendanceMode || "in-person";
      equipment = body.equipment || "observer";
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

    const registration = await payload.create({
      collection: "moon-registrations",
      data: {
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

    return NextResponse.json(
      {
        success: true,
        message: isPaidEvent
          ? "Registration submitted! Payment slip received and pending verification."
          : "Successfully registered for Observe the Moon Night!",
        registrationId: registration.id,
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
