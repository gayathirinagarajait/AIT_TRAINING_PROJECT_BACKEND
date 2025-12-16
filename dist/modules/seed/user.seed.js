"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdminUser = void 0;
const bcrypt = require("bcrypt");
const roles_constant_1 = require("../../constants/roles.constant");
const seedAdminUser = async (userModel) => {
    const admin = await userModel.findOne({ email: 'admin@company.com' });
    if (admin)
        return;
    const password = await bcrypt.hash('Admin@123', 10);
    await userModel.create({
        name: 'Admin',
        email: 'admin@company.com',
        password,
        role: roles_constant_1.ROLES.ADMIN,
    });
    console.log('Admin user created');
};
exports.seedAdminUser = seedAdminUser;
//# sourceMappingURL=user.seed.js.map