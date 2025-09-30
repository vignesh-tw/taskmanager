const request = require('supertest');
const { expect } = require('chai');
const app = require('../server');
const { mockTokens, mockUsers } = require('./setup');

describe('Therapist Routes', () => {

  // Create a test therapist before each test
  let therapistToken;

  beforeEach(async () => {
    const therapistRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Dr. Test',
        email: 'doctor@example.com',
        password: 'password123',
        userType: 'therapist',
        specialties: ['Clinical'],
        rate: { amount: 100, currency: 'USD' },
        languages: ['English', 'Spanish'],
        location: {
          city: 'Test City',
          state: 'Test State'
        }
      });
    therapistToken = therapistRes.body.data.token;
  });

  describe('GET /api/therapists', () => {
    it('should list all therapists', async () => {
      const res = await request(app)
        .get('/api/therapists');

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('status', 'success');
      expect(res.body.data).to.be.an('array');
      expect(res.body.data).to.have.lengthOf(1);
    });

    it('should filter therapists by specialization', async () => {
      const res = await request(app)
        .get('/api/therapists')
        .query({ specialty: 'Clinical' });

      expect(res.status).to.equal(200);
      expect(res.body.data).to.be.an('array');
      expect(res.body.data[0]).to.have.property('specialties').that.includes('Clinical');
    });
  });

  describe('GET /api/therapists/search', () => {
    it('should search therapists by query', async () => {
      const res = await request(app)
        .get('/api/therapists/search')
        .query({ query: 'Test' });

      expect(res.status).to.equal(200);
      expect(res.body.data).to.be.an('array');
      expect(res.body.data[0]).to.have.property('name', 'Dr. Test');
    });
  });

  describe('PUT /api/therapists/me/availability', () => {
    it('should update therapist availability', async () => {
      const res = await request(app)
        .put('/api/therapists/me/availability')
        .set('Authorization', `Bearer ${therapistToken}`)
        .send({
          availability: {
            monday: [{ start: '09:00', end: '17:00' }],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: []
          }
        });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('status', 'success');
    });

    it('should reject unauthorized availability update', async () => {
      const res = await request(app)
        .put('/api/therapists/me/availability')
        .set('Authorization', `Bearer ${mockTokens.patient}`)
        .send({
          availability: {
            monday: [{ start: '09:00', end: '17:00' }],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: []
          }
        });

      expect(res.status).to.equal(403);
    });
  });
});