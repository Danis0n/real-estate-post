import {
  CreatePostRequest,
  Image,
  ImageCreate,
  Post,
  PostInfo,
} from '../proto/post.pb';

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
}

export class PostInfoDto implements PostInfo {
  public infoId!: string;
  public price!: number;
  public floorHeight!: string;
  public maxFloor!: number;
  public currentFloor!: number;
  public houseType!: string;
  public isParking!: boolean;
  public isBalcony!: boolean;
  public isRenovation!: boolean;
  public roomQuantity!: string;
  public dimensions!: string;
  public kitchenDimensions!: string;
  public livingDimensions!: string;
  public buildAt!: string;
  public description!: string;
}

export class CreatePostDto implements CreatePostRequest {
  public readonly buildAt: string;
  public readonly city: string;
  public readonly currentFloor: number;
  public readonly deal: string;
  public readonly description: string;
  public readonly dimensions: string;
  public readonly floorHeight: string;
  public readonly houseType: string;
  public readonly isBalcony: boolean;
  public readonly isParking: boolean;
  public readonly isRenovation: boolean;
  public readonly kitchenDimensions: string;
  public readonly livingDimensions: string;
  public readonly location: string;
  public readonly maxFloor: number;
  public readonly name: string;
  public readonly price: string;
  public readonly roomQuantity: string;
  public readonly type: string;
  public readonly userUUID: string;
  public readonly images: ImageCreateDto[];
}

export class ImageCreateDto implements ImageCreate {
  public buffer: Buffer;
  public fieldName: string;
  public originalName: string;
  public mimetype: string;
  public size: number;
}
