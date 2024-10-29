import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto) {
    console.log(loginDto);
    const client = await this.authService.validateClient(
      loginDto.telephone,
      +loginDto.code, 
    );
    
    return this.authService.login(client);
  }
}
