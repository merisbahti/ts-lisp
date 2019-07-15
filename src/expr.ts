import * as T from './types'

export const Num = (v: number): T.Expr => ({ type: 'number', v })
export const List = (...v: Array<T.Expr>): T.Expr => ({ type: 'list', v })
export const Atom = (v: string): T.Expr => ({ type: 'atom', v })
export const Proc = (v: T.ProcValue): T.Expr => ({ type: 'procedure' as 'procedure', v })
