import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { Transport } from '@nestjs/microservices';
import { INestMicroservice } from '@nestjs/common';
import { protobufPackage } from './post/proto/post.pb';

async function bootstrap() {
  const app: INestMicroservice = await NestFactory.createMicroservice(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: '0.0.0.0:50054',
        package: protobufPackage,
        protoPath: join('node_modules/proto-config/proto/post.proto'),
      },
    },
  );
  await app.listen();
}
bootstrap();
