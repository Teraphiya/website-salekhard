import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { Product } from './product.model';
import { CreateProductBody } from './product.types';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(page: number, limit: number): Promise<[Product[], number]> {
    const [products, total] = await this.productRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });

    return [products, total];
  }

  async create(data: CreateProductBody): Promise<Product> {
    const product = this.productRepository.create(data);
    await this.productRepository.save(product);
    return product;
  }

  async findOne(id: number): Promise<Product | null> {
    return this.productRepository.findOne({ where: { id } });
  }

  async update(id: number, data: CreateProductBody): Promise<Product> {
    await this.productRepository.update(id, data);
    return this.productRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.productRepository.delete(id);
  }

  async searchAll(): Promise<Product[]> {
    return this.productRepository.find();
  }
}
