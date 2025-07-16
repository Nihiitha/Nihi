// Mock user profile data
export const mockUser = {
  id: 1,
  username: "janedoe",
  name: "Jane Doe",
  title: "Software Engineer",
  location: "San Francisco, CA",
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  bio: "Passionate developer with 5+ years of experience in web and mobile applications.",
  skills: ["React", "TypeScript", "Node.js", "GraphQL"],
  workExperience: [
    {
      company: "TechCorp",
      role: "Frontend Developer",
      start: "2019-01",
      end: "2022-06",
      description: "Built scalable web apps with React and Redux."
    },
    {
      company: "Webify",
      role: "Junior Developer",
      start: "2017-06",
      end: "2018-12",
      description: "Worked on UI components and bug fixes."
    }
  ],
  education: [
    {
      school: "Stanford University",
      degree: "BSc Computer Science",
      start: "2013",
      end: "2017"
    }
  ],
  contact: {
    email: "jane.doe@example.com",
    phone: "+1 555-123-4567",
    linkedin: "https://linkedin.com/in/janedoe",
    github: "https://github.com/janedoe"
  },
  social: {
    twitter: "https://twitter.com/janedoe",
    facebook: "https://facebook.com/janedoe"
  },
  connections: 120,
  mutualConnections: 8
};

// Mock activity data
export const mockActivity = [
  {
    id: 1,
    type: "post",
    content: "Excited to share my new project!",
    date: "2024-06-01"
  },
  {
    id: 2,
    type: "connection",
    content: "Connected with John Smith.",
    date: "2024-05-28"
  },
  {
    id: 3,
    type: "comment",
    content: "Commented on Alice's post.",
    date: "2024-05-25"
  }
];

// Mock validation rules
export const validationRules = {
  username: { required: true, minLength: 3, maxLength: 20 },
  email: { required: true, pattern: /^[^@\s]+@[^@\s]+\.[^@\s]+$/ },
  bio: { maxLength: 200 },
  skills: { max: 10 },
  phone: { pattern: /^\+?[0-9\-\s]{7,15}$/ }
}; 