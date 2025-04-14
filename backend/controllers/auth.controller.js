import User from "../models/user.model.js";

export const signup = async (req, resp) => {
  const { email, password, name } = req.body;
  
  try {
    const userExists = await User.findOne({ email });

    if(userExists) {
      return resp.status(400).json({ message: 'User already exists'});
    }
  
    const user = await User.create({ name, email, password });
  
    resp.status(201).json({ user, message: 'User created successfully...'});

  } catch (error) {
    resp.status(500).json({ message: error.message });
  }
};

export const login = async (req, resp) => {
  resp.send('login route called');
};

export const logout = async (req, resp) => {
  resp.send('logout route called');
};