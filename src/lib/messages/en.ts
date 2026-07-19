import type { Messages } from "./types";

const en: Messages = {
  common: {
    loading: "Loading…",
    tryAgain: "Try again",
    logout: "Logout",
  },
  login: {
    title: "Admin Login",
    username: "Username",
    password: "Password",
    submit: "Login",
    submitting: "Logging in…",
    invalid: "Invalid credentials",
  },
  nav: {
    home: "Home",
    gallery: "Gallery",
  },
  gallery: {
    title: "Gallery",
    subtitle: "Glimpses of our campus life, ceremonies, and service to the community.",
    loading: "Loading images…",
    error: "Couldn't load the gallery. Please try refreshing the page.",
    empty: "No photos yet.",
    loadMore: "Load more",
    loadingMore: "Loading…",
  },
  galleryPreview: {
    eyebrow: "Our Community",
    title: "Glimpses of the Vidyapeeth",
    subtitle:
      "Moments from our campus, ceremonies, and seva — a living record of our community's journey.",
    viewFull: "View full gallery",
  },
  video: {
    eyebrow: "Our Vidyapeeth",
    defaultTitle: "Watch our story",
    play: "Play video",
  },
  footer: {
    explore: "Explore",
    contact: "Get in touch",
    rights: "All rights reserved.",
  },
  notFound: {
    title: "Site not available",
    body: "This address isn't set up yet. If you expected a site here, please check the link or contact the administrator.",
  },
  upload: {
    title: "Upload Image",
    file: "Image file",
    alt: "Alt text (optional)",
    submit: "Upload",
    uploading: "Uploading…",
    failed: "Upload failed — check your connection and try again.",
    success: "Uploaded successfully:",
  },
  admin: {
    language: "Language",
  },
  language: {
    hi: "हिन्दी",
    en: "English",
    switch: "Change language",
  },
};

export default en;
