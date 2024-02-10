module.exports = {
  development: {
<<<<<<< HEAD
    username: "root",
    password: "root",
    database: "cloud",
    host: "localhost",
=======
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: "mysql_cloud",
>>>>>>> 0272ce9 (trying)
    dialect: "mysql",
  },
};
