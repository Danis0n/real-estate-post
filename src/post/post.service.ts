import { HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PostRepository } from './repository/post.repository';
import {
  IMAGE_SERVICE_NAME,
  ImagePostResponse,
  ImagesDeleteResponse,
  ImageServiceClient,
  ImagesViewRowResponse,
} from './proto/image.pb';
import { ClientGrpc } from '@nestjs/microservices';
import {
  CreatePostResponse,
  FindAllPostByUserRequest,
  FindAllPostResponse,
  FindOnePostRequest,
  FindOnePostResponse,
  LockPostAdminStateRequest,
  LockPostAdminStateResponse,
  LockPostStateRequest,
  LockPostStateResponse,
  SearchPostNameRequest,
  SearchPostNameResponse,
  SearchPostRequest,
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
import { PostSearchDto } from './dto/post.search.dto';
import { toFixedNumber } from './utils/helper/cast.helper';

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
        UUID: post.postUUID,
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

    for (const dtoPost of postsDto) {
      await this.fetchImages(dtoPost);
    }

    return { posts: postsDto };
  }

  public async searchParams({
    query,
  }: SearchPostRequest): Promise<FindAllPostResponse> {
    const search: PostSearchDto = new PostSearchDto();

    if (query.parking) search.isParking = query.parking;
    if (query.balcony) search.isBalcony = query.balcony;
    if (query.lift) search.isLift = query.lift;
    if (query.renovation) search.isRenovation = query.renovation;
    if (query.rooms) search.roomQuantity = query.rooms;
    if (query.height) search.floorHeight = toFixedNumber(query.height, 1, 10);

    let filteredPosts: Post[] = await this.postRepository.findByParams(search);

    if (query.minPrice)
      filteredPosts = filteredPosts.filter(
        (post) => post.info.price >= query.minPrice,
      );
    if (query.maxPrice)
      filteredPosts = filteredPosts.filter(
        (post) => post.info.price <= query.maxPrice,
      );

    if (query.minCommon)
      filteredPosts = filteredPosts.filter(
        (post) => post.info.dimensions >= query.minCommon,
      );
    if (query.maxCommon)
      filteredPosts = filteredPosts.filter(
        (post) => post.info.dimensions <= query.maxCommon,
      );

    if (query.minLiving)
      filteredPosts = filteredPosts.filter(
        (post) => post.info.livingDimensions >= query.minLiving,
      );
    if (query.maxLiving)
      filteredPosts = filteredPosts.filter(
        (post) => post.info.livingDimensions <= query.maxLiving,
      );

    if (query.minKitchen)
      filteredPosts = filteredPosts.filter(
        (post) => post.info.kitchenDimensions >= query.minKitchen,
      );
    if (query.maxKitchen)
      filteredPosts = filteredPosts.filter(
        (post) => post.info.kitchenDimensions <= query.maxKitchen,
      );

    const postsDto: PostDto[] =
      this.postMapper.mapToArrayPostDto(filteredPosts);
    for (const dtoPost of postsDto) {
      await this.fetchImages(dtoPost);
    }
    return { posts: postsDto };
  }

  public async findAllByUser(
    dto: FindAllPostByUserRequest,
  ): Promise<FindAllPostResponse> {
    const posts: Post[] = await this.postRepository.findAllByUser(dto.userUUID);
    const postsDto: PostDto[] = this.postMapper.mapToArrayPostDto(posts);

    return { posts: postsDto };
  }

  public async findAllUnlocked(): Promise<FindAllPostResponse> {
    const posts: Post[] = await this.postRepository.findAllUnlocked();
    const postsDto: PostDto[] = this.postMapper.mapToArrayPostDto(posts);

    for (const dtoPost of postsDto) {
      await this.fetchImages(dtoPost);
    }

    return { posts: postsDto };
  }

  public async findOne(dto: FindOnePostRequest): Promise<FindOnePostResponse> {
    const post: Post = await this.postRepository.findOne(dto.UUID);

    if (post == null || post.locked || post.lockedByAdmin)
      return {
        error: 'Пост не был найден',
        post: null,
        status: HttpStatus.NOT_FOUND,
      };

    const dtoPost: PostDto = this.postMapper.mapToPostDto(post);
    await this.fetchImages(dtoPost);

    return {
      post: dtoPost,
      status: HttpStatus.OK,
      error: null,
    };
  }

  private async fetchImages(dtoPost: PostDto) {
    const UUIDs: string[] = [];

    dtoPost.images.map((image) => {
      UUIDs.push(image.imageUuid);
    });

    const response: ImagesViewRowResponse = await firstValueFrom(
      this.imageSvc.imageViewRow({ UUIDs: UUIDs }),
    );

    if (response.images.length === dtoPost.images.length) {
      dtoPost.images.map((image, index) => {
        image.buffer = response.images[index];
      });
    }
  }

  public async update(dto: UpdatePostRequest): Promise<UpdatePostResponse> {
    const post: Post = await this.postRepository.findOne(dto.UUID);

    if (post == null || post.userUUID != dto.userUUID) {
      return {
        error: 'Искомый пост не был найден или вы не являетесь владельцем',
        status: HttpStatus.BAD_REQUEST,
      };
    }

    this.updateState(post, dto);
    await this.postRepository.save(post);

    return { error: null, status: HttpStatus.OK };
  }

  public async updateImages(
    dto: UpdateImagesRequest,
  ): Promise<UpdateImagesResponse> {
    const post: Post = await this.postRepository.findOne(dto.UUID);

    if (post == null || post.userUUID != dto.userUUID)
      return {
        error: 'Объявление не принадлежит пользователю или отсутствует',
        status: HttpStatus.BAD_REQUEST,
      };

    if (
      post.images.length +
        (dto.createImages ? dto.createImages.length : 0) -
        (dto.deleteImages ? dto.deleteImages.length : 0) >
      10
    )
      return {
        error: 'Количество изображений не может быть больше 10',
        status: HttpStatus.BAD_REQUEST,
      };

    if (dto.deleteImages && dto.deleteImages.length >= 1) {
      const deleteImagesResponse: ImagesDeleteResponse = await firstValueFrom(
        this.imageSvc.imagesDelete({ UUIDs: dto.deleteImages }),
      );

      if (deleteImagesResponse.status == HttpStatus.BAD_REQUEST)
        return {
          error: 'Нет данных изображений',
          status: HttpStatus.BAD_REQUEST,
        };

      dto.deleteImages.map((id) => {
        post.images = post.images.filter((item) => item.imageUUID !== id);
      });
    }

    if (dto.createImages && dto.createImages.length >= 1) {
      const response: ImagePostResponse = await firstValueFrom(
        this.imageSvc.imageUploadPost({
          images: dto.createImages,
          UUID: post.postUUID,
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

  public async updateLockState(
    dto: LockPostStateRequest,
  ): Promise<LockPostStateResponse> {
    const post: Post = await this.postRepository.findOne(dto.postUUID);

    if (post == null)
      return { error: 'Пост не был найден', status: HttpStatus.NOT_FOUND };

    if (dto.userUUID != post.userUUID)
      return {
        error: 'Данный пост не принадлежит вам',
        status: HttpStatus.BAD_REQUEST,
      };

    post.locked = dto.state;
    await this.postRepository.save(post);
    return { error: null, status: HttpStatus.OK };
  }

  public async updateLockStateAdmin(
    dto: LockPostAdminStateRequest,
  ): Promise<LockPostAdminStateResponse> {
    const post: Post = await this.postRepository.findOne(dto.postUUID);

    if (post == null)
      return { error: 'Пост не был найден', status: HttpStatus.NOT_FOUND };

    post.lockedByAdmin = dto.state;
    await this.postRepository.save(post);
    return { error: null, status: HttpStatus.OK };
  }

  public async searchName(
    dto: SearchPostNameRequest,
  ): Promise<SearchPostNameResponse> {
    const posts: Post[] = await this.postRepository.findByName(dto.name);
    const postsDto: PostDto[] = this.postMapper.mapToArrayPostDto(posts);

    if (postsDto.length === 0) return { isSuccess: false, posts: [] };

    for (const dtoPost of postsDto) {
      await this.fetchImages(dtoPost);
    }

    return { isSuccess: true, posts: postsDto };
  }

  public async findLatest(): Promise<FindAllPostResponse> {
    const posts: Post[] = await this.postRepository.findLatest();
    let postsDto: PostDto[] = this.postMapper.mapToArrayPostDto(posts);

    postsDto = postsDto.slice(0, 4);

    for (const dtoPost of postsDto) {
      await this.fetchImages(dtoPost);
    }

    return { posts: postsDto };
  }

  private updateState(post: Post, dto: UpdatePostRequest) {
    if (dto.isBalcony != null) post.info.isBalcony = dto.isBalcony;
    if (dto.isParking != null) post.info.isParking = dto.isParking;
    if (dto.isRenovation != null)
      post.info.isRenovation = Boolean(dto.isRenovation);
    if (dto.description) post.info.description = dto.description;
    if (dto.price) post.info.price = Number(dto.price);
    if (dto.dimensions) post.info.dimensions = dto.dimensions;
    if (dto.floorHeight) post.info.floorHeight = dto.floorHeight;
    if (dto.kitchenDimensions)
      post.info.kitchenDimensions = dto.kitchenDimensions;
    if (dto.livingDimensions) post.info.livingDimensions = dto.livingDimensions;
    if (dto.name) post.name = dto.name;
  }
}
