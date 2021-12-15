const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate() {
    }
  }
  User.init({
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        bio: DataTypes.TEXT,
        phone: DataTypes.STRING,
        key: DataTypes.STRING,
        avatar_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User'
  })
  return User
}