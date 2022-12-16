import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Post } from './entity/post.entity';
import { PostInfo } from './entity/post.info.entity';
import { PostImage } from './entity/image.info.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostMapper } from './mapper/post.mapper';
import { PostRepository } from './repository/post.repository';
import { IMAGE_PACKAGE_NAME, IMAGE_SERVICE_NAME } from './proto/image.pb';
import { PostImageMapper } from './mapper/post.image.mapper';
import { PostImageRepository } from './repository/post.image.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostImage, PostInfo]),
    ClientsModule.register([
      {
        name: IMAGE_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:50053',
          package: IMAGE_PACKAGE_NAME,
          protoPath: 'node_modules/proto-config/proto/image.proto',
        },
      },
    ]),
  ],
  controllers: [PostController],
  providers: [
    PostService,
    PostMapper,
    PostRepository,
    PostImageMapper,
    PostImageRepository,
  ],
})
export class PostModule {}
