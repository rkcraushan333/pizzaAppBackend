import Joi from 'joi';
import customeErrorHandler from '../../services/customErrorHandler.js';
import JwtService from '../../services/JwtService.js'
import { REFRESH_SECRET } from '../../config/index.js'
import { User, refreshToken } from '../../models/index.js'

const refreshController = {
    async refresh(req, res, next) {
        // validation
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required()
        });

        const { error } = refreshSchema.validate(req.body);
        if (error) {
            return next(error);
        }

        // if no error then check in db, if it exists or not then
        let RefreshToken;
        try {
            RefreshToken = await refreshToken.findOne({ token: req.body.refresh_token });
            if (!RefreshToken) {
                return next(customeErrorHandler.unAuthorized('Invalid refresh Token'));
            }
            let userId;
            try {
                const { _id } = await JwtService.verify(RefreshToken.token, REFRESH_SECRET);
                userId = _id;
            }
            catch (err) {
                return next(customeErrorHandler.unAuthorized('Invalid refresh Token'));
            }
            const user = await User.findOne({ _id: userId });
            if (!user) {
                return next(customeErrorHandler.unAuthorized('No user found'));
            }

            // new Token generate
            const accessToken = JwtService.sign({ _id: user._id, role: user.role });
            const Refresh_Token = JwtService.sign({ _id: user._id, role: user.role }, '1y', REFRESH_SECRET);

            // saving the RefreshToken in db
            await refreshToken.create({ token: Refresh_Token });

            res.json({ accessToken, Refresh_Token });

        }
        catch (err) {
            return next(new Error('Something went wrong ' + err.message));
        }

    }
}

export default refreshController;