class customErrorHandler extends Error {
    constructor(status, msg) {
        super(); // super constructor must be called in derived class before accessing this
        this.status = status;
        this.message = msg;
    }
    static alreadyExists(message) {
        return new customErrorHandler(409, message);
    }

    static wrongCredentials(message = 'Email or Password is wrong!.') {
        return new customErrorHandler(401, message); // 401 :- Unauthorized
    }

    static unAuthorized(message = 'unAuthorized!') {
        return new customErrorHandler(401, message);
    }

    static notFound(message = 'User Not Found!') {
        return new customErrorHandler(404, message);
    }

    static serverError(message = 'Internal Server Error') {
        return new customErrorHandler(500, message);
    }
}

export default customErrorHandler;