import { IsInt, IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
export class CreateTransactionDto {
  @IsInt()
  @ApiProperty()
  montant: number;

  @IsInt()
  @ApiProperty()
  idOperateur: number;

  @IsInt()
  @ApiProperty()
  idClient: number;

 
  
  
  @IsString()
  type : 'DEPOT' | 'RETRAIT';

 
}
