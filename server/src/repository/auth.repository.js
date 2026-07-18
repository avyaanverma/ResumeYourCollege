const Auth = require('./auth.model');

class AuthRepository {
    async findByEmail(email) {
        return await Auth.findOne({ email });
    }

    async create(userData) {
        const user = new Auth(userData);
        return await user.save();
    }
}

module.exports = new AuthRepository();
