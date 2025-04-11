
export const signup = (req, resp) => {
  resp.send('Sign up route called');
};

export const login = async (req, resp) => {
  resp.send('login route called');
};

export const logout = async (req, resp) => {
  resp.send('logout route called');
};