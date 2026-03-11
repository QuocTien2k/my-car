import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsLatitude,
  IsLongitude,
} from 'class-validator';

export class CreateReportDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  make: string; // hãng xe

  @IsString()
  @Transform(({ value }) => value?.trim())
  model: string; // dòng xe

  @Type(() => Number)
  @IsNumber()
  @Min(2007)
  @Max(new Date().getFullYear())
  year: number; // năm sản xuất

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number; // số km đã chạy

  @IsLongitude()
  lng: number; // kinh độ

  @IsLatitude()
  lat: number; // vĩ độ

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number; // giá bán
}
