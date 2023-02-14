import { DatabaseModule } from '../database/database.module';
import { Module } from '@nestjs/common';
import { ParcelController } from './parcel.controller';
import { ParcelService } from './parcel.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ParcelController],
  providers: [ParcelService],
})
export class ParcelModule{}
