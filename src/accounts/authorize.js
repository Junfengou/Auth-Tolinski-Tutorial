import bcrypt from "bcryptjs";
const { compare } = bcrypt;

export async function authorizeUser(email, password) {
	// Dynamic import
	/* The reason we need to do this is because when this function is run, 
    it runs before the DB is connected in [index.js]

    It will catch any loading order errors
    */
	const { user } = await import("../user/user.js");

	// Find user by email
	const userData = await user.findOne({
		"email.address": email,
	});

	// Get user password from DB
	const savedPassword = userData.password;

	// Compare plain text password with the hashed password that's stored in the database
	const isAuthorized = await compare(password, savedPassword); // boolean
	console.log(isAuthorized);

	// Password correct ? return true : return false
	return { isAuthorized, userId: userData._id }; // return multiple items in a single return
}
