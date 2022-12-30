import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../entity/post.entity';

export class PostRepository {
  @InjectRepository(Post)
  private readonly postRepository: Repository<Post>;

  public async save(post: Post): Promise<Post> {
    return await this.postRepository.save(post);
  }

  public async findAll(): Promise<Post[]> {
    return await this.postRepository.find({
      relations: {
        info: true,
        images: true,
      },
    });
  }

  public async findOne(uuid: string): Promise<Post> {
    return await this.postRepository.findOne({
      where: {
        postUuid: uuid,
      },
      relations: {
        info: true,
        images: true,
      },
    });
  }
}
