import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";
import { Post } from './post.entity';

@Entity('image_info_post')
export class PostImage extends BaseEntity {
  @PrimaryColumn({ name: 'image_id' })
  public imageUuid!: string;

  @Column({ name: 'image_date', nullable: false, type: 'date' })
  public date!: Date;

  @ManyToMany(() => Post, (post) => post.images)
  @JoinTable({
    name: 'post_image',
    joinColumn: {
      name: 'image_id',
      referencedColumnName: 'imageUuid',
    },
    inverseJoinColumn: {
      name: 'post_id',
      referencedColumnName: 'postUuid',
    },
  })
  public post: Post;
}
