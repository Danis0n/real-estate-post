import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../entity/post.entity';
import { PostSearchDto } from '../dto/post.search.dto';

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
        postUUID: uuid,
      },
      relations: {
        info: true,
        images: true,
      },
    });
  }

  public async findAllUnlocked() {
    return await this.postRepository.find({
      where: {
        locked: false,
        lockedByAdmin: false,
      },
      relations: {
        info: true,
        images: true,
      },
    });
  }

  public async findAllByUser(userUUID: string) {
    return await this.postRepository.find({
      where: {
        userUUID: userUUID,
      },
      relations: {
        info: true,
        images: true,
      },
    });
  }

  public async findByParams(query: PostSearchDto) {
    return await this.postRepository.find({
      where: {
        info: { ...query },
      },
      relations: {
        info: true,
        images: true,
      },
    });
  }

  public async findLatest() {
    return await this.postRepository.find({
      relations: {
        info: true,
        images: true,
      },
      order: { postUUID: 'DESC' },
    });
  }

  public async findByName(name: string) {
    return await this.postRepository.find({
      where: {
        name: ILike(`%${name}%`),
      },
      relations: {
        info: true,
        images: true,
      },
    });
  }
}
