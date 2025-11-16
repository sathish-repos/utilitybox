// This file would be configured in jest.config.cjs
// to run before all tests.

// import mongoose from 'mongoose';
// import { MongoMemoryServer } from 'mongodb-in-memory';

// let mongoServer;

// beforeAll(async () => {
//   mongoServer = await MongoMemoryServer.create();
//   const uri = mongoServer.getUri();
//   await mongoose.connect(uri);
// });

// afterAll(async () => {
//   await mongoose.disconnect();
//   await mongoServer.stop();
// });

// afterEach(async () => {
//   // Clean up all collections after each test
//   const collections = mongoose.connection.collections;
//   for (const key in collections) {
//     await collections[key].deleteMany({});
//   }
// });
