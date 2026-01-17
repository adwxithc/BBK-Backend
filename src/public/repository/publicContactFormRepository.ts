import ContactFormModel, { IContactForm } from '@common/model/contactFormModel';

interface CreateContactFormData {
    fullName: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}

class PublicContactFormRepository {
    async createContactForm(data: CreateContactFormData): Promise<IContactForm> {
        const contactForm = new ContactFormModel(data);
        await contactForm.save();
        return contactForm;
    }

    async findContactFormById(id: string): Promise<IContactForm | null> {
        return await ContactFormModel.findById(id);
    }

    async findAllContactForms(
        limit: number = 10,
        skip: number = 0
    ): Promise<IContactForm[]> {
        return await ContactFormModel.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);
    }

    async countContactForms(): Promise<number> {
        return await ContactFormModel.countDocuments();
    }
}

export default new PublicContactFormRepository();
