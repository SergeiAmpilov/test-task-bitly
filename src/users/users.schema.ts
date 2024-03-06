import mongoose, { Schema } from "mongoose";

export interface IUsersSchema {
	name: string;
	email: string;
	password: string;
}


export const UsersSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 6,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
});