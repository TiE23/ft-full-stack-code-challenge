import { IsNotEmpty, IsOptional, Length } from 'class-validator';

/*
 * Note: I wanted to use a central config using the node module `config` but there
 * were issues with the tsconfig and other things that I really didn't want to
 * deal with. So, just saying... I hate hard-coded configuration numbers like this
 * but for now, let's just let me write `64` direct in the source code. : )
 */

export class CreateTaskDto {
  @IsNotEmpty()
  @Length(0, 64)
  readonly title: string;
}
