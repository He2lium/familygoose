import { Relationship } from '../../types/Factory'

export const ManyToManyDestroyFactory = (
  foreignModelName: string,
  foreignField: string
): Relationship.PostQueryMiddleware =>
  async function (doc, next) {
    const foreignModel = doc.$model(foreignModelName)

    // Update related documents
    await foreignModel.updateMany(
      { [foreignField]: doc._id },
      { $pull: { [foreignField]: doc._id } },
      { initiator: this.model.modelName }
    )

    next()
  }

export const ManyToManyDestroyManyFactory = (
  foreignField: string
): Relationship.PostQueryResponseMiddleware =>
  async function (_res, next) {
    if (this.getOptions().initiator === this.foreignModel.modelName) return

    // Update related documents
    await this.foreignModel.updateMany(
      { [foreignField]: { $in: this.localIds } },
      { $pull: { [foreignField]: { $in: this.localIds } } },
      { initiator: this.model.modelName }
    )
    next()
  }
