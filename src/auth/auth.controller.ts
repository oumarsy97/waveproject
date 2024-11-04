import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() LoginAuthDto :LoginAuthDto) {
    console.log(LoginAuthDto);
    const client = await this.authService.validateClient(
      LoginAuthDto.telephone,
      +LoginAuthDto.code, 
    );
    
    return this.authService.login(client);
  }

  @Post('logout')
  async logout(@Body() client: { id: number }) {
    return this.authService.logout(client);
  }
}
