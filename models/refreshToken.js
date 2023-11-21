import mongoose from "mongoose";
const Schema = mongoose.Schema;

const refreshTokenSchema = new Schema({
    token: {
        type: 'string',
        unique: true
    }
}, { timestamps: false });

export default mongoose.model('refreshToken', refreshTokenSchema, 'refreshTokens');