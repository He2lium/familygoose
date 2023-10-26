import { Relationship } from '../../types/Factory'
import { Schema } from 'mongoose'
import { OneToManyDestroyFactory, OneToManyDestroyManyFactory } from './DestroyFactory'
import { OneToManySaveFactory } from './SaveFactory'
import OneToManyMiddlewares = Relationship.OneToManyMiddlewares
import { SaveLocalIdsFactory } from '../SaveLocalIds'
import { OneToManyUpdateFactory, OneToManyUpdateManyFactory } from './UpdateFactory'

export const OneToManyFactory = (
  foreignModelName: string,
  localField?: string,
  foreignField?: string,
  cascade: boolean = false,
): OneToManyMiddlewares => ({
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
  preDeleteMany: SaveLocalIdsFactory(),
  preUpdateMany: SaveLocalIdsFactory(),
  postSave: OneToManySaveFactory(foreignModelName, localField, foreignField, cascade),
  postUpdate: OneToManyUpdateFactory(foreignModelName, localField, foreignField, cascade),
  postUpdateMany: OneToManyUpdateManyFactory(foreignModelName, localField, foreignField, cascade),
  postDelete: OneToManyDestroyFactory(foreignModelName, localField, foreignField, cascade),
  postDeleteMany: OneToManyDestroyManyFactory(foreignModelName, foreignField, cascade),
})
