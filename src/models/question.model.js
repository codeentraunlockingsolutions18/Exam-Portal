import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";

const Question = sequelize.define("Question", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Question;
