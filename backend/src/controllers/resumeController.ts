import { Request, Response, NextFunction } from 'express';
const pdf = require('pdf-parse');
import { Resume, IResume } from '../models/Resume';
import { IUser } from '../models/User';

// Extend Express Request to include user
interface AuthRequest extends Request {
  user?: IUser;
}

// Helper function to simulate AI generation (Mock)
const generateResumeContent = (militaryHistory: any) => {
  const { branch, rank, mosCode, description, securityClearance, leadershipRole, awards } = militaryHistory;
  
  // Simple template-based generation for MVP
  let summary = `Dedicated and disciplined ${branch} veteran with experience as a ${rank} (${mosCode}).`;
  if (leadershipRole) {
    summary += ` Proven leader having served as a ${leadershipRole}.`;
  }
  if (securityClearance && securityClearance !== 'None') {
    summary += ` Holds Active ${securityClearance} clearance.`;
  }
  summary += ` Proven track record of leadership, adaptability, and mission accomplishment. Eager to leverage military experience in a civilian role.`;
  
  const skills = [
    'Leadership & Team Management',
    'Operational Planning',
    'Risk Assessment',
    'Adaptability under Pressure',
    'Cross-functional Communication',
    `${branch} Specific Technical Skills`
  ];

  if (securityClearance && securityClearance !== 'None') {
    skills.push(`Security Clearance: ${securityClearance}`);
  }

  const experience = [
    `Served as ${rank} in the United States ${branch}`,
    `Managed operations and personnel in high-stress environments`,
    `Maintained accountability of equipment valued at over $1M`,
    `Mentored junior personnel and conducted training operations`
  ];

  if (leadershipRole) {
    experience.push(`Performed duties as ${leadershipRole}, overseeing team operations and welfare.`);
  }

  if (awards) {
    experience.push(`Honors: ${awards}`);
  }

  return { summary, skills, experience };
};

export const createResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as AuthRequest).user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not authorized' });
    }
    const { militaryHistory, title } = req.body;

    // 1. Generate AI Content
    const { summary, skills, experience } = generateResumeContent(militaryHistory);

    // 2. Create Resume Record
    const resume = await Resume.create({
      user: user._id,
      title: title || `${user.firstName}'s Resume`,
      militaryHistory,
      generatedSummary: summary,
      generatedSkills: skills,
      generatedExperience: experience
    });

    res.status(201).json({
      success: true,
      data: resume
    });
  } catch (error) {
    next(error);
  }
};

export const getMyResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as AuthRequest).user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not authorized' });
    }
    const resume = await Resume.findOne({ user: user._id }).sort({ createdAt: -1 });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'No resume found'
      });
    }

    res.status(200).json({
      success: true,
      data: resume
    });
  } catch (error) {
    next(error);
  }
};

const extractMilitaryData = (text: string) => {
  const data = {
    branch: '',
    rank: '',
    mosCode: '',
    yearsOfService: 0,
    securityClearance: 'None',
    leadershipRole: '',
    awards: '',
    description: ''
  };

  const lowerText = text.toLowerCase();

  // 1. Detect Branch
  if (lowerText.includes('army national guard') || lowerText.includes('arng')) data.branch = 'Army National Guard';
  else if (lowerText.includes('air national guard') || lowerText.includes('ang')) data.branch = 'Air National Guard';
  else if (lowerText.includes('army reserve') || lowerText.includes('usar')) data.branch = 'Army Reserve';
  else if (lowerText.includes('navy reserve') || lowerText.includes('usnr')) data.branch = 'Navy Reserve';
  else if (lowerText.includes('marine corps reserve') || lowerText.includes('usmcr')) data.branch = 'Marine Corps Reserve';
  else if (lowerText.includes('air force reserve') || lowerText.includes('usfr')) data.branch = 'Air Force Reserve';
  else if (lowerText.includes('coast guard reserve') || lowerText.includes('uscgr')) data.branch = 'Coast Guard Reserve';
  else if (lowerText.includes('army') || lowerText.includes('soldier') || lowerText.includes('usa')) data.branch = 'Army';
  else if (lowerText.includes('navy') || lowerText.includes('sailor') || lowerText.includes('usn')) data.branch = 'Navy';
  else if (lowerText.includes('air force') || lowerText.includes('airman') || lowerText.includes('usaf')) data.branch = 'Air Force';
  else if (lowerText.includes('marine') || lowerText.includes('corps') || lowerText.includes('usmc')) data.branch = 'Marine Corps';
  else if (lowerText.includes('coast guard') || lowerText.includes('uscg')) data.branch = 'Coast Guard';
  else if (lowerText.includes('space force') || lowerText.includes('ussf')) data.branch = 'Space Force';

  // 2. Detect Rank (Expanded List with Abbreviations)
  const rankMap: { [key: string]: string } = {
    // Army Enlisted
    'pvt': 'Private', 'private': 'Private',
    'pfc': 'Private First Class',
    'spc': 'Specialist', 'specialist': 'Specialist',
    'cpl': 'Corporal', 'corporal': 'Corporal',
    'sgt': 'Sergeant', 'sergeant': 'Sergeant',
    'ssg': 'Staff Sergeant', 'staff sergeant': 'Staff Sergeant',
    'sfc': 'Sergeant First Class', 'sergeant first class': 'Sergeant First Class',
    'msg': 'Master Sergeant', 'master sergeant': 'Master Sergeant',
    '1sg': 'First Sergeant', 'first sergeant': 'First Sergeant',
    'sgm': 'Sergeant Major', 'sergeant major': 'Sergeant Major',
    'csm': 'Command Sergeant Major', 'command sergeant major': 'Command Sergeant Major',
    // Army Officers
    '2lt': 'Second Lieutenant', 'second lieutenant': 'Second Lieutenant',
    '1lt': 'First Lieutenant', 'first lieutenant': 'First Lieutenant',
    'cpt': 'Captain', 'captain': 'Captain',
    'maj': 'Major', 'major': 'Major',
    'ltc': 'Lieutenant Colonel', 'lieutenant colonel': 'Lieutenant Colonel',
    'col': 'Colonel', 'colonel': 'Colonel',
    'bg': 'Brigadier General', 'brigadier general': 'Brigadier General',
    'mg': 'Major General', 'major general': 'Major General',
    'ltg': 'Lieutenant General', 'lieutenant general': 'Lieutenant General',
    'gen': 'General', 'general': 'General',
    // Navy / Coast Guard
    'sr': 'Seaman Recruit', 'sa': 'Seaman Apprentice', 'sn': 'Seaman',
    'po3': 'Petty Officer Third Class', 'petty officer third class': 'Petty Officer Third Class',
    'po2': 'Petty Officer Second Class', 'petty officer second class': 'Petty Officer Second Class',
    'po1': 'Petty Officer First Class', 'petty officer first class': 'Petty Officer First Class',
    'cpo': 'Chief Petty Officer', 'chief petty officer': 'Chief Petty Officer',
    'scpo': 'Senior Chief Petty Officer', 'senior chief petty officer': 'Senior Chief Petty Officer',
    'mcpo': 'Master Chief Petty Officer', 'master chief petty officer': 'Master Chief Petty Officer',
    'ens': 'Ensign', 'ensign': 'Ensign',
    'ltjg': 'Lieutenant Junior Grade', 'lieutenant junior grade': 'Lieutenant Junior Grade',
    'lt': 'Lieutenant', 'lieutenant': 'Lieutenant',
    'lcdr': 'Lieutenant Commander', 'lieutenant commander': 'Lieutenant Commander',
    'cdr': 'Commander', 'commander': 'Commander',
    'capt': 'Captain', // Navy Captain matches Army Captain keyword, context matters but for MVP we rely on branch selection or manual fix
    'adm': 'Admiral', 'admiral': 'Admiral',
    // Air Force
    'ab': 'Airman Basic', 'amn': 'Airman', 'a1c': 'Airman First Class', 'sra': 'Senior Airman',
    'tsgt': 'Technical Sergeant', 'technical sergeant': 'Technical Sergeant',
    'msgt': 'Master Sergeant', 
    'smsgt': 'Senior Master Sergeant', 'senior master sergeant': 'Senior Master Sergeant',
    'cmsgt': 'Chief Master Sergeant', 'chief master sergeant': 'Chief Master Sergeant'
  };

  // Sort keys by length descending to match "Staff Sergeant" before "Sergeant"
  const sortedRanks = Object.keys(rankMap).sort((a, b) => b.length - a.length);

  for (const rankKey of sortedRanks) {
    // Regex to match rank as a whole word
    const regex = new RegExp(`\\b${rankKey}\\b`, 'i');
    if (regex.test(lowerText)) {
      data.rank = rankMap[rankKey];
      break;
    }
  }

  // 3. Detect MOS/Rate/AFSC (Enhanced Regex)
  // Matches: 
  // - Army: 11B, 42A, 25B
  // - Air Force: 1A0X1, 3D0X2
  // - Navy: IT2, ET1 (This is harder, using simplified pattern)
  // - General: 4 digit codes like 1234
  
  // Look for keywords first
  const mosKeywords = ['mos', 'afsc', 'rate', 'specialty', 'code', 'job'];
  let mosFound = false;
  
  // Try to find MOS near keywords
  const lines = text.split('\n');
  for(const line of lines) {
    const lowerLine = line.toLowerCase();
    if(mosKeywords.some(kw => lowerLine.includes(kw))) {
         const match = line.match(/\b([0-9]{2}[A-Z]|[0-9]{4}|[0-9][A-Z][0-9][A-Z][0-9])\b/);
         if(match) {
             data.mosCode = match[0];
             mosFound = true;
             break;
         }
    }
  }

  // If not found via keywords, scan whole text with broad regex
  if(!mosFound) {
      const mosMatch = text.match(/\b([0-9]{2}[A-Z]|[0-9]{4}|[0-9][A-Z][0-9][A-Z][0-9])\b/);
      if (mosMatch) {
        data.mosCode = mosMatch[0];
      }
  }

  // 4. Calculate Years of Service (Approximate)
  // Look for 4 digit years 1990-2030
  const yearMatches = text.match(/\b(19|20)\d{2}\b/g);
  if (yearMatches && yearMatches.length >= 2) {
      const years = yearMatches.map(y => parseInt(y, 10));
      const minYear = Math.min(...years);
      const maxYear = Math.max(...years);
      const diff = maxYear - minYear;
      if (diff > 0 && diff < 40) { // Reasonable service length
          data.yearsOfService = diff;
      }
  }


  // 5. Detect Security Clearance
  if (lowerText.includes('top secret') || lowerText.includes('ts/sci')) {
    data.securityClearance = 'Top Secret (TS/SCI)';
  } else if (lowerText.includes('secret')) {
    data.securityClearance = 'Secret';
  }

  // 6. Detect Leadership Role (Heuristic)
  const leadershipKeywords = ['team leader', 'squad leader', 'platoon sergeant', 'detachment commander', 'department head', 'oic', 'ncoic', 'supervisor'];
  for (const role of leadershipKeywords) {
    if (lowerText.includes(role)) {
      data.leadershipRole = role.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      break;
    }
  }

  // 7. Extract Awards (Simplified keyword search)
  const awardKeywords = ['bronze star', 'commendation medal', 'achievement medal', 'meritorious service', 'purple heart', 'distinguished service'];
  const foundAwards: string[] = [];
  for (const award of awardKeywords) {
    if (lowerText.includes(award)) {
      foundAwards.push(award.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
    }
  }
  if (foundAwards.length > 0) {
    data.awards = foundAwards.join(', ');
  }

  // 8. Extract a description snippet
  data.description = text.slice(0, 500).replace(/\s+/g, ' ').trim();

  return data;
};

export const parseResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    let text = '';

    if (req.file.mimetype === 'application/pdf') {
      const data = await pdf(req.file.buffer);
      text = data.text;
    } else {
      text = req.file.buffer.toString('utf-8');
    }

    const extractedData = extractMilitaryData(text);

    res.status(200).json({
      success: true,
      data: extractedData
    });
  } catch (error) {
    console.error('Resume Parse Error:', error);
    next(error);
  }
};

export const updateResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as AuthRequest).user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not authorized' });
    }
    const { resumeId } = req.params;
    const updateData = req.body;

    let resume = await Resume.findOne({ _id: resumeId, user: user._id });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found or unauthorized'
      });
    }

    resume = await Resume.findByIdAndUpdate(resumeId, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: resume
    });
  } catch (error) {
    next(error);
  }
};
