import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { MESSAGES } from '../../constants/messages.constant';
import { CreateUserDto } from '../../DTO/create-user.dto';
import { UpdateUserDto } from '../../DTO/update-user-dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  // ADD THIS METHOD: AuthService needs this to find users by email
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email, isDeleted: { $ne: true } });
  }

  async findAll(): Promise<User[]> {
    return this.userModel
      .find({ isDeleted: { $ne: true } })
      .select('-password');
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel
      .findOne({ _id: id, isDeleted: { $ne: true } })
      .select('-password');

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(data: CreateUserDto): Promise<User> {
    const user = new this.userModel({
      ...data,
      isDeleted: false,
    });
    return user.save();
  }

  async update(id: string, data: UpdateUserDto) {
    const user = await this.userModel.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
      { $set: data },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { message: MESSAGES.USER_UPDATED };
  }

  async remove(id: string) {
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
  }
}