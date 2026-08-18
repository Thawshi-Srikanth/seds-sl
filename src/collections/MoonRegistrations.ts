import type { CollectionConfig } from "payload";

export const MoonRegistrations: CollectionConfig = {
  slug: "moon-registrations",
  admin: {
    group: "Observe Moon Night",
    useAsTitle: "fullName",
    defaultColumns: [
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
  fields: [
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
      defaultValue: "confirmed",
      options: [
        { label: "Confirmed", value: "confirmed" },
        { label: "Pending Approval", value: "pending" },
        { label: "Cancelled", value: "cancelled" },
      ],
      label: "Registration Status",
    },
  ],
};
