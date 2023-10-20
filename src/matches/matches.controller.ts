import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchesService.create(createMatchDto);
  }

  @Get()
  findAll() {
    return this.matchesService.findAll();
  }

  @Get('count')
  @Roles(Role.Administrator)
  Count() {
    return this.matchesService.getCount();
  }

  @Get('team/:id')
  findAllByTeam(@Param('id') id: string) {
    return this.matchesService.findAllByTeam(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMatchDto: UpdateMatchDto) {
    return this.matchesService.update(+id, updateMatchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matchesService.remove(+id);
  }
}
