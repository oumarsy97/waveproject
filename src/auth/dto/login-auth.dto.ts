import { ApiProperty } from "@nestjs/swagger";
import {  IsEmail, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class LoginAuthDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    telephone: string;

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    code: Number;
  
  }
