export const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

// Simplified map for demo purposes - in production this should be a proper dataset or API
export const CITIES_BY_STATE: Record<string, string[]> = {
  "California": ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Sacramento", "Oakland", "Fresno", "Long Beach"],
  "New York": ["New York City", "Buffalo", "Rochester", "Yonkers", "Syracuse", "Albany"],
  "Texas": ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth", "El Paso", "Arlington"],
  "Florida": ["Miami", "Orlando", "Tampa", "Jacksonville", "Tallahassee", "Fort Lauderdale"],
  "Washington": ["Seattle", "Spokane", "Tacoma", "Vancouver", "Bellevue"],
  // Fallback for others - we can populate this more fully later or use a library
  "Alabama": ["Birmingham", "Montgomery", "Mobile", "Huntsville"],
  "Arizona": ["Phoenix", "Tucson", "Mesa", "Chandler", "Scottsdale"],
  "Colorado": ["Denver", "Colorado Springs", "Aurora", "Fort Collins"],
  "Georgia": ["Atlanta", "Augusta", "Columbus", "Savannah"],
  "Illinois": ["Chicago", "Aurora", "Naperville", "Joliet"],
  "Massachusetts": ["Boston", "Worcester", "Springfield", "Cambridge"],
  "Michigan": ["Detroit", "Grand Rapids", "Warren", "Sterling Heights"],
  "North Carolina": ["Charlotte", "Raleigh", "Greensboro", "Durham"],
  "Ohio": ["Columbus", "Cleveland", "Cincinnati", "Toledo"],
  "Pennsylvania": ["Philadelphia", "Pittsburgh", "Allentown", "Erie"],
  "Virginia": ["Virginia Beach", "Norfolk", "Chesapeake", "Richmond"],
};

export const COMMON_SKILLS = [
  // Tech
  "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "C++", "C#", "SQL", "AWS", "Azure", "Docker", "Kubernetes", "Git",
  // Business
  "Project Management", "Leadership", "Strategic Planning", "Operations Management", "Logistics", "Supply Chain", "Budgeting",
  // Soft Skills
  "Communication", "Teamwork", "Problem Solving", "Critical Thinking", "Adaptability", "Time Management",
  // Military Specific
  "Security Clearance", "Top Secret", "DoD", "Military Experience", "Operational Planning", "Risk Management", "Training & Development"
];

export const MILITARY_BRANCHES = [
  "Army", "Navy", "Air Force", "Marine Corps", "Coast Guard", "Space Force"
];

export const SECURITY_CLEARANCES = [
  "None", "Public Trust", "Confidential", "Secret", "Top Secret", "Top Secret/SCI", "Yankee White"
];
