import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

export const createInitialAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      $or: [
        { email: process.env.ADMIN_EMAIL },
        { username: process.env.ADMIN_USERNAME }
      ]
    });

    if (existingAdmin) {
      console.log('Initial admin already exists');
      return;
    }

    // Hash the admin password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

    // Create initial admin
    const initialAdmin = new User({
      username: process.env.ADMIN_USERNAME,
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
      profile: {
        firstName: process.env.ADMIN_FIRST_NAME,
        lastName: process.env.ADMIN_LAST_NAME
      }
    });

    await initialAdmin.save();
    console.log('Initial admin created successfully');
  } catch (error) {
    console.error('Error creating initial admin:', error);
  }
};

export default createInitialAdmin;
