import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      institution,
      year = "2026",
      eventSlug = "observe-the-moon-night-2026",
      attendanceMode = "in-person",
      equipment = "observer",
      notes,
    } = body;

    if (!fullName || !email || !institution) {
      return NextResponse.json(
        { error: "Full Name, Email, and Institution are required fields." },
        { status: 400 },
      );
    }

    const payload = await getPayload({ config: configPromise });

    const registration = await payload.create({
      collection: "moon-registrations",
      data: {
        fullName,
        email,
        phone: phone || "",
        institution,
        year,
        eventSlug,
        attendanceMode,
        equipment,
        notes: notes || "",
        status: "confirmed",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Successfully registered for Observe the Moon Night!",
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
