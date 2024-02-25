module.exports = {
  development: {
    username: "root",
    password: process.env.password,
    database: "webapp",
    host: process.env.host,
    dialect: "mysql",
  },
};
