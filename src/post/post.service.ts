import { HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PostRepository } from './repository/post.repository';
import {
  IMAGE_SERVICE_NAME,
  ImagePostResponse,
  ImagesDeleteResponse,
  ImageServiceClient,
} from './proto/image.pb';
import { ClientGrpc } from '@nestjs/microservices';
import {
  CreatePostResponse,
  FindAllPostResponse,
  FindOnePostRequest,
  FindOnePostResponse,
  UpdateImagesRequest,
  UpdateImagesResponse,
  UpdatePostRequest,
  UpdatePostResponse,
} from './proto/post.pb';
import { Post } from './entity/post.entity';
import { PostMapper } from './mapper/post.mapper';
import { CreatePostDto, PostDto } from './dto/post.dto';
import { firstValueFrom } from 'rxjs';
import { PostImageMapper } from './mapper/post.image.mapper';
import { PostImage } from './entity/image.info.entity';
import { PostImageRepository } from './repository/post.image.repository';

@Injectable()
export class PostService implements OnModuleInit {
  @Inject(PostRepository)
  private readonly postRepository: PostRepository;

  @Inject(PostImageRepository)
  private readonly postImageRepository: PostImageRepository;

  @Inject(PostMapper)
  private readonly postMapper: PostMapper;

  @Inject(PostImageMapper)
  private readonly postImageMapper: PostImageMapper;

  private imageSvc: ImageServiceClient;

  @Inject(IMAGE_SERVICE_NAME)
  private readonly client: ClientGrpc;

  onModuleInit(): void {
    this.imageSvc =
      this.client.getService<ImageServiceClient>(IMAGE_SERVICE_NAME);
  }

  public async create(dto: CreatePostDto): Promise<CreatePostResponse> {
    const post: Post = this.postMapper.mapToNewPost(dto);

    const response: ImagePostResponse = await firstValueFrom(
      this.imageSvc.imageUploadPost({
        images: dto.images,
        uuid: post.postUuid,
      }),
    );

    const postImages: PostImage[] = this.postImageMapper.mapToNewPostImages(
      response.imagesUuids,
    );

    post.images = [];
    for (const image of postImages) {
      post.images.push(await this.postImageRepository.save(image));
    }

    const postDto: PostDto = this.postMapper.mapToPostDto(
      await this.postRepository.save(post),
    );

    return { post: postDto, error: null, status: HttpStatus.OK };
  }

  public async findAll(): Promise<FindAllPostResponse> {
    const posts: Post[] = await this.postRepository.findAll();
    const postsDto: PostDto[] = this.postMapper.mapToArrayPostDto(posts);

    return { posts: postsDto };
  }

  public async findOne(dto: FindOnePostRequest): Promise<FindOnePostResponse> {
    const post: Post = await this.postRepository.findOne(dto.uuid);
    return {
      post: this.postMapper.mapToPostDto(post),
      status: HttpStatus.OK,
      error: null,
    };
  }

  public async update(dto: UpdatePostRequest): Promise<UpdatePostResponse> {
    return null;
  }

  public async updateImages(
    dto: UpdateImagesRequest,
  ): Promise<UpdateImagesResponse> {
    const post: Post = await this.postRepository.findOne(dto.uuid);

    if (post == null || post.userId != dto.userUuid)
      return {
        error: 'Объявление не принадлежит пользователю или отсутствует',
        status: HttpStatus.BAD_REQUEST,
      };

    if (
      post.images.length +
        (dto.createImages.length ? dto.createImages.length : 0) -
        (dto.deleteImages.length ? dto.deleteImages.length : 0) >
      10
    )
      return {
        error: 'Количество изображений не может быть больше 10',
        status: HttpStatus.BAD_REQUEST,
      };

    if (dto.deleteImages && dto.deleteImages.length >= 1) {
      const deleteImagesResponse: ImagesDeleteResponse = await firstValueFrom(
        this.imageSvc.imagesDelete({ uuids: dto.deleteImages }),
      );

      if (deleteImagesResponse.status == HttpStatus.BAD_REQUEST)
        return {
          error: 'Нет данных изображений',
          status: HttpStatus.BAD_REQUEST,
        };

      dto.deleteImages.map((id) => {
        post.images = post.images.filter((item) => item.imageUuid !== id);
      });
    }

    if (dto.createImages && dto.createImages.length >= 1) {
      const response: ImagePostResponse = await firstValueFrom(
        this.imageSvc.imageUploadPost({
          images: dto.createImages,
          uuid: post.postUuid,
        }),
      );

      if (response.status != HttpStatus.OK) {
        return {
          error: 'Ошибка при добавлении изображения',
          status: HttpStatus.BAD_REQUEST,
        };
      }

      const postImages: PostImage[] = this.postImageMapper.mapToNewPostImages(
        response.imagesUuids,
      );

      for (const image of postImages) {
        post.images.push(await this.postImageRepository.save(image));
      }
    }

    await this.postRepository.save(post);
    return { error: null, status: HttpStatus.OK };
  }
}
