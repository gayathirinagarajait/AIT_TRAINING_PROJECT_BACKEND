"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("./product.schema");
const messages_constant_1 = require("../../constants/messages.constant");
let ProductService = class ProductService {
    constructor(productModel) {
        this.productModel = productModel;
    }
    // CREATE
    async create(data) {
        await this.productModel.create(data);
        return { message: messages_constant_1.MESSAGES.PRODUCT_CREATED };
    }
    // READ with filters (SOFT DELETE SAFE)
    async getAll(query) {
        const filter = {
            isDeleted: { $ne: true }, // 🔑 IMPORTANT
        };
        // Filter by name
        if (query.name) {
            filter.name = { $regex: query.name, $options: 'i' };
        }
        // Filter by stock availability
        if (query.stock) {
            filter.stock = { $gt: 0 };
        }
        // Filter by created date
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
    async update(id, data) {
        const product = await this.productModel.findByIdAndUpdate(id, data, {
            new: true,
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return { message: messages_constant_1.MESSAGES.PRODUCT_UPDATED };
    }
    // ✅ SOFT DELETE PRODUCT
    async remove(id) {
        const product = await this.productModel.findByIdAndUpdate(id, {
            isDeleted: true,
            deletedAt: new Date(),
        }, { new: true });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return { message: messages_constant_1.MESSAGES.PRODUCT_DELETED };
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProductService);
//# sourceMappingURL=product.service.js.map