import { Module } from '@nestjs/common';
import { LeaguesService } from './leagues.service';
import { LeaguesController } from './leagues.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { League } from './entities/league.entity';

@Module({
  controllers: [LeaguesController],
  providers: [LeaguesService],
  exports: [LeaguesService],
  imports: [TypeOrmModule.forFeature([League]), UsersModule],
})
export class LeaguesModule {}
