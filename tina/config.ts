import { defineConfig } from "tinacms";
import { data_fileFields } from "./templates";
import { service_providerFields } from "./templates";

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || "main";

export default defineConfig({
  branch,
  clientId: null, // Get this from tina.io
  token: null, // Get this from tina.io
  client: { skip: true },
  build: {
    outputFolder: "admin",
    publicFolder: "static",
  },
  media: {
    tina: {
      mediaRoot: "img",
      publicFolder: "static",
    },
  },
  schema: {
    collections: [
      // {
      //   format: "json",
      //   label: "Data",
      //   name: "data",
      //   path: "data",
      //   frontmatterFormat: "toml",
      //   frontmatterDelimiters: "+++",
      //   match: {
      //     include: "**/*",
      //   },
      //   fields: [
      //     {
      //       type: "string",
      //       name: "Items",
      //       label: "Items",
      //       description: "Provide the items",
      //       list: true,
      //     },
      //   ],
      // },
      {
        format: "md",
        label: "Service providers",
        name: "service_providers",
        path: "content/MHD",
        frontmatterFormat: "toml",
        frontmatterDelimiters: "+++",
        defaultItem: () => {
          return {
            best_way_to_contact: [],
            ada_compliant: false,
            age_groups: [],
            client_requirements: "",
            draft: true,
            email: "",
            facebook: "",
            highlight: false,
            image: "",
            instagram: "",
            linkedin: "",
            medium: "",
            payment_info_clinical: "",
            payment_info_non_clinical: "",
            payment_types: [],
            payment_types_non_clinical: [],
            program: "",
            sliding_scale_clinical: true,
            sliding_scale_non_clinical: true,
            tags: [],
            telehealth: "Not applicable",
            tiktok: "",
            twitter: "",
            website: "",
            youtube: "",
          };
        },
        match: {
          include: "**/*",
        },
        fields: [
          {
            type: "rich-text",
            name: "body",
            label: "Body of Document",
            description: "This is the markdown body",
            isBody: true,
          },
          {
            name: "draft",
            label: "Draft",
            type: "boolean",
            required: true,
            description: "If this is checked the post will not be published",
          },
          ...service_providerFields(),
        ],
      },
    ],
  },
});
