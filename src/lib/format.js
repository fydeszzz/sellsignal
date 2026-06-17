// Shared number formatter.
//
// Locale-grouped fixed-decimal string for money/percent display, with a
// neutral em-dash placeholder for non-finite input (blank/NaN). Shared by
// App.jsx and FeeDiscountPage.jsx so the two pages format identically.
export const fmt = (n, digits = 2) =>
  Number.isFinite(n)
    ? n.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits })
    : '—';
