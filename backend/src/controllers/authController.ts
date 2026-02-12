import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User';
import Company from '../models/Company';
import sendEmail from '../utils/sendEmail';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register User
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, password, role, companyName, militaryBranch, companyWebsite, termsAccepted } = req.body;
    
    console.log('Register attempt:', { ...req.body, password: '***' });

    // Basic Validation
    if (!firstName || !lastName || !email || !password || !role) {
      console.log('Registration failed: Missing required fields');
      res.status(400);
      throw new Error('Please provide all required fields');
    }

    if (termsAccepted !== true) {
      res.status(400);
      throw new Error('You must accept the Terms and Conditions');
    }

    // Role-specific validation
    if (role === 'employer' && !companyName) {
      res.status(400);
      throw new Error('Company name is required for employers');
    }
    if (role === 'veteran' && !militaryBranch) {
      res.status(400);
      throw new Error('Military branch is required for veterans');
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
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
      termsAccepted,
      termsAcceptedAt: new Date(),
      companyProfile: companyWebsite ? { website: companyWebsite } : undefined,
    });

    // If employer, create Company record and link
    if (role === 'employer' && user) {
        try {
            const company = await Company.create({
                name: companyName,
                industry: 'Unspecified', // Default value as it's required in schema
                website: companyWebsite,
                verified: false
            });
            
            // @ts-ignore
            user.companyId = company._id;
            await user.save();
        } catch (err) {
            console.error('Failed to create company record:', err);
            // Optionally rollback user creation or just log error (MVP: log error)
        }
    }

    if (user) {
      res.status(201).json({
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
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
      companyId: user.companyId,
      token: generateToken(user.id),
    });
  } catch (error) {
    next(error);
  }
};

// Google Auth (Login/Register)
export const googleAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, role, militaryBranch, companyName } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload) {
      res.status(400);
      throw new Error('Invalid Google Token');
    }

    const { email, given_name, family_name, sub: googleId } = payload;

    if (!email) {
       res.status(400);
       throw new Error('Google account missing email');
    }

    let user = await User.findOne({ email });

    if (user) {
      // User exists - Login
      if (!user.providerId) {
          user.authProvider = 'google';
          user.providerId = googleId;
          await user.save();
      }
      
      res.json({
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        token: generateToken(user.id),
      });
    } else {
      // User does not exist - Register
      if (!role) {
        res.status(404);
        throw new Error('User not found. Please sign up.');
      }

      // Validation for required fields
      if (role === 'veteran' && !militaryBranch) {
        res.status(400);
        throw new Error('Military branch is required for veterans');
      }
      if (role === 'employer' && !companyName) {
         res.status(400);
         throw new Error('Company name is required for employers');
      }

      // Create user
      user = await User.create({
        firstName: given_name,
        lastName: family_name,
        email,
        role: role || 'veteran', // Default to veteran if not specified
        companyName: role === 'employer' ? companyName : undefined,
        militaryBranch: role === 'veteran' ? militaryBranch : undefined,
        authProvider: 'google',
        providerId: googleId,
        password: await bcrypt.hash(Math.random().toString(36), 10) // Random password
      });

      res.status(200).json({
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        token: generateToken(user.id),
      });
    }
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(400).json({ message: 'Google authentication failed' });
  }
};

// LinkedIn Authentication
export const linkedinAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, redirectUri, role, militaryBranch, companyName } = req.body;
    
    // 1. Exchange authorization code for access token
    const tokenUrl = 'https://www.linkedin.com/oauth/v2/accessToken';
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: process.env.LINKEDIN_CLIENT_ID!,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET!
    });

    const tokenRes = await axios.post(tokenUrl, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const { access_token } = tokenRes.data;

    // 2. Get User Info (OpenID Connect)
    const userInfoUrl = 'https://api.linkedin.com/v2/userinfo';
    const userRes = await axios.get(userInfoUrl, {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const { sub: linkedinId, given_name, family_name, email } = userRes.data;

    // 3. Find or Create User
    let user = await User.findOne({ email });

    if (user) {
      // Update provider info if missing
      if (!user.providerId) {
        user.authProvider = 'linkedin';
        user.providerId = linkedinId;
        await user.save();
      }
    } else {
      // Validate role requirements for new users
      if (role === 'employer' && !companyName) {
        throw new Error('Company name is required for employers');
      }
      if (role === 'veteran' && !militaryBranch) {
        throw new Error('Military branch is required for veterans');
      }

      // Create new user
      user = await User.create({
        firstName: given_name,
        lastName: family_name,
        email,
        role: role || 'veteran',
        companyName: role === 'employer' ? companyName : undefined,
        militaryBranch: role === 'veteran' ? militaryBranch : undefined,
        authProvider: 'linkedin',
        providerId: linkedinId,
        password: await bcrypt.hash(Math.random().toString(36), 10) // Random password
      });
    }

    res.status(200).json({
      _id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      token: generateToken(user.id),
    });

  } catch (error: any) {
    console.error('LinkedIn Auth Error:', error.response?.data || error.message);
    res.status(400).json({ message: 'LinkedIn authentication failed' });
  }
};

// Forgot Password
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      res.status(404);
      throw new Error('There is no user with that email');
    }

    // Get reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 Minutes

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    const message = `
      You are receiving this email because you (or someone else) has requested the reset of a password.
      Please click on the link below to reset your password:
      
      ${resetUrl}

      If you did not request this, please ignore this email and your password will remain unchanged.
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Token',
        message,
      });

      res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
      console.log(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      res.status(500);
      throw new Error('Email could not be sent');
    }
  } catch (error) {
    next(error);
  }
};

// Reset Password
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken as string)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400);
      throw new Error('Invalid token');
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
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
