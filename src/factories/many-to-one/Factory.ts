import { Relationship } from '../../types/Factory'
import { Schema } from 'mongoose'
import { ManyToOneSaveFactory } from './SaveFactory'
import { ManyToOneDestroyFactory, ManyToOneDestroyManyFactory } from './DestroyFactory'
import ManyToOneMiddlewares = Relationship.ManyToOneMiddlewares
import { SaveLocalIdsFactory } from '../SaveLocalIds'
import { ManyToOneUpdateFactory, ManyToOneUpdateManyFactory } from './UpdateFactory'

export const ManyToOneFactory = (
  foreignModelName: string,
  localField?: string,
  foreignField?: string
): ManyToOneMiddlewares => {
  return {
    localField: localField
      ? {
          key: localField,
          definition: { type: Schema.Types.ObjectId, ref: foreignModelName },
        }
      : undefined,
    preDeleteMany: SaveLocalIdsFactory(),
    preUpdateMany: SaveLocalIdsFactory(),
    postSave: ManyToOneSaveFactory(foreignModelName, localField, foreignField),
    postUpdate: ManyToOneUpdateFactory(foreignModelName, localField, foreignField),
    postUpdateMany: ManyToOneUpdateManyFactory(foreignModelName, localField, foreignField),
    postDelete: ManyToOneDestroyFactory(foreignModelName, foreignField),
    postDeleteMany: ManyToOneDestroyManyFactory(foreignModelName, localField, foreignField),
  }
}
