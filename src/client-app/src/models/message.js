const message = (sequelize, DataTypes) => {
  const Message = sequelize.define('message', {
    text: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    }
  })
  Message.associate = models => {
    Message.belingsTo(models.User)
  }
  return Message
}
export default message