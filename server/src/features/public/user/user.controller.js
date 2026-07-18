class UserController {
  constructor(service) {
    this.service = service;
  }

  async register(req, res) {
    try {
      const userData = req.body;
      const hashedPassword = await this.service.hashPassword(userData.password);
      const user = await this.service.createUser(userData.email, hashedPassword);
      const tokens = await this.service.generateTokens(user._id);
      res.status(201).json(tokens);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await this.service.authenticateUser(email, password);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const tokens = await this.service.generateTokens(user._id);
      res.json(tokens);
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  }
}

module.exports = UserController;