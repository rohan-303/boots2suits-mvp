import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Register User
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, password, role, companyName, militaryBranch } = req.body;
    
    console.log('Register attempt:', { ...req.body, password: '***' });

    // Basic Validation
    if (!firstName || !lastName || !email || !password || !role) {
      console.log('Registration failed: Missing required fields');
      res.status(400);
      throw new Error('Please provide all required fields');
    }

    // Role-specific validation
    if (role === 'employer' && !companyName) {
      console.log('Registration failed: Missing companyName for employer');
      res.status(400);
      throw new Error('Company name is required for employers');
    }
    if (role === 'veteran' && !militaryBranch) {
      console.log('Registration failed: Missing militaryBranch for veteran');
      res.status(400);
      throw new Error('Military branch is required for veterans');
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log(`Registration failed: User already exists (${email})`);
      res.status(400);
      throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      companyName,
      militaryBranch,
      authProvider: 'local',
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    console.error('Registration error:', error);
    next(error);
  }
};

// Login User
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (!user || !user.password) {
      console.log(`Login failed: User not found or no password for email: ${email}`);
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Login failed: Invalid password for email: ${email}`);
      res.status(401);
      throw new Error('Invalid email or password');
    }

    res.json({
      _id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    });
  } catch (error) {
    next(error);
  }
};

// Generate JWT
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};
