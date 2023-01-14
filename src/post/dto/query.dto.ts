import { SearchPostQuery } from '../proto/post.pb';
import {toBoolean, toNumber} from '../utils/helper/cast.helper';
import { Transform } from 'class-transformer';
import {IsBoolean, IsOptional} from 'class-validator';

export class QueryDto implements SearchPostQuery {
  @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
  @IsOptional()
  public rooms: number;

  @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
  @IsOptional()
  public height: number;

  @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
  @IsOptional()
  public minPrice: number;

  @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
  @IsOptional()
  public maxPrice: number;

  @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
  @IsOptional()
  public minCommon: number;

  @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
  @IsOptional()
  public maxCommon: number;

  @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
  @IsOptional()
  public minKitchen: number;

  @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
  @IsOptional()
  public maxKitchen: number;

  @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
  @IsOptional()
  public minLiving: number;

  @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
  @IsOptional()
  public maxLiving: number;

  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  @IsOptional()
  public parking = false;

  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  @IsOptional()
  public balcony = false;

  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  @IsOptional()
  public lift = false;

  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  @IsOptional()
  public renovation = false;
}
