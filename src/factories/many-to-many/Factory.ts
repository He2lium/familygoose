import { Schema } from 'mongoose'
import { Relationship } from '../../types/Factory'
import { SaveLocalIdsFactory } from '../SaveLocalIds'
import { ManyToManyDestroyFactory, ManyToManyDestroyManyFactory } from './DestroyFactory'
import { ManyToManySaveFactory } from './SaveFactory'
import { ManyToManyUpdateFactory, ManyToManyUpdateManyFactory } from './UpdateFactory'
import { LocalFieldFactory } from '../LocalFieldFactory'

export const ManyToManyFactory = (
  foreignModelName: string,
  foreignField: string,
  localField?: string
): Relationship.Middlewares => ({
  localField: LocalFieldFactory(localField, {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: foreignModelName,
  }),
  preQueryWithUpdateResult: SaveLocalIdsFactory(foreignModelName),

  postSave: ManyToManySaveFactory(foreignModelName, foreignField, localField),
  postDelete: ManyToManyDestroyFactory(foreignModelName, foreignField),
  postDeleteWithUpdateResult: ManyToManyDestroyManyFactory(foreignField),
  postUpdate: ManyToManyUpdateFactory(foreignModelName, foreignField, localField),
  postUpdateWithUpdateResult: ManyToManyUpdateManyFactory(foreignField, localField),
})
