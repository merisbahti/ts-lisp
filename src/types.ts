import { Result } from './result'
export type Num = { type: 'number', v: number}
export type Atom = { type: 'atom', v: string}
export type List = { type: 'list', v: Array<Expr> }
export type Proc = { type: 'procedure', v: ProcValue}
export type Expr = Num | List | Atom | Proc
export type ProcValue = (...args: Array<Expr>) => Result<Expr>
