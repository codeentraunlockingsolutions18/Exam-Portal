import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";

const Option = sequelize.define("Option", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_correct: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

export default Option;
