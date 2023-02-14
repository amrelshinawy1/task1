import * as mongoose from 'mongoose';
import * as request from 'supertest';

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from './../src/app.module';

describe('API endpoints testing (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableShutdownHooks();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/register a new user', () => {
    it('if username is existed', async () => {
      const res = await request(app.getHttpServer())
        .post('/register')
        .send({
          username: 'amr',
          password: 'password',
          email: 'amr@test.com',
          firstName: 'Hantsy',
          lastName: 'Bai'
        });
      expect(res.status).toBe(409);
    });

    it('if email is existed', async () => {
      const res = await request(app.getHttpServer())
        .post('/register')
        .send({
          username: 'amr1',
          password: 'password',
          email: 'amr@example.com',
          firstName: 'Hantsy',
          lastName: 'Bai'
        });
      expect(res.status).toBe(409);
    });

    it('successed', async () => {
      const res = await request(app.getHttpServer())
        .post('/register')
        .send({
          username: 'amr1',
          password: 'password',
          email: 'amr@gmail.com',
          firstName: 'Hantsy',
          lastName: 'Bai'
        });
      expect(res.status).toBe(201);
    });
  });

  describe('if user is not logged in', () => {
    it('/parcels (GET)', async () => {
      const res = await request(app.getHttpServer()).get('/parcels').send();
      expect(res.status).toBe(200);
      expect(res.body.length).toEqual(3);
    });

    it('/parcels (GET) if none existing should return 404', async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(app.getHttpServer()).get('/parcels/' + id);
      expect(res.status).toBe(404);
    });

    it('/parcels (GET) if invalid id should return 400', async () => {
      const id = "invalidid";
      const res = await request(app.getHttpServer()).get('/parcels/' + id);
      expect(res.status).toBe(400);
    });

    it('/parcels (POST) should return 401', async () => {
      const res = await request(app.getHttpServer())
        .post('/parcels')
        .send({ name: 'test name' });
      expect(res.status).toBe(401);
    });

    it('/parcels (PUT) should return 401', async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(app.getHttpServer())
        .put('/parcels/' + id)
        .send({ name: 'test name' });
      expect(res.status).toBe(401);
    });

    it('/parcels (DELETE) should return 401', async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(app.getHttpServer())
        .delete('/parcels/' + id)
        .send();
      expect(res.status).toBe(401);
    });
  });

  describe('if user is logged in as (USER)', () => {
    let jwttoken: any;
    beforeEach(async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'amr', password: 'password' });

      expect(res.status).toBe(201);
      jwttoken = res.body.access_token;
    });

    it('/parcels (GET)', async () => {
      const res = await request(app.getHttpServer()).get('/parcels');
      expect(res.status).toBe(200);
      expect(res.body.length).toEqual(3);
    });

    it('/parcels (POST) with empty body should return 400', async () => {
      const res = await request(app.getHttpServer())
        .post('/parcels')
        .set('Authorization', 'Bearer ' + jwttoken)
        .send({});
      console.log(res.status);
      expect(res.status).toBe(400);
    });

    it('/parcels (PUT) if none existing should return 404', async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(app.getHttpServer())
        .put('/parcels/' + id)
        .set('Authorization', 'Bearer ' + jwttoken)
        .send({ name: 'test name' });
      expect(res.status).toBe(404);
    });

    it('/parcels (DELETE) if none existing should return 403', async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(app.getHttpServer())
        .delete('/parcels/' + id)
        .set('Authorization', 'Bearer ' + jwttoken)
        .send();
      expect(res.status).toBe(403);
    });
  });

  describe('if user is logged in as (ADMIN)', () => {
    let jwttoken: any;
    beforeEach(async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'admin', password: 'password' });
      jwttoken = res.body.access_token;
    });

    it('/parcels (DELETE) if none existing should return 404', async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(app.getHttpServer())
        .delete('/parcels/' + id)
        .set('Authorization', 'Bearer ' + jwttoken)
        .send();
      expect(res.status).toBe(404);
    });
  });
});
