import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ClientsModule } from '../clients/clients.module';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ClientsService } from 'src/clients/clients.service';

@Module({
  imports: [
    ClientsModule,
    PrismaModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, JwtStrategy, ClientsService],
  controllers: [AuthController],
})
export class AuthModule {}
