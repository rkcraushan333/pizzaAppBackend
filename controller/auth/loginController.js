import Joi from "joi";
import { User, refreshToken } from "../../models/index.js";
import customErrorHandler from '../../services/customErrorHandler.js';
import bcrypt from 'bcrypt';
import JwtService from '../../services/JwtService.js'
import { REFRESH_SECRET } from '../../config/index.js'

const loginController = {
    async login(req, res, next) {
        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
        })
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return next(error);
        }
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return next(customErrorHandler.wrongCredentials());
            }

            // compare the password with the db password
            const match = await bcrypt.compare(password, user.password); // compare the given password with the hashed password
            if (!match) {
                return next(customErrorHandler.wrongCredentials());
            }

            // if matched then generate token using jswebtoken
            const accessToken = JwtService.sign({ _id: user._id, role: user.role });
            const RefreshToken = JwtService.sign({ _id: user._id, role: user.role }, '1y', REFRESH_SECRET);

            // saving the RefreshToken in db
            await refreshToken.create({ token: RefreshToken });

            res.json({ accessToken, RefreshToken });
        }
        catch (err) {
            return next(err);
        }
    },
    async logout(req, res, next) {
        // validation
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required()
        });

        const { error } = refreshSchema.validate(req.body);
        if (error) {
            return next(error);
        }

        try {
            await refreshToken.deleteOne({ token: req.body.refresh_token });
        }
        catch (err) {
            return next(new Error('Something went Wrong!'));
        }
        res.json({ status: 1 })
    }
}

export default loginController;