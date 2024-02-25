module.exports = {
  development: {
    username: process.env.user,
    password: process.env.password,
    database: "webapp",
    host: process.env.host,
    dialect: "mysql",
  },
};
