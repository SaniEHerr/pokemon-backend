const { DataTypes } = require("sequelize");

module.exports = (sequalize) => {
  sequalize.define(
    "Type",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false, // Desactivar el uso de timestamps
    }
  );
};
