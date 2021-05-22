import { createSession } from "./session.js";
import { createToken } from "./token.js";

export async function logUserIn(userId, request, res) {
	const connectionInfo = {
		ip: request.ip, // fastify thing
		userAgent: request.headers["user-agent"],
	};

	// Create Session by generating a token
	const sessionToken = await createSession(userId, connectionInfo);

	// Create JWT
	const { accessToken, refreshToken } = await createToken(sessionToken, userId);

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
}
