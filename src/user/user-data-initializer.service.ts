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
    },{
      username: 'amr1',
      password: 'password',
      email: 'amr1@example.com',
      roles: [RoleType.SENDER],
    },{
      username: 'amr2',
      password: 'password',
      email: 'amr2@example.com',
      roles: [RoleType.SENDER],
    },{
      username: 'amr3',
      password: 'password',
      email: 'amr3@example.com',
      roles: [RoleType.SENDER],
    },{
      username: 'amr4',
      password: 'password',
      email: 'amr4@example.com',
      roles: [RoleType.SENDER],
    }];

    const bikers = [{
      username: 'admin1',
      password: 'password',
      email: 'admin1@example.com',
      roles: [RoleType.BIKER],
    },{
      username: 'admin2',
      password: 'password',
      email: 'admin2@example.com',
      roles: [RoleType.BIKER],
    },{
      username: 'admin3',
      password: 'password',
      email: 'admin3@example.com',
      roles: [RoleType.BIKER],
    },{
      username: 'admin4',
      password: 'password',
      email: 'admin4@example.com',
      roles: [RoleType.BIKER],
    },{
      username: 'admin5',
      password: 'password',
      email: 'admin5@example.com',
      roles: [RoleType.BIKER],
    },{
      username: 'admin6',
      password: 'password',
      email: 'admin6@example.com',
      roles: [RoleType.BIKER],
    },{
      username: 'admin7',
      password: 'password',
      email: 'admin7@example.com',
      roles: [RoleType.BIKER],
    },{
      username: 'admin8',
      password: 'password',
      email: 'admin8@example.com',
      roles: [RoleType.BIKER],
    },{
      username: 'admin9',
      password: 'password',
      email: 'admin9@example.com',
      roles: [RoleType.BIKER],
    },{
      username: 'admin10',
      password: 'password',
      email: 'admin10@example.com',
      roles: [RoleType.BIKER],
    }];
    await this.userModel.create(...senders, ...bikers).then(
      data => console.log(data)
    );
  }

}
