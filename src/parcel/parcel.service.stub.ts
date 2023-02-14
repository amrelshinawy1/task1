import { Observable, of } from 'rxjs';

import { CreateParcelDto } from './create-parcel.dto';
import { Parcel } from 'database/parcel.model';
import { ParcelService } from './parcel.service';
import { UpdateParcelDto } from './update-parcel.dto';

export class ParcelServiceStub implements Pick<ParcelService, keyof ParcelService> {
  private parcels: Parcel[] = [
    {
      _id: '5ee49c3115a4e75254bb732e',
      status: 'PENDING',
      sender: '5ee49c3115a4e75254bb732e',
      pickUpAddress: 'test address',
      deliveryAddress: 'test address'
    } as Parcel,
    {
      _id: '5ee49c3115a4e75254bb732f',
      status: 'PENDING',
      sender: '5ee49c3115a4e75254bb732e',
      pickUpAddress: 'test address',
      deliveryAddress: 'test address'
    } as Parcel,
    {
      _id: '5ee49c3115a4e75254bb7330',
      status: 'PENDING',
      sender: '5ee49c3115a4e75254bb732e',
      pickUpAddress: 'test address',
      deliveryAddress: 'test address'
    } as Parcel,
  ];

  findAll(): Observable<Parcel[]> {
    return of(this.parcels);
  }

  findById(id: string): Observable<Parcel> {
    const { status } = this.parcels[0];
    return of({ _id: id, status } as Parcel);
  }

  save(data: CreateParcelDto): Observable<Parcel> {
    return of({ _id: this.parcels[0]._id, ...data } as Parcel);
  }

  update(id: string, data: UpdateParcelDto): Observable<Parcel> {
    return of({ _id: id, ...data } as Parcel);
  }

  deleteById(id: string): Observable<Parcel> {
    return of({ _id: id, status: 'PENDING'} as Parcel);
  }

  deleteAll(): Observable<any> {
    throw new Error('Method not implemented.');
  }
}
