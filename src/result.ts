export type Result<T> = Value<T> | Err
export type Value<T> = { t: 'value', value: T }
export type Err = { t: 'err', error: string }

export const Val = <T>(value: T): Value<T> => ({ t: 'value', value })
export const Err = <T>(error: string): Result<T> => ({ t: 'err', error })

export const fmap = <T, B>(res: Result<T>, f: (a0: T) => Result<B>): Result<B> => {
  switch (res.t) {
    case 'value':
      return f(res.value)
    case 'err':
      return res
  }
}
