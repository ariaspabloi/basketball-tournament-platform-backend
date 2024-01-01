import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseInterceptors,
  ParseFilePipeBuilder,
  UploadedFile,
} from '@nestjs/common';
import { LeaguesService } from './leagues.service';
import { CreateLeagueDto } from './dto/create-league.dto';
import { UpdateLeagueDto } from './dto/update-league.dto';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import filenameGenerator from 'src/utils/fileNameGenerator';

@Controller('leagues')
export class LeaguesController {
  constructor(private readonly leaguesService: LeaguesService) {}

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files/documents',
        filename: filenameGenerator,
      }),
    }),
  )
  @Post()
  create(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /pdf/,
        })
        .build({
          fileIsRequired: false,
        }),
    )
    file: Express.Multer.File,
    @Body() createLeagueDto: CreateLeagueDto,
  ) {
    return this.leaguesService.create(createLeagueDto, file?.filename);
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

  @Get('organizer/count')
  @Roles(Role.Organizer)
  countLeagueClubs(@Req() req: any) {
    return this.leaguesService.countLeagueClubs(req.user.sub);
  }

  @Post('organizer')
  @Roles(Role.Organizer)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files/documents',
        filename: filenameGenerator,
      }),
    }),
  )
  @Post()
  createByOrganizer(
    @Req() req: any,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /pdf/,
        })
        .build({
          fileIsRequired: false,
        }),
    )
    file: Express.Multer.File,
    @Body() createLeagueDto: CreateLeagueDto,
  ) {
    return this.leaguesService.createByOrganizer(
      req.user.sub,
      createLeagueDto,
      file?.filename,
    );
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
