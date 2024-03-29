import { Relationship } from '../../types/Factory'

export const ManyToOneDestroyFactory = (
  foreignModelName: string,
  foreignField?: string
): Relationship.PostQueryMiddleware | undefined => {
  if (!foreignField) return undefined
  return async function (doc) {
    const foreignModel = doc.$model(foreignModelName)
    if (!foreignModel.schema.path(foreignField)) return

    // Update related documents
    await foreignModel.updateMany(
      { [foreignField]: doc._id },
      { $pull: { [foreignField]: doc._id } },
      { initiator: this.model.modelName }
    )
  }
}

export const ManyToOneDestroyManyFactory = (
  foreignField?: string
): Relationship.PostQueryResponseMiddleware | undefined => {
  if (!foreignField) return undefined
  return async function (_res) {
    if (this.getOptions().initiator === this.foreignModel.modelName) return

    // Update related documents
    await this.foreignModel.updateMany(
      { [foreignField]: { $in: this.localIds } },
      { $pull: { [foreignField]: { $in: this.localIds } } },
      { initiator: this.model.modelName }
    )
  }
}
