const request = require('supertest');
const app = require('./index');

describe('Test GET User', () => {
    
    test('Get correct user', async () => {
      return request(app)
      .get('/user/sbirulino')
      .then(response => {
        expect(response.statusCode).toBe(200);
      });
    });
    
    test('Get incorrect user', async () => {
      return request(app)
      .get('/user/1')
      .then(response => {
        expect(response.statusCode).toBe(404);
      });
    });
});

            