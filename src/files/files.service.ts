import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { ProjectService } from 'src/project/project.service';

@Injectable()
export class FilesService {

  constructor(
    private projectService: ProjectService,
  ) { }

  getStaticProjectImage(image: string) {
    const path = join(__dirname, '..', '..', 'static', 'uploads', 'projects', image);
    if (!existsSync(path)) throw new BadRequestException('Image not found');

    return path;
  }

  async removeProjectFile(projectId: number, id: string) {
    unlinkSync(this.getStaticProjectImage(id));
    await this.projectService.removeImage(projectId, id);
    return { message: 'Image deleted' };
  }

}