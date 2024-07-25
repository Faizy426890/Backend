import session from 'express-session';
import MongoStore from 'connect-mongo';

const configureSession = (app) => {
  // Set secure cookies to false by default
  const isSecure = false; // You can adjust this based on your environment

  app.use(session({
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 14 * 24 * 60 * 60 // 14 days
    }),
    cookie: {
      secure: isSecure, // Set to true if using HTTPS
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
      sameSite: isSecure ? 'none' : 'lax' // Handle cross-origin requests
    },
  }));
};

export default configureSession;
