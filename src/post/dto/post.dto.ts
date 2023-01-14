import {
  CreatePostRequest,
  Image,
  ImageCreate,
  Post,
  PostInfo,
} from '../proto/post.pb';
import { Transform } from 'class-transformer';
import { toBoolean, toNumber } from '../utils/helper/cast.helper';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class PostDto implements Post {
  public postUUID!: string;
  public userUUID!: string;
  public name!: string;
  public dateOfCreation!: string;
  public location!: string;
  public city!: string;
  public deal!: string;
  public type!: string;
  public info: PostInfoDto;
  public images!: PostImageDto[];
  public locked: boolean;
  public lockedByAdmin: boolean;
}

export class PostImageDto implements Image {
  public imageUuid!: string;
  public date!: string;
  public buffer!: string;
}

export class PostInfoDto implements PostInfo {
  public infoId!: string;
  public price!: number;
  public floorHeight!: number;
  public maxFloor!: number;
  public currentFloor!: number;
  public houseType!: string;
  public isParking!: boolean;
  public isBalcony!: boolean;
  public isRenovation!: boolean;
  public roomQuantity!: number;
  public dimensions!: number;
  public kitchenDimensions!: number;
  public livingDimensions!: number;
  public buildAt!: string;
  public description!: string;
  public isLift: boolean;
}

export class CreatePostDto implements CreatePostRequest {
  @IsString()
  buildAt: string;

  @IsString()
  city: string;

  @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
  @IsNumber()
  currentFloor: number;

  @IsString()
  deal: string;

  @IsString()
  description: string;

  @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
  @IsNumber()
  dimensions: number;

  @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
  @IsNumber()
  floorHeight: number;

  @IsString()
  houseType: string;

  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  isBalcony: boolean;

  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  isLift: boolean;

  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  isParking: boolean;

  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  isRenovation: boolean;

  @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
  @IsNumber()
  kitchenDimensions: number;

  @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
  @IsNumber()
  livingDimensions: number;

  @IsString()
  location: string;

  @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
  @IsNumber()
  maxFloor: number;

  @IsString()
  name: string;

  @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
  @IsNumber()
  price: number;

  @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
  @IsNumber()
  roomQuantity: number;

  @IsString()
  type: string;

  @IsString()
  userUUID: string;
  public readonly images: ImageCreateDto[];
}

export class ImageCreateDto implements ImageCreate {
  public buffer: Buffer;
  public fieldName: string;
  public originalName: string;
  public mimetype: string;
  public size: number;
}
