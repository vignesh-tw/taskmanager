/**
 * Base Repository implementing the Repository Pattern
 * Provides a standard interface for data access operations
 */
class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  /**
   * Create a new document
   */
  async create(data, options = {}) {
    try {
      const document = new this.model(data);
      return await document.save(options);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Find document by ID
   */
  async findById(id) {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Find document by ID and update
   */
  async findByIdAndUpdate(id, updateData, options = {}) {
    try {
      return await this.model.findByIdAndUpdate(id, updateData, {
        new: true, // Return the updated document
        runValidators: true, // Run schema validators
        ...options,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Find documents by criteria
   */
  async find(criteria = {}, options = {}) {
    try {
      if (!this.model || !this.model.find) {
        throw new Error("Model is not properly initialized");
      }

      const {
        sort = { createdAt: -1 },
        limit = 50,
        skip = 0,
        populate = [],
      } = options;

      const query = this.model
        .find(criteria)
        .sort(sort)
        .skip(skip)
        .limit(limit);

      if (populate.length > 0) {
        populate.forEach((field) => query.populate(field));
      }

      return await query.exec();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Find one document by criteria
   */
  async findOne(criteria) {
    try {
      if (!this.model || !this.model.findOne) {
        throw new Error("Model is not properly initialized");
      }

      return await this.model.findOne(criteria);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update document by ID
   */
  async update(id, data, options = {}) {
    try {
      const updateOptions = {
        new: true,
        runValidators: true,
        ...options,
      };
      return await this.model.findByIdAndUpdate(
        id,
        { $set: data },
        updateOptions,
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete document by ID
   */
  async delete(id) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle repository errors
   */
  handleError(error) {
    console.error("[Repository Error]:", error);
    return error;
  }

  /**
   * Count documents by criteria
   */
  async count(criteria = {}) {
    try {
      return await this.model.countDocuments(criteria);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Error handler
   */
  handleError(error) {
    // Log error details here if needed
    console.error("[Repository Error]:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      throw new Error(`Validation Error: ${messages.join(", ")}`);
    }

    if (error.code === 11000) {
      throw new Error("Duplicate key error");
    }

    throw error;
  }
}

module.exports = BaseRepository;
