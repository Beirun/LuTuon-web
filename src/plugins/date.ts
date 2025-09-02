export function diffMinutesSeconds(start: string, end: string): string {
  const d1 = new Date(start)
  const d2 = new Date(end)
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return ''

  let diff = Math.abs(d2.getTime() - d1.getTime()) / 1000 // seconds
  const m = Math.floor(diff / 60)
  const s = Math.floor(diff % 60)

  return `${m} min ${s} sec`
}

export function formatDateTime(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}


export function formatDate(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
