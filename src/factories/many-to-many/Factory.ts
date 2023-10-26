import { Schema } from 'mongoose'
import { Relationship } from '../../types/Factory'
import { SaveLocalIdsFactory } from '../SaveLocalIds'
import { ManyToManyDestroyFactory, ManyToManyDestroyManyFactory } from './DestroyFactory'
import { ManyToManySaveFactory } from './SaveFactory'
import ManyToManyMiddlewares = Relationship.ManyToManyMiddlewares
import { ManyToManyUpdateFactory, ManyToManyUpdateManyFactory } from './UpdateFactory'

export const ManyToManyFactory = (
  foreignModelName: string,
  foreignField: string,
  localField?: string,
): ManyToManyMiddlewares => ({
  localField: localField
    ? {
        key: localField,
        definition: {
          type: [Schema.Types.ObjectId],
          default: [],
          ref: foreignModelName,
        },
      }
    : undefined,
  postSave: ManyToManySaveFactory(foreignModelName, foreignField, localField),
  postDelete: ManyToManyDestroyFactory(foreignModelName, foreignField, localField),
  preDeleteMany: SaveLocalIdsFactory(),
  postDeleteMany: ManyToManyDestroyManyFactory(foreignModelName, foreignField),
  postUpdate: ManyToManyUpdateFactory(foreignModelName, foreignField, localField),
  preUpdateMany: SaveLocalIdsFactory(),
  postUpdateMany: ManyToManyUpdateManyFactory(foreignModelName, foreignField, localField),
})
