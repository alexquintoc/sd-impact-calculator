import fs from "node:fs";
import path from "node:path";
import { parseMdx, type FrontmatterValue } from "./content";

export const UPDATE_CATEGORIES = [
  "Event",
  "Project update",
  "Partnership",
  "Research",
  "Tool release",
  "Opportunity",
] as const;

export type UpdateCategory = (typeof UPDATE_CATEGORIES)[number];

export type Update = {
  slug: string;
  title: string;
  summary: string;
  publishedDate: string;
  published: boolean;
  category: UpdateCategory;
  featuredImage?: string;
  imageAlt?: string;
  body: string;
  showInAnnouncementBar: boolean;
  announcementText?: string;
  announcementLinkLabel: string;
  announcementStart?: string;
  announcementEnd?: string;
  announcementPriority?: number;
};

const updatesDirectory = path.join(process.cwd(), "content", "updates");

export function getAllUpdates(): Update[] {
  if (!fs.existsSync(updatesDirectory)) return [];

  return fs
    .readdirSync(updatesDirectory)
    .filter((filename) => /\.mdx?$/.test(filename))
    .map((filename) => {
      const contents = fs.readFileSync(path.join(updatesDirectory, filename), "utf8");
      const { frontmatter, body } = parseMdx(contents);
      return normalizeUpdate(filename.replace(/\.mdx?$/, ""), frontmatter, body);
    })
    .filter((update) => update.published)
    .sort((a, b) => dateValue(b.publishedDate) - dateValue(a.publishedDate));
}

export function getUpdate(slug: string) {
  return getAllUpdates().find((update) => update.slug === slug) ?? null;
}

export function selectAnnouncement(updates: Update[], now = new Date()) {
  const currentTime = now.getTime();
  return updates
    .filter((update) => {
      if (!update.published || !update.showInAnnouncementBar) return false;
      if (update.announcementStart && dateValue(update.announcementStart) > currentTime) return false;
      if (update.announcementEnd && dateValue(update.announcementEnd) < currentTime) return false;
      return true;
    })
    .sort(
      (a, b) =>
        (b.announcementPriority ?? 0) - (a.announcementPriority ?? 0) ||
        dateValue(b.publishedDate) - dateValue(a.publishedDate),
    )[0] ?? null;
}

function normalizeUpdate(
  slug: string,
  frontmatter: Record<string, FrontmatterValue>,
  body: string,
): Update {
  const featuredImage = optionalString(frontmatter.featuredImage);
  const imageAlt = optionalString(frontmatter.imageAlt);
  if (featuredImage && !imageAlt) {
    console.warn(`Update "${slug}" has a featured image but no imageAlt and will be shown without its image.`);
  }

  return {
    slug,
    title: String(frontmatter.title ?? "Untitled update"),
    summary: String(frontmatter.summary ?? ""),
    publishedDate: String(frontmatter.publishedDate ?? ""),
    published: frontmatter.published === true,
    category: String(frontmatter.category ?? "Project update") as UpdateCategory,
    featuredImage: featuredImage && imageAlt ? featuredImage : undefined,
    imageAlt,
    body,
    showInAnnouncementBar: frontmatter.showInAnnouncementBar === true,
    announcementText: optionalString(frontmatter.announcementText),
    announcementLinkLabel: String(frontmatter.announcementLinkLabel || "Learn more"),
    announcementStart: optionalString(frontmatter.announcementStart),
    announcementEnd: optionalString(frontmatter.announcementEnd),
    announcementPriority:
      typeof frontmatter.announcementPriority === "number"
        ? frontmatter.announcementPriority
        : undefined,
  };
}

function optionalString(value: FrontmatterValue | undefined) {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function dateValue(value: string) {
  const time = Date.parse(value);
  return Number.isNaN(time) ? 0 : time;
}
