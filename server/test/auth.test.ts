import request from 'supertest';
import app from '../testHelper/app';

describe('Auth routes', ()=>{
  it('register -> login flow', async ()=>{
    const email = `test${Date.now()}@example.com`;
    const pw = 'Password123!';

    const reg = await request(app).post('/api/auth/register').send({ email, password: pw });
    expect(reg.status).toBe(200);
    expect(reg.body.accessToken).toBeDefined();

    const login = await request(app).post('/api/auth/login').send({ email, password: pw });
    expect(login.status).toBe(200);
    expect(login.body.accessToken).toBeDefined();
  });
});
