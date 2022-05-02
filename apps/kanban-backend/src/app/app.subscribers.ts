import {
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
} from 'typeorm';

@EventSubscriber()
export class Subscribers implements EntitySubscriberInterface {
  /**
   * Need to utilize a Subscriber to make sure that the updated_at column is
   * updated through a relationship. For example, without this moving a Task
   * from one Category to another would not be tracked as an update because it
   * was updated through the Category's relation to its Tasks.
   * https://github.com/typeorm/typeorm/issues/5378
   * @param event
   */
  beforeUpdate(event: UpdateEvent<any>) {
    if (event.entity.updated_at) {
      event.entity.updated_at = new Date();
    }
  }
}
