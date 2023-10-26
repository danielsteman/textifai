import { getAuth, applyActionCode, AuthErrorCodes } from "firebase/auth";

export async function handleOOBCode(oobCode: string): Promise<boolean> {
    const auth = getAuth();

    try {
        await applyActionCode(auth, oobCode);
        console.log("Email successfully verified!");
        return true; 
    } catch (error) {
        if ((error as any).code === AuthErrorCodes.EXPIRED_OOB_CODE) {
            console.error("The action code has expired.");
        } else {
            console.error("Error while verifying email:", error);
        }
        return false;
    }
}
