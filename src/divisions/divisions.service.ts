import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateDivisionDto } from './dto/create-division.dto';
import { UpdateDivisionDto } from './dto/update-division.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Division } from './entities/division.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DivisionsService {
  private readonly logger = new Logger('TeamsService');

  constructor(
    @InjectRepository(Division)
    private readonly divisionRepository: Repository<Division>,
  ) {}

  async create(createTeamDto: CreateDivisionDto) {
    try {
      const division = await this.divisionRepository.create(createTeamDto);
      await this.divisionRepository.save(division);
      return division;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    const divisions = await this.divisionRepository.find();
    return divisions;
  }

  async findOne(id: number) {
    const division = await this.divisionRepository.findOneBy({ id });
    if (!division) throw new NotFoundException(`Division with ${id} not found`);
    return division;
  }

  async update(id: number, updateTeamDto: UpdateDivisionDto) {
    try {
      const division = await this.divisionRepository.preload({
        id,
        ...updateTeamDto,
      });
      if (!division)
        throw new NotFoundException(`division with id ${id} not found`);
      await this.divisionRepository.save(division);
      return division;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: number) {
    const division = await this.findOne(id);
    await this.divisionRepository.remove(division);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error');
  }
}
