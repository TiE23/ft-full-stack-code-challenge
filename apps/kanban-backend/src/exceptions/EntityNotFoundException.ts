import { NotFoundException } from '@nestjs/common';

export class EntityNotFoundException extends NotFoundException {
  constructor(entityName: string, id: number) {
    super({ message: `${entityName} with ID ${id} was not found` });
  }
}
