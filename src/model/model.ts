import {Table, Model, Column, DataType} from "sequelize-typescript";

@Table({
    timestamps: false,
    tableName: "model",
  })
  export class model extends Model {
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    name!: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    description!: string;
  }