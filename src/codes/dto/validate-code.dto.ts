import { ApiProperty } from "@nestjs/swagger";
import {  IsEmail, IsInt, IsNotEmpty, IsOptional, IsNumber, Length, isDate } from "class-validator";

export class ValidateCodeDto {

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    @Length(6)
    code: number

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    idCompte: number

  
    

}
