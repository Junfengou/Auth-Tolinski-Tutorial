import { client } from "../db.js";

// model connect to the database
export const session = client.db("test").collection("session");
