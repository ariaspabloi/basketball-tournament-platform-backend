import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDivisionDto } from './dto/create-division.dto';
import { UpdateDivisionDto } from './dto/update-division.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Division } from './entities/division.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DivisionsService {
  constructor(
    @InjectRepository(Division)
    private readonly divisionRepository: Repository<Division>,
  ) {}

  async create(createTeamDto: CreateDivisionDto) {
    const division = await this.divisionRepository.create(createTeamDto);
    await this.divisionRepository.save(division);
    return division;
  }

  async findAll() {
    const divisions = await this.divisionRepository.find();
    return divisions;
  }

  async findOne(id: number) {
    const division = await this.divisionRepository.findOneBy({ id });
    if (!division)
      throw new NotFoundException(`Division con ${id} no encontrada.`);
    return division;
  }

  async update(id: number, updateTeamDto: UpdateDivisionDto) {
    const division = await this.divisionRepository.preload({
      id,
      ...updateTeamDto,
    });
    if (!division)
      throw new NotFoundException(`Division con ${id} no encontrada.`);
    await this.divisionRepository.save(division);
    return division;
  }

  async remove(id: number) {
    const division = await this.findOne(id);
    await this.divisionRepository.remove(division);
  }
}
