import session from 'express-session';
import MongoStore from 'connect-mongo';

const configureSession = (app) => {
  const isProduction = process.env.NODE_ENV === 'production'; // Check if the environment is production
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 14 * 24 * 60 * 60 // 14 days
    }),
    cookie: {
      secure: isProduction, // Set to true if using HTTPS in production
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
      sameSite: isProduction ? 'none' : 'lax' // Handle cross-origin requests
    }
  }));
};

export default configureSession;
