const BaseRepository = require("./BaseRepository");
const { Therapist } = require("../models/User");

/**
 * TherapistRepository implementing the Repository Pattern for Therapist-specific operations
 */
class TherapistRepository extends BaseRepository {
  constructor() {
    super(Therapist);
  }

  /**
   * Find therapists by specialty
   */
  async findBySpecialization(specialty) {
    return this.find({
      userType: "therapist",
      specialties: specialty,
      active: true,
    });
  }

  /**
   * Find available therapists
   */
  async findAvailable() {
    return this.find({
      userType: "therapist",
      active: true,
    });
  }

  /**
   * Update therapist availability
   */
  async updateAvailability(therapistId, availabilityData) {
    const therapist = await this.findById(therapistId);
    if (!therapist) throw new Error("Therapist not found");

    therapist.availability = availabilityData;
    return therapist.save();
  }

  /**
   * Find therapists by location
   */
  async findByLocation(city, state) {
    return this.find({
      "location.city": city,
      "location.state": state,
      acceptingNewPatients: true,
      active: true,
    });
  }

  /**
   * Find therapists by language
   */
  async findByLanguage(language) {
    return this.find({
      languages: language,
      acceptingNewPatients: true,
      active: true,
    });
  }

  /**
   * Update therapist profile with validation
   */
  async updateProfile(therapistId, profileData) {
    const allowedUpdates = [
      "specialization",
      "qualifications",
      "experience",
      "rate",
      "location",
      "languages",
    ];

    // Filter out non-allowed fields
    const updates = Object.keys(profileData)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = profileData[key];
        return obj;
      }, {});

    return this.update(therapistId, updates);
  }

  /**
   * Search therapists by query across multiple fields
   */
  async search(query) {
    const criteria = {
      userType: "therapist",
      $or: [
        { name: { $regex: query, $options: "i" } },
        { specialties: { $regex: query, $options: "i" } },
        { languages: { $regex: query, $options: "i" } },
        { "location.city": { $regex: query, $options: "i" } },
        { "location.state": { $regex: query, $options: "i" } },
      ],
      active: true,
    };

    const results = await this.model
      .find(criteria)
      .select("-password")
      .sort({ isVerified: -1, createdAt: -1 })
      .exec();

    return results;
  }
}

module.exports = TherapistRepository;
