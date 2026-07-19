export type Messages = {
  common: {
    loading: string;
    tryAgain: string;
    logout: string;
  };
  login: {
    title: string;
    username: string;
    password: string;
    submit: string;
    submitting: string;
    invalid: string;
  };
  nav: {
    home: string;
    gallery: string;
  };
  gallery: {
    title: string;
    subtitle: string;
    loading: string;
    error: string;
    empty: string;
    loadMore: string;
    loadingMore: string;
  };
  galleryPreview: {
    eyebrow: string;
    title: string;
    subtitle: string;
    viewFull: string;
  };
  video: {
    eyebrow: string;
    defaultTitle: string;
    play: string;
  };
  footer: {
    explore: string;
    contact: string;
    rights: string;
  };
  notFound: {
    title: string;
    body: string;
  };
  upload: {
    title: string;
    file: string;
    alt: string;
    submit: string;
    uploading: string;
    failed: string;
    success: string;
  };
  admin: {
    language: string;
  };
  language: {
    hi: string;
    en: string;
    switch: string;
  };
};
