import { User } from "../../models/index.js";
import customErrorHandler from '../../services/customErrorHandler.js';


const userController = {
    async me(req, res, next) {
        try {
            // to not include use - with property name in select method of findOne
            const user = await User.findOne({ _id: req.user._id }).select('-password -updatedAt -__v');
            if (!user) {
                // if user is not found
                return next(customErrorHandler.notFound());
            }
            res.json(user);
        }
        catch (err) {
            return next(err);
        }
    }
}

export default userController;