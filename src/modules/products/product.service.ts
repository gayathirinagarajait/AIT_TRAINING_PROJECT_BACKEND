import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './product.schema';
import { MESSAGES } from '../../constants/messages.constant';
import { CreateProductDto } from '../../DTO/create-product.dto';
import { UpdateProductDto } from '../../DTO/update-product.dto';
import { MessageResponseDto } from '../../DTO/common-response.dto';
import { ProductResponseDto } from '../../DTO/product-response.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}



  async create(data: CreateProductDto & { images?: string[] }, ):Promise<MessageResponseDto> {
    const productData = {
      name: data.name,
      price: Number(data.price),
      stock: Number(data.stock),
      images: data.images ?? [],
    };

    await this.productModel.create(productData);

    return { message: MESSAGES.PRODUCT_CREATED };
    
  }



async update(
  id: string,
  updateData: UpdateProductDto & { newImages?: string[] },
): Promise<{ message: string; product: ProductResponseDto }> {
  const existingProduct = await this.productModel.findById(id);

  if (!existingProduct) {
    throw new NotFoundException('Product not found');
  }

  const newImages = updateData.newImages ?? [];

  let existingImages: string[] = [];
  if (updateData.existingImages) {
    existingImages = Array.isArray(updateData.existingImages)
      ? updateData.existingImages
      : [updateData.existingImages];
  }

  const finalImages = [...existingImages, ...newImages];

  const updatePayload: any = { images: finalImages };

  if (updateData.name !== undefined) updatePayload.name = updateData.name;
  if (updateData.price !== undefined)
    updatePayload.price = Number(updateData.price);
  if (updateData.stock !== undefined)
    updatePayload.stock = Number(updateData.stock);

  const updatedProduct = await this.productModel.findByIdAndUpdate(
    id,
    updatePayload,
    { new: true },
  );

  // ✅ REQUIRED for TypeScript + safety
  if (!updatedProduct) {
    throw new NotFoundException('Product not found');
  }

  // ✅ MAP TO DTO
  const productDto: ProductResponseDto = {
    id: updatedProduct._id.toString(),
    name: updatedProduct.name,
    price: updatedProduct.price,
    stock: updatedProduct.stock,
    images: updatedProduct.images,
  };

  return {
    message: MESSAGES.PRODUCT_UPDATED,
    product: productDto,
  };
}


  /* GET ALL */

  async getAll(query: any) {
    const filter: any = { isDeleted: { $ne: true } };

    if (query.name) {
      filter.name = { $regex: query.name, $options: 'i' };
    }

    if (query.stock) {
      filter.stock = { $gt: 0 };
    }

    if (query.startDate && query.endDate) {
      const start = new Date(query.startDate);
      const end = new Date(query.endDate);

      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        end.setHours(23, 59, 59, 999);
        filter.createdAt = { $gte: start, $lte: end };
      }
    }

    return this.productModel.find(filter);
  }

  /* SOFT DELETE */

  async remove(id: string) {
    const product = await this.productModel.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true },
    );

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return { message: MESSAGES.PRODUCT_DELETED };
  }
}
