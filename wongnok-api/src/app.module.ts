import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DifficultiesModule } from './difficulties/difficulties.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './data-source';
import { CookingDurationsModule } from './cooking-durations/cooking-durations.module';
import { UsersModule } from './users/users.module';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { AuthModule } from './auth/auth.module';
import { ConfigifyModule } from '@itgorillaz/configify';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...dataSourceOptions,
        autoLoadEntities: true,
        synchronize: true,
      })
    }),
    ConfigifyModule.forRootAsync(),
    DifficultiesModule,
    CookingDurationsModule,
    UsersModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    AppService
  ],
})
export class AppModule {}
