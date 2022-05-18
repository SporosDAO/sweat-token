import { Document } from 'mongoose'

export const toDTO = <T = any>(doc: Document): T => {
  const json = doc.toJSON()
  if (json._id !== undefined) delete json._id
  if (json.__v !== undefined) delete json.__v
  return json as T
}
