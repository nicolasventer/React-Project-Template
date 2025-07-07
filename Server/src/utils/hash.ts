import * as bcrypt from "bcrypt";

const saltRounds = 10;

export async function hashPassword(password: string): Promise<string> {
	try {
		// Generate a salt
		const salt = await bcrypt.genSalt(saltRounds);

		// Hash the password with the generated salt
		const hashedPassword = await bcrypt.hash(password, salt);

		return hashedPassword;
	} catch (error) {
		console.error("Error hashing password:", error);
		throw error;
	}
}
