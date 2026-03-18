export function parseCsv(text: string) {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/ /g,'_'))
  return lines.slice(1).map(line => {
    const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g,''))
    return Object.fromEntries(headers.map((h,i) => [h, vals[i] || '']))
  })
}

export function toCsvString(rows: Record<string,unknown>[], headers: string[]) {
  const header = headers.join(',')
  const data = rows.map(r => headers.map(h => `"${String(r[h]||'').replace(/"/g,'""')}"`).join(','))
  return [header, ...data].join('\n')
}
