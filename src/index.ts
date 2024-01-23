import { Schema } from 'mongoose'
import { Relationship } from './types/Factory'

export { FG } from './utils/RelationshipBuilder'

export const FamilyGoose = <DocType>(
  schema: Schema<DocType & any>,
  options: Relationship.Middlewares[],
) => {
  for (const { localField, ...middlewares } of options) {
    // Add local field to schema automatically
    if (localField && !schema.path(localField.key))
      schema.add({ [`${localField.key}`]: localField.definition })

    // Set deleteMany generated middleware
    if (middlewares.preQueryWithUpdateResult)
      schema.pre(
        ['deleteMany', 'deleteOne', 'updateMany', 'updateOne'],
        middlewares.preQueryWithUpdateResult,
      )

    if (middlewares.postDeleteWithUpdateResult)
      schema.post(['deleteMany', 'deleteOne'], middlewares.postDeleteWithUpdateResult)

    // Set saving generated middlewares
    if (middlewares.postSave) schema.post(['save'], middlewares.postSave)

    // Set updating generated middlewares
    if (middlewares.postUpdate)
      schema.post(['findOneAndUpdate', 'findOneAndReplace'], middlewares.postUpdate)

    if (middlewares.postUpdateWithUpdateResult)
      schema.post(['updateMany', 'updateOne'], middlewares.postUpdateWithUpdateResult)

    // Set destroying generated middlewares
    if (middlewares.postDelete)
      schema.post(['deleteOne', 'findOneAndDelete', 'findOneAndRemove'], middlewares.postDelete)
  }
}
