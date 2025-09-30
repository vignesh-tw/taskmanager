const request = require('supertest');
const { expect } = require('chai');
const app = require('../server');
const { mockTokens, mockUsers } = require('./setup');

describe('Slot and Booking Routes', () => {
  let slotId;
  let therapistToken;
  let patientToken;
  let therapistRes;

  // Create test users and slot before each test
  beforeEach(async () => {
    // Create therapist
    const therapistRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Dr. Test',
        email: 'doctor@example.com',
        password: 'password123',
        userType: 'therapist',
        specialties: ['Clinical'],
        rate: { amount: 100, currency: 'USD' }
      });
    therapistToken = therapistRes.body.data.token;

    // Create patient
    const patientRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Patient Test',
        email: 'patient@example.com',
        password: 'password123',
        userType: 'patient'
      });
    patientToken = patientRes.body.data.token;

    // Create a slot
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const start = new Date(tomorrow.setHours(10, 0, 0));
    const end = new Date(tomorrow.setHours(11, 0, 0));

    const slotRes = await request(app)
      .post('/api/slots')
      .set('Authorization', `Bearer ${therapistToken}`)
      .send({
        start: start.toISOString(),
        end: end.toISOString(),
        therapistId: therapistRes.body.data.user._id,
        status: 'available'
      });
    slotId = slotRes.body.data._id;
  });

  describe('Slot Routes', () => {
    describe('GET /api/slots', () => {
      it('should list available slots', async () => {
        const res = await request(app)
          .get('/api/slots');

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('status', 'success');
        expect(res.body.data).to.be.an('array');
      });
    });

    describe('POST /api/slots', () => {
      it('should create a new slot', async () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const start = new Date(tomorrow.setHours(14, 0, 0));
        const end = new Date(tomorrow.setHours(15, 0, 0));

        const res = await request(app)
          .post('/api/slots')
          .set('Authorization', `Bearer ${therapistToken}`)
          .send({
            start: start.toISOString(),
            end: end.toISOString()
          });

        expect(res.status).to.equal(201);
        expect(res.body.data).to.have.property('start');
        expect(res.body.data).to.have.property('end');
      });
    });
  });

  describe('Booking Routes', () => {
    describe('GET /api/bookings/my', () => {
      it('should list user bookings', async () => {
        const res = await request(app)
          .get('/api/bookings/my')
          .set('Authorization', `Bearer ${patientToken}`);

        expect(res.status).to.equal(200);
        expect(res.body.data).to.be.an('array');
      });
    });
  });
});