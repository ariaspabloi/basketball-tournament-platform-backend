import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { Club } from './entities/club.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ClubsService {
  private readonly logger = new Logger('ClubService');

  constructor(
    @InjectRepository(Club)
    private readonly clubRepository: Repository<Club>,
  ) {}

  async create(createClubDto: CreateClubDto) {
    try {
      const club = this.clubRepository.create(createClubDto);
      await this.clubRepository.save(club);

      return club;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    try {
      const clubs = await this.clubRepository.find({});
      return clubs;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(id: number) {
    const club = await this.clubRepository.findOneBy({ id });
    if (!club) throw new NotFoundException(`Club with id ${id} not found`);
    return club;
  }

  async update(id: number, updateClubDto: UpdateClubDto) {
    const club = await this.clubRepository.preload({ id, ...updateClubDto });
    if (!club) throw new NotFoundException(`Club with id ${id} not found`);
    try {
      await this.clubRepository.save(club);
    } catch (error) {
      this.handleDBExceptions(error);
    }
    return club;
  }

  async remove(id: number) {
    const club = await this.findOne(id);
    await this.clubRepository.remove(club);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error');
  }
}
