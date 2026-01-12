import { Req, Res } from '@common/types/expressTypes';
import publicContactFormRepository from '../repository/publicContactFormRepository';

class PublicContactFormController {
    async submitContactForm(req: Req, res: Res) {
        const { fullName, email, phone, subject, message } = req.body;

        const contactForm = await publicContactFormRepository.createContactForm({
            fullName,
            email,
            phone,
            subject,
            message,
        });

        res.status(201).json({
            success: true,
            message: 'Contact form submitted successfully',
            data: {
                id: contactForm._id,
                fullName: contactForm.fullName,
                email: contactForm.email,
                phone: contactForm.phone,
                subject: contactForm.subject,
                message: contactForm.message,
                createdAt: contactForm.createdAt,
            },
        });
    }
}

export default new PublicContactFormController();
