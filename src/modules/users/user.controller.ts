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
import { RolesGuard } from '../../config/common/guard/roles.guard';
import { Roles } from '../../config/common/decorators/roles.decorator';
import { UpdateUserDto } from '../../DTO/update-user-dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ADMIN ONLY
  @Get()
  @Roles('ADMIN')
  async getUsers() {
    return this.userService.findAll();
  }

  // ADMIN + USER
  @Get(':id')
  @Roles('ADMIN', 'USER')
  async getUserById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  // ADMIN ONLY
  @Put(':id')
  @Roles('ADMIN')
  async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ) {
    return this.userService.update(id, body);
  }

  // ADMIN ONLY
  @Delete(':id')
  @Roles('ADMIN')
  async deleteUser(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
