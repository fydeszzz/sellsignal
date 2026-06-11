// Resolve a public/ asset to a URL that works under any base.
//
// public/ files are copied to the dist root and were referenced as absolute
// "/icon.png". That works for a web app served from the domain root, but in
// the Electron desktop build the page loads over file://, where "/icon.png"
// resolves to the FILESYSTEM root (C:\icon.png) and the image 404s.
//
// import.meta.env.BASE_URL reflects Vite's `base` config — "/" for the web
// build, "./" for the relative-base desktop build (see vite.config.js). It
// always ends in "/", so a simple concat yields the right relative URL in
// both environments. Pass the bare filename, e.g. asset('stock.png').
export const asset = (name) => `${import.meta.env.BASE_URL}${name}`;
