import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed/seed.service';
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

@Controller()
export class AppController {
  constructor(
    private readonly seederService: SeedService,
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator

  ) { }

  @Get('/seed')
  async seed(): Promise<string> {
    await this.seederService.seed();
    return 'ok'
  }

  @Get('/healthcheck')
  async healthCheck() {
    return this.health.check([
      () =>
        this.http.responseCheck(
          'project endpoint',
          'http://localhost:4200/api/project',
          (res) => res.status === 200,
        ),

    ]);
  }

}
