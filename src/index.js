/* [nodemon ./src/index.js] - to run and watch the program
    Fastify is just like Express server
*/
import "./env.js"; // immediately load and run
import fastifyStatic from "fastify-static";
import fastifyCookie from "fastify-cookie";
import path from "path";
import { fastify } from "fastify";
import { fileURLToPath } from "url";
import { connectDb } from "./db.js";
import { registerUser } from "./accounts/register.js";
import { authorizeUser } from "./accounts/authorize.js";
import { logUserIn } from "./accounts/logUserIn.js";
import { getUserFromCookies } from "./accounts/user.js";
import { logout } from "./accounts/logout.js";

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
				// fetch the inputs from frontend and run it through authorizeUser()
				// return a boolean value that say whether the user is authenticated or not
				const { isAuthorized, userId } = await authorizeUser(
					req.body.email,
					req.body.password
				);

				// conditional check if the user is authenticated, then proceed to logUserIn()
				if (isAuthorized) {
					await logUserIn(userId, req, res); // need to await this
					// res is coming in from logUserIn() function
					res.send({
						data: "testing",
					});
				}

				res.send({
					data: "Auth failed",
				});
			} catch (e) {
				console.error(e);
			}
		});

		// Protected route: Only authenticated user can access
		app.get("/test", {}, async (req, res) => {
			try {
				// verify user login
				const user = await getUserFromCookies(req, res);
				console.log(user);

				// return user email if it exists, otherwise return unauthorized
				if (user?._id) {
					res.send({
						data: user,
					});
				} else {
					res.send({
						data: "User Lookup Failed",
					});
				}
			} catch (e) {
				throw new Error(e);
			}
		});

		app.post("/api/logout", {}, async (req, res) => {
			try {
				await logout(req, res);
				res.send({
					data: "User logged out",
				});
			} catch (e) {
				console.error(e);
			}
		});

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
