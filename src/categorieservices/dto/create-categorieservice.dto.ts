import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategorieserviceDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    nom: string;
}
