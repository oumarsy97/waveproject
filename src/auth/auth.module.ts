import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ClientsModule } from '../clients/clients.module';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ClientsService } from 'src/clients/clients.service';
import { SmsModule } from 'src/sms/sms.module';

@Module({
  imports: [
    ClientsModule,
    PrismaModule,
    PassportModule,
     SmsModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy, ClientsService],
  controllers: [AuthController],
})
export class AuthModule {}
