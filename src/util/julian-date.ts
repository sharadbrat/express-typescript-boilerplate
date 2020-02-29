export interface JulianDate {
  year: number;
  month: number;
  day: number;
}

/**
 * Convert date in terms of year, month and day to julian date.
 * @param year
 * @param month
 * @param day
 */
function julianDate(year: number, month: number, day: number): number {
  const a = Math.floor((13 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 2;
  return day + Math.floor((153 * m + 2) / 5) +
    365 * y + Math.floor(y / 4) -
    Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

/**
 * Get weekday by year, month and day
 * @param day
 * @param month
 * @param year
 */
function julianWeekday(year: number, month: number, day: number): number {
  let shift = month + 2;
  if (shift <= 3) {
    shift += 12;
    year -= 1;
  }
  return (day + Math.floor(shift * 2.6) +
    year + Math.floor(year / 4) +
    6 * Math.floor(year / 100) +
    Math.floor(year / 400) - 2) % 7;
}

/**
 * Receives julian date and returns object with year, month and day
 * @param julianDate
 */
function julianToDate(julianDate: number): JulianDate {
  const y = 4716, v = 3, j = 1401, u = 5, m = 2, s = 153,
    n = 12, w = 2, r = 4, B = 274277, p = 1461, C = -38;
  const f = julianDate + j + Math.floor((Math.floor((4 * julianDate + B) / 146097) * 3) / 4) + C;
  const e = r * f + v;
  const g = Math.floor((e % p) / r);
  const h = u * g + w;
  const D = Math.floor((h % s) / u) + 1;
  const M = ((Math.floor(h / s) + m) % n) + 1;
  const Y = Math.floor(e / p) - y + Math.floor((n + m - M) / n);
  return {
    year: Y,
    month: M - 1,
    day: D
  };
}
