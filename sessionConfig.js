import session from 'express-session';
import MongoStore from 'connect-mongo';

const configureSession = (app) => {
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI, // Ensure this is correctly set in environment variables
      ttl: 14 * 24 * 60 * 60 // 14 days
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
      maxAge: 14 * 24 * 60 * 60 * 1000 // 14 days
    },
  }));
};

export default configureSession;
