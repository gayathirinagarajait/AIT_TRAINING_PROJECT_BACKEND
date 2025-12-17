import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './product.schema';
import { MESSAGES } from '../../constants/messages.constant';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}

  // CREATE
  async create(data: any) {
    await this.productModel.create(data);
    return { message: MESSAGES.PRODUCT_CREATED };
  }
//get with filter also
  async getAll(query: any) {
    const filter: any = {
      isDeleted: { $ne: true }, 
    };

    // filter by name
    if (query.name) {
      filter.name = { $regex: query.name, $options: 'i' };
    }

    // filter by stock availability
    if (query.stock) {
      filter.stock = { $gt: 0 };
    }

    // filter by created date
    if (query.startDate && query.endDate) {
      const start = new Date(query.startDate);
      const end = new Date(query.endDate);

      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        end.setHours(23, 59, 59, 999);
        filter.createdAt = {
          $gte: start,
          $lte: end,
        };
      }
    }

    return this.productModel.find(filter);
  }

  // UPDATE
  async update(id: string, data: any) {
    const product = await this.productModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return { message: MESSAGES.PRODUCT_UPDATED };
  }

  // SOFT DELETE PRODUCT
  async remove(id: string) {
    const product = await this.productModel.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      { new: true },
    );

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return { message: MESSAGES.PRODUCT_DELETED };
  }
}
