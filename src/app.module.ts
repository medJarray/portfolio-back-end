import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ExperienceModule } from './experience/experience.module';
import { DegreeModule } from './degree/degree.module';
import { SkillModule } from './skills/skill.module';
import { ContactModule } from './contact/contact.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_HOST'),
        retryWrites: true,
        w: 'majority',
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4,
      }),
      inject: [ConfigService],
    }),
    ExperienceModule,
    DegreeModule,
    SkillModule,
    ContactModule,
  ],
})
export class AppModule {}
