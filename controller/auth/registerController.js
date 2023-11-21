import Joi from 'joi';
import customErrorHandler from '../../services/customErrorHandler.js';
import { User, refreshToken } from '../../models/index.js'
import bcrypt from 'bcrypt';
import JwtService from '../../services/JwtService.js';
import { REFRESH_SECRET } from '../../config/index.js'

const registerController = {
    async register(req, res, next) {
        // logic

        // validation
        const registerSchema = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            repeat_password: Joi.ref('password')
        })
        // console.log(req.body)
        const { error } = registerSchema.validate(req.body);
        if (error) {
            return next(error);
        }

        // check if user is in the database already

        try {
            const exist = await User.exists({ email: req.body.email })
            if (exist) {
                return next(customErrorHandler.alreadyExists('This email is already registered.')); // custom error handler
            }
            
        }
        catch (err) {
            return next(err);
        }

        // Hash Password
        // Destructring req.body
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is saltRounds

        // making an (object of) user to store in the database
        const user = new User(
            {
                name,
                email,
                password: hashedPassword
            }
        );

        let accessToken;
        let RefreshToken;
        try {
            const result = await user.save(); // save is a method to save in db 
            console.log(result);
            // Generate token and give it to the client (In the services)
            accessToken = JwtService.sign({ _id: result._id, role: result.role }); //  Token
            RefreshToken = JwtService.sign({ id: result._id, role: result.role }, '1y', REFRESH_SECRET)  // Refresh token

            // databse whitelist
            await refreshToken.create({ token: RefreshToken });
        }
        catch (err) {
            return next(err);
        }
        res.json({ accessToken, RefreshToken });
    }
}
export default registerController;