const BaseRepository = require("./BaseRepository");
const { User } = require("../models/User");

/**
 * UserRepository implementing the Repository Pattern for User-related operations
 * Also implements Factory Pattern for creating different user types
 */
class UserRepository extends BaseRepository {
  constructor() {
    // Initialize with the base User model
    super(User);
  }

  /**
   * Factory method to create appropriate user type
   */
  async createUser(userData) {
    try {
      const UserModel = this.getUserModel(userData.userType);
      const user = new UserModel(userData);
      return await user.save();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get appropriate user model based on user type
   */
  getUserModel(userType) {
    return User.discriminators[userType] || User;
  }

  /**
   * Find user by email using the model
   */
  async findByEmail(email) {
    try {
      // Convert email to lowercase for consistent searching
      const lowercaseEmail = email.toLowerCase();

      // Use the model from the base repository
      return await this.model.findOne({ email: lowercaseEmail });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Find users by role
   */
  async findByRole(role) {
    return this.find({ userType: role });
  }

  /**
   * Update user profile
   */
  async updateProfile(userId, profileData) {
    const user = await this.findById(userId);
    if (!user) throw new Error("User not found");

    return user.updateProfile(profileData);
  }

  /**
   * Change user password
   */
  async changePassword(userId, oldPassword, newPassword) {
    const user = await this.findById(userId);
    if (!user) throw new Error("User not found");

    const isValidPassword = await user.comparePassword(oldPassword);
    if (!isValidPassword) throw new Error("Invalid current password");

    user.password = newPassword;
    return user.save();
  }
}

module.exports = UserRepository;
