import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AuthenticatedRequest } from 'auth/interface/authenticated-request.interface';
import { Parcel, Status } from 'database/parcel.model';
import { FilterQuery, Model } from 'mongoose';
import { EMPTY, from, Observable, of } from 'rxjs';
import { mergeMap, throwIfEmpty } from 'rxjs/operators';
import { RoleType } from 'shared/enum/role-type.enum';
import { PARCEL_MODEL } from '../database/database.constants';
import { CreateParcelDto } from './create-parcel.dto';
import { UpdateParcelDto } from './update-parcel.dto';

@Injectable({ scope: Scope.REQUEST })
export class ParcelService {
  constructor(
    @Inject(PARCEL_MODEL) private parcelModel: Model<Parcel>,
    @Inject(REQUEST) private req: AuthenticatedRequest,
  ) { }

  findAll(status?: string, skip = 0, limit = 10): Observable<Parcel[]> {
    const query: any = {}
    if (status) {
      query.status = status
    }
    if (this.req.user.roles.includes(RoleType.SENDER)) {
      query.sender = this.req.user.id
    }
    if (this.req.user.roles.includes(RoleType.BIKER)) {
      query['$or'] = [{
        biker: this.req.user.id
      },
      {
        biker: null
      }]
    }

    return from(this.parcelModel.find(query).skip(skip).limit(limit).exec());

  }

  findById(id: string): Observable<Parcel> {
    const query: any = { _id: id };
    if (this.req.user.roles.includes(RoleType.SENDER)) {
      query.sender = this.req.user.id
    }
    if (this.req.user.roles.includes(RoleType.BIKER)) {
      query.biker = this.req.user.id
    }
    return from(this.parcelModel.findOne(query).exec()).pipe(
      mergeMap((p) => (p ? of(p) : EMPTY)),
      throwIfEmpty(() => new NotFoundException(`parcel:$id was not found`)),
    );
  }

  save(data: CreateParcelDto): Observable<Parcel> {
    const createParcel: Promise<Parcel> = this.parcelModel.create({
      sender: this.req.user.id,
      status: Status.PENDING,
      ...data,
    });
    return from(createParcel);
  }

  async update(id: string, data: Partial<Parcel>): Promise<{case:number, message: string}> {
    // this function should use transaction to avoid race condition to be picked by two people at same time

    const parcel = await this.parcelModel.findOne({_id: id}) as Parcel;
    console.log(parcel)
    if(!parcel){
      return {case:0, message: 'parcel not found.'}
    }
    if(parcel.pickUpAt){
      return {case:2, message: 'parcel already picked.'}
    }
    if (this.req.user.roles.includes(RoleType.BIKER) && data.status == Status.PICKEDUP) {
      data.biker = this.req.user.id;
      data.pickUpAt = new Date().toString();
    }
    if (this.req.user.roles.includes(RoleType.BIKER) && data.status == Status.DELIVERED) {
      data.biker = this.req.user.id;
      data.deliveredAt = new Date().toString();
    }
    await this.parcelModel
        .findOneAndUpdate(
          { _id: id },
          data,
          { new: true },
        )
        .exec();
      return {case:2, message: 'parcel picked successfully.'}
  }

  deleteById(id: string): Observable<Parcel> {
    return from(this.parcelModel.findOneAndDelete({ _id: id, status: Status.PENDING }).exec()).pipe(
      mergeMap((p) => (p ? of(p) : EMPTY)),
      throwIfEmpty(() => new NotFoundException(`parcel:$id was not found`)),
    );
  }

  deleteAll(): Observable<any> {
    return from(this.parcelModel.deleteMany({}).exec());
  }
}
