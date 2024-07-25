// Mock user data (replace with your actual authentication logic)
const users = [
  { username: 'WittyWarDrobe@store', password: 'Store786' }
];

export const login = (req, res) => {
  const { username, password } = req.body;
  
  // Mock authentication logic (replace with your actual authentication logic)
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    req.session.user = user;
    
    // Respond with username only
    res.json({ message: 'Login successful', username: user.username });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};
