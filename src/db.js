import mongo from "mongodb";

const { MongoClient } = mongo;

// connection string
const url = process.env.MONGO_CONNECTION_STRING;

export const client = new MongoClient(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// connect to DB
export async function connectDb() {
	// since it's async code, anything that fail will move straight to the catch block
	try {
		await client.connect();

		// confirm connection, not necessary
		await client.db("admin").command({ ping: 1 });

		console.log("Connected to DB");
	} catch (e) {
		console.error(e);

		// if there is a problem, close the connection to the database
		await client.close();
	}
}
