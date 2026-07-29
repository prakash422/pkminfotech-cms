const NOTE_WORDS = "note|notes|नोट|disclaimer|important|ध्यान दें"

/** Legacy posts wrote labels as single-item bullet lists, e.g. `<ul><li><p>Note:-</p></li></ul>` */
const NOTE_LABEL = String.raw`(?:<(?:ul|ol)>\s*<li>\s*(?:<p[^>]*>)?\s*(?:<strong>)?\s*(?:${NOTE_WORDS})\s*(?:<\/strong>)?\s*[:：]?\s*[-–—]?\s*(?:<\/p>)?\s*<\/li>\s*<\/(?:ul|ol)>|<p[^>]*>\s*(?:<strong>)?\s*(?:${NOTE_WORDS})\s*(?:<\/strong>)?\s*[:：]\s*[-–—]?\s*(?:<\/strong>)?\s*<\/p>)`

const ALSO_READ_LABEL = String.raw`(?:<(?:ul|ol)>\s*<li>\s*(?:<p[^>]*>)?\s*(?:<strong>)?\s*also\s+read(?:\s+this)?\s*(?:<\/strong>)?\s*[:：]?\s*[-–—]?\s*(?:<\/p>)?\s*<\/li>\s*<\/(?:ul|ol)>|<p[^>]*>\s*(?:<strong>)?\s*also\s+read(?:\s+this)?\s*(?:<\/strong>)?\s*[:：]?\s*[-–—]?\s*(?:<\/strong>)?\s*<\/p>)`

function markdownishToHtml(content: string): string {
  const normalized = content.replace(
    /href="http:\/\/(www\.)?pkminfotech\.com/g,
    'href="https://www.pkminfotech.com'
  )

  // Editor-authored posts are already block-level HTML; wrapping them in <p> nests invalidly.
  if (/^\s*<(p|h[1-6]|ul|ol|div|figure|blockquote|table|section|aside)\b/i.test(normalized)) {
    return normalized.replace(/<p>/g, '<p class="blog-p">')
  }

  return normalized
    .replace(/\n\n/g, '</p><p class="blog-p">')
    .replace(/\n/g, "<br>")
    .replace(/^/, '<p class="blog-p">')
    .replace(/$/, "</p>")
    .replace(/### (.*?)(<br>|$)/g, '</p><h3 class="blog-h3">$1</h3><p class="blog-p">')
    .replace(/## (.*?)(<br>|$)/g, '</p><h2 class="blog-h2">$1</h2><p class="blog-p">')
    .replace(/# (.*?)(<br>|$)/g, '</p><h2 class="blog-h2">$1</h2><p class="blog-p">')
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/<p[^>]*>\s*<\/p>/g, "")
}

/** Turns bare "Note:-" / "Also Read This :-" labels into proper callout blocks. */
function upgradeCallouts(html: string): string {
  return html
    .replace(
      new RegExp(`${NOTE_LABEL}\\s*(<p[^>]*>[\\s\\S]*?<\\/p>)`, "gi"),
      (_match, body: string) =>
        `<aside class="blog-note"><span class="blog-note-label">Note</span><div class="blog-note-body">${body}</div></aside>`
    )
    .replace(
      new RegExp(`${ALSO_READ_LABEL}\\s*((?:<p[^>]*>\\s*<a[\\s\\S]*?<\\/a>\\s*<\\/p>\\s*)+)`, "gi"),
      (_match, links: string) => {
        const items = links
          .split(/<\/p>/i)
          .map((chunk) => chunk.replace(/^[\s\S]*?<p[^>]*>/i, "").trim())
          .filter(Boolean)
          .map((link) => `<li>${link}</li>`)
          .join("")
        return `<aside class="blog-also-read"><span class="blog-also-read-label">Also read</span><ul>${items}</ul></aside>`
      }
    )
    .replace(
      /<p[^>]*>\s*(this post (?:was )?written by [^<]{1,60})\s*<\/p>/gi,
      '<p class="blog-byline">$1</p>'
    )
}

export function formatBlogContent(content: string): string {
  return upgradeCallouts(markdownishToHtml(content))
}
