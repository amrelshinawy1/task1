import { Connection, Model } from 'mongoose';
import { DATABASE_CONNECTION, PARCEL_MODEL, USER_MODEL } from './database.constants';
import { Parcel, ParcelModel } from './parcel.model';
import { Test, TestingModule } from '@nestjs/testing';
import { User, UserModel } from './user.model';

import { databaseModelsProviders } from './database-models.providers';

describe('DatabaseModelsProviders', () => {
  let conn: any;
  let userModel: any;
  let parcelModel: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ...databaseModelsProviders,

        {
          provide: DATABASE_CONNECTION,
          useValue: {
            model: jest
              .fn()
              .mockReturnValue({} as Model<User | Parcel>),
          },
        },
      ],
    }).compile();

    conn = module.get<Connection>(DATABASE_CONNECTION);
    userModel = module.get<UserModel>(USER_MODEL);
    parcelModel = module.get<ParcelModel>(PARCEL_MODEL);
  });

  it('DATABASE_CONNECTION should be defined', () => {
    expect(conn).toBeDefined();
  });

  it('USER_MODEL should be defined', () => {
    expect(userModel).toBeDefined();
  });

  it('POST_MODEL should be defined', () => {
    expect(parcelModel).toBeDefined();
  });

});
