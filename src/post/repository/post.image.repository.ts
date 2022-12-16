import { PostImage } from '../entity/image.info.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export class PostImageRepository {
  @InjectRepository(PostImage)
  private readonly postImageRepository: Repository<PostImage>;

  public async save(image: PostImage): Promise<PostImage> {
    return this.postImageRepository.save(image);
  }
}
