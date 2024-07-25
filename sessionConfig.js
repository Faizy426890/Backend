import session from 'express-session';
import MongoStore from 'connect-mongo';

const configureSession = (app) => {
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 14 * 24 * 60 * 60 // 14 days
    }),
    cookie: {
      secure: true, // Set to true for HTTPS
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
      sameSite: 'none' // Required for cross-origin cookies
    },
  }));
};

export default configureSession;
