export * as mongoose from 'mongoose'
import { Relationship } from './types/Factory'
import ManyToOneMiddlewares = Relationship.ManyToOneMiddlewares
import ManyToManyMiddlewares = Relationship.ManyToManyMiddlewares
import OneToManyMiddlewares = Relationship.OneToManyMiddlewares
import { Schema } from 'mongoose'

export { FG } from './utils/RelationshipBuilder'

export const FamilyGoose = <DocType>(
  schema: Schema<DocType & any>,
  options: (ManyToOneMiddlewares | ManyToManyMiddlewares | OneToManyMiddlewares)[]
) => {
  for (let middlewares of options) {
    // Add local field to schema automatically
    if (middlewares.localField && !schema.path(middlewares.localField.key))
      schema.add({
        [`${middlewares.localField.key}`]: middlewares.localField.definition,
      })

    // Set deleteMany generated middleware
    if (middlewares.preDeleteMany) {
      schema.pre(['deleteMany', 'deleteOne'], middlewares.preDeleteMany)
    }

    if (middlewares.postDeleteMany) {
      schema.post(['deleteMany', 'deleteOne'], middlewares.postDeleteMany)
    }

    // Set saving generated middlewares
    if (middlewares.postSave) {
      schema.post(['save'], middlewares.postSave)
    }

    // Set updating generated middlewares
    if (middlewares.postUpdate) {
      schema.post(['findOneAndUpdate'], middlewares.postUpdate)
    }

    if (middlewares.preUpdateMany) {
      schema.pre(['updateMany', 'updateOne'], middlewares.preUpdateMany)
    }

    if (middlewares.postUpdateMany) {
      schema.post(['updateMany', 'updateOne'], middlewares.postUpdateMany)
    }

    // Set destroying generated middlewares
    if (middlewares.postDelete) {
      schema.post(['deleteOne', 'findOneAndDelete', 'findOneAndRemove'], middlewares.postDelete)
    }
  }
}
