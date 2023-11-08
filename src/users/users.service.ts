import {
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
import { Player } from 'src/players/entities/player.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UserService');
  private readonly CLUBROLEID = 3;
  private readonly ORGANIZERROLERID = 2;
  private readonly ADMINROLERID = 1;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  private async create(userDetails, role, image = undefined) {
    const user = await this.userRepository.create({
      ...userDetails,
      ...(image ? { image } : {}),
      role,
    });
    await this.userRepository.save(user);
    return user;
  }

  private async findAllByRole(roleId: number) {
    return await this.userRepository.find({ where: { role: { id: roleId } } });
  }

  private async findOne(id: number, roleId: number) {
    const user: User = await this.userRepository.findOneBy({ id });
    if (!user || user.role.id !== roleId)
      throw new NotFoundException(`User con ${id} no encontrado`);
    return user;
  }

  private async update(
    id: number,
    updateUserDto: UpdateUserDto,
    image?: string,
  ) {
    const userExists: User = await this.userRepository.findOneBy({ id });
    if (!userExists)
      throw new NotFoundException(`User with ID ${id} not found`);
    const userToUpdate = {
      id,
      ...updateUserDto,
      ...(image ? { image } : {}),
    };
    const user = await this.userRepository.preload(userToUpdate);
    const returnUser = await this.userRepository.save(user);
    delete returnUser.password;
    return returnUser;
  }

  async findAllPlayersByClubId(clubId: number) {
    // Create a query builder for the user repository
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :clubId', { clubId })
      .leftJoinAndSelect('user.teams', 'team')
      .leftJoinAndSelect('team.players', 'player')
      .getMany();

    let players: Player[] = [];
    users.forEach((user) => {
      user.teams.forEach((team) => {
        players = players.concat(team.players);
      });
    });

    return players;
  }

  private async getCount(role) {
    const count = await this.userRepository
      .createQueryBuilder('user')
      .where('user.roleId = :roleId', { roleId: role })
      .getCount();
    return count;
  }

  async updateImage(id, image) {
    //TODO: delete old image
    const user = await this.userRepository.preload({ id, image });
    await this.userRepository.save(user);
    return user;
  }

  async updateProfileClub(
    id: number,
    image: string,
    updateUserDto: UpdateUserDto,
  ) {
    await this.findClub(id);
    return await this.update(id, updateUserDto, image);
  }

  async updateProfileAdmin(
    id: number,
    image: string,
    updateUserDto: UpdateUserDto,
  ) {
    await this.findAdmin(id);
    return await this.update(id, updateUserDto, image);
  }

  async updateProfileOrganizer(
    id: number,
    image: string,
    updateUserDto: UpdateUserDto,
  ) {
    await this.findOrganizer(id);
    return await this.update(id, updateUserDto, image);
  }

  async getClubCount() {
    return await this.getCount(this.CLUBROLEID);
  }

  async getOrganizerCount() {
    return await this.getCount(this.ORGANIZERROLERID);
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new NotFoundException(`User con ${email} no encontrado`);
    return user;
  }

  async createClub(createUserDto: CreateUserDto) {
    const role = await this.roleRepository.findOneBy({ id: this.CLUBROLEID });
    if (!role) throw new InternalServerErrorException('Rol no encontrado');
    return await this.create(createUserDto, role);
  }

  async findAllClubs() {
    const clubs = await this.findAllByRole(this.CLUBROLEID);
    return clubs;
  }

  async findAdmin(id: number) {
    const admin = await this.findOne(id, this.ADMINROLERID);
    return admin;
  }

  async findClub(id: number) {
    const club = await this.findOne(id, this.CLUBROLEID);
    return club;
  }

  async updateClub(id: number, updateUserDto: UpdateUserDto) {
    await this.findClub(id);
    return await this.update(id, updateUserDto);
  }
  async removeClub(id: number) {
    const user = await this.findClub(id);
    await this.userRepository.remove(user);
  }

  async createOrganizer(createUserDto: CreateUserDto, image: string) {
    const role = await this.roleRepository.findOneBy({
      id: this.ORGANIZERROLERID,
    });
    if (!role) throw new InternalServerErrorException('Rol no encontrado');
    return await this.create(createUserDto, role, image);
  }

  async findAllOrganizers() {
    const clubs = await this.findAllByRole(this.ORGANIZERROLERID);
    return clubs;
  }

  async findOrganizer(id: number) {
    const club = await this.findOne(id, this.ORGANIZERROLERID);
    return club;
  }

  async updateOrganizer(
    id: number,
    image: string,
    updateUserDto: UpdateUserDto,
  ) {
    await this.findOrganizer(id);
    return await this.update(id, updateUserDto, image);
  }
  async removeOrganizer(id: number) {
    const user = await this.findOrganizer(id);
    await this.userRepository.remove(user);
  }
}
