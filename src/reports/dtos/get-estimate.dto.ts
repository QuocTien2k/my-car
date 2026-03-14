import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsLatitude,
  IsLongitude,
} from 'class-validator';

export class GetEstimateDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  make: string; // hãng xe

  @IsString()
  @Transform(({ value }) => value?.trim())
  model: string; // dòng xe

  //@Type(() => Number)
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(2007)
  @Max(new Date().getFullYear())
  year: number; // năm sản xuất

  //@Type(() => Number)
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number; // số km đã chạy

  @Transform(({ value }) => parseFloat(value))
  @IsLongitude()
  lng: number; // kinh độ

  @Transform(({ value }) => parseFloat(value))
  @IsLatitude()
  lat: number; // vĩ độ
}
