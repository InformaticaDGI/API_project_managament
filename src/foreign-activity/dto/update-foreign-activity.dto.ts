import { PartialType } from '@nestjs/swagger';
import { CreateForeignActivityDto } from './create-foreign-activity.dto';

export class UpdateForeignActivityDto extends PartialType(CreateForeignActivityDto) {}
