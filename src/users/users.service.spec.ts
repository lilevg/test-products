import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepository = {
    save: jest.fn(() => ({ name: 'Chadwick', password: 'Boseman' })),
    find: jest.fn(),
    findOne: jest.fn(() => ({
      id: '1',
      name: 'Chadwick',
      password: 'Boseman',
    })),
    delete: jest.fn(),
    create: jest.fn(() => ({ id: '1', name: 'Chadwick', password: 'Boseman' })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('findAll => should return an array of users', async () => {
    const user: User = {
      id: '',
      name: 'Chadwick',
      password: 'Boseman',
    };

    const users: User[] = [user];
    jest.spyOn(service, 'findAll').mockImplementation(async () => users);

    const result = await service.findAll();

    expect(result).toEqual(users);
  });

  it('getUsersByName => Should return a user by his name', async () => {
    const user: User = {
      id: '1',
      name: 'John Doe',
      password: 'P@ssword',
    };
    jest.spyOn(mockUserRepository, 'findOne').mockReturnValue(user);

    const result = await service.getUsersByName(user.name);

    expect(result).toEqual(user);
    expect(mockUserRepository.findOne).toBeCalled();
    expect(mockUserRepository.findOne).toBeCalledWith({
      where: { name: user.name },
    });
  });

  it('getUsersByName => Should return undefined if no user is found', async () => {
    jest.spyOn(mockUserRepository, 'findOne').mockReturnValue(undefined);
    const result = await service.getUsersByName('user.name');

    expect(result).toEqual(undefined);
    expect(mockUserRepository.findOne).toBeCalled();
    expect(mockUserRepository.findOne).toBeCalledWith({
      where: { name: 'user.name' },
    });
  });

  it('register => Should create a new user and return its data', async () => {
    const createUserDto = {
      name: 'Chadwick',
      password: 'Boseman',
    } as CreateUserDto;

    const user = {
      id: '1',
      ...createUserDto,
    } as User;

    jest.spyOn(mockUserRepository, 'save').mockReturnValue(user);

    const result = await service.register(createUserDto);

    expect(mockUserRepository.save).toBeCalled();
    expect(mockUserRepository.save).toBeCalledWith(user);

    expect(result).toEqual(user);
  });

});
