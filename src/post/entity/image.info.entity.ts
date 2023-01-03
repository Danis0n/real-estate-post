import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
} from 'typeorm';
import { Post } from './post.entity';

@Entity('image_info_post')
export class PostImage extends BaseEntity {
  @PrimaryColumn({ name: 'image_id' })
  public imageUUID!: string;

  @Column({ name: 'image_date', nullable: false, type: 'date' })
  public date!: Date;

  @ManyToMany(() => Post, (post) => post.images)
  @JoinTable({
    name: 'post_image',
    joinColumn: {
      name: 'image_id',
      referencedColumnName: 'imageUUID',
    },
    inverseJoinColumn: {
      name: 'post_id',
      referencedColumnName: 'postUUID',
    },
  })
  public post: Post;
}
