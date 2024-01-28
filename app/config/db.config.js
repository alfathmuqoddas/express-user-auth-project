module.exports = {
  HOST: "ep-patient-queen-60636982-pooler.ap-southeast-1.postgres.vercel-storage.com",
  USER: "default",
  PASSWORD: "PeC1JBmiNAg8",
  DB: "verceldb",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {
    ssl: {
      require: true,
    },
  },
};
