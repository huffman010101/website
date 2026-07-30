// Extract plain text from an uploaded CV / cover letter.
// PDF and DOCX parsers are dynamically imported so their (large) bundles
// only load if the user actually attaches that file type.

export const ACCEPTED_FILE_TYPES = '.pdf,.docx,.txt,.md,.rtf'

export async function extractTextFromFile(file: File): Promise<string> {
  const name = file.name.toLowerCase()

  if (name.endsWith('.pdf')) {
    const pdfjs = await import('pdfjs-dist')
    // Vite resolves this to a hashed asset URL at build time — no CDN needed.
    const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default
    pdfjs.GlobalWorkerOptions.workerSrc = workerUrl

    const buffer = await file.arrayBuffer()
    const pdf = await pdfjs.getDocument({ data: buffer }).promise
    const pages: string[] = []
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      pages.push(
        content.items
          .map((item: any) => ('str' in item ? item.str : ''))
          .join(' ')
      )
    }
    return pages.join('\n\n').replace(/[ \t]+/g, ' ').trim()
  }

  if (name.endsWith('.docx')) {
    const mammoth = await import('mammoth')
    const buffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer: buffer })
    return result.value.trim()
  }

  if (name.endsWith('.txt') || name.endsWith('.md') || name.endsWith('.rtf')) {
    const raw = await file.text()
    // Strip RTF control words so a .rtf paste isn't full of markup
    return name.endsWith('.rtf')
      ? raw.replace(/\\[a-z]+-?\d*\s?/gi, '').replace(/[{}]/g, '').trim()
      : raw.trim()
  }

  if (name.endsWith('.doc')) {
    throw new Error('Legacy .doc files aren\'t supported — please save as .docx or PDF and try again.')
  }

  throw new Error('Unsupported file type. Upload a PDF, DOCX, TXT or MD file.')
}
