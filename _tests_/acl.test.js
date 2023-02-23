'use strict';

const { server } = require('../src/server');
const { db, userModel } = require('../src/auth/models');
const supertest = require('supertest');
const request = supertest(server);

let testWriter;

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

describe('Auth', () => {
  it('allows user to signup', async () => {
    let response = await request.post('/signup').send({
      username: 'testAdmin',
      password: 'pass123',
      role: 'admin',
    });

    // console.log('------------------ from read', testWriter);

    expect(response.status).toEqual(200);
    expect(response.body.user.username).toEqual('testAdmin');
  });

  it('allows user to login', async () => {
    let response = await request.post('/signin').auth('testAdmin', 'pass123');

    expect(response.status).toEqual(200);
    expect(response.body.user.username).toEqual('testAdmin');
  });
});


//   it('allows create access', async () => {
//     let response = await request.post('/create').set('Authorization', `Bearer ${testWriter.token}`);

//     expect(response.status).toEqual(200);
//     expect(response.text).toEqual('You have create permission');
//   });

//   it('does not allow a writer update access', async () => {
//     let response = await request.put('/update').set('Authorization', `Bearer ${testWriter.token}`);

//     expect(response.status).toEqual(500);
//   });

//   it('does not allow a writer delete access', async () => {
//     let response = await request.delete('/delete').set('Authorization', `Bearer ${testWriter.token}`);

//     expect(response.status).toEqual(500);
//   });
// });
