module.exports = {
  development: {
    username: process.env.username,
    password: process.env.password,
    database: "webapp",
    host: process.env.host,
    dialect: "mysql",
  },
};
