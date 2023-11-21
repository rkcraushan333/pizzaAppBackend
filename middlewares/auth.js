import customErrorHandler from "../services/customErrorHandler.js";
import JwtService from '../services/JwtService.js'

const auth = async (req, res, next) => {
    let authHeader = req.headers.authorization;
    // console.log(authHeader);
    if (!authHeader) {
        return next(customErrorHandler.unAuthorized());
    }
    const token = authHeader.split(' ')[1]; // split is use to split and make the element of an array
    // console.log(token);

    try {
        const { _id, role } = await JwtService.verify(token);
        const user = {
            _id,
            role
        }
        req.user = user;
        next();
    }
    catch (err) {
        return next(customErrorHandler.unAuthorized());
    }
}

export default auth;