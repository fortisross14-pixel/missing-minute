const DAY_MS = 24 * 60 * 60 * 1000;

function parseIsoDate(value) {
  const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return new Date(Date.UTC(1934, 9, 14));
  return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
}

export function officialDateFor(layer, flags = {}) {
  const base = parseIsoDate(layer.baseDate);
  const advances = layer.advanceFlag && flags[layer.advanceFlag] ? (layer.advanceDays ?? 1) : 0;
  const date = new Date(base.getTime() + advances * DAY_MS);
  const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'UTC' }).format(date).toUpperCase();
  const month = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' }).format(date).toUpperCase();
  return {
    iso: date.toISOString().slice(0, 10),
    weekday,
    month,
    day: String(date.getUTCDate()).padStart(2, '0'),
    year: String(date.getUTCFullYear()),
    status: advances ? (layer.advancedStatus || 'TOMORROW') : (layer.baseStatus || 'TODAY')
  };
}

export function splitFlapCharacters(value) {
  return String(value).split('').map((character, index) => ({ character, index }));
}
