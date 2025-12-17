import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { MESSAGES } from '../../constants/messages.constant';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  // 🔹 Find by email (ignore soft-deleted users)
  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.userModel.findOne({
        email,
        isDeleted: { $ne: true },
      });
    } catch (error) {
      throw error;
    }
  }

  // 🔹 Get all active users
  async findAll(): Promise<User[]> {
    try {
      return await this.userModel
        .find({ isDeleted: { $ne: true } })
        .select('-password');
    } catch (error) {
      throw error;
    }
  }

  // 🔹 Get user by ID
  async findById(id: string): Promise<User> {
    try {
      const user = await this.userModel
        .findOne({ _id: id, isDeleted: { $ne: true } })
        .select('-password');

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  // CREATE USER
  async create(data: any): Promise<User> {
    try {
      const user = new this.userModel({
        ...data,
        isDeleted: false,
      });

      return await user.save();
    } catch (error) {
      throw error;
    }
  }

  // 🔹 UPDATE USER
  async update(id: string, data: any) {
    try {
      const user = await this.userModel.findOneAndUpdate(
        { _id: id, isDeleted: { $ne: true } },
        data,
        { new: true },
      );

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return { message: MESSAGES.USER_UPDATED };
    } catch (error) {
      throw error;
    }
  }

  // SOFT DELETE USER
  async remove(id: string) {
    try {
      const user = await this.userModel.findOneAndUpdate(
        { _id: id, isDeleted: { $ne: true } },
        {
          isDeleted: true,
          deletedAt: new Date(),
        },
        { new: true },
      );

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return { message: MESSAGES.USER_DELETED };
    } catch (error) {
      throw error;
    }
  }
}
