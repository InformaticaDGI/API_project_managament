import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from './category/category.module';
import { MunicipalityModule } from './municipality/municipality.module';
import { ParrishModule } from './parrish/parrish.module';
import { ProjectModule } from './project/project.module';
import { AreaModule } from './area/area.module';
import { SeedService } from './seed/seed.service';
import { FilesModule } from './files/files.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CompromiseModule } from './compromise/compromise.module';
import { UpdatesModule } from './updates/updates.module';
import { PreflightMiddleware } from './preflight/preflight.middleware';
import { ActivityModule } from './activity/activity.module';
import { AgendaModule } from './agenda/agenda.module';
import { StateModule } from './state/state.module';
import { ForeignActivityModule } from './foreign-activity/foreign-activity.module';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return ({
          type: 'postgres',
          url: process.env.DATABASE_URL,
          autoLoadEntities: true,
          entities: [
            __dirname + '/**/*.entity{.ts,.js}',
          ],
          synchronize: true,
          applicationName: 'Project Library',
        })
      },
    }),
    HttpModule,
    TerminusModule,
    CategoryModule,
    MunicipalityModule,
    ParrishModule,
    ProjectModule,
    AreaModule,
    FilesModule,
    CompromiseModule,
    UpdatesModule,
    ActivityModule,
    AgendaModule,
    StateModule,
    ForeignActivityModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeedService],
})
export class AppModule implements NestModule {

  constructor() {
  }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PreflightMiddleware).forRoutes('*');
  }


}
