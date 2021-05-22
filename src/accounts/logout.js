// If refresh token doesn't exist, chances are the access token won't exist
import jwt from "jsonwebtoken";
const JWTSignature = process.env.JWT_SIGNATURE;

export async function logout(request, res) {
	try {
		const { session } = await import("../session/session.js");

		if (request?.cookies?.refreshToken) {
			// Get refresh token
			const { refreshToken } = request.cookies;

			// Decode sessionToken from refresh token
			const { sessionToken } = jwt.verify(refreshToken, JWTSignature);

			// Delete database record for session
			await session.deleteOne({
				sessionToken,
			});
		}

		// Remove cookies
		res.clearCookie("refreshToken").clearCookie("accessToken");
	} catch (e) {
		console.error(e);
	}
}
