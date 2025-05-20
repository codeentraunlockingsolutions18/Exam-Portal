import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";

const Quiz = sequelize.define("Quiz", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: DataTypes.STRING,
  description: DataTypes.STRING,
  time_limit: DataTypes.INTEGER,
  course_id: DataTypes.STRING,
});

export default Quiz;
