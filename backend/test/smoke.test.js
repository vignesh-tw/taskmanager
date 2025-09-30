const request = require('supertest');
const { expect } = require('chai');
const app = require('../server');

describe('Smoke Tests', () => {
  describe('Health Check', () => {
    it('should return 200 and correct environment', async () => {
      const res = await request(app)
        .get('/api/health')
        .expect(200);

      expect(res.body).to.have.property('ok', true);
      expect(res.body).to.have.property('env', 'test');
      expect(res.body).to.have.property('dbState');
      expect(res.body).to.have.property('timestamp');
    });
  });

  describe('API Endpoints', () => {
    it('auth endpoint should be accessible', async () => {
      await request(app)
        .post('/api/auth/login')
        .expect(400); // Expect 400 as no credentials provided
    });

    it('tasks endpoint should require auth', async () => {
      await request(app)
        .get('/api/tasks')
        .expect(401); // Expect 401 as no token provided
    });

    it('therapists endpoint should be accessible', async () => {
      await request(app)
        .get('/api/therapists')
        .expect(200);
    });
  });
});