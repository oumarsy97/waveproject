import { IsNotEmpty, IsInt, IsDate } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
export class CreateTransfertDto {

    @IsInt()
    @IsNotEmpty()
    @ApiProperty()
    idEmetteur: number;

    @IsInt()
    @IsNotEmpty()
    @ApiProperty()
    idRecepteur: number;

    @IsInt()
    @IsNotEmpty()
    @ApiProperty()
    montant: number;

    @IsDate()
    @IsNotEmpty()
    @ApiProperty()
    dateExecution: Date;
}
