import { Module } from '@nestjs/common';
import { DivisionsService } from './divisions.service';
import { DivisionsController } from './divisions.controller';
import { Division } from './entities/division.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [DivisionsController],
  providers: [DivisionsService],
  exports: [DivisionsService],
  imports: [TypeOrmModule.forFeature([Division])],
})
export class DivisionsModule {}
