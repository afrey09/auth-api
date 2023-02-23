'use strict';

const { app } = require('../src/server');
const { sequelizeDB, userModel } = require('../src/auth/models');
const supertest = require('supertest');
const request = supertest(app);

let testWriter;

beforeAll(async () => {
  sequelizeDB.sync();
  testWriter = await userModel.create({
    username: 'writer',
    password: 'pass123',
    role: 'writer',
  });
});

afterAll(async () => {
  sequelizeDB.drop();
});

describe('ACL Integration', () => {
  it('allows read access', async () => {
    let response = await request.get('/read').set('Authorization', `Bearer ${testWriter.token}`);

    console.log('------------------ from read', testWriter);

    expect(response.status).toEqual(200);
    expect(response.text).toEqual('You have read permission');
  });

  it('allows create access', async () => {
    let response = await request.post('/create').set('Authorization', `Bearer ${testWriter.token}`);

    expect(response.status).toEqual(200);
    expect(response.text).toEqual('You have create permission');
  });

  it('does not allow a writer update access', async () => {
    let response = await request.put('/update').set('Authorization', `Bearer ${testWriter.token}`);

    expect(response.status).toEqual(500);
  });

  it('does not allow a writer delete access', async () => {
    let response = await request.delete('/delete').set('Authorization', `Bearer ${testWriter.token}`);

    expect(response.status).toEqual(500);
  });
});
