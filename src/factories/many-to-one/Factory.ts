import { Schema } from 'mongoose'
import { Relationship } from '../../types/Factory'
import { SaveLocalIdsFactory } from '../SaveLocalIds'
import { LocalFieldFactory } from '../LocalFieldFactory'
import { ManyToOneDestroyFactory, ManyToOneDestroyManyFactory } from './DestroyFactory'
import { ManyToOneSaveFactory } from './SaveFactory'
import { ManyToOneUpdateFactory, ManyToOneUpdateManyFactory } from './UpdateFactory'

export const ManyToOneFactory = (
  foreignModelName: string,
  localField: string,
  foreignField: string
): Relationship.Middlewares => {
  return {
    localField: LocalFieldFactory(localField, {
      type: Schema.Types.ObjectId,
      ref: foreignModelName,
    }),
    preQueryWithUpdateResult: SaveLocalIdsFactory(foreignModelName),
    postSave: ManyToOneSaveFactory(foreignModelName, localField, foreignField),
    postUpdate: ManyToOneUpdateFactory(foreignModelName, localField, foreignField),
    postUpdateWithUpdateResult: ManyToOneUpdateManyFactory(localField, foreignField),
    postDelete: ManyToOneDestroyFactory(foreignModelName, foreignField),
    postDeleteWithUpdateResult: ManyToOneDestroyManyFactory(localField, foreignField),
  }
}
