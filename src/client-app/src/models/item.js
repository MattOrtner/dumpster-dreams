const item = (sequelize, DataTypes) => {
  const Item = sequelize.define('item', {
    itemName: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    itemPrice: {
      type: DataTypes.NUMBER,
      unique: false,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    
  });

  return Item
}

export default item;
