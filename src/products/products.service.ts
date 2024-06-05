import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const candidateProduct = await this.getProductByName(createProductDto.name);
    if (candidateProduct) {
      throw new HttpException(
        'This product already exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const product = await this.productRepository.create(createProductDto);
    await this.productRepository.save(product);
    return product;
  }

  async getProductByName(name: string): Promise<Product> {
    const product = await this.productRepository.findOneBy({ name });
    return product;
  }
  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }

    return await this.productRepository.update(id, updateProductDto);
  }
  async remove(id: string) {
    await this.productRepository.delete(id);
  }
}
