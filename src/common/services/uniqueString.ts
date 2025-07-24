import { v4 as uuidv4 } from 'uuid';
class UniqueString {
    generateUniqueString() {
        return uuidv4();
    }
}
export const uniqueString = new UniqueString();
