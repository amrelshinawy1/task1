import { IsNotEmpty, IsPhoneNumber, IsString, Min } from 'class-validator';
export class CreateParcelDto {  
  @IsString()
  @IsNotEmpty()
  readonly pickUpAddress: string;
  
  @IsString()
  @IsNotEmpty()
  readonly deliveryAddress: string;
}
