import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';

@Controller('clubs')
export class ClubsController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createClub(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAllClubs();
  }

  @Get('count')
  @Roles(Role.Administrator)
  Count() {
    return this.usersService.getClubCount();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findClub(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateClub(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.removeClub(+id);
  }
}

@Controller('organizers')
export class OrganizerController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createOrganizer(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAllOrganizers();
  }

  @Get('count')
  @Roles(Role.Administrator)
  Count() {
    return this.usersService.getOrganizerCount();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOrganizer(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateOrganizer(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.removeOrganizer(+id);
  }
}
