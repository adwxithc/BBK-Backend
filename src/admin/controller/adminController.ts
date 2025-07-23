import { Req, Res } from '@common/types/expressTypes';
import { jWTToken } from 'admin/services/jwt';
import { encrypt } from 'admin/services/encript';
import { tokenOptions } from '../utils/tockenOptions';
import adminRepository from '../repository/adminRepository';
import { BadRequestError } from '@common/errors/bad-request-error';

class AdminController {
    async login(req: Req, res: Res) {
        const { email, password } = req.body;
        let user = await adminRepository.findByEmail(email);
        if (!user) throw new BadRequestError('invalid email or password');

        const { password: hashPassword, name } = user;
        const passwordMatch = await encrypt.comparePassword(
            password,
            hashPassword
        );

        if (!passwordMatch)
            throw new BadRequestError('invalid email or password');

        const token = jWTToken.createJWT(
            { email },
            process.env.JWT_KEY as string
        );

        res.cookie('token', token, tokenOptions);
        res.json({
            success: true,
            data: { name, email },
        });
    }

    logout(req: Req, res: Res) {
        res.clearCookie('token');
        res.json({
            success: true,
            message: 'successfully logout',
        });
    }
}

export const adminController = new AdminController();
