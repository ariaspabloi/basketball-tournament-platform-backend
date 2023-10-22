import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { LeaguesService } from './leagues.service';
import { CreateLeagueDto } from './dto/create-league.dto';
import { UpdateLeagueDto } from './dto/update-league.dto';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';

@Controller('leagues')
export class LeaguesController {
  constructor(private readonly leaguesService: LeaguesService) {}

  @Post()
  create(@Body() createLeagueDto: CreateLeagueDto) {
    return this.leaguesService.create(createLeagueDto);
  }

  @Get()
  findAll() {
    return this.leaguesService.findAll();
  }

  @Get('count')
  @Roles(Role.Administrator)
  Count() {
    return this.leaguesService.getCount();
  }

  @Get('organizer')
  @Roles(Role.Organizer)
  findByOrganizer(@Req() req: any) {
    return this.leaguesService.findByOrganizer(req.user.sub);
  }

  @Post('organizer')
  @Roles(Role.Organizer)
  createByOrganizer(@Req() req: any, @Body() createLeagueDto: CreateLeagueDto) {
    return this.leaguesService.createByOrganizer(req.user.sub, createLeagueDto);
  }

  @Get(':id/matches')
  findLeagueMatches(@Param('id') id: string) {
    return this.leaguesService.findLeagueMatches(+id);
  }

  @Get(':id/clubs')
  findLeagueClue(@Param('id') id: string) {
    return this.leaguesService.findLeagueClubs(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leaguesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLeagueDto: UpdateLeagueDto) {
    return this.leaguesService.update(+id, updateLeagueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leaguesService.remove(+id);
  }
}
