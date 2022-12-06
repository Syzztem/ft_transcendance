import { UserService } from './services/user.service';
import { UserModule } from './user.module';
import { UserController } from './controlers/user.controller';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/User';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([User])
  ],
  controllers: [UserController, AppController],
  providers: [
    UserService, AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) { }
}
