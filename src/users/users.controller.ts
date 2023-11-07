import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

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

  @Get('/players/:id')
  findPlayersByClub(@Param('id') id: string) {
    return this.usersService.findAllPlayersByClubId(+id);
  }

  @Patch('update-profile')
  @Roles(Role.Club)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files/images',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  updateProfile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /jpg|jpeg|png/,
        })
        .build({
          fileIsRequired: false,
        }),
    )
    file: Express.Multer.File,
    @Req() req: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateProfileClub(
      req.user.sub,
      file.filename,
      updateUserDto,
    );
  }

  @Post('image')
  @Roles(Role.Club)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files/images',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  handleUpload(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /jpg|jpeg|png|gif/,
        })
        .build(),
    )
    file: Express.Multer.File,
    @Req() req: any,
  ) {
    console.log(req.user.sub);
    return this.usersService.updateImage(req.user.sub, file.filename);
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

  @Patch('update-profile')
  @Roles(Role.Organizer)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files/images',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  updateProfile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /jpg|jpeg|png/,
        })
        .build({
          fileIsRequired: false,
        }),
    )
    file: Express.Multer.File,
    @Req() req: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateProfileOrganizer(
      req.user.sub,
      file?.filename,
      updateUserDto,
    );
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

@Controller('admin')
export class AdminController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('update-profile')
  @Roles(Role.Administrator)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files/images',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  updateProfile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /jpg|jpeg|png/,
        })
        .build({
          fileIsRequired: false,
        }),
    )
    file: Express.Multer.File,
    @Req() req: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateProfileAdmin(
      req.user.sub,
      file?.filename,
      updateUserDto,
    );
  }
}
