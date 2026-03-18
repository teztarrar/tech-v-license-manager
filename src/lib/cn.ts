// Lightweight cn utility (replaces clsx + tailwind-merge dependency)
export function cn(...inputs: (string | undefined | null | boolean | Record<string, boolean>)[]): string {
  const classes: string[] = []
  for (const input of inputs) {
    if (!input) continue
    if (typeof input === 'string') classes.push(input)
    else if (typeof input === 'object') {
      for (const [key, val] of Object.entries(input)) {
        if (val) classes.push(key)
      }
    }
  }
  return classes.join(' ')
}
