/**
 * Single source of truth for URL paths used from client/server code.
 * The physical API route files live under src/app/api and src/pages/api;
 * these constants are how the rest of the app *references* them, so a path
 * change happens in exactly one place.
 */
export const ROUTES = {
  home: "/",
  gallery: "/gallery",
  upload: "/upload",
  admin: "/admin",
} as const;

export const API_ROUTES = {
  auth: "/api/auth",
  checkAuth: "/api/check-auth",
  logout: "/api/logout",
  siteConfig: "/api/siteconfig",
  gallery: "/api/gallery",
  upload: "/api/upload",
  adminUpload: "/api/admin-upload",
} as const;
