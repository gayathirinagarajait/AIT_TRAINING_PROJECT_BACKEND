import * as bcrypt from 'bcrypt';
import { User } from '../users/user.schema';
import { ROLES } from '../../constants/roles.constant';
import { Model } from 'mongoose';

export const seedAdminUser = async (userModel: Model<User>) => {
  const admin = await userModel.findOne({ email: 'admin@company.com' });
  if (admin) return;

  const password = await bcrypt.hash('Admin@123', 10);

  await userModel.create({
    name: 'Admin',
    email: 'admin@company.com',
    password,
    role: ROLES.ADMIN,
  });

  console.log('Admin user created');
};
