/* eslint-disable no-console */
import 'dotenv/config';
import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import { User } from '../models/User.model.js';
import { Product } from '../models/Product.model.js';
import { Token } from '../models/Token.model.js';

// We need to import mongoose directly for disconnect

const seedDatabase = async () => {
  try {
    // 1. Connect to DB
    await connectDB();
    console.log('Database connected for seeding...');

    // 2. Clear existing data
    console.log('Clearing old data...');
    await Token.deleteMany({});
    await User.deleteMany({});
    await Product.deleteMany({});

    // 3. Create Admin User
    console.log('Creating admin user...');
    await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'Password123!', // Will be hashed by pre-save hook
      role: 'admin',
    });

    // 4. Create Regular User
    console.log('Creating regular user...');
    await User.create({
      name: 'Test User',
      email: 'user@example.com',
      password: 'Password123!',
      role: 'user',
    });

    // 5. Create Sample Products
    console.log('Creating sample products...');
    const products = [];
    for (let i = 0; i < 20; i++) {
      products.push({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        stock: faker.number.int({ min: 0, max: 200 }),
        category: faker.commerce.department(),
      });
    }
    await Product.insertMany(products);

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // 6. Disconnect from DB
    await mongoose.disconnect();
    console.log('Database disconnected.');
    process.exit(0);
  }
};

seedDatabase();
