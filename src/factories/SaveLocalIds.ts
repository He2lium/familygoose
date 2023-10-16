import { Types } from 'mongoose'
import { Relationship } from '../types/Factory'

export const SaveLocalIdsFactory = (): Relationship.PreQueryMiddleware =>
  async function (next) {
    this.localIds = await this.model.distinct<Types.ObjectId>('_id', this.getFilter())

    next()
  }
