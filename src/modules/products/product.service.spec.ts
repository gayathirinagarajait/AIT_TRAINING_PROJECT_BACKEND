import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.schema';
import { MESSAGES } from '../../constants/messages.constant';

describe('ProductService', () => {
  let service: ProductService;

  const mockProductModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    jest.clearAllMocks();
  });

  /* ===================== BASIC ===================== */

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /* ===================== CREATE ===================== */

  it('should create a product and return success message', async () => {
    mockProductModel.create.mockResolvedValue({});

    const dto = {
      name: 'Laptop',
      price: '1200',
      stock: '5',
      images: ['img1.jpg'],
    };

    const result = await service.create(dto);

    expect(mockProductModel.create).toHaveBeenCalledWith({
      name: 'Laptop',
      price: 1200,
      stock: 5,
      images: ['img1.jpg'],
    });

    expect(result).toEqual({
      message: MESSAGES.PRODUCT_CREATED,
    });
  });

  /* ===================== GET ALL ===================== */

  it('should return products with default filter', async () => {
    const products = [{ name: 'Phone' }];

    mockProductModel.find.mockResolvedValue(products);

    const result = await service.getAll({});

    expect(mockProductModel.find).toHaveBeenCalledWith({
      isDeleted: { $ne: true },
    });

    expect(result).toEqual(products);
  });

  it('should apply name filter', async () => {
    mockProductModel.find.mockResolvedValue([]);

    await service.getAll({ name: 'lap' });

    expect(mockProductModel.find).toHaveBeenCalledWith({
      isDeleted: { $ne: true },
      name: { $regex: 'lap', $options: 'i' },
    });
  });

  /* ===================== UPDATE ===================== */

  it('should update product with merged images', async () => {
    const existingProduct = {
      _id: '1',
      images: ['old1.jpg'],
    };

    const updatedProduct = {
      _id: '1',
      name: 'Updated',
      images: ['keep.jpg', 'new.jpg'],
    };

    mockProductModel.findById.mockResolvedValue(existingProduct);
    mockProductModel.findByIdAndUpdate.mockResolvedValue(updatedProduct);

    const result = await service.update('1', {
      name: 'Updated',
      price: '100',
      stock: '2',
      newImages: ['new.jpg'],
    });

    expect(mockProductModel.findById).toHaveBeenCalledWith('1');

    expect(mockProductModel.findByIdAndUpdate).toHaveBeenCalledWith(
      '1',
      {
        name: 'Updated',
        price: 100,
        stock: 2,
        images: ['keep.jpg', 'new.jpg'],
      },
      { new: true },
    );

    expect(result).toEqual({
      message: MESSAGES.PRODUCT_UPDATED,
      product: updatedProduct,
    });
  });

  it('should throw NotFoundException if product does not exist (update)', async () => {
    mockProductModel.findById.mockResolvedValue(null);

    await expect(service.update('999', {})).rejects.toThrow(
      NotFoundException,
    );
  });

  /* ===================== REMOVE ===================== */

  it('should soft delete a product', async () => {
    mockProductModel.findByIdAndUpdate.mockResolvedValue({ _id: '1' });

    const result = await service.remove('1');

    expect(mockProductModel.findByIdAndUpdate).toHaveBeenCalledWith(
      '1',
      { isDeleted: true, deletedAt: expect.any(Date) },
      { new: true },
    );

    expect(result).toEqual({
      message: MESSAGES.PRODUCT_DELETED,
    });
  });

  it('should throw NotFoundException if product not found (remove)', async () => {
    mockProductModel.findByIdAndUpdate.mockResolvedValue(null);

    await expect(service.remove('999')).rejects.toThrow(
      NotFoundException,
    );
  });
});
