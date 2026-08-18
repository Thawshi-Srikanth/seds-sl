import type { CollectionConfig } from "payload";

export const ObserveMoonEvents: CollectionConfig = {
  slug: "observe-moon-events",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "year", "eventDate", "status", "createdAt"],
  },
  access: {
    read: ({ req }) => {
      // Allow public read if status is published
      if (!req.user) {
        return {
          status: {
            equals: "published",
          },
        };
      }
      return true;
    },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Event Title",
    },
    {
      name: "year",
      type: "text",
      required: true,
      unique: true,
      index: true,
      label: "Event Year (e.g. 2026)",
    },
    {
      name: "eventDate",
      type: "text",
      defaultValue: "October 24, 2026",
      label: "Event Date",
    },
    {
      name: "eventTime",
      type: "text",
      defaultValue: "06:30 PM - 10:30 PM IST",
      label: "Event Time",
    },
    {
      name: "location",
      type: "text",
      defaultValue: "Colombo & Chapter Observatories",
      label: "Location / Venue",
    },
    {
      name: "description",
      type: "textarea",
      label: "Event Description",
    },
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
      label: "Hero / Header Image",
    },
    {
      name: "status",
      type: "select",
      defaultValue: "published",
      options: [
        { label: "Published", value: "published" },
        { label: "Draft", value: "draft" },
      ],
      label: "Status",
    },
  ],
};
