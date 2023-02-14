import { DATABASE_CONNECTION, PARCEL_MODEL, USER_MODEL } from './database.constants';

import { Connection } from 'mongoose';
import { createParcelModel } from './parcel.model';
import { createUserModel } from './user.model';

export const databaseModelsProviders = [
  {
    provide: PARCEL_MODEL,
    useFactory: (connection: Connection) => createParcelModel(connection),
    inject: [DATABASE_CONNECTION],
  },
  {
    provide: USER_MODEL,
    useFactory: (connection: Connection) => createUserModel(connection),
    inject: [DATABASE_CONNECTION],
  },
];
