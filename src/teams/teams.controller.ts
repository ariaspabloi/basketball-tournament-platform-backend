import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Roles(Role.Administrator, Role.Club)
  @Post()
  create(@Body() createTeamDto: CreateTeamDto, @Req() req: any) {
    const { isAdmin, sub } = req.user;
    if (!isAdmin && createTeamDto.clubId)
      throw new UnauthorizedException(
        'No tienes permiso para crear un equipo en nombre de otro usuario.',
      );
    return this.teamsService.create(sub, createTeamDto);
  }

  @Get()
  findAll() {
    return this.teamsService.findAll();
  }

  @Get('owned')
  @Roles(Role.Club)
  findOwned(@Req() req: any) {
    return this.teamsService.findOwned(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(+id);
  }

  @Roles(Role.Administrator, Role.Club)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamsService.update(+id, updateTeamDto);
  }

  @Roles(Role.Administrator, Role.Club)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamsService.remove(+id);
  }
}
