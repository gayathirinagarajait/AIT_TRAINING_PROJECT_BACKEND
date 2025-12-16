import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../config/common/guard/jwt_auth.guard';
// to protect all api 
@UseGuards(JwtAuthGuard) 
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers() {
    return await this.userService.findAll();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.userService.findById(id);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() body: any) {
    return await this.userService.update(id, body);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return await this.userService.remove(id);
  }
}
