import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { Categories } from './enums/product-category.emun';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  const product: Product = {
    id: '1',
    name: 'Chips',
    description:
      'This is a snack food in the form of a crisp, flat or slightly bowl shaped, bite-sized unit',
    price: 5.8,
    category: Categories.dairy,
  };

  const mockProductRepository = {
    save: jest.fn((product: Product) => {
      product;
    }),
    find: jest.fn(),
    findOneBy: jest.fn((name) => ({
      id: '1',
      name: name,
      description:
        'This is a snack food in the form of a crisp, flat or slightly bowl shaped, bite-sized unit',
      price: 5.8,
      category: Categories.dairy,
    })),
    delete: jest.fn(),
    create: jest.fn((createProductDto: CreateProductDto) => ({
      id: '1',
      ...createProductDto,
    })),
    update: jest.fn((updateProductDto: UpdateProductDto) => ({
      ...updateProductDto,
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('findAll => should return an array of products', async () => {
    const products: Product[] = [product];
    jest.spyOn(service, 'findAll').mockImplementation(async () => products);
    const result = await service.findAll();
    expect(result).toEqual(products);
  });

  it('getProductByName => Should return a product by his name', async () => {
    const name = 'Chips';

    jest.spyOn(mockProductRepository, 'findOneBy').mockReturnValue(product);

    const result = await service.getProductByName(name);

    expect(result).toEqual(product);
    expect(mockProductRepository.findOneBy).toBeCalled();
    expect(mockProductRepository.findOneBy).toBeCalledWith({ name });
  });

  it('getProductByName => Should return undefined if no product is found', async () => {
    jest.spyOn(mockProductRepository, 'findOneBy').mockReturnValue(undefined);

    const result = await service.getProductByName('name');

    expect(result).toEqual(undefined);
    expect(mockProductRepository.findOneBy).toBeCalled();
    expect(mockProductRepository.findOneBy).toBeCalledWith({ name: 'name' });
  });

  it('create => Should create a new product and return its data', async () => {
    const createProductDto: CreateProductDto = {
      name: 'Salt',
      description:
        'This is a snack food in the form of a crisp, flat or slightly bowl shaped, bite-sized unit',
      price: 5.8,
      category: Categories.dairy,
    };

    jest.spyOn(mockProductRepository, 'create').mockReturnValue(product);

    const result = await service.create(createProductDto);
    expect(mockProductRepository.save).toBeCalled();
    expect(mockProductRepository.save).toBeCalledWith(product);

    expect(result).toEqual(product);
  });

  it('findOne => Should return a product by his id', async () => {
    const id = '1';

    jest.spyOn(mockProductRepository, 'findOneBy').mockReturnValue(product);

    const result = await service.findOne(id);

    expect(result).toEqual(product);
    expect(mockProductRepository.findOneBy).toBeCalled();
    expect(mockProductRepository.findOneBy).toBeCalledWith({ id });
  });

  it('update => Should update a product and return its new data', async () => {
    const id: string = '1';
    const updateProductDto: UpdateProductDto = {
      name: 'Salt',
      description:
        'This is a snack food in the form of a crisp, flat or slightly bowl shaped, bite-sized unit',
      price: 5.8,
      category: Categories.dairy,
    };

    jest
      .spyOn(mockProductRepository, 'update')
      .mockReturnValue(updateProductDto);

    const result = await service.update(id, updateProductDto);
    expect(mockProductRepository.update).toBeCalled();
    expect(mockProductRepository.update).toBeCalledWith(id, updateProductDto);

    expect(result).toEqual(updateProductDto);
  });

  it('remove => should find a user by a given id and remove', async () => {
    const id = '1';

    jest.spyOn(mockProductRepository, 'delete').mockReturnValue(undefined);

    const result = await service.remove(id);
    expect(result).toEqual(undefined);
    expect(mockProductRepository.delete).toBeCalled();
    expect(mockProductRepository.delete).toBeCalledWith(id);
  });
});
