import { sendEmailVerification, User } from "firebase/auth";

export async function resendVerificationEmail(user: User): Promise<{ success: boolean, error?: any }> {
    try {
        await sendEmailVerification(user);
        return { success: true };
    } catch (error) {
        return { success: false, error: error };
    }
}