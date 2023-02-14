import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { LoggerModule } from './logger/logger.module';
import { Module } from '@nestjs/common';
import { ParcelModule } from './parcel/parcel.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ ignoreEnvFile: true }),
    DatabaseModule,
    ParcelModule,
    AuthModule,
    UserModule,
    LoggerModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
  exports:[AppService]
})
export class AppModule { }
