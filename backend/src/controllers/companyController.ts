import { Request, Response } from 'express';
import Company from '../models/Company';
import User from '../models/User';

// @desc    Create a new company
// @route   POST /api/companies
// @access  Private (Employer only)
export const createCompany = async (req: Request, res: Response) => {
  try {
    const { name, industry, website, description, location, size, logo } = req.body;

    // Check if company already exists
    const companyExists = await Company.findOne({ name });

    if (companyExists) {
      return res.status(400).json({ message: 'Company already exists' });
    }

    const company = await Company.create({
      name,
      industry,
      website,
      description,
      location,
      size,
      logo,
    });

    // Automatically join the company
    // @ts-ignore
    const user = await User.findById(req.user._id);
    if (user) {
      user.companyId = company._id as any;
      user.companyName = company.name;
      await user.save();
    }

    res.status(201).json({
      company,
      user: user ? {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        companyName: user.companyName,
      } : null
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all companies (with search)
// @route   GET /api/companies
// @access  Public
export const getCompanies = async (req: Request, res: Response) => {
  try {
    const keyword = req.query.keyword as string;
    const query = keyword 
      ? { name: { $regex: keyword, $options: 'i' } }
      : {};

    const companies = await Company.find(query).sort({ name: 1 });

    res.status(200).json(companies);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get company by ID
// @route   GET /api/companies/:id
// @access  Public
export const getCompanyById = async (req: Request, res: Response) => {
  try {
    const company = await Company.findById(req.params.id);

    if (company) {
      res.status(200).json(company);
    } else {
      res.status(404).json({ message: 'Company not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update company details
// @route   PUT /api/companies/:id
// @access  Private (Employer only)
export const updateCompany = async (req: Request, res: Response) => {
  try {
    const { name, industry, website, description, location, size, logo } = req.body;
    
    // @ts-ignore
    const user = req.user;
    
    // Check if company exists
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Verify user belongs to this company (simple authorization)
    // In a real app, you might want 'admin' roles within a company
    if (user.companyId.toString() !== company._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this company' });
    }

    company.name = name || company.name;
    company.industry = industry || company.industry;
    company.website = website || company.website;
    company.description = description || company.description;
    company.location = location || company.location;
    company.size = size || company.size;
    company.logo = logo || company.logo;

    const updatedCompany = await company.save();

    res.json(updatedCompany);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user company link (Join Company)
// @route   PUT /api/companies/join
// @access  Private
export const joinCompany = async (req: Request, res: Response) => {
  try {
    const { companyId } = req.body;
    // @ts-ignore
    const userId = req.user._id;

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.companyId = companyId;
    user.companyName = company.name;
    await user.save();

    res.status(200).json({
      message: `Successfully joined ${company.name}`,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        companyName: user.companyName,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
