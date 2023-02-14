import {
  Inject,
  Injectable,
  OnModuleInit
} from '@nestjs/common';
import { Model } from 'mongoose';
import { USER_MODEL } from '../database/database.constants';
import { User } from '../database/user.model';
import { RoleType } from '../shared/enum/role-type.enum';

@Injectable()
export class UserDataInitializerService
  implements OnModuleInit {
  constructor(@Inject(USER_MODEL) private userModel: Model<User>) { }

  async onModuleInit(): Promise<void> {
    console.log('(UserModule) is initialized...');
    await this.userModel.deleteMany({});
    const senders = [{
      username: 'amr',
      password: 'password',
      email: 'amr@example.com',
      roles: [RoleType.SENDER],
    }];

    const bikers = [{
      username: 'admin',
      password: 'password',
      email: 'admin@example.com',
      roles: [RoleType.BIKER],
    }];
    await this.userModel.create(...senders, ...bikers).then(
      data => console.log(data)
    );
  }

}
