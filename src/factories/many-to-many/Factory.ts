import { Schema } from 'mongoose'
import { Relationship } from '../../types/Factory'
import { SaveLocalIdsFactory } from '../SaveLocalIds'
import { ManyToManyDestroyFactory, ManyToManyDestroyManyFactory } from './DestroyFactory'
import { ManyToManySaveFactory } from './SaveFactory'
import ManyToManyMiddlewares = Relationship.ManyToManyMiddlewares
import { ManyToManyUpdateFactory, ManyToManyUpdateManyFactory } from './UpdateFactory'

export const ManyToManyFactory = (
  foreignModelName: string,
  localField: string,
  foreignField: string
): ManyToManyMiddlewares => ({
  localField: {
    key: localField,
    definition: { type: [Schema.Types.ObjectId], default: [], ref: foreignModelName },
  },
  postSave: ManyToManySaveFactory(foreignModelName, localField, foreignField),
  postDelete: ManyToManyDestroyFactory(foreignModelName, localField, foreignField),
  preDeleteMany: SaveLocalIdsFactory(),
  postDeleteMany: ManyToManyDestroyManyFactory(foreignModelName, foreignField),
  postUpdate: ManyToManyUpdateFactory(foreignModelName, localField, foreignField),
  preUpdateMany: SaveLocalIdsFactory(),
  postUpdateMany: ManyToManyUpdateManyFactory(foreignModelName, localField, foreignField),
})
