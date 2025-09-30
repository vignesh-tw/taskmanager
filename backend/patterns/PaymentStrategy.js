/**
 * Strategy Pattern implementation for payment processing
 * Allows switching between different payment methods
 */

// Payment Strategy Interface
class PaymentStrategy {
  async processPayment(amount, currency) {
    throw new Error("processPayment method must be implemented");
  }

  async refundPayment(transactionId) {
    throw new Error("refundPayment method must be implemented");
  }
}

// Concrete Payment Strategies
class CreditCardPayment extends PaymentStrategy {
  constructor(credentials) {
    super();
    this.credentials = credentials;
  }

  async processPayment(amount, currency) {
    // Implementation for credit card payment processing
    console.log(`Processing credit card payment: ${amount} ${currency}`);
    return {
      success: true,
      transactionId: `CC-${Date.now()}`,
      amount,
      currency,
    };
  }

  async refundPayment(transactionId) {
    console.log(`Refunding credit card payment: ${transactionId}`);
    return {
      success: true,
      refundId: `RF-${transactionId}`,
    };
  }
}

class PayPalPayment extends PaymentStrategy {
  constructor(credentials) {
    super();
    this.credentials = credentials;
  }

  async processPayment(amount, currency) {
    // Implementation for PayPal payment processing
    console.log(`Processing PayPal payment: ${amount} ${currency}`);
    return {
      success: true,
      transactionId: `PP-${Date.now()}`,
      amount,
      currency,
    };
  }

  async refundPayment(transactionId) {
    console.log(`Refunding PayPal payment: ${transactionId}`);
    return {
      success: true,
      refundId: `RF-${transactionId}`,
    };
  }
}

class BankTransferPayment extends PaymentStrategy {
  constructor(credentials) {
    super();
    this.credentials = credentials;
  }

  async processPayment(amount, currency) {
    // Implementation for bank transfer processing
    console.log(`Processing bank transfer: ${amount} ${currency}`);
    return {
      success: true,
      transactionId: `BT-${Date.now()}`,
      amount,
      currency,
    };
  }

  async refundPayment(transactionId) {
    console.log(`Refunding bank transfer: ${transactionId}`);
    return {
      success: true,
      refundId: `RF-${transactionId}`,
    };
  }
}

// Context class
class PaymentProcessor {
  constructor() {
    this.strategy = null;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  async processPayment(amount, currency) {
    if (!this.strategy) {
      throw new Error("Payment strategy not set");
    }
    return this.strategy.processPayment(amount, currency);
  }

  async refundPayment(transactionId) {
    if (!this.strategy) {
      throw new Error("Payment strategy not set");
    }
    return this.strategy.refundPayment(transactionId);
  }
}

// Factory for creating payment strategies
class PaymentStrategyFactory {
  static createStrategy(type, credentials) {
    switch (type) {
      case "creditCard":
        return new CreditCardPayment(credentials);
      case "paypal":
        return new PayPalPayment(credentials);
      case "bankTransfer":
        return new BankTransferPayment(credentials);
      default:
        throw new Error(`Unsupported payment type: ${type}`);
    }
  }
}

module.exports = {
  PaymentProcessor,
  PaymentStrategyFactory,
};
