import { defineConfig } from "tinacms";
import criteriaV2 from "../packages/standard-core/src/criteria.v2.json";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

const criteriaPrefixByPillar: Record<string, string> = {
  environment: "E",
  society: "S",
  social: "S",
  culture: "C",
  cultural: "C",
  finance: "F",
  financial: "F",
};

type CriteriaWithDisplayIds = {
  displayId?: string;
  label: string;
};

const criteriaOptions = criteriaV2.pillars.flatMap((pillar) =>
  pillar.criteria.map((rawCriterion, index) => {
    const criterion = rawCriterion as CriteriaWithDisplayIds;
    const generatedDisplayId = `${criteriaPrefixByPillar[pillar.id]}${index + 1}`;
    const displayId = criterion.displayId ?? generatedDisplayId;

    return {
      label: `${displayId} - ${criterion.label}`,
      value: displayId,
    };
  }),
);

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "apps/calculator/client/public",
  },
  // Uncomment to allow cross-origin requests from non-localhost origins
  // during local development (e.g. GitHub Codespaces, Gitpod, Docker).
  // Use 'private' to allow all private-network IPs (WSL2, Docker, etc.)
  // server: {
  //   allowedOrigins: ['https://your-codespace.github.dev'],
  // },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "apps/calculator/client/public",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/r/content-modelling-collections/
  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "content/posts",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
        ui: {
          // This is an DEMO router. You can remove this to fit your site
          router: ({ document }) => `/demo/blog/${document._sys.filename}`,
        },
      },
      {
        name: "project",
        label: "Projects",
        path: "content/projects",
        format: "mdx",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "number",
            name: "year",
            label: "Year",
          },
          {
            type: "string",
            name: "location",
            label: "Location",
          },
          {
            type: "string",
            name: "projectType",
            label: "Project Type",
          },
          {
            type: "string",
            name: "website",
            label: "Website",
          },
          {
            type: "image",
            name: "coverImage",
            label: "Cover Image",
          },
          {
            type: "image",
            name: "gallery",
            label: "Gallery",
            list: true,
          },
          {
            type: "string",
            name: "pillars",
            label: "Pillars",
            list: true,
            options: ["environment", "society", "culture", "finance"],
          },
          {
            type: "string",
            name: "criteria",
            label: "Criteria",
            list: true,
            options: criteriaOptions,
          },
          {
            type: "string",
            name: "rating",
            label: "Rating",
            options: ["Emerging", "Advanced", "Transformative"],
          },
          {
            type: "number",
            name: "score",
            label: "Score",
          },
          {
            type: "boolean",
            name: "published",
            label: "Published",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
        ui: {
          router: ({ document }) => `/projects/${document._sys.filename}`,
        },
      },
    ],
  },
});
