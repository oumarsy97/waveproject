import { ApiProperty } from "@nestjs/swagger";

export class CreateNotificationDto {
    @ApiProperty({example: 1})
    clientId: number;
    @ApiProperty({example: 'Rechargement effectue avec succes'})
    message: string;
    
    @ApiProperty({example: 'Rechargement effectue avec succes'})
    titre: string;

    @ApiProperty({enum: ['COMPTE', 'TRANSACTION', 'SECURITE', 'PROMOTION'] })
    type: string;
}
