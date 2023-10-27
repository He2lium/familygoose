import { Schema } from 'mongoose'
import { Relationship } from '../../types/Factory'
import { SaveLocalIdsFactory } from '../SaveLocalIds'
import { LocalFieldFactory } from '../LocalFieldFactory'
import { OneToOneDestroyFactory, OneToOneDestroyManyFactory } from './DestroyFactory'
import { OneToOneSaveFactory } from './SaveFactory'
import { OneToOneUpdateFactory, OneToOneUpdateManyFactory } from './UpdateFactory'

export const OneToOneFactory = (
  foreignModelName: string,
  localField?: string,
  foreignField?: string,
  cascade: boolean = false
): Relationship.Middlewares => {
  return {
    localField: LocalFieldFactory(localField, {
      type: [Schema.Types.ObjectId],
      default: [],
      ref: foreignModelName,
    }),
    preQueryWithUpdateResult: SaveLocalIdsFactory(foreignModelName),
    postSave: OneToOneSaveFactory(foreignModelName, localField, foreignField, cascade),
    postUpdate: OneToOneUpdateFactory(foreignModelName, localField, foreignField, cascade),
    postUpdateWithUpdateResult: OneToOneUpdateManyFactory(localField, foreignField, cascade),
    postDelete: OneToOneDestroyFactory(foreignModelName, localField, foreignField, cascade),
    postDeleteWithUpdateResult: OneToOneDestroyManyFactory(localField, foreignField, cascade),
  }
}
