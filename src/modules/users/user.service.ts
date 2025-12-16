import { Injectable, NotFoundException } from '@nestjs/common';
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

  // 🔹 Find by email (ignore deleted users)
  async findByEmail(email: string) {
    return this.userModel.findOne({
      email,
      isDeleted: { $ne: true },
    });
  }

  // 🔹 Get all active users only
  async findAll() {
    return this.userModel
      .find({ isDeleted: { $ne: true } })
      .select('-password');
  }

  // 🔹 Get user by ID
  async findById(id: string) {
    const user = await this.userModel
      .findOne({ _id: id, isDeleted: { $ne: true } })
      .select('-password');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // 🔹 Create user (UNCHANGED)
  async create(data: any) {
    return this.userModel.create(data);
  }

  // 🔹 Update user (UNCHANGED)
  async update(id: string, data: any) {
    const user = await this.userModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { message: MESSAGES.USER_UPDATED };
  }

  // 🔹 SOFT DELETE USER (UNCHANGED)
  async remove(id: string) {
    const user = await this.userModel.findByIdAndUpdate(
      id,
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
  }
}
