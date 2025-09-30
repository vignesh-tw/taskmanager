const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const dbConnection = require('../config/db');

// Set test environment
process.env.NODE_ENV = 'test';
let mongoServer;

// Create mock tokens for testing
const createMockToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, userType: user.userType },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  );
};

// Mock user data
const mockUsers = {
  patient: {
    _id: new mongoose.Types.ObjectId(),
    name: 'Test Patient',
    email: 'patient@test.com',
    userType: 'patient'
  },
  therapist: {
    _id: new mongoose.Types.ObjectId(),
    name: 'Test Therapist',
    email: 'therapist@test.com',
    userType: 'therapist',
    specialization: 'Clinical',
    rate: { amount: 100, currency: 'USD' }
  }
};

// Generate tokens
const mockTokens = {
  patient: createMockToken(mockUsers.patient),
  therapist: createMockToken(mockUsers.therapist)
};

// Before all tests
before(async () => {
  try {
    // Create MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Override MongoDB URI for testing
    process.env.MONGODB_URI = mongoUri;
    
    // Connect to test database
    await dbConnection.connect();
    console.log('Connected to test database');
  } catch (err) {
    console.error('Error setting up test database:', err);
    throw err;
  }
});

// Before each test
beforeEach(async () => {
  try {
    // Clear all collections
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany();
    }
  } catch (err) {
    console.error('Error clearing test database:', err);
    throw err;
  }
});

// After all tests
after(async () => {
  try {
    // Cleanup and close connection
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    await mongoServer.stop();
    console.log('Closed test database connection');
  } catch (err) {
    console.error('Error closing test database:', err);
    throw err;
  }
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err);
  process.exit(1);
});

// Export mock data for tests
module.exports = {
  mockUsers,
  mockTokens
};