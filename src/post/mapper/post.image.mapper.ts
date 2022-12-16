import { PostImage } from '../entity/image.info.entity';
import { PostImageDto } from '../dto/post.dto';

export class PostImageMapper {
  public mapToNewPostImage(uuid: string): PostImage {
    const postImage: PostImage = new PostImage();
    postImage.imageUuid = uuid;
    postImage.date = new Date();
    return postImage;
  }

  public mapToPostImageDto(image: PostImage): PostImageDto {
    const imageDto: PostImageDto = new PostImageDto();
    imageDto.date = image.date.toString();
    imageDto.imageUuid = image.imageUuid;
    return imageDto;
  }

  public mapToNewPostImages(uuids: string[]): PostImage[] {
    const images: PostImage[] = [];

    uuids.forEach((uuid) => {
      const image: PostImage = new PostImage();
      image.imageUuid = uuid;
      image.date = new Date();
      images.push(image);
    });

    return images;
  }
}
