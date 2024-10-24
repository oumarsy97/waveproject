import { ApiProperty } from "@nestjs/swagger";
import {  IsEmail, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateClientDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    telephone: string;
  
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    prenom: string;
  
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    nom: string;
  
    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    code: number;
  
    @ApiProperty({ required: false })
    @IsEmail()
    @IsOptional()
    email?: string;
  }
