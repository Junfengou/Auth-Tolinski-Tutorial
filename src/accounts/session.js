import { randomBytes } from "crypto";

export async function createSession(userId, connection) {
	try {
		// Generate a session token
		const sessionToken = randomBytes(69).toString("hex");

		// Retrieve connection information by destructure
		const { ip, userAgent } = connection;

		// Database insert for session
		const { session } = await import("../session/session.js");

		// Write to the database of the current session
		await session.insertOne({
			sessionToken,
			userId,
			valid: true,
			userAgent,
			ip,
			updatedAt: new Date(),
			createdAt: new Date(),
		});

		// Return session token
		return sessionToken;
	} catch (e) {
		throw new Error("Session creation failed");
	}
}
