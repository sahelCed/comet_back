import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiTags, ApiOperation, ApiResponse, ApiBearerAuth
} from '@nestjs/swagger';

@Controller()
@ApiTags('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }
}
