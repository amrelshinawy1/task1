import { Observable, lastValueFrom, of } from 'rxjs';
import { Test, TestingModule } from '@nestjs/testing';
import { anyNumber, anyString, instance, mock, verify, when } from 'ts-mockito';

import { CreateParcelDto } from './create-parcel.dto';
import { Parcel } from 'database/parcel.model';
import { ParcelController } from './parcel.controller';
import { ParcelService } from './parcel.service';
import { ParcelServiceStub } from './parcel.service.stub';
import { Response } from 'express';
import { UpdateParcelDto } from './update-parcel.dto';
import { createMock } from '@golevelup/ts-jest';

describe('Parcel Controller', () => {
  describe('Replace ParcelService in provider(useClass: ParcelServiceStub)', () => {
    let controller: ParcelController;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          {
            provide: ParcelService,
            useClass: ParcelServiceStub,
          },
        ],
        controllers: [ParcelController],
      }).compile();

      controller = await module.resolve<ParcelController>(ParcelController);
    });

    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('GET on /parcels should return all parcels', async () => {
      const parcels = await lastValueFrom(controller.getAllParcels());
      expect(parcels.length).toBe(3);
    });

    it('GET on /parcels/:id should return one parcel ', (done) => {
      controller.getParcelById('1').subscribe((data) => {
        expect(data._id).toEqual('1');
        done();
      });
    });

    it('POST on /parcels should save parcel', async () => {
      const parcel: CreateParcelDto = {
        deliveryAddress: 'test 1',
        pickUpAddress: 'test 2'
      };
      const saved = await lastValueFrom(
        controller.createParcel(
          parcel,
          createMock<Response>({
            status: jest.fn().mockReturnValue({
              send: jest.fn().mockReturnValue({
                status: 201,
              }),
            }),
          }),
        ),
      );
      // console.log(saved);
      expect(saved.status).toBe(201);
    });

    it('PUT on /parcels/:id should update the existing parcel', (done) => {
      const parcel: UpdateParcelDto = {
        deliveryAddress: 'test 1',
        pickUpAddress: 'test 2'
      };
      controller
        .updateParcel(
          '1',
          parcel,
          createMock<Response>({
            status: jest.fn().mockReturnValue({
              send: jest.fn().mockReturnValue({
                status: 204,
              }),
            }),
          }),
        )
        .subscribe((data) => {
          expect(data.status).toBe(204);
          done();
        });
    });

    it('DELETE on /parcels/:id should delete parcel', (done) => {
      controller
        .deleteParcelById(
          '1',
          createMock<Response>({
            status: jest.fn().mockReturnValue({
              send: jest.fn().mockReturnValue({
                status: 204,
              }),
            }),
          }),
        )
        .subscribe((data) => {
          expect(data).toBeTruthy();
          done();
        });
    });
  });

  describe('Replace ParcelService in provider(useValue: fake object)', () => {
    let controller: ParcelController;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          {
            provide: ParcelService,
            useValue: {
              findAll: (_keyword?: string, _skip?: number, _limit?: number) =>
                of<any[]>([
                  {
                    _id: 'testid',
                    deliveryAddress: 'test 1',
                    pickUpAddress: 'test 2'                                          },
                ]),
            },
          },
        ],
        controllers: [ParcelController],
      }).compile();

      controller = await module.resolve<ParcelController>(ParcelController);
    });

    it('should get all parcels(useValue: fake object)', async () => {
      const result = await lastValueFrom(controller.getAllParcels());
      expect(result[0]._id).toEqual('testid');
    });
  });

  describe('Replace ParcelService in provider(useValue: jest mocked object)', () => {
    let controller: ParcelController;
    let parcelService: ParcelService;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          {
            provide: ParcelService,
            useValue: {
              constructor: jest.fn(),
              findAll: jest
                .fn()
                .mockImplementation(
                  (_keyword?: string, _skip?: number, _limit?: number) =>
                    of<any[]>([
                      {
                        _id: 'testid',
                        deliveryAddress: 'test 1',
                        pickUpAddress: 'test 2'
                                                      },
                    ]),
                ),
            },
          },
        ],
        controllers: [ParcelController],
      }).compile();

      controller = await module.resolve<ParcelController>(ParcelController);
      parcelService = module.get<ParcelService>(ParcelService);
    });

    it('should get all parcels(useValue: jest mocking)', async () => {
      const result = await lastValueFrom(controller.getAllParcels('test', 10, 0));
      expect(result[0]._id).toEqual('testid');
      expect(parcelService.findAll).toBeCalled();
      expect(parcelService.findAll).lastCalledWith('test', 0, 10);
    });
  });

  describe('Mocking ParcelService using ts-mockito', () => {
    let controller: ParcelController;
    const mockedParcelService: ParcelService = mock(ParcelService);

    beforeEach(async () => {
      controller = new ParcelController(instance(mockedParcelService));
    });

    it('should get all parcels(ts-mockito)', async () => {
      when(
        mockedParcelService.findAll(anyString(), anyNumber(), anyNumber()),
      ).thenReturn(
        of([
          {
            _id: 'testid',
            status: 'PENDING',
            sender: '5ee49c3115a4e75254bb732e',
            pickUpAddress: 'test address',
            deliveryAddress: 'test address'                },
        ]) as Observable<Parcel[]>,
      );
      const result = await lastValueFrom(controller.getAllParcels('', 10, 0));
      expect(result.length).toEqual(1);
      expect(result[0].status).toBe('PENDING');
      verify(
        mockedParcelService.findAll(anyString(), anyNumber(), anyNumber()),
      ).once();
    });
  });
});
