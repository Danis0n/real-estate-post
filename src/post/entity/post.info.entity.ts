import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('post_info')
export class PostInfo extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'info_id' })
  public infoId!: number;

  @Column({ name: 'price', nullable: false, type: 'numeric' })
  public price!: number;

  @Column({ name: 'floor_height', nullable: true, type: 'numeric' })
  public floorHeight!: number;

  @Column({ name: 'max_floor', nullable: true, type: 'numeric' })
  public maxFloor!: number;

  @Column({ name: 'current_floor', nullable: true, type: 'integer' })
  public currentFloor!: number;

  @Column({ name: 'house_type', nullable: true, type: 'varchar' })
  public houseType!: string;

  @Column({ name: 'parking', nullable: true, type: 'boolean' })
  public isParking!: boolean;

  @Column({ name: 'balcony', nullable: true, type: 'boolean' })
  public isBalcony!: boolean;

  @Column({ name: 'lift', nullable: true, type: 'boolean' })
  public isLift!: boolean;

  @Column({ name: 'renovation', nullable: true, type: 'boolean' })
  public isRenovation!: boolean;

  @Column({ name: 'room_quantity', nullable: true, type: 'integer' })
  public roomQuantity!: number;

  @Column({ name: 'dimensions', nullable: false, type: 'numeric' })
  public dimensions!: number;

  @Column({ name: 'kitchen_dimensions', nullable: true, type: 'numeric' })
  public kitchenDimensions!: number;

  @Column({ name: 'living_dimensions', nullable: true, type: 'numeric' })
  public livingDimensions!: number;

  @Column({ name: 'build_year', nullable: true, type: 'integer' })
  public buildAt!: string;

  @Column({ name: 'description', nullable: true, type: 'text' })
  public description!: string;
}
