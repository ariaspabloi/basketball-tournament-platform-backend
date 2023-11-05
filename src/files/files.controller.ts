import { Controller, Get, Param, StreamableFile } from '@nestjs/common';
import { FilesService } from './files.service';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('images/:filename')
  getFile(@Param('filename') filename: string): StreamableFile {
    const file = createReadStream(
      join(process.cwd(), `./files/images/${filename}`),
    );
    return new StreamableFile(file);
  }
}
