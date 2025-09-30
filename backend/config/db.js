/**
 * Database connection manager implementing the Singleton pattern
 * Ensures only one database connection instance exists throughout the application
 */
const mongoose = require('mongoose');
const EventEmitter = require('events');

class DatabaseConnection extends EventEmitter {
  constructor() {
    super();
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }
    
    this.isConnected = false;
    this.MAX_RETRIES = 5;
    this.RETRY_DELAY_MS = 1500;
    
    DatabaseConnection.instance = this;
  }

  /**
   * Get the singleton instance
   */
  static getInstance() {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  /**
   * Redact sensitive information from connection string
   */
  #redactConnectionString(uri) {
    if (!uri) return 'undefined';
    return uri.replace(/:[^:@]+@/, ':***@');
  }

  /**
   * Attempt to connect with retry logic
   */
  async #attemptConnect(uri, attempt = 1) {
    try {
      if (!this.isConnected) {
        await mongoose.connect(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          serverSelectionTimeoutMS: 5000
        });
        this.isConnected = true;
        this.emit('connected');
        console.log(`[DB] MongoDB connected successfully (attempt ${attempt})`);
      }
      return true;
    } catch (err) {
      console.error(`[DB] Connection error (attempt ${attempt}):`, err.message);
      if (attempt < this.MAX_RETRIES) {
        await new Promise(r => setTimeout(r, this.RETRY_DELAY_MS));
        return this.#attemptConnect(uri, attempt + 1);
      }
      this.emit('error', err);
      return false;
    }
  }

  /**
   * Connect to the database
   */
  async connect() {
    if (this.isConnected) {
      console.log('[DB] Already connected');
      return true;
    }

    let primaryUri = process.env.MONGO_URI;
    const fallbackUri = 'mongodb://127.0.0.1:27017/taskmanager';

    if (!primaryUri || primaryUri.trim() === '') {
      console.warn('[DB] MONGO_URI not set. Using fallback local URI.');
      primaryUri = fallbackUri;
    }

    console.log('[DB] Connecting to', this.#redactConnectionString(primaryUri));
    const ok = await this.#attemptConnect(primaryUri);
    
    if (!ok && primaryUri !== fallbackUri) {
      console.log('[DB] Trying fallback URI', fallbackUri);
      const fallbackOk = await this.#attemptConnect(fallbackUri);
      if (!fallbackOk) {
        this.emit('error', new Error('All connection attempts failed'));
        throw new Error('[DB] All connection attempts failed');
      }
    } else if (!ok) {
      this.emit('error', new Error('Connection failed after retries'));
      throw new Error('[DB] Connection failed after retries');
    }

    // Set up connection monitoring
    mongoose.connection.on('disconnected', () => {
      console.log('[DB] MongoDB disconnected');
      this.isConnected = false;
      this.emit('disconnected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('[DB] MongoDB connection error:', err);
      this.emit('error', err);
    });

    return true;
  }

  /**
   * Get the mongoose connection instance
   */
  getConnection() {
    return mongoose.connection;
  }

  /**
   * Close the database connection
   */
  async disconnect() {
    if (this.isConnected) {
      await mongoose.disconnect();
      this.isConnected = false;
      this.emit('disconnected');
      console.log('[DB] Disconnected from MongoDB');
    }
  }
}

// Create and export the singleton instance
const dbConnection = DatabaseConnection.getInstance();
module.exports = dbConnection;
