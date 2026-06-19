export function getInitials(name) {
  return String(name || 'U')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';
}

export function formatDate(date) {
  if (!date) return 'Recently';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return 'Recently';
  return parsed.toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatPrice(price) {
  const amount = Number(price || 0);
  return `PKR ${amount.toLocaleString('en-PK')}`;
}

