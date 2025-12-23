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
import { CreateProductDto } from '../../DTO/create-product.dto';
import { UpdateProductDto } from '../../DTO/update-product.dto';
import { Roles } from '../../config/common/decorators/roles.decorator';
import { RolesGuard } from '../../config/common/guard/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductController {
  constructor(private service: ProductService) {}

  /* (ADMIN ONLY) */
  @Roles('ADMIN')
  @Post()
  @UseInterceptors(FilesInterceptor('images', 5, multerConfig))
  async create(
    @Body() body: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.service.create({
      ...body,
      images: files?.map((file) => file.filename) || [],
    });
  }

  /* (ADMIN ONLY) */
  @Roles('ADMIN')
  @Put(':id')
  @UseInterceptors(FilesInterceptor('images', 5, multerConfig))
  async update(
    @Param('id') id: string,
    @Body() body: UpdateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.service.update(id, {
      ...body,
      newImages: files?.map((file) => file.filename) || [],
    });
  }

  /* (USER + ADMIN) */
  @Roles('USER', 'ADMIN')
  @Get()
  async getAll(@Query() query: any) {
    return this.service.getAll(query);
  }

  /* (ADMIN ONLY) */
  @Roles('ADMIN')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
