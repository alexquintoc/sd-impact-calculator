export type FrontmatterScalar = string | number | boolean;
export type FrontmatterObject = Record<string, FrontmatterScalar>;
export type FrontmatterValue = FrontmatterScalar | string[] | FrontmatterObject[];

export function parseMdx(fileContents: string) {
  const match = fileContents.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!match) {
    return { frontmatter: {}, body: fileContents };
  }

  return {
    frontmatter: parseFrontmatter(match[1]),
    body: match[2].trim(),
  };
}

function parseFrontmatter(frontmatter: string) {
  const values: Record<string, FrontmatterValue> = {};
  const lines = frontmatter.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const keyValue = line.match(/^([A-Za-z0-9_-]+):(?:\s*(.*))?$/);

    if (!keyValue) {
      continue;
    }

    const [, key, rawValue = ""] = keyValue;

    if (rawValue === "") {
      const list: Array<string | FrontmatterObject> = [];
      while (lines[index + 1]?.match(/^\s+-\s+/)) {
        index += 1;
        const item = lines[index].replace(/^\s+-\s+/, "").trim();
        const inlineObjectMatch = item.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);

        if (inlineObjectMatch) {
          const objectValue: FrontmatterObject = {};
          assignObjectValue(objectValue, inlineObjectMatch[1], inlineObjectMatch[2]);

          while (lines[index + 1]?.match(/^\s{4}[A-Za-z0-9_-]+:\s*/)) {
            index += 1;
            const objectLine = lines[index].trim();
            const objectMatch = objectLine.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
            if (objectMatch) {
              assignObjectValue(objectValue, objectMatch[1], objectMatch[2]);
            }
          }

          list.push(objectValue);
        } else {
          list.push(unquote(item));
        }
      }
      values[key] = list.every((item) => typeof item === "string")
        ? (list as string[])
        : (list as FrontmatterObject[]);
    } else {
      values[key] = parseScalar(rawValue.trim());
    }
  }

  return values;
}

function assignObjectValue(
  objectValue: FrontmatterObject,
  key: string,
  rawValue: string,
) {
  objectValue[key] = parseScalar(rawValue.trim());
}

function parseScalar(value: string): FrontmatterScalar {
  if (value === "true") return true;
  if (value === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  return unquote(value);
}

function unquote(value: string) {
  return value.replace(/^["']|["']$/g, "");
}
