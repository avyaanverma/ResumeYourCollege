import mongoose from "mongoose";
import { RESUME_VISIBILITY } from "../constants/index.js";

const personalSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    linkedin: {
      type: String,
      default: "",
      trim: true,
    },

    github: {
      type: String,
      default: "",
      trim: true,
    },

    portfolio: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    institution: {
      type: String,
      default: "",
    },

    degree: {
      type: String,
      default: "",
    },

    fieldOfStudy: {
      type: String,
      default: "",
    },

    startDate: {
      type: String,
      default: "",
    },

    endDate: {
      type: String,
      default: "",
    },

    cgpa: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: false,
  }
);

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      default: "",
    },

    position: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    startDate: {
      type: String,
      default: "",
    },

    endDate: {
      type: String,
      default: "",
    },

    currentlyWorking: {
      type: Boolean,
      default: false,
    },

    description: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: false,
  }
);

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },

    techStack: [
      {
        type: String,
      },
    ],

    github: {
      type: String,
      default: "",
    },

    live: {
      type: String,
      default: "",
    },

    description: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: false,
  }
);

const skillSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      default: "",
    },

    items: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: false,
  }
);

const certificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },

    issuer: {
      type: String,
      default: "",
    },

    issueDate: {
      type: String,
      default: "",
    },

    credentialUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: false,
  }
);

const languageSchema = new mongoose.Schema(
  {
    language: {
      type: String,
      default: "",
    },

    proficiency: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: false,
  }
);

const resumeSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      default: "Untitled Resume",
      trim: true,
    },

    template: {
      type: String,
      default: "modern",
    },

    visibility: {
      type: String,
      enum: Object.values(RESUME_VISIBILITY),
      default: RESUME_VISIBILITY.PRIVATE,
    },

    personal: {
      type: personalSchema,
      default: () => ({}),
    },

    summary: {
      type: String,
      default: "",
    },

    education: {
      type: [educationSchema],
      default: [],
    },

    experience: {
      type: [experienceSchema],
      default: [],
    },

    projects: {
      type: [projectSchema],
      default: [],
    },

    skills: {
      type: [skillSchema],
      default: [],
    },

    certifications: {
      type: [certificationSchema],
      default: [],
    },

    achievements: {
      type: [String],
      default: [],
    },

    languages: {
      type: [languageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;