import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { PostInfo } from './post.info.entity';
import { PostImage } from './image.info.entity';

@Entity('post')
export class Post extends BaseEntity {
  @PrimaryColumn({ name: 'post_id' })
  public postUuid!: string;

  @Column({ name: 'post_user_id', nullable: false, type: 'uuid' })
  public userId!: string;

  @Column({ name: 'post_name', nullable: false, type: 'varchar' })
  public name!: string;

  @Column({ name: 'post_date_of_creation', nullable: false, type: 'date' })
  public dateOfCreation!: Date;

  @Column({ name: 'post_location', nullable: false, type: 'varchar' })
  public location!: string;

  @Column({ name: 'post_city', nullable: false, type: 'varchar' })
  public city!: string;

  @Column({ name: 'post_deal_type', nullable: false, type: 'varchar' })
  public deal!: string;

  @Column({ name: 'post_property_type', nullable: false, type: 'varchar' })
  public type!: string;

  @OneToOne(() => PostInfo, { cascade: true })
  @JoinColumn({ name: 'post_info_id' })
  public info!: PostInfo;

  @ManyToMany(() => PostImage, (image) => image.post)
  @JoinTable({
    name: 'post_image',
    joinColumn: {
      name: 'post_id',
      referencedColumnName: 'postUuid',
    },
    inverseJoinColumn: {
      name: 'image_id',
      referencedColumnName: 'imageUuid',
    },
  })
  public images!: PostImage[];
}
