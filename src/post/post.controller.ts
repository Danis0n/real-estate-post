import { Controller, Inject } from '@nestjs/common';
import { PostService } from './post.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CreatePostResponse,
  FindAllPostResponse,
  FindOnePostResponse,
  LockPostStateResponse,
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

  @GrpcMethod(POST_SERVICE_NAME, 'SearchPostParams')
  private async searchParams(payload): Promise<FindAllPostResponse> {
    return this.service.searchParams(payload);
  }

  @GrpcMethod(POST_SERVICE_NAME, 'FindAll')
  private async findAll(): Promise<FindAllPostResponse> {
    return this.service.findAll();
  }

  @GrpcMethod(POST_SERVICE_NAME, 'FindAllUnlocked')
  private async findAllUnlocked(): Promise<FindAllPostResponse> {
    return this.service.findAllUnlocked();
  }

  @GrpcMethod(POST_SERVICE_NAME, 'FindAllByUser')
  private async findAllByUser(payload): Promise<FindAllPostResponse> {
    return this.service.findAllByUser(payload);
  }

  @GrpcMethod(POST_SERVICE_NAME, 'UpdatePost')
  private async update(payload): Promise<UpdatePostResponse> {
    return this.service.update(payload);
  }

  @GrpcMethod(POST_SERVICE_NAME, 'UpdateImages')
  private async updateImages(payload): Promise<UpdateImagesResponse> {
    return this.service.updateImages(payload);
  }

  @GrpcMethod(POST_SERVICE_NAME, 'UpdateLockPost')
  private async updateLockState(payload): Promise<LockPostStateResponse> {
    return this.service.updateLockState(payload);
  }

  @GrpcMethod(POST_SERVICE_NAME, 'UpdateLockPostAdmin')
  private async updateLockStateAdmin(payload): Promise<LockPostStateResponse> {
    return this.service.updateLockStateAdmin(payload);
  }
}
