import { IsInt, IsString, IsEnum, IsOptional } from 'class-validator';

export class CreateTransactionDto {
  @IsInt()
  montant: number;

  @IsInt()
  idOperateur: number;

  @IsInt()
  idClient: number;

 
  
  
  @IsString()
  type : 'DEPOT' | 'RETRAIT';

 
}
