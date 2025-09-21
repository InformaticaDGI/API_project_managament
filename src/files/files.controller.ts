import { Controller, Post, Param, UploadedFiles, UseInterceptors, BadRequestException, Get, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { ProjectService } from 'src/project/project.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly projectService: ProjectService,
    private readonly configService: ConfigService,
  ) { }

  @Post('project/:id')
  @UseInterceptors(AnyFilesInterceptor({
    fileFilter: fileFilter,
    storage: diskStorage({
      destination: './static/uploads/projects',
      filename: (req, file, cb) => {
        const fileExtension = file.originalname.split('.').pop();
        const filename = randomUUID() + "." + fileExtension;
        cb(null, filename);
      },
    }),
  }))
  async create(
    @Param('id') id: number,
    @UploadedFiles()
    files: Array<Express.Multer.File>,
  ) {

    if (files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }
    const appUrl = this.configService.getOrThrow('HOST_URL');
    const names = files.map(file => `${this.configService.get('HOST_URL')}/api/files/project/${file.filename}`);
    await this.projectService.addImages(+id, names);
    return names;
  }

  @Get('project/:image')
  async getStaticProjectImage(
    @Res() res: Response,
    @Param('image') image: string) {
    const path = this.filesService.getStaticProjectImage(image);
    return res.sendFile(path)
  }
}
