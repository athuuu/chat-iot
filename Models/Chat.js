const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    return sequelize.define("chat", {
        username: Sequelize.STRING,
        message: Sequelize.STRING,
        room: Sequelize.STRING,
    })
}