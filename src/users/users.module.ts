import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { ClubsController, OrganizerController } from './users.controller';

@Module({
  controllers: [ClubsController, OrganizerController],
  providers: [UsersService],
  exports: [UsersService],
  imports: [TypeOrmModule.forFeature([User, Role])],
})
export class UsersModule {}
