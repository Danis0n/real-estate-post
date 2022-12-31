import { Controller, Inject } from '@nestjs/common';
import { PostService } from './post.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CreatePostResponse,
  FindAllPostResponse,
  FindOnePostResponse,
  POST_SERVICE_NAME,
  UpdateImagesResponse,
  UpdatePostResponse,
} from './proto/post.pb';

@Controller('post')
export class PostController {
  @Inject(PostService)
  private readonly service: PostService;

  @GrpcMethod(POST_SERVICE_NAME, 'Create')
  private async create(payload): Promise<CreatePostResponse> {
    return this.service.create(payload);
  }

  @GrpcMethod(POST_SERVICE_NAME, 'FindOne')
  private async findOne(payload): Promise<FindOnePostResponse> {
    return this.service.findOne(payload);
  }

  @GrpcMethod(POST_SERVICE_NAME, 'FindAll')
  private async findAll(): Promise<FindAllPostResponse> {
    return this.service.findAll();
  }

  @GrpcMethod(POST_SERVICE_NAME, 'UpdatePost')
  private async update(payload): Promise<UpdatePostResponse> {
    return this.service.update(payload);
  }

  @GrpcMethod(POST_SERVICE_NAME, 'UpdateImages')
  private async updateImages(payload): Promise<UpdateImagesResponse> {
    return this.service.updateImages(payload);
  }
}
