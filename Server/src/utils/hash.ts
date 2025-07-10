import * as bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
	try {
		const SALT = "$2b$10$g7k9eDxKSOJyJU.5HwYmKO"; // salt generated with bcrypt.genSalt(10)

		// Hash the password with the generated salt
		const hashedPassword = await bcrypt.hash(password, SALT);

		return hashedPassword;
	} catch (error) {
		console.error("Error hashing password:", error);
		throw error;
	}
}
