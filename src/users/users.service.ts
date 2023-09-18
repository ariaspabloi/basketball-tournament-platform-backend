import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UserService');
  private readonly CLUBROLEID = 3;
  private readonly ORGANIZERROLERID = 2;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  private async create(userDetails, role) {
    try {
      const user = await this.userRepository.create({ ...userDetails, role });
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private async findAllByRole(roleId: number) {
    return await this.userRepository.find({ where: { role: { id: roleId } } });
  }

  private async findOne(id: number, roleId: number) {
    const user: User = await this.userRepository.findOneBy({ id });
    if (!user || user.role.id !== roleId)
      throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  private async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({ id, ...updateUserDto });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    try {
      await this.userRepository.save(user);
    } catch (error) {
      this.handleDBExceptions(error);
    }
    return user;
  }

  async createClub(createUserDto: CreateUserDto) {
    try {
      const role = await this.roleRepository.findOneBy({ id: this.CLUBROLEID });
      //TODO: create a meaningful error msg
      if (!role) {
        throw new Error('Role not found');
      }
      return await this.create(createUserDto, role);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAllClubs() {
    try {
      const clubs = await this.findAllByRole(this.CLUBROLEID);
      return clubs;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findClub(id: number) {
    try {
      const club = await this.findOne(id, this.CLUBROLEID);
      return club;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async updateClub(id: number, updateUserDto: UpdateUserDto) {
    try {
      await this.findClub(id);
      return await this.update(id, updateUserDto);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }
  async removeClub(id: number) {
    const user = await this.findClub(id);
    await this.userRepository.remove(user);
  }

  async createOrganizer(createUserDto: CreateUserDto) {
    try {
      const role = await this.roleRepository.findOneBy({
        id: this.ORGANIZERROLERID,
      });
      //TODO: create a meaningful error msg
      if (!role) {
        throw new Error('Role not found');
      }
      return await this.create(createUserDto, role);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAllOrganizers() {
    try {
      const clubs = await this.findAllByRole(this.ORGANIZERROLERID);
      return clubs;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOrganizer(id: number) {
    try {
      const club = await this.findOne(id, this.ORGANIZERROLERID);
      return club;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async updateOrganizer(id: number, updateUserDto: UpdateUserDto) {
    try {
      await this.findOrganizer(id);
      return await this.update(id, updateUserDto);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }
  async removeOrganizer(id: number) {
    const user = await this.findOrganizer(id);
    await this.userRepository.remove(user);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error');
  }
}
