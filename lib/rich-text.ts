import sanitizeHtml from "sanitize-html";

const allowedColor = /^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\))$/i;

export function sanitizeRichText(value: string, maxLength = 30_000) {
  const html = typeof value === "string" ? value : "";
  return sanitizeHtml(html.slice(0, maxLength), {
    allowedTags: [
      "p",
      "div",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "ul",
      "ol",
      "li",
      "h2",
      "h3",
      "h4",
      "blockquote",
      "span",
      "section",
      "a",
    ],
    allowedAttributes: {
      "*": ["style", "align"],
      a: ["href", "rel", "target"],
    },
    transformTags: {
      font: (_tagName, attributes) => {
        const color = attributes.color?.trim();
        const attribs: Record<string, string> = {};
        if (color && allowedColor.test(color)) attribs.style = `color:${color}`;
        return {
          tagName: "span",
          attribs,
        };
      },
      a: (_tagName, attributes) => ({
        tagName: "a",
        attribs:
          attributes.target === "_blank"
            ? { ...attributes, rel: "noopener noreferrer" }
            : attributes,
      }),
    },
    allowedStyles: {
      "*": {
        color: [allowedColor],
        "text-align": [/^(left|center|right|justify)$/],
        "font-weight": [/^(bold|[5-9]00)$/],
        "font-style": [/^italic$/],
        "text-decoration": [/^(underline|line-through)$/],
        "text-decoration-line": [/^(underline|line-through)$/],
      },
    },
    allowedSchemes: ["http", "https", "mailto"],
    disallowedTagsMode: "discard",
  }).trim();
}

export function sanitizeLegalHtml(value: string) {
  return sanitizeRichText(value, 80_000);
}

export function richTextToPlainText(value: string) {
  const html = typeof value === "string" ? value : "";
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
