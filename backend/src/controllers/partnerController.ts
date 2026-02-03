import { Request, Response } from 'express';
import PartnerInquiry from '../models/PartnerInquiry';

export const createInquiry = async (req: Request, res: Response) => {
  try {
    const { organizationName, contactName, email, type, message } = req.body;

    const newInquiry = new PartnerInquiry({
      organizationName,
      contactName,
      email,
      type,
      message
    });

    const savedInquiry = await newInquiry.save();

    res.status(201).json(savedInquiry);
  } catch (error) {
    console.error('Error creating partner inquiry:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getInquiries = async (req: Request, res: Response) => {
  try {
    // Ideally protected by admin middleware
    const inquiries = await PartnerInquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    console.error('Error fetching partner inquiries:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateInquiryStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const inquiry = await PartnerInquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!inquiry) {
      res.status(404).json({ message: 'Inquiry not found' });
      return;
    }

    res.json(inquiry);
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
