// Singleton style means one function per file....not the case here lol
import jwt from "jsonwebtoken";
import mongo from "mongodb";
import { createToken } from "./token.js";

const { ObjectId } = mongo;
const JWTSignature = process.env.JWT_SIGNATURE;

// request contains the cookies
export async function getUserFromCookies(request, res) {
	try {
		const { user } = await import("../user/user.js");
		const { session } = await import("../session/session.js");
		// Check to make sure access token exist
		if (request?.cookies?.accessToken) {
			// Check to see if there is a access token
			const { accessToken } = request.cookies;

			// Decode the access token and return user from record
			const decodedAccessToken = jwt.verify(accessToken, JWTSignature);

			// don't need to await it since it already return a promise
			// The [_id] stored in ObjectId(...) format
			return user.findOne({
				_id: ObjectId(decodedAccessToken?.userId),
			});
		}

		// ---------------------------------------------------------->
		// Refresh token part
		if (request?.cookies?.refreshToken) {
			const { refreshToken } = request.cookies;

			// Decode refresh token
			const { sessionToken } = jwt.verify(refreshToken, JWTSignature);

			const currentSession = await session.findOne({
				sessionToken,
			});

			if (currentSession?.valid) {
				// Look up current user
				const currentUser = await user.findOne({
					_id: ObjectId(currentSession?.userId),
				});

				console.log("currentUser", currentUser);

				// Refresh token
				await refreshTokens(sessionToken, currentUser._id, res);
				// Return current user

				return currentUser;
			}
		}
	} catch (e) {
		console.error(e);
	}
}

// Generate a new access token
export async function refreshTokens(sessionToken, userId, res) {
	try {
		// Create JWT
		const { accessToken, refreshToken } = await createToken(
			sessionToken,
			userId
		);

		// Set Cookie with JWT - chain them
		const now = new Date();
		// 30 days in the future
		const refreshExpires = now.setDate(now.getDate() + 30);

		res
			.setCookie("refreshToken", refreshToken, {
				path: "/",
				domain: "localhost",
				httpOnly: true,
				expires: refreshExpires,
			})
			.setCookie("accessToken", accessToken, {
				path: "/",
				domain: "localhost",
				httpOnly: true,
			});
	} catch (e) {
		console.error(e);
	}
}
