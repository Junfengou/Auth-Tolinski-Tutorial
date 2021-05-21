import bcrypt from "bcryptjs";

const { genSalt, hash } = bcrypt;

export async function registerUser(email, password) {
	// Dynamic import
	/* The reason we need to do this is because when this function is run, 
    it runs before the DB is connected in [index.js]

    It will catch any loading order errors
    */
	const { user } = await import("../user/user.js");

	// Generate the salt
	const salt = await genSalt(10);

	// Hash with salt
	const hashedPassword = await hash(password, salt);

	// Store in database
	const result = await user.insertOne({
		email: {
			address: email,
			verified: false,
		},
		password: hashedPassword,
	});

	// Return user from database
	return result.insertedId;
}
