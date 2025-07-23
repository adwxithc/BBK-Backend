import AdminModel from "@common/model/adminModel";

class AdminRepsitory {
    async findByEmail(email: string) {
        return await AdminModel.findOne({ email });
    }
}

export default new AdminRepsitory();
