import { ManyToManyFactory } from '../factories/many-to-many/Factory'
import { OneToManyFactory } from '../factories/one-to-many/Factory'
import { ManyToOneFactory } from '../factories/many-to-one/Factory'
import { OneToOneFactory } from '../factories/one-to-one/Factory'

export const FG = (foreignModelName: string) => ({
  Many: (foreignField: string) => ({
    toMany: (localField: string) => ManyToManyFactory(foreignModelName, foreignField, localField),
    toOne: (localField: string) => ManyToOneFactory(foreignModelName, localField, foreignField),
  }),
  One: (foreignField: string) => ({
    toMany: (localField?: string, cascade: boolean = false) =>
      OneToManyFactory(foreignModelName, localField, foreignField, cascade),
    toOne: (localField?: string, cascade: boolean = false) =>
      OneToOneFactory(foreignModelName, localField, foreignField, cascade),
  }),
})
