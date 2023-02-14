import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  Scope,
  UseGuards
} from '@nestjs/common';
import { Parcel } from 'database/parcel.model';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ParseObjectIdPipe } from '../shared/pipe/parse-object-id.pipe';
import { ParcelService } from './parcel.service';
import { CreateParcelDto } from './create-parcel.dto';
import { UpdateParcelDto } from './update-parcel.dto';
import { HasRoles } from 'auth/guard/has-roles.decorator';
import { JwtAuthGuard } from 'auth/guard/jwt-auth.guard';
import { RolesGuard } from 'auth/guard/roles.guard';
import { RoleType } from 'shared/enum/role-type.enum';

@Controller({ path: 'parcels', scope: Scope.REQUEST })
export class ParcelController {
  constructor(private parcelService: ParcelService) { }

  @Get('')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(RoleType.SENDER, RoleType.BIKER)
  getAllParcels(
    @Query('status') status?: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip?: number,
  ): Observable<Parcel[]> {
    return this.parcelService.findAll(status, skip, limit);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(RoleType.SENDER, RoleType.BIKER)
  getParcelById(@Param('id', ParseObjectIdPipe) id: string): Observable<Parcel> {
    return this.parcelService.findById(id);
  }

  @Post('')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(RoleType.SENDER)
  createParcel(
    @Body() parcel: CreateParcelDto,
    @Res() res: Response,
  ): Observable<Response> {
    return this.parcelService.save(parcel).pipe(
      map((parcel: Parcel) => {
        return res
          .status(201)
          .send({ id: parcel._id });
      }),
    );
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(RoleType.BIKER)
  async updateParcel(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() parcel: UpdateParcelDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const response = await this.parcelService.update(id, parcel)
      return res.status(200).send(response);
    } catch (error) {
      return res.status(500).send({ case: 0, message: 'failed to update parcel.' });
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(RoleType.SENDER)
  deleteParcelById(
    @Param('id', ParseObjectIdPipe) id: string,
    @Res() res: Response,
  ): Observable<Response> {
    return this.parcelService.deleteById(id).pipe(
      map(() => {
        return res.status(200).send({ message: `parcel with id: ${id} Deleted.` });
      }),
    );
  }

}
