'use strict';

const { server } = require('../src/server');
const { db, userModel } = require('../src/auth/models');
const supertest = require('supertest');
const request = supertest(server);

let testWriter;

beforeAll(async () => {
  await db.sync();
  testWriter = await userModel.create({
    username: 'writer',
    password: 'pass123',
    role: 'writer',
  });
});

afterAll(async () => {
  db.drop();
});


// ** for Bearer Auth
//* headers: {
//Authorization: Bearer <some-token>;
//* }


describe('v2 routes', () => {
  it('creates a record', async () => {
    let response = await request.post('/api/v2/food').send({
      name: 'tacos',
      calories: '100',
      type: 'protein',
    }).set('Authorization', `Bearer ${testWriter.token}`);


    expect(response.status).toEqual(201);
    expect(response.body[0].name).toEqual('tacos');
    expect(response.body.calories).toEqual('100');
    expect(response.body.type).toEqual('protein');
  });

  it('gets all records', async () => {
    let response = await request.get('/api/v2/food').set('Authorization', `Bearer ${testWriter.token}`);
    expect(response.status).toEqual(200);
    expect(response.body[0].name).toEqual('tacos');
  });

  it('gets a single record', async () => {
    let response = await request.get('/api/v2/food/1').set('Authorization', `Bearer ${testWriter.token}`);
    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('tacos');
  });

  it('updates a record', async () => {
    let response = await request.put('/api/v2/food/1').send({
      name: 'tacos',
      calories: 100,
      type: 'protein',
    });

    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('tacos');
    expect(response.body.calories).toEqual(100);

  });

  it('deletes a record', async () => {
    let response = await request.delete('/api/v2/food/1').set('Authorization', `Bearer ${testWriter.token}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual('tacos');
  });

});
