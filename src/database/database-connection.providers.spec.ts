  jest.mock('mongoose', () => ({
    createConnection: jest.fn().mockImplementation(
      (uri:any, options:any)=>({} as any)
      ),
    Connection: jest.fn()
  }))

import { Connection, createConnection } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigModule } from '@nestjs/config';
import { DATABASE_CONNECTION } from './database.constants';
import { databaseConnectionProviders } from './database-connection.providers';
import mongodbConfig from '../config/mongodb.config';

describe('DatabaseConnectionProviders', () => {
  let conn: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(mongodbConfig)],
      providers: [...databaseConnectionProviders],
    }).compile();

    conn = module.get<Connection>(DATABASE_CONNECTION);
  });



  it('DATABASE_CONNECTION should be defined', () => {
    expect(conn).toBeDefined();
  });

  it('connect is called', () => {
    expect(createConnection).toHaveBeenCalledWith("mongodb://localhost/saloodo", {    });
  })

});

// write function to sum two numbers