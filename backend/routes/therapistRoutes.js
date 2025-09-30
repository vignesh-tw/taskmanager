const express = require("express");
const {
  AuthenticationDecorator,
  RoleAuthorizationDecorator,
  ResourceOwnerDecorator,
} = require("../patterns/AuthDecorator");
const repositoryFactory = require("../repositories/RepositoryFactory");
const upload = require("../middleware/uploadMiddleware");
const { mockTherapists, mockSlots } = require("../mockData");
const router = express.Router();

// Initialize repositories
const therapistRepository = repositoryFactory.getRepository("therapist");
const slotRepository = repositoryFactory.getRepository("slot");

// Base controller for fetching therapist profile
class TherapistProfileController {
  async execute(req, res) {
    try {
      const userId = req.user.id;
      console.log("Fetching therapist profile for user ID:", userId);

      // Get therapist data from user repository (since therapists are stored as users)
      const userRepository = repositoryFactory.getRepository("user");
      const therapist = await userRepository.findById(userId);

      if (!therapist) {
        return res.status(404).json({
          status: "error",
          message: "Therapist profile not found",
        });
      }

      return res.status(200).json({
        status: "success",
        data: therapist.getProfileData(),
      });
    } catch (error) {
      console.error("[Get Therapist Profile Error]:", error);
      return res.status(500).json({
        status: "error",
        message: "Error fetching therapist profile",
        error: error.message,
      });
    }
  }
}

// Base controller for listing therapists
class ListTherapistsController {
  async execute(req, res) {
    try {
      const { specialization, location, language, name, search } = req.query;
      let therapists = [];

      try {
        // Try to get therapists from database first
        if (search) {
          therapists = await therapistRepository.search(search);
        } else if (name) {
          therapists = await therapistRepository.findByName(name);
        } else if (specialization) {
          therapists =
            await therapistRepository.findBySpecialization(specialization);
        } else if (location) {
          const [city, state] = location.split(",").map((s) => s.trim());
          therapists = await therapistRepository.findByLocation(city, state);
        } else if (language) {
          therapists = await therapistRepository.findByLanguage(language);
        } else {
          therapists = await therapistRepository.findAvailable();
        }
      } catch (dbError) {
        console.log("Database not available, using mock data");
        therapists = [];
      }

      // If no therapists found in database, use mock data
      if (!therapists || therapists.length === 0) {
        therapists = mockTherapists.filter((therapist) => {
          if (search) {
            const query = search.toLowerCase();
            return (
              therapist.name.toLowerCase().includes(query) ||
              therapist.specialty.toLowerCase().includes(query) ||
              therapist.specializations.some((spec) =>
                spec.toLowerCase().includes(query),
              ) ||
              therapist.languages.some((lang) =>
                lang.toLowerCase().includes(query),
              ) ||
              therapist.location.toLowerCase().includes(query)
            );
          } else if (name) {
            return therapist.name.toLowerCase().includes(name.toLowerCase());
          } else if (specialization) {
            return (
              therapist.specialty
                .toLowerCase()
                .includes(specialization.toLowerCase()) ||
              therapist.specializations.some((spec) =>
                spec.toLowerCase().includes(specialization.toLowerCase()),
              )
            );
          } else if (location) {
            return therapist.location
              .toLowerCase()
              .includes(location.toLowerCase());
          } else if (language) {
            return therapist.languages.some((lang) =>
              lang.toLowerCase().includes(language.toLowerCase()),
            );
          }
          return true;
        });
      }

      // Ensure we return therapist data in a consistent format for cards
      const formattedTherapists = therapists.map((therapist) => ({
        id: therapist._id || therapist.id,
        name: therapist.name || `${therapist.firstName} ${therapist.lastName}`,
        specialty: therapist.specialization || therapist.specialty,
        profilePicture: therapist.profilePicture || therapist.photo,
        languages: therapist.languages || [],
        location: therapist.location || "",
        rating: therapist.rating || 0,
        reviewCount: therapist.reviewCount || 0,
        bio: therapist.bio || "",
        isAvailable: therapist.isAvailable !== false,
      }));

      return res.status(200).json({
        status: "success",
        data: formattedTherapists,
      });
    } catch (error) {
      console.error("[List Therapists Error]:", error);
      return res.status(500).json({
        status: "error",
        message: "Error fetching therapists",
      });
    }
  }
}

// Base controller for searching therapists
class SearchTherapistsController {
  async execute(req, res) {
    try {
      const { query } = req.query;
      if (!query) {
        return res.status(400).json({
          status: "error",
          message: "Search query is required",
        });
      }

      const therapists = await therapistRepository.search(query);

      return res.status(200).json({
        status: "success",
        data: therapists,
      });
    } catch (error) {
      console.error("[Search Therapists Error]:", error);
      return res.status(500).json({
        status: "error",
        message: "Error searching therapists",
      });
    }
  }
}

// Base controller for getting therapist profile
class GetTherapistProfileController {
  async execute(req, res) {
    try {
      let therapist = null;

      try {
        therapist = await therapistRepository.findById(req.params.id);
      } catch (dbError) {
        console.log("Database not available, using mock data");
      }

      // If not found in database, try mock data
      if (!therapist) {
        therapist = mockTherapists.find((t) => t.id === req.params.id);
      }

      if (!therapist) {
        return res.status(404).json({
          status: "error",
          message: "Therapist not found",
        });
      }

      // Format therapist data for detailed profile view
      const detailedProfile = {
        id: therapist._id || therapist.id,
        name: therapist.name || `${therapist.firstName} ${therapist.lastName}`,
        firstName: therapist.firstName,
        lastName: therapist.lastName,
        email: therapist.email,
        phone: therapist.phone,
        specialty: therapist.specialization || therapist.specialty,
        specializations:
          therapist.specializations ||
          [therapist.specialization || therapist.specialty].filter(Boolean),
        profilePicture: therapist.profilePicture || therapist.photo,
        languages: therapist.languages || [],
        location: therapist.location || "",
        bio: therapist.bio || "",
        education: therapist.education || [],
        experience: therapist.experience || "",
        certifications: therapist.certifications || [],
        rating: therapist.rating || 0,
        reviewCount: therapist.reviewCount || 0,
        sessionPrice: therapist.sessionPrice || 0,
        isAvailable: therapist.isAvailable !== false,
        availability: therapist.availability || {},
        createdAt: therapist.createdAt,
        updatedAt: therapist.updatedAt,
      };

      return res.status(200).json({
        status: "success",
        data: detailedProfile,
      });
    } catch (error) {
      console.error("[Therapist Profile Error]:", error);
      return res.status(500).json({
        status: "error",
        message: "Error fetching therapist profile",
      });
    }
  }
}

// Base controller for updating therapist profile
class UpdateTherapistProfileController {
  async execute(req, res) {
    try {
      const updatedTherapist = await therapistRepository.updateProfile(
        req.user.id,
        req.body,
      );

      return res.status(200).json({
        status: "success",
        data: updatedTherapist.getProfileData(),
      });
    } catch (error) {
      console.error("[Update Therapist Error]:", error);
      return res.status(500).json({
        status: "error",
        message: "Error updating therapist profile",
      });
    }
  }
}

// Base controller for getting therapist available slots
class GetTherapistSlotsController {
  async execute(req, res) {
    try {
      const { id: therapistId } = req.params;
      const { startDate, endDate } = req.query;

      // Default to showing slots from now until next 30 days
      const defaultStartDate = new Date();
      const defaultEndDate = new Date();
      defaultEndDate.setDate(defaultEndDate.getDate() + 30);

      let slots = [];

      try {
        slots = await slotRepository.findAvailableSlots(
          therapistId,
          startDate ? new Date(startDate) : defaultStartDate,
          endDate ? new Date(endDate) : defaultEndDate,
        );
      } catch (dbError) {
        console.log("Database not available, using mock data for slots");
      }

      // If no slots found in database, use mock data
      if (!slots || slots.length === 0) {
        const start = startDate ? new Date(startDate) : defaultStartDate;
        const end = endDate ? new Date(endDate) : defaultEndDate;

        slots = mockSlots.filter((slot) => {
          const slotDate = new Date(slot.startTime);
          return (
            slot.therapistId === therapistId &&
            slotDate >= start &&
            slotDate <= end &&
            slot.isAvailable
          );
        });
      }

      // Format slots for easier frontend consumption
      const formattedSlots = slots.map((slot) => ({
        id: slot._id || slot.id,
        startTime: slot.startTime || slot.start,
        endTime: slot.endTime || slot.end,
        date:
          slot.date || new Date(slot.startTime || slot.start).toDateString(),
        duration: slot.duration || 60,
        price: slot.price || 0,
        isAvailable: slot.isAvailable !== false,
      }));

      return res.status(200).json({
        status: "success",
        data: formattedSlots,
      });
    } catch (error) {
      console.error("[Get Therapist Slots Error]:", error);
      return res.status(500).json({
        status: "error",
        message: "Error fetching therapist slots",
      });
    }
  }
}

// Base controller for updating availability
class UpdateAvailabilityController {
  async execute(req, res) {
    try {
      const { availability } = req.body;
      const therapist = await therapistRepository.findById(req.user.id);

      if (!therapist) {
        return res.status(404).json({
          status: "error",
          message: "Therapist not found",
        });
      }

      // Update availability
      therapist.availability = availability;
      await therapist.save();

      return res.status(200).json({
        status: "success",
        message: "Availability updated successfully",
        data: {
          availability: therapist.availability,
        },
      });
    } catch (error) {
      console.error("[Update Availability Error]:", error);
      return res.status(500).json({
        status: "error",
        message: "Error updating availability",
      });
    }
  }
}

// Import auth middleware
const { requireAuth } = require("../middleware/authMiddleware");

// Create decorated controllers
const listTherapists = new ListTherapistsController();
const searchTherapists = new SearchTherapistsController();
const getTherapistProfile = new GetTherapistProfileController();
const getTherapistSlots = new GetTherapistSlotsController();
const therapistProfile = new TherapistProfileController();
const updateTherapistProfile = new AuthenticationDecorator(
  new RoleAuthorizationDecorator(new UpdateTherapistProfileController(), [
    "therapist",
  ]),
);
const updateAvailability = new AuthenticationDecorator(
  new RoleAuthorizationDecorator(new UpdateAvailabilityController(), [
    "therapist",
  ]),
);

// Routes
router.get("/", (req, res) => listTherapists.execute(req, res));
router.get("/search", (req, res) => searchTherapists.execute(req, res));
router.get("/me/profile", requireAuth(), (req, res) => {
  console.log("Hit /me/profile route, user:", req.user);
  therapistProfile.execute(req, res);
});
router.get("/:id", (req, res) => getTherapistProfile.execute(req, res));
router.get("/:id/slots", (req, res) => getTherapistSlots.execute(req, res));
router.put("/me/profile", (req, res, next) =>
  updateTherapistProfile.execute(req, res, next),
);
router.put("/me/availability", (req, res, next) =>
  updateAvailability.execute(req, res, next),
);

// File upload route
router.post(
  "/me/upload-photo",
  (req, res, next) =>
    new AuthenticationDecorator(
      new RoleAuthorizationDecorator({ execute: uploadProfilePicture }, [
        "therapist",
      ]),
    ).execute(req, res, next),
  upload.single("profilePicture"),
);

module.exports = router;
