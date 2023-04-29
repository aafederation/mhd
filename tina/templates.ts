import type { TinaField } from "tinacms";
export function data_fileFields() {
  return [
    {
      type: "string",
      name: "Items",
      label: "Items",
      list: true,
    },
  ] as TinaField[];
}
export function service_providerFields() {
  return [
    {
      type: "string",
      name: "org",
      label: "Organization name",
      required: true,
    },
    {
      type: "boolean",
      name: "highlight",
      label: "Highlight",
    },
    {
      type: "string",
      name: "program",
      label: "Program/clinic name (if applicable)",
    },
    {
      type: "string",
      name: "website",
      label: "Website",
    },
    {
      type: "string",
      name: "email",
      label: "Email",
    },
    {
      type: "string",
      name: "facebook",
      label: "Facebook",
    },
    {
      type: "string",
      name: "twitter",
      label: "Twitter",
    },
    {
      type: "string",
      name: "instagram",
      label: "Instagram",
    },
    {
      type: "string",
      name: "linkedin",
      label: "Linkedin",
    },
    {
      type: "string",
      name: "youtube",
      label: "Youtube",
    },
    {
      type: "string",
      name: "tiktok",
      label: "Tiktok",
    },
    {
      type: "string",
      name: "medium",
      label: "Medium",
    },
    {
      type: "string",
      name: "best_way_to_contact",
      label: "Best way to contact",
      list: true,
      options: ["Phone", "Email", "Website"],
    },
    {
      type: "string",
      name: "payment_types",
      label: "Payment types (clinical)",
      list: true,
    },
    {
      type: "boolean",
      name: "sliding_scale_clinical",
      label: "Sliding scale (clinical)",
    },
    {
      type: "string",
      name: "payment_info_clinical",
      label: "Payment info (clinical)",
      ui: {
        component: "textarea",
      },
    },
    {
      type: "string",
      name: "payment_types_non_clinical",
      label: "Payment types (non-clinical)",
      list: true,
    },
    {
      type: "boolean",
      name: "sliding_scale_non_clinical",
      label: "Sliding scale (non-clinical)",
    },
    {
      type: "string",
      name: "payment_info_non_clinical",
      label: "Payment info (non-clinical)",
      ui: {
        component: "textarea",
      },
    },
    {
      type: "boolean",
      name: "ada_compliant",
      label: "ADA compliant",
    },
    {
      type: "string",
      name: "telehealth",
      label: "Telehealth service",
      options: ["Yes", "No", "Not applicable"],
    },
    {
      type: "string",
      name: "tags",
      label: "Tags",
      list: true,
      ui: {
        component: "tags",
      },
    },
    {
      type: "string",
      name: "client_requirements",
      label: "Client requirements",
    },
    {
      type: "string",
      name: "age_groups",
      label: "Age groups",
      list: true,
    },
    {
      type: "object",
      name: "locations",
      label: "Locations",
      list: true,
      fields: [
        {
          type: "string",
          name: "address",
          label: "Physical address",
          ui: {
            component: "textarea",
          },
        },
        {
          type: "string",
          name: "latLng",
          label: "latitude, longitude",
        },
        {
          type: "string",
          name: "boroughs",
          label: "Boroughs",
          list: true,
        },
        {
          type: "string",
          name: "phone_number",
          label: "Phone number",
        },
        {
          type: "string",
          name: "services",
          label: "Clinical services",
          list: true,
        },
        {
          type: "boolean",
          name: "psychotherapy",
          label: "Psychotherapy",
        },
        {
          type: "string",
          name: "psychotherapy_specialties",
          label: "Psychotherapy specialties",
          list: true,
        },
        {
          type: "string",
          name: "psychotherapy_types",
          label: "Psychotherapy types",
          list: true,
        },
        {
          type: "string",
          name: "non_clinical_services",
          label: "Non-clinical services",
          list: true,
        },
        {
          type: "string",
          name: "credentials",
          label: "Credentials",
          list: true,
        },
        {
          type: "string",
          name: "trainings",
          label: "Trainings",
          ui: {
            component: "textarea",
          },
        },
        {
          type: "string",
          name: "languages",
          label: "Languages",
          list: true,
        },
        {
          type: "string",
          name: "new_clients",
          label: "New clients",
          options: ["Yes", "No", "Not applicable"],
        },
        {
          type: "string",
          name: "new_clients_detail",
          label: "New clients detail",
          ui: {
            component: "textarea",
          },
        },
        {
          type: "string",
          name: "parking",
          label: "Parking",
          options: ["Yes", "No", "Street parking"],
        },
        {
          type: "object",
          name: "public_transportation",
          label: "Public transportation options",
          list: true,
          fields: [
            {
              type: "string",
              name: "transport_option",
              label: "Transport option",
            },
          ],
        },
        {
          type: "string",
          name: "staff_gender",
          label: "Gender Identification of Provider(s)",
          list: true,
        },
        {
          type: "object",
          name: "hours_of_operation",
          label: "Hours of operation",
          list: true,
          fields: [
            {
              type: "string",
              name: "day_hours",
              label: "Days hours",
            },
          ],
        },
      ],
    },
    {
      type: "image",
      name: "image",
      label: "Image",
    },
  ] as TinaField[];
}
