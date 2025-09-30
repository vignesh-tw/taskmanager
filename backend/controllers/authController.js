const jwt = require("jsonwebtoken");
const repositoryFactory = require("../repositories/RepositoryFactory");
const {
  NotificationManager,
  NotificationFactory,
  NotificationEvents,
  NotificationEventBuilder,
} = require("../patterns/NotificationObserver");
const {
  AuthenticationDecorator,
  RoleAuthorizationDecorator,
} = require("../patterns/AuthDecorator");

// Initialize repositories
const userRepository = repositoryFactory.getRepository("user");

// Initialize notification system
const notificationManager = new NotificationManager();
const notificationObservers = NotificationFactory.createObservers(["email"]);
notificationManager.attach(
  NotificationEvents.USER_REGISTERED,
  notificationObservers.get("email"),
);

// Token generation utility
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      userType: user.userType,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" },
  );
};

// Base controller for registration
class RegistrationController {
  async execute(req, res) {
    const { name, email, password, userType, ...additionalData } = req.body;

    try {
      // Validate required fields
      if (!name || !email || !password || !userType) {
        return res.status(400).json({
          status: "error",
          message: "Missing required fields",
          received: {
            name: !!name,
            email: !!email,
            password: !!password,
            userType,
          },
        });
      }

      // Validate user type
      if (!["patient", "therapist"].includes(userType)) {
        return res.status(400).json({
          status: "error",
          message: 'Invalid user type. Must be either "patient" or "therapist"',
        });
      }

      // Check existing user
      const existingUser = await userRepository.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          status: "error",
          message: "User already exists",
        });
      }

      // Create user using repository pattern
      const userData = { name, email, password, userType, ...additionalData };
      const user = await userRepository.createUser(userData);

      // Send welcome notification using observer pattern
      const notificationEvent = new NotificationEventBuilder(
        NotificationEvents.USER_REGISTERED,
      )
        .setRecipient(user.email)
        .setSubject("Welcome to our platform!")
        .setContent(`Welcome ${user.name}! Thank you for registering.`)
        .setData({ userType: user.userType })
        .build();

      await notificationManager.notify(notificationEvent);

      // Return success response
      return res.status(201).json({
        status: "success",
        data: {
          user: user.getProfileData(),
          token: generateToken(user),
        },
      });
    } catch (error) {
      console.error("[Registration Error]:", error);
      return res.status(500).json({
        status: "error",
        message: "Registration failed",
        error: error.message,
      });
    }
  }
}

// Update Profile Controller
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Available from auth middleware
    const updateData = req.body;

    // Update user profile
    const user = await userRepository.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }, // Return the updated document
    );

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Return success response
    return res.json({
      status: "success",
      data: user.getProfileData(),
    });
  } catch (error) {
    console.error("[Update Profile Error]:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

// Base controller for login
class LoginController {
  async execute(req, res) {
    const { email, password } = req.body;

    try {
      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({
          status: "error",
          message: "Please provide email and password",
        });
      }

      // Find user
      const user = await userRepository.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          status: "error",
          message: "Invalid credentials",
        });
      }

      // Check password
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({
          status: "error",
          message: "Invalid credentials",
        });
      }

      // Return success response
      return res.status(200).json({
        status: "success",
        data: {
          user: user.getProfileData(),
          token: generateToken(user),
        },
      });
    } catch (error) {
      console.error("[Login Error]:", error);
      return res.status(500).json({
        status: "error",
        message: "Login failed",
        error: error.message,
      });
    }
  }
}

// Base controller for profile operations
class ProfileController {
  async execute(req, res) {
    try {
      const user = await userRepository.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User not found",
        });
      }

      return res.status(200).json({
        status: "success",
        data: user.getProfileData(),
      });
    } catch (error) {
      console.error("[Profile Error]:", error);
      return res.status(500).json({
        status: "error",
        message: "Error fetching profile",
        error: error.message,
      });
    }
  }
}

// Create decorated controllers
const registerUser = new RegistrationController();
const loginUser = new LoginController();
const getProfile = new AuthenticationDecorator(new ProfileController());

// Export controllers
/**
 * Handle profile picture upload
 */
const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "No file uploaded",
      });
    }

    // Update user's profile picture URL
    const user = await userRepository.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Set the URL path to the uploaded file
    const fileUrl = `/uploads/${req.file.filename}`;
    user.profilePicture = fileUrl;
    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Profile picture uploaded successfully",
      url: fileUrl,
    });
  } catch (error) {
    console.error("[Upload Error]:", error);
    return res.status(500).json({
      status: "error",
      message: "Error uploading profile picture",
    });
  }
};

module.exports = {
  registerUser: (req, res) => registerUser.execute(req, res),
  loginUser: (req, res) => loginUser.execute(req, res),
  getProfile: (req, res, next) => getProfile.execute(req, res, next),
  updateProfile,
  uploadProfilePicture,
  generateToken,
};
