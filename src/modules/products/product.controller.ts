import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Query,
  Param,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { multerConfig } from '../../config/common/multer/multer.config';
import { JwtAuthGuard } from '../../config/common/guard/jwt_auth.guard';

@UseGuards(JwtAuthGuard) 
@Controller('products')
export class ProductController {
  constructor(private service: ProductService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', 5, multerConfig))
  async create(
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const images = files?.map((file) => file.filename);
    return await this.service.create({ ...body, images });
  }

  @Get()
  async getAll(@Query() query: any) {
    return await this.service.getAll(query);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return await this.service.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(id);
  }
}
