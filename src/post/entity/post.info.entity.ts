import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('post_info')
export class PostInfo extends BaseEntity {
  @PrimaryColumn({ name: 'info_id' })
  public infoId!: string;

  @Column({ name: 'price', nullable: false, type: 'numeric' })
  public price!: number;

  @Column({ name: 'floor_height', nullable: true, type: 'varchar' })
  public floorHeight!: string;

  @Column({ name: 'max_floor', nullable: true, type: 'integer' })
  public maxFloor!: number;

  @Column({ name: 'current_floor', nullable: true, type: 'integer' })
  public currentFloor!: number;

  @Column({ name: 'house_type', nullable: true, type: 'varchar' })
  public houseType!: string;

  @Column({ name: 'parking', nullable: true, type: 'boolean' })
  public isParking!: boolean;

  @Column({ name: 'balcony', nullable: true, type: 'boolean' })
  public isBalcony!: boolean;

  @Column({ name: 'renovation', nullable: true, type: 'boolean' })
  public isRenovation!: boolean;

  @Column({ name: 'room_quantity', nullable: true, type: 'integer' })
  public roomQuantity!: string;

  @Column({ name: 'dimensions', nullable: false, type: 'varchar' })
  public dimensions!: string;

  @Column({ name: 'kitchen_dimensions', nullable: true, type: 'varchar' })
  public kitchenDimensions!: string;

  @Column({ name: 'living_dimensions', nullable: true, type: 'varchar' })
  public livingDimensions!: string;

  @Column({ name: 'build_year', nullable: true, type: 'integer' })
  public buildAt!: string;

  @Column({ name: 'description', nullable: true, type: 'text' })
  public description!: string;
}
