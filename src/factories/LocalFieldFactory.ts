import { SchemaDefinitionProperty } from 'mongoose'

export const LocalFieldFactory = (key: string | undefined, definition: SchemaDefinitionProperty) =>
  !!key?.trim().length ? { key, definition } : undefined
