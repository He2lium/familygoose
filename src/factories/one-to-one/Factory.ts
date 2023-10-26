import { Relationship } from '../../types/Factory'
import { Schema } from 'mongoose'
import { OneToOneDestroyFactory, OneToOneDestroyManyFactory } from './DestroyFactory'
import { OneToOneSaveFactory } from './SaveFactory'
import OneToManyMiddlewares = Relationship.OneToManyMiddlewares
import { SaveLocalIdsFactory } from '../SaveLocalIds'
import { OneToOneUpdateFactory, OneToOneUpdateManyFactory } from './UpdateFactory'

export const OneToOneFactory = (
  foreignModelName: string,
  localField?: string,
  foreignField?: string,
  cascade: boolean = false,
): OneToManyMiddlewares => {
  return {
    localField: localField
      ? {
          key: localField,
          definition: { type: [Schema.Types.ObjectId], default: [], ref: foreignModelName },
        }
      : undefined,
    preDeleteMany: SaveLocalIdsFactory(),
    preUpdateMany: SaveLocalIdsFactory(),
    postSave: OneToOneSaveFactory(foreignModelName, localField, foreignField, cascade),
    postUpdate: OneToOneUpdateFactory(foreignModelName, localField, foreignField, cascade),
    postUpdateMany: OneToOneUpdateManyFactory(foreignModelName, localField, foreignField, cascade),
    postDelete: OneToOneDestroyFactory(foreignModelName, localField, foreignField, cascade),
    postDeleteMany: OneToOneDestroyManyFactory(foreignModelName, localField, foreignField, cascade),
  }
}
