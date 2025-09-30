const request = require("supertest");
const { expect } = require("chai");
const app = require("../server");
const { mockTokens, mockUsers } = require("./setup");
const mongoose = require("mongoose");

describe("Booking Tests", () => {
  let slotId;

  beforeEach(async () => {
    // Create a test slot
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const slot = {
      start: new Date(tomorrow.setHours(10, 0, 0)).toISOString(),
      end: new Date(tomorrow.setHours(11, 0, 0)).toISOString(),
      therapistId: mockUsers.therapist._id,
    };

    const res = await request(app)
      .post("/api/slots")
      .set("Authorization", `Bearer ${mockTokens.therapist}`)
      .send(slot);

    slotId = res.body.data._id;
  });

  it("should return 404 when deleting non-existent booking", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/api/bookings/${fakeId}`)
      .set("Authorization", `Bearer ${mockTokens.patient}`);

    expect(res.status).to.equal(404);
    expect(res.body.message).to.equal("Booking not found");
  });
});
