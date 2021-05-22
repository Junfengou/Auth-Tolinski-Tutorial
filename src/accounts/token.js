import jwt from "jsonwebtoken";

const JWTSignature = process.env.JWT_SIGNATURE;

export async function createToken(sessionToken, userId) {
	try {
		// Create a refresh token
		// refresh token needs session id
		const refreshToken = jwt.sign(
			{
				sessionToken,
			},
			JWTSignature
		);
		// Create a access token
		// access token need session id and user id

		const accessToken = jwt.sign(
			{
				sessionToken,
				userId,
			},
			JWTSignature
		);

		// Return refresh token and access token
		return { refreshToken, accessToken };
	} catch (e) {
		console.error(e);
	}
}
