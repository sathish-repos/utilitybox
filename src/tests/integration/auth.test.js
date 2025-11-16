import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app.js'; // Import the configured Express app
import connectDB from '../../config/db.js';
import { User } from '../../models/User.model.js';
import { Token } from '../../models/Token.model.js';

// We must connect to a database for integration tests.
// This assumes a TEST_MONGODB_URI is set in a .env.test file
// or that the jest setup file handles an in-memory DB.

beforeAll(async () => {
  // Use a dedicated test database
  process.env.MONGODB_URI =
    process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/enterprise-api-test';
  await connectDB();
});

afterEach(async () => {
  // Clean up
  await User.deleteMany({});
  await Token.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Auth Routes - /api/v1/auth', () => {
  describe('POST /register', () => {
    it('should register a new user successfully', async () => {
      const newUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      };

      const res = await request(app).post('/api/v1/auth/register').send(newUser).expect(201); // HTTP CREATED

      // Check response body
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(newUser.email);
      expect(res.body.data.accessToken).toBeDefined();

      // Check response cookie
      expect(res.headers['set-cookie'][0]).toContain('refreshToken=');

      // Check database
      const dbUser = await User.findOne({ email: newUser.email });
      expect(dbUser).toBeDefined();
    });

    it('should fail to register with a duplicate email', async () => {
      // First, create the user
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });

      // Then, attempt to register again
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Another User',
          email: 'test@example.com',
          password: 'Password456!',
        })
        .expect(400); // HTTP BAD REQUEST

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Email already taken');
    });
  });

  describe('POST /login', () => {
    // ... (tests for login) ...
  });
});
