/* [nodemon ./src/index.js] - to run and watch the program
    Fastify is just like Express server
*/
import "./env.js"; // immediately load and run
import { fastify } from "fastify";
import fastifyStatic from "fastify-static";
import path from "path";
import { fileURLToPath } from "url";
import { connectDb } from "./db.js";
import { registerUser } from "./accounts/register.js";
import { authorizeUser } from "./accounts/authorize.js";
import fastifyCookie from "fastify-cookie";

// new to ESM [import.meta.url] allows us to get meta-data about our file
// ESM specific features
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // current directory

const app = fastify();

// spin up Backend
async function startApp() {
	try {
		// Cookie env can be anything
		app.register(fastifyCookie, {
			secret: process.env.COOKIE_SIGNATURE,
		});

		// Basically....if you type in [http://localhost:3000/index.html] you get directed to html page
		app.register(fastifyStatic, {
			root: path.join(__dirname, "public"), // current directory with the public directory inside of it
		});

		// empty {} is options
		// register
		app.post("/api/register", {}, async (req, res) => {
			try {
				const userId = await registerUser(req.body.email, req.body.password);
				console.log(`userId - ${userId}`);
			} catch (e) {
				console.error(e);
			}
		});

		// login ------------------------------------------------------->

		app.post("/api/authorize", {}, async (req, res) => {
			try {
				const userId = await authorizeUser(req.body.email, req.body.password);

				// Generate auth tokens

				// Set cookies

				res
					.setCookie("testCookie", "the value is this", {
						httpOnly: true,
						path: "/",
						domain: "localhost",
					})
					.send({
						data: "just testing",
					});
			} catch (e) {
				console.error(e);
			}
		});

		// app.get("/", {}, (req, res) => {
		// console.log(req.cookies.testCookie);
		// 	res.send({
		// 		data: "Hello world",
		// 	});
		// });

		await app.listen(3000);
		console.log("🍖 Port running on 3000");
	} catch (e) {
		console.error(e);
	}
}

// First connect to the DB
// Then run a callback function when the connection to db is established (Async)
// then start the app
connectDb().then(() => {
	startApp();
});
