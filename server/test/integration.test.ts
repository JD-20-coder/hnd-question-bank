import request from 'supertest';
import app from '../src/index';

describe('Integration: Banks & Questions', () => {
  const ts = Date.now();
  const testEmail = `test+${ts}@example.com`;
  const testPassword = 'Test1234!';
  let token: string | null = null;
  let bankId: number | null = null;
  let questionId: number | null = null;

  beforeAll(() => {
    if (!process.env.DB_HOST) {
      console.warn('DB_HOST not set — ensure migrations and seed have been run and env vars configured for tests');
    }
  });

  test('register -> login -> create bank -> create question -> cleanup', async () => {
    // register
    const reg = await request(app).post('/api/auth/register').send({ email: testEmail, password: testPassword, full_name: 'Integration Tester' });
    expect(reg.status).toBe(200);
    expect(reg.body.accessToken).toBeDefined();

    // login
    const login = await request(app).post('/api/auth/login').send({ email: testEmail, password: testPassword });
    expect(login.status).toBe(200);
    expect(login.body.accessToken).toBeDefined();
    token = login.body.accessToken;

    // create bank
    const bankRes = await request(app).post('/api/banks').set('Authorization', `Bearer ${token}`).send({ title: `IT Bank ${ts}`, description: 'integration bank' });
    expect(bankRes.status).toBe(200);
    expect(bankRes.body.id).toBeDefined();
    bankId = bankRes.body.id;

    // list banks
    const list = await request(app).get('/api/banks');
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body.items)).toBe(true);

    // create question
    const qRes = await request(app).post('/api/questions').set('Authorization', `Bearer ${token}`).send({ bankId, title: 'What is 1+1?', body: 'Compute 1+1', answer: '2', type: 'short', difficulty: 'easy' });
    expect(qRes.status).toBe(200);
    expect(qRes.body.id).toBeDefined();
    questionId = qRes.body.id;

    // fetch questions by bank
    const qList = await request(app).get(`/api/questions/bank/${bankId}`);
    expect(qList.status).toBe(200);
    expect(Array.isArray(qList.body.items)).toBe(true);

    // cleanup - delete question
    const delQ = await request(app).delete(`/api/questions/${questionId}`).set('Authorization', `Bearer ${token}`);
    expect(delQ.status).toBe(200);

    // cleanup - delete bank
    const delB = await request(app).delete(`/api/banks/${bankId}`).set('Authorization', `Bearer ${token}`);
    expect(delB.status).toBe(200);
  }, 20000);
});
