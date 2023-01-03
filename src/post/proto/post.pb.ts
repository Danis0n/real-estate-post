/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "post";

export interface LockPostAdminStateRequest {
  postUUID: string;
  state: boolean;
}

export interface LockPostAdminStateResponse {
  status: number;
  error: string;
}

export interface LockPostStateRequest {
  postUUID: string;
  userUUID: string;
  state: boolean;
}

export interface LockPostStateResponse {
  status: number;
  error: string;
}

export interface UpdatePostRequest {
  name: string;
  price: string;
  floorHeight: string;
  isParking: boolean;
  isBalcony: boolean;
  isRenovation: boolean;
  dimensions: string;
  kitchenDimensions: string;
  livingDimensions: string;
  description: string;
  UUID: string;
  userUUID: string;
}

export interface UpdatePostResponse {
  status: number;
  error: string;
}

export interface UpdateImagesRequest {
  UUID: string;
  userUUID: string;
  createImages: ImageCreate[];
  deleteImages: string[];
}

export interface UpdateImagesResponse {
  status: number;
  error: string;
}

export interface ImageCreate {
  fieldName: string;
  originalName: string;
  mimetype: string;
  buffer: Uint8Array;
  size: number;
}

export interface CreatePostRequest {
  name: string;
  price: string;
  floorHeight: string;
  maxFloor: number;
  currentFloor: number;
  houseType: string;
  isParking: boolean;
  isBalcony: boolean;
  isRenovation: boolean;
  roomQuantity: string;
  dimensions: string;
  kitchenDimensions: string;
  livingDimensions: string;
  buildAt: string;
  description: string;
  city: string;
  location: string;
  deal: string;
  type: string;
  userUUID: string;
  images: ImageCreate[];
}

export interface CreatePostResponse {
  status: number;
  error: string;
  post: Post | undefined;
}

export interface FindAllPostRequest {
}

export interface FindAllPostResponse {
  posts: Post[];
}

export interface FindOnePostRequest {
  UUID: string;
}

export interface FindOnePostResponse {
  status: number;
  error: string;
  post: Post | undefined;
}

export interface Post {
  postUUID: string;
  userUUID: string;
  name: string;
  dateOfCreation: string;
  location: string;
  city: string;
  deal: string;
  type: string;
  info: PostInfo | undefined;
  images: Image[];
  locked: boolean;
  lockedByAdmin: boolean;
}

export interface PostInfo {
  infoId: string;
  price: number;
  floorHeight: string;
  maxFloor: number;
  currentFloor: number;
  houseType: string;
  isParking: boolean;
  isBalcony: boolean;
  isRenovation: boolean;
  roomQuantity: string;
  dimensions: string;
  kitchenDimensions: string;
  livingDimensions: string;
  buildAt: string;
  description: string;
}

export interface Image {
  imageUuid: string;
  date: string;
}

export const POST_PACKAGE_NAME = "post";

export interface PostServiceClient {
  create(request: CreatePostRequest): Observable<CreatePostResponse>;

  findOne(request: FindOnePostRequest): Observable<FindOnePostResponse>;

  findAll(request: FindAllPostRequest): Observable<FindAllPostResponse>;

  updateImages(request: UpdateImagesRequest): Observable<UpdateImagesResponse>;

  updatePost(request: UpdatePostRequest): Observable<UpdatePostResponse>;

  updateLockPostRequest(request: LockPostStateRequest): Observable<LockPostStateResponse>;

  updateLockPostAdminRequest(request: LockPostAdminStateRequest): Observable<LockPostAdminStateResponse>;
}

export interface PostServiceController {
  create(request: CreatePostRequest): Promise<CreatePostResponse> | Observable<CreatePostResponse> | CreatePostResponse;

  findOne(
    request: FindOnePostRequest,
  ): Promise<FindOnePostResponse> | Observable<FindOnePostResponse> | FindOnePostResponse;

  findAll(
    request: FindAllPostRequest,
  ): Promise<FindAllPostResponse> | Observable<FindAllPostResponse> | FindAllPostResponse;

  updateImages(
    request: UpdateImagesRequest,
  ): Promise<UpdateImagesResponse> | Observable<UpdateImagesResponse> | UpdateImagesResponse;

  updatePost(
    request: UpdatePostRequest,
  ): Promise<UpdatePostResponse> | Observable<UpdatePostResponse> | UpdatePostResponse;

  updateLockPostRequest(
    request: LockPostStateRequest,
  ): Promise<LockPostStateResponse> | Observable<LockPostStateResponse> | LockPostStateResponse;

  updateLockPostAdminRequest(
    request: LockPostAdminStateRequest,
  ): Promise<LockPostAdminStateResponse> | Observable<LockPostAdminStateResponse> | LockPostAdminStateResponse;
}

export function PostServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "create",
      "findOne",
      "findAll",
      "updateImages",
      "updatePost",
      "updateLockPostRequest",
      "updateLockPostAdminRequest",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("PostService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("PostService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const POST_SERVICE_NAME = "PostService";
