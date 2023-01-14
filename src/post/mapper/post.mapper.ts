import { Post } from '../entity/post.entity';
import { CreatePostDto, PostDto, PostInfoDto } from '../dto/post.dto';
import { v4 as uuidv4 } from 'uuid';
import { PostInfo } from '../entity/post.info.entity';
import { Inject } from '@nestjs/common';
import { PostImageMapper } from './post.image.mapper';
import { toFixedNumber } from '../utils/helper/cast.helper';

export class PostMapper {
  @Inject(PostImageMapper)
  private readonly postImageMapper: PostImageMapper;

  public mapToNewPost(dto: CreatePostDto): Post {
    const post: Post = this.fillPost(dto);
    post.info = this.fillPostInfo(dto);
    return post;
  }

  private fillPost(dto: CreatePostDto): Post {
    const post: Post = new Post();
    post.postUUID = uuidv4();
    post.userUUID = dto.userUUID;
    post.name = dto.name;
    post.deal = dto.deal;
    post.type = dto.type;
    post.city = dto.city;
    post.locked = false;
    post.lockedByAdmin = false;
    post.location = dto.location;
    post.dateOfCreation = new Date();
    return post;
  }

  private fillPostInfo(dto: CreatePostDto): PostInfo {
    const postInfo: PostInfo = new PostInfo();
    postInfo.price = Number(dto.price);
    postInfo.description = this.fillData(dto.description);
    postInfo.isBalcony = this.fillData(dto.isBalcony);
    postInfo.isRenovation = this.fillData(dto.isRenovation);
    postInfo.isLift = this.fillData(dto.isLift);
    postInfo.isParking = this.fillData(dto.isParking);
    postInfo.buildAt = this.fillData(dto.buildAt);
    postInfo.currentFloor = this.fillData(dto.currentFloor);
    postInfo.maxFloor = this.fillData(dto.maxFloor);
    postInfo.dimensions = this.fillData(dto.dimensions);
    postInfo.floorHeight = this.fillData(toFixedNumber(dto.floorHeight, 1, 10));
    postInfo.houseType = this.fillData(dto.houseType);
    postInfo.roomQuantity = this.fillData(dto.roomQuantity);
    postInfo.kitchenDimensions = this.fillData(dto.kitchenDimensions);
    postInfo.livingDimensions = this.fillData(dto.livingDimensions);
    return postInfo;
  }

  private fillData(data: any) {
    return data !== null ? data : null;
  }

  public mapToPostDto(post: Post): PostDto {
    const postDto: PostDto = new PostDto();
    postDto.info = this.mapToPostInfoDto(post.info);

    postDto.postUUID = post.postUUID;
    postDto.userUUID = post.userUUID;
    postDto.name = post.name;
    postDto.deal = post.deal;
    postDto.type = post.type;
    postDto.city = post.city;
    postDto.locked = post.locked;
    postDto.lockedByAdmin = post.lockedByAdmin;
    postDto.location = post.location;
    postDto.dateOfCreation = post.dateOfCreation.toString();

    postDto.images = [];
    post.images.forEach((image) => {
      postDto.images.push(this.postImageMapper.mapToPostImageDto(image));
    });

    return postDto;
  }

  private mapToPostInfoDto(postInfo: PostInfo): PostInfoDto {
    const postInfoDto: PostInfoDto = new PostInfoDto();
    postInfoDto.price = Number(postInfo.price);
    postInfoDto.description = this.fillData(postInfo.description);
    postInfoDto.isBalcony = this.fillData(postInfo.isBalcony);
    postInfoDto.isRenovation = this.fillData(postInfo.isRenovation);
    postInfoDto.isParking = this.fillData(postInfo.isParking);
    postInfoDto.isLift = this.fillData(postInfo.isLift);
    postInfoDto.buildAt = this.fillData(postInfo.buildAt);
    postInfoDto.currentFloor = this.fillData(postInfo.currentFloor);
    postInfoDto.maxFloor = this.fillData(postInfo.maxFloor);
    postInfoDto.dimensions = postInfo.dimensions;
    postInfoDto.floorHeight = this.fillData(postInfo.floorHeight);
    postInfoDto.houseType = this.fillData(postInfo.houseType);
    postInfoDto.roomQuantity = this.fillData(postInfo.roomQuantity);
    postInfoDto.kitchenDimensions = this.fillData(postInfo.kitchenDimensions);
    postInfoDto.livingDimensions = this.fillData(postInfo.livingDimensions);
    return postInfoDto;
  }

  public mapToArrayPostDto(posts: Post[]): PostDto[] {
    const postsDto: PostDto[] = [];
    posts.map((post) => {
      postsDto.push(this.mapToPostDto(post));
    });
    return postsDto;
  }
}
