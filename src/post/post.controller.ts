import { Controller, Inject } from '@nestjs/common';
import { PostService } from './post.service';
import { GrpcMethod } from '@nestjs/microservices';
import { CreatePostResponse, FindAllPostResponse, FindOnePostResponse, POST_SERVICE_NAME } from "./proto/post.pb";

@Controller('post')
export class PostController {
  @Inject(PostService)
  private readonly postService: PostService;

  @GrpcMethod(POST_SERVICE_NAME, 'Create')
  private async create(payload): Promise<CreatePostResponse> {
    return this.postService.create(payload);
  }

  @GrpcMethod(POST_SERVICE_NAME, 'FindOne')
  private async findOne(payload): Promise<FindOnePostResponse> {
    return this.postService.findOne(payload);
  }

  @GrpcMethod(POST_SERVICE_NAME, 'FindAll')
  private async findAll(): Promise<FindAllPostResponse> {
    return this.postService.findAll();
  }
}
