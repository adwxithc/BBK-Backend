import bcrypt from 'bcryptjs';
class Encrypt{
    async createHash(password: string): Promise<string> {
        const hashPassword = await bcrypt.hash(password, 10);
        return hashPassword;
    }

    async comparePassword(
        password: string,
        hashPassword: string
    ): Promise<boolean> {
        const passwordMatch = await bcrypt.compare(password, hashPassword);
        return passwordMatch;
    }
}
export const encrypt = new Encrypt();