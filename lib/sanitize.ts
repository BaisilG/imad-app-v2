import sanitizeHtml from 'sanitize-html';

export function sanitizeContent(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [
      'p',
      'h1',
      'h2',
      'h3',
      'strong',
      'em',
      'u',
      'ul',
      'ol',
      'li',
      'pre',
      'code',
      'blockquote',
      'img',
      'a',
      'br'
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt']
    },
    allowedSchemes: ['http', 'https', 'data', 'mailto']
  });
}
