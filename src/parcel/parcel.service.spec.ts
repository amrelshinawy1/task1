import { Test, TestingModule } from '@nestjs/testing';

import { Model } from 'mongoose';
import { PARCEL_MODEL } from '../database/database.constants';
import { Parcel } from 'database/parcel.model';
import { ParcelService } from './parcel.service';
import { lastValueFrom } from 'rxjs';

describe('ParcelService', () => {
  let service: ParcelService;
  let model: Model<Parcel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParcelService,
        {
          provide: PARCEL_MODEL,
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
            deleteMany: jest.fn(),
            deleteOne: jest.fn(),
            updateOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findOneAndDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = await module.resolve<ParcelService>(ParcelService);
    model = module.get<Model<Parcel>>(PARCEL_MODEL);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  describe('findByid', () => {
    it('if exists return one parcel', (done) => {
      const found = {
        _id: '5ee49c3115a4e75254bb732e',
        status: 'PENDING',
        sender: '5ee49c3115a4e75254bb732e',
        pickUpAddress: 'test address',
        deliveryAddress: 'test address'
        };

      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(found) as any,
      } as any);

      service.findById('1').subscribe({
        next: (data) => {
          expect(data._id).toBe('5ee49c3115a4e75254bb732e');
          expect(data.status).toEqual('PENDING');
        },
        error: (error) => console.log(error),
        complete: done(),
      });
    });

    it('if not found throw an NotFoundException', (done) => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null) as any,
      } as any);

      service.findById('1').subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (error) => {
          expect(error).toBeDefined();
        },
        complete: done(),
      });
    });
  });

  it('should save parcel', async () => {
    const toCreated = {
      status: 'PENDING',
      sender: '5ee49c3115a4e75254bb732e',
      pickUpAddress: 'test address',
      deliveryAddress: 'test address'
  };

    const toReturned = {
      _id: '5ee49c3115a4e75254bb732e',
      ...toCreated,
    } as Parcel;

    jest
      .spyOn(model, 'create')
      .mockImplementation(() => Promise.resolve(toReturned));

    const data = await lastValueFrom(service.save(toCreated));
    expect(data._id).toBe('5ee49c3115a4e75254bb732e');
    expect(model.create).toBeCalledWith({
      ...toCreated,
    });
    expect(model.create).toBeCalledTimes(1);
  });

  describe('update', () => {
    it('perform update if parcel exists', (done) => {
      const toUpdated = {
        _id: '5ee49c3115a4e75254bb732e',
        deliveryAddress: 'test 1',
        pickUpAddress: 'test 2'
      };

      jest.spyOn(model, 'findOneAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(toUpdated) as any,
      } as any);

      service.update('5ee49c3115a4e75254bb732e', toUpdated).subscribe({
        next: (data) => {
          expect(data).toBeTruthy();
          expect(model.findOneAndUpdate).toBeCalled();
        },
        error: (error) => console.log(error),
        complete: done(),
      });
    });

    it('throw an NotFoundException if parcel not exists', (done) => {
      const toUpdated = {
        _id: '5ee49c3115a4e75254bb732e',
        deliveryAddress: 'test 1',
        pickUpAddress: 'test 2'
      };
      jest.spyOn(model, 'findOneAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null) as any,
      } as any);

      service.update('5ee49c3115a4e75254bb732e', toUpdated).subscribe({
        error: (error) => {
          expect(error).toBeDefined();
          expect(model.findOneAndUpdate).toHaveBeenCalledTimes(1);
        },
        complete: done(),
      });
    });
  });

  describe('delete', () => {
    it('perform delete if parcel exists', (done) => {
      const toDeleted = {
        _id: '5ee49c3115a4e75254bb732e',
        deliveryAddress: 'test 1',
        pickUpAddress: 'test 2'
      };
      jest.spyOn(model, 'findOneAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(toDeleted),
      } as any);

      service.deleteById('anystring').subscribe({
        next: (data) => {
          expect(data).toBeTruthy();
          expect(model.findOneAndDelete).toBeCalled();
        },
        error: (error) => console.log(error),
        complete: done(),
      });
    });

    it('throw an NotFoundException if parcel not exists', (done) => {
      jest.spyOn(model, 'findOneAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);
      service.deleteById('anystring').subscribe({
        error: (error) => {
          expect(error).toBeDefined();
          expect(model.findOneAndDelete).toBeCalledTimes(1);
        },
        complete: done(),
      });
    });
  });

  it('should delete all parcel', (done) => {
    jest.spyOn(model, 'deleteMany').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce({
        deletedCount: 1,
      }),
    } as any);

    service.deleteAll().subscribe({
      next: (data) => expect(data).toBeTruthy,
      error: (error) => console.log(error),
      complete: done(),
    });
  });

});
