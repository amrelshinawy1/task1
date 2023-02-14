import { Controller, DefaultValuePipe, Get, Param, Query } from '@nestjs/common';
import { User } from 'database/user.model';
import { Observable } from 'rxjs';
import { ParseObjectIdPipe } from '../shared/pipe/parse-object-id.pipe';
import { UserService } from './user.service';

@Controller({ path: "/users" })
export class UserController {

  constructor(private userService: UserService) { }

  @Get(':id')
  getUser(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Observable<Partial<User>> {
    return this.userService.findById(id);
  }
}
