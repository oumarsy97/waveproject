import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateClientDto } from './create-client.dto';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateClientDto  {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    telephone?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    prenom?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    nom?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    code?: String;

    @ApiProperty({ required: false })
    @IsEmail()
    @IsOptional()
    email?: string;


}