import { IsNotEmpty, Length } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @Length(0, 64)
  readonly title: string;
  @IsNotEmpty()
  readonly categoryId: number;
}
