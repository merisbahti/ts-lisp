import * as T from './types'

export const pp = (e: T.Expr): string => {
  switch (e.type) {
    case 'number': return String(e.v)
    case 'list': return `(${e.v.map(pp).join(' ')})`
    case 'atom': return e.v
    case 'procedure': return `&Procedure`
  }
}
