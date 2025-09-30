const BaseRepository = require('./BaseRepository');
const UserRepository = require('./UserRepository');
const TherapistRepository = require('./TherapistRepository');
const SlotRepository = require('./SlotRepository');
const BookingRepository = require('./BookingRepository');

/**
 * Repository Factory implementing the Factory Pattern
 * Manages creation and caching of repository instances
 */
class RepositoryFactory {
  constructor() {
    if (RepositoryFactory.instance) {
      return RepositoryFactory.instance;
    }
    
    this.repositories = new Map();
    RepositoryFactory.instance = this;
  }

  /**
   * Get the singleton instance
   */
  static getInstance() {
    if (!RepositoryFactory.instance) {
      RepositoryFactory.instance = new RepositoryFactory();
    }
    return RepositoryFactory.instance;
  }

  /**
   * Get repository instance by type
   */
  getRepository(type) {
    if (this.repositories.has(type)) {
      return this.repositories.get(type);
    }

    let repository;
    switch (type) {
      case 'user':
        repository = new UserRepository();
        break;
      case 'therapist':
        repository = new TherapistRepository();
        break;
      case 'slot':
        repository = new SlotRepository();
        break;
      case 'booking':
        repository = new BookingRepository();
        break;
      default:
        throw new Error(`Unknown repository type: ${type}`);
    }

    this.repositories.set(type, repository);
    return repository;
  }

  /**
   * Clear repository cache
   */
  clearCache() {
    this.repositories.clear();
  }
}

// Create and export the singleton instance
const repositoryFactory = RepositoryFactory.getInstance();

module.exports = repositoryFactory;