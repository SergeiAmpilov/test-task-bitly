import mongoose from "mongoose";


export const LinksSchema = new mongoose.Schema({
	link: {
		type: String
	},
	shortlink: {
		type: String
	},
	userid: {
		type: String,
	}
});