const settings = {
  production: {
    chat: {
      url: "https://textifai-chat-6ti4marjoq-ez.a.run.app",
    },
    documents: {
      url: "https://textifai-documents-6ti4marjoq-ez.a.run.app",
    },
    payments: {
      url: "http://localhost:4242",
    },
  },
  development: {
    chat: {
      url: "http://localhost:3001",
    },
    documents: {
      url: "http://localhost:3000",
    },
    payments: {
      url: "http://localhost:4242",
    },
  },
};

export const config =
  process.env.NODE_ENV === "production"
    ? settings.production
    : settings.development;
