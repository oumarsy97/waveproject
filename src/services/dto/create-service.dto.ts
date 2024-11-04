import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateServiceDto {

    @ApiProperty()
    @IsString()
    logo?: string;

    @ApiProperty()
    @IsString()
    description?: string;

    @ApiProperty()
    @IsString()
    nom: string;

    @ApiProperty()
    @IsString()
    code: string;

    @ApiProperty()
    @IsString()
    telephone: string;
    

}
