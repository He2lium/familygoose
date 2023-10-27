import { Schema } from 'mongoose'
import { Relationship } from '../../types/Factory'
import { SaveLocalIdsFactory } from '../SaveLocalIds'
import { LocalFieldFactory } from '../LocalFieldFactory'
import { OneToManyDestroyFactory, OneToManyDestroyManyFactory } from './DestroyFactory'
import { OneToManySaveFactory } from './SaveFactory'
import { OneToManyUpdateFactory, OneToManyUpdateManyFactory } from './UpdateFactory'

export const OneToManyFactory = (
  foreignModelName: string,
  localField?: string,
  foreignField?: string,
  cascade: boolean = false
): Relationship.Middlewares => ({
  localField: LocalFieldFactory(localField, {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: foreignModelName,
  }),
  preQueryWithUpdateResult: SaveLocalIdsFactory(foreignModelName),
  postSave: OneToManySaveFactory(foreignModelName, localField, foreignField, cascade),
  postUpdate: OneToManyUpdateFactory(foreignModelName, localField, foreignField, cascade),
  postUpdateWithUpdateResult: OneToManyUpdateManyFactory(localField, foreignField, cascade),
  postDelete: OneToManyDestroyFactory(foreignModelName, localField, foreignField, cascade),
  postDeleteWithUpdateResult: OneToManyDestroyManyFactory(foreignField, cascade),
})
