import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './reports.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/users.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private readonly repo: Repository<Report>,
  ) {}

  private applyEstimateFilters(
    qb: SelectQueryBuilder<Report>,
    { make, model, lng, lat, year }: GetEstimateDto,
  ) {
    qb.where('report.make = :make', { make })
      .andWhere('report.model = :model', { model })
      .andWhere('report.lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('report.lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('report.year - :year BETWEEN -3 AND 3', { year })
      .andWhere('report.approved IS TRUE');
  }

  estimatePrice(dto: GetEstimateDto) {
    const qb = this.repo.createQueryBuilder('report');

    this.applyEstimateFilters(qb, dto);

    return qb
      .select('AVG(report.price)', 'price')
      .orderBy('ABS(report.mileage - :mileage)', 'ASC')
      .setParameters({ mileage: dto.mileage })
      .limit(3)
      .getRawOne();
  }

  async create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;

    const savedReport = await this.repo.save(report);

    // console.log('savedReport:', savedReport);
    // console.log('savedReport.user:', savedReport.user);

    return savedReport;
  }

  async changeApproval(id: number, approved: boolean) {
    const report = await this.repo.findOne(id);

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    report.approved = approved;

    const savedReport = await this.repo.save(report);

    return savedReport;
  }
}
