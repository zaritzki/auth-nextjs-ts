import mongoose from "mongoose";

export async function dbConnect() {
	try {
		mongoose.connect(process.env.MONGO_URL!);
		const connection = mongoose.connection;

		connection.on("connected", () => {
			console.log("MongoDB connected succesfully!");
		});

		connection.on("error", (err) => {
			console.log("MongoDB conenction failed. Please make sure MongoDB is running - " + err);
			process.exit();
		});
	} catch (err) {
		console.log('Something goes wrong!');
		console.log(err);
	}
}