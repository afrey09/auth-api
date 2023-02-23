'use strict';

const { server } = require('../src/server');
const { db } = require('../src/auth/models');
const supertest = require('supertest');
const request = supertest(server);

//let testWriter;

beforeAll(async () => {
  await db.sync();
  // testWriter = await userModel.create({
  //   username: 'writer',
  //   password: 'pass123',
  //   role: 'writer',
  //});
});

afterAll(async () => {
  db.drop();
});

describe('v1 routes', () => {
  it('creates a record', async () => {
    let response = await request.post('/api/v1/food').send({
      name: 'tacos',
      calories: '100',
      type: 'protein',
    });
    expect(response.status).toEqual(201);
    expect(response.body[0].name).toEqual('tacos');
    expect(response.body.calories).toEqual('100');
    expect(response.body.type).toEqual('protein');
  });

  it('gets all records', async () => {
    let response = await request.get('/api/v1/food');
    expect(response.status).toEqual(200);
    expect(response.body[0].name).toEqual('tacos');
  });

  it('gets a single record', async () => {
    let response = await request.get('/api/v1/food/1');
    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('tacos');
  });

  it('updates a record', async () => {
    let response = await request.put('/api/v1/food/1').send({
      name: 'tacos',
      calories: '100',
      type: 'protein',
    });

    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('tacos');
    expect(response.body.calories).toEqual('100');

  });

  it('deletes a record', async () => {
    let response = await request.delete('/api/v1/food/1');

    expect(response.status).toEqual(200);
    expect(response.body).toEqual('tacos');
  });

});
