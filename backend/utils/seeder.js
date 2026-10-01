const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Active Models
const User = require('../models/User');
const Service = require('../models/Service');
const Setting = require('../models/Setting');
const Lead = require('../models/Lead');

// Sample Data File
const sampleData = require('./sampleData');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAdminOnly = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/clicksansar');
    console.log('MongoDB Connected...');

    const isFullSeed = process.argv.includes('--full');

    if (isFullSeed) {
      console.log('Running full sample data seed...');
      await User.deleteMany();
      await Service.deleteMany();
      await Setting.deleteMany();
      await Lead.deleteMany();

      console.log('Cleared existing database records.');

      await User.create({
        username: 'admin',
        email: 'admin@clicksansar.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('Seeded Admin User (username: admin, password: admin123)');

      await Service.insertMany(sampleData.services);
      await Setting.create(sampleData.setting);

      console.log('Core sample data successfully seeded into MongoDB!');
    } else {
      console.log('Seeding/Updating Admin Panel User Login Details...');

      // Find or recreate admin user without deleting other content collections
      let admin = await User.findOne({ username: 'admin' });
      if (admin) {
        admin.password = 'admin123';
        admin.email = 'admin@clicksansar.com';
        admin.role = 'admin';
        await admin.save();
        console.log('Updated existing Admin User credentials (username: admin, password: admin123)');
      } else {
        await User.create({
          username: 'admin',
          email: 'admin@clicksansar.com',
          password: 'admin123',
          role: 'admin',
        });
        console.log('Created Admin User (username: admin, password: admin123)');
      }

      console.log('Admin login details verified in MongoDB. Content data collections left preserved!');
    }

    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error.message);
    process.exit(1);
  }
};

seedAdminOnly();
