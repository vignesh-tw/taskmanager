/**
 * Observer Pattern implementation for notification system
 * Allows different types of notifications to be sent based on events
 */

// Observer interface
class NotificationObserver {
  update(event) {
    throw new Error("update method must be implemented");
  }
}

// Concrete Observers
class EmailNotification extends NotificationObserver {
  async update(event) {
    console.log(`Sending email notification for event: ${event.type}`);
    // Email sending implementation
    return {
      type: "email",
      recipient: event.recipient,
      subject: event.subject,
      content: event.content,
    };
  }
}

class SMSNotification extends NotificationObserver {
  async update(event) {
    console.log(`Sending SMS notification for event: ${event.type}`);
    // SMS sending implementation
    return {
      type: "sms",
      recipient: event.recipient,
      content: event.content,
    };
  }
}

class PushNotification extends NotificationObserver {
  async update(event) {
    console.log(`Sending push notification for event: ${event.type}`);
    // Push notification implementation
    return {
      type: "push",
      recipient: event.recipient,
      title: event.subject,
      body: event.content,
    };
  }
}

// Subject (Observable)
class NotificationManager {
  constructor() {
    this.observers = new Map();
  }

  attach(eventType, observer) {
    if (!this.observers.has(eventType)) {
      this.observers.set(eventType, new Set());
    }
    this.observers.get(eventType).add(observer);
  }

  detach(eventType, observer) {
    if (this.observers.has(eventType)) {
      this.observers.get(eventType).delete(observer);
    }
  }

  async notify(event) {
    if (!this.observers.has(event.type)) return;

    const observers = this.observers.get(event.type);
    const notifications = [];

    for (const observer of observers) {
      try {
        const notification = await observer.update(event);
        notifications.push(notification);
      } catch (error) {
        console.error(`Notification error: ${error.message}`);
      }
    }

    return notifications;
  }
}

// Event Types
const NotificationEvents = {
  BOOKING_CREATED: "booking.created",
  BOOKING_CONFIRMED: "booking.confirmed",
  BOOKING_CANCELLED: "booking.cancelled",
  BOOKING_REMINDER: "booking.reminder",
  PAYMENT_RECEIVED: "payment.received",
  PAYMENT_FAILED: "payment.failed",
};

// Notification Factory
class NotificationFactory {
  static createObservers(types) {
    const observers = new Map();

    types.forEach((type) => {
      switch (type) {
        case "email":
          observers.set(type, new EmailNotification());
          break;
        case "sms":
          observers.set(type, new SMSNotification());
          break;
        case "push":
          observers.set(type, new PushNotification());
          break;
        default:
          throw new Error(`Unknown notification type: ${type}`);
      }
    });

    return observers;
  }
}

// Event builder for creating notification events
class NotificationEventBuilder {
  constructor(type) {
    this.event = {
      type,
      timestamp: new Date(),
    };
  }

  setRecipient(recipient) {
    this.event.recipient = recipient;
    return this;
  }

  setSubject(subject) {
    this.event.subject = subject;
    return this;
  }

  setContent(content) {
    this.event.content = content;
    return this;
  }

  setData(data) {
    this.event.data = data;
    return this;
  }

  build() {
    if (!this.event.recipient) {
      throw new Error("Recipient is required");
    }
    if (!this.event.content) {
      throw new Error("Content is required");
    }
    return this.event;
  }
}

module.exports = {
  NotificationManager,
  NotificationFactory,
  NotificationEvents,
  NotificationEventBuilder,
};
