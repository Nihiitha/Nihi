export interface MockUserProfile {
  id: number;
  name: string;
  title: string;
  location: string;
  avatar: string;
  bio: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  connectionCount: number;
  mutualConnections: number;
  skills: Array<{
    id: number;
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  }>;
  experience: Array<{
    id: number;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: number;
    degree: string;
    institution: string;
    field: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    gpa?: string;
  }>;
  contactInfo: {
    email: string;
    phone?: string;
    location: string;
    website?: string;
  };
}

export interface MockActivity {
  id: number;
  type: 'post' | 'like' | 'comment' | 'connection' | 'achievement';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  color: string;
}

export interface MockPost {
  id: number;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
  isLiked: boolean;
}

// Mock User Profiles
export const mockProfiles: MockUserProfile[] = [
  {
    id: 1,
    name: "John Doe",
    title: "Senior Software Engineer",
    location: "San Francisco, CA",
    avatar: "/default-avatar.png",
    bio: "Passionate software engineer with 5+ years of experience in full-stack development. Specialized in React, Node.js, and cloud technologies. Always eager to learn new technologies and contribute to innovative projects.",
    socialLinks: {
      linkedin: "https://linkedin.com/in/johndoe",
      twitter: "https://twitter.com/johndoe",
      github: "https://github.com/johndoe",
      website: "https://johndoe.dev"
    },
    connectionCount: 342,
    mutualConnections: 28,
    skills: [
      { id: 1, name: "React", level: "expert" },
      { id: 2, name: "Node.js", level: "advanced" },
      { id: 3, name: "TypeScript", level: "advanced" },
      { id: 4, name: "Python", level: "intermediate" },
      { id: 5, name: "AWS", level: "intermediate" },
      { id: 6, name: "Docker", level: "beginner" }
    ],
    experience: [
      {
        id: 1,
        title: "Senior Software Engineer",
        company: "TechCorp Inc.",
        location: "San Francisco, CA",
        startDate: "2022-01-01",
        current: true,
        description: "Leading development of scalable web applications using React and Node.js. Mentoring junior developers and implementing best practices."
      },
      {
        id: 2,
        title: "Software Engineer",
        company: "StartupXYZ",
        location: "San Francisco, CA",
        startDate: "2020-03-01",
        endDate: "2021-12-31",
        current: false,
        description: "Developed and maintained multiple web applications. Collaborated with cross-functional teams to deliver high-quality software."
      }
    ],
    education: [
      {
        id: 1,
        degree: "Bachelor of Science",
        institution: "Stanford University",
        field: "Computer Science",
        startDate: "2016-09-01",
        endDate: "2020-06-01",
        current: false,
        gpa: "3.8"
      }
    ],
    contactInfo: {
      email: "john.doe@email.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      website: "https://johndoe.dev"
    }
  },
  {
    id: 2,
    name: "Sarah Johnson",
    title: "Product Manager",
    location: "New York, NY",
    avatar: "/default-avatar.png",
    bio: "Product manager with expertise in user experience design and agile methodologies. Passionate about creating products that solve real user problems.",
    socialLinks: {
      linkedin: "https://linkedin.com/in/sarahjohnson",
      twitter: "https://twitter.com/sarahjohnson"
    },
    connectionCount: 156,
    mutualConnections: 12,
    skills: [
      { id: 1, name: "Product Management", level: "expert" },
      { id: 2, name: "User Research", level: "advanced" },
      { id: 3, name: "Agile", level: "advanced" },
      { id: 4, name: "Figma", level: "intermediate" }
    ],
    experience: [
      {
        id: 1,
        title: "Senior Product Manager",
        company: "InnovateTech",
        location: "New York, NY",
        startDate: "2021-06-01",
        current: true,
        description: "Leading product strategy and development for enterprise SaaS solutions."
      }
    ],
    education: [
      {
        id: 1,
        degree: "Master of Business Administration",
        institution: "Harvard Business School",
        field: "Business Administration",
        startDate: "2019-09-01",
        endDate: "2021-05-01",
        current: false,
        gpa: "3.9"
      }
    ],
    contactInfo: {
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 987-6543",
      location: "New York, NY"
    }
  },
  {
    id: 3,
    name: "Aatham Ansari",
    title: "B.E - Electronics and Communication Engineering",
    location: "Tirunelveli, Tamil Nadu, India",
    avatar: "/default-avatar.png",
    bio: "Passionate Electronics and Communication Engineering graduate from Tirunelveli. Specialized in embedded systems and digital electronics. Seeking opportunities to apply my technical skills and contribute to innovative projects.",
    socialLinks: {},
    connectionCount: 200,
    mutualConnections: 25,
    skills: [
      { id: 1, name: "Embedded Systems", level: "advanced" },
      { id: 2, name: "Digital Electronics", level: "advanced" },
      { id: 3, name: "VLSI Design", level: "intermediate" },
      { id: 4, name: "PCB Design", level: "intermediate" },
      { id: 5, name: "Microcontrollers", level: "intermediate" },
      { id: 6, name: "C Programming", level: "advanced" }
    ],
    experience: [],
    education: [
      {
        id: 1,
        degree: "B.E - Electronics and Communication Engineering",
        institution: "Anna University",
        field: "Electronics and Communication Engineering",
        startDate: "2019-01-01",
        endDate: "2023-01-01",
        current: false
      },
      {
        id: 2,
        degree: "Higher Secondary Education",
        institution: "Tirunelveli Government Higher Secondary School",
        field: "",
        startDate: "2017-01-01",
        endDate: "2019-01-01",
        current: false
      }
    ],
    contactInfo: {
      email: "aatham.ansari@example.com",
      phone: "+91 98765 43210",
      location: "Tirunelveli, Tamil Nadu"
    }
  }
];

// Mock Activities
export const mockActivities: MockActivity[] = [
  {
    id: 1,
    type: 'achievement',
    title: 'Earned "Top Contributor" Badge',
    description: 'For consistently providing valuable insights in the community',
    timestamp: '2024-01-15T14:20:00Z',
    icon: '🏆',
    color: 'bg-yellow-100 text-yellow-800'
  },
  {
    id: 2,
    type: 'connection',
    title: 'Connected with Sarah Johnson',
    description: 'Software Engineer at Google',
    timestamp: '2024-01-15T11:30:00Z',
    icon: '👥',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    id: 3,
    type: 'post',
    title: 'Shared a post',
    description: 'About project management best practices',
    timestamp: '2024-01-15T10:30:00Z',
    icon: '📝',
    color: 'bg-green-100 text-green-800'
  },
  {
    id: 4,
    type: 'like',
    title: 'Liked a post by Mike Chen',
    description: 'About React performance optimization',
    timestamp: '2024-01-14T16:45:00Z',
    icon: '❤️',
    color: 'bg-red-100 text-red-800'
  },
  {
    id: 5,
    type: 'comment',
    title: 'Commented on a post',
    description: 'Shared insights about TypeScript best practices',
    timestamp: '2024-01-14T14:20:00Z',
    icon: '💬',
    color: 'bg-purple-100 text-purple-800'
  }
];

// Mock Posts
export const mockPosts: MockPost[] = [
  {
    id: 1,
    content: "Just completed a major project milestone! Excited to share the results with our team. #projectmanagement #success",
    likes: 24,
    comments: 8,
    shares: 3,
    createdAt: '2024-01-15T10:30:00Z',
    isLiked: false
  },
  {
    id: 2,
    content: "Attended an amazing tech conference today. Learned so much about the latest trends in AI and machine learning.",
    image: "/conference-image.jpg",
    likes: 18,
    comments: 5,
    shares: 2,
    createdAt: '2024-01-14T16:45:00Z',
    isLiked: true
  },
  {
    id: 3,
    content: "Happy to announce that I've been promoted to Senior Developer! Grateful for the opportunities and support from my amazing team.",
    likes: 45,
    comments: 12,
    shares: 7,
    createdAt: '2024-01-13T09:15:00Z',
    isLiked: false
  },
  {
    id: 4,
    content: "Working on some exciting new features for our platform. Can't wait to see how users respond to these improvements!",
    likes: 32,
    comments: 6,
    shares: 4,
    createdAt: '2024-01-12T14:30:00Z',
    isLiked: true
  }
];

// Mock API Responses
export const mockApiResponses = {
  profile: {
    success: {
      status: 200,
      data: mockProfiles[0]
    },
    error: {
      status: 404,
      error: "Profile not found"
    }
  },
  
  updateProfile: {
    success: {
      status: 200,
      message: "Profile updated successfully",
      data: mockProfiles[0]
    },
    error: {
      status: 400,
      error: "Invalid data provided"
    }
  },
  
  uploadImage: {
    success: {
      status: 200,
      url: "https://example.com/uploads/avatar.jpg"
    },
    error: {
      status: 413,
      error: "File too large"
    }
  },
  
  activities: {
    success: {
      status: 200,
      data: mockActivities,
      hasMore: true
    }
  },
  
  posts: {
    success: {
      status: 200,
      data: mockPosts,
      hasMore: true
    }
  }
};

// Mock form validation test data
export const mockFormData = {
  validProfile: {
    name: "John Doe",
    title: "Senior Software Engineer",
    location: "San Francisco, CA",
    bio: "Passionate software engineer with 5+ years of experience.",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    website: "https://johndoe.dev"
  },
  
  invalidProfile: {
    name: "",
    title: "A".repeat(150), // Too long
    location: "San Francisco, CA",
    bio: "Valid bio",
    email: "invalid-email",
    phone: "invalid-phone",
    website: "not-a-url"
  },
  
  partialProfile: {
    name: "John",
    title: "",
    location: "San Francisco, CA",
    bio: "",
    email: "john@email.com",
    phone: "",
    website: ""
  }
};

// Mock loading states
export const mockLoadingStates = {
  profile: false,
  activities: false,
  posts: false,
  imageUpload: false,
  formSubmission: false
};

// Mock error states
export const mockErrorStates = {
  profile: null,
  activities: null,
  posts: null,
  imageUpload: null,
  formSubmission: null
}; 