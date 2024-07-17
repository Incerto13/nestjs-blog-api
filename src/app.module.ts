import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager'
import * as redisStore from 'cache-manager-redis-store';
import { APP_INTERCEPTOR } from '@nestjs/core';


import { UserModule } from './user/user.module';
import { BlogPostModule } from 'src/blog-post/blog-post.module';
import { CommentModule } from 'src/comment/comment.module';
import { GatewayModule } from './gateway/gateway.module';


@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: 'localhost', // Redis host
      port: 6379,        // Redis port
      ttl: 600,          // Time to live in seconds
      isGlobal: true,
    }),
    UserModule, BlogPostModule, CommentModule, GraphQLModule.forRoot(
    {
      autoSchemaFile: join(process.cwd(), 'src/graphql-schema.gql')
    }
  ),
  GatewayModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'blog',
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true,
    }),],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor
    }
  ],
})
export class AppModule {}
