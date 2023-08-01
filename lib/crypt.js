import { AES as crypt, enc } from "crypto-js";

const key = process.env.CRYPT_KEY;

export const encrypt = (value) => {
    var encrypted = crypt.encrypt(value , key);
    return encrypted.toString();
}

export const decrypt = (value) => {
    var decrypted = crypt.decrypt(value , key);
    return decrypted.toString(enc.Utf8);
}

export const checkSimilar = (hash, value) => {
    return decrypt(hash) == value ? true : false;
}