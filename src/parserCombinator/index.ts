type ParseResult<From, To> = OK<From, To> | Fail<From>;
type OK<Input, Value> = { ok: true; value: Value; rest: Input};
type Fail<From> = { ok: false; expected: From; actual: From};
export type Parser<Input, Value> = (input: Input) => ParseResult<Input, Value>;
export const pOK = <A, B>(value: B, rest: A): ParseResult<A, B> => ({
  ok: true,
  value,
  rest
})
export const pFail = <B>(expected: B, actual: B): Fail<B> => ({
  ok: false,
  expected,
  actual
})

export const token = (myToken: string): Parser<string, string> => (input: string) => {
  const index = input.indexOf(myToken)
  if (index === 0) {
    return pOK(myToken, input.slice(myToken.length))
  }
  return pFail(myToken, input)
}

export const regexp = (myRegexp: RegExp): Parser<string, string> => (input: string) => {
  const match = myRegexp.exec(input)
  if (match && match.index === 0) {
    const matched = match[0]
    return pOK(matched, input.slice(matched.length))
  }
  return pFail(String(myRegexp), input)
}

export const map = <FromValue, Input, ToValue>(parser: Parser<Input, FromValue>, f: (a: FromValue) => ToValue): Parser<Input, ToValue> => (
  input: Input
) => {
  const parsed = parser(input)
  if (parsed.ok) {
    return pOK(f(parsed.value), parsed.rest)
  } else {
    return parsed
  }
}

export const many = <A, B>(parser: Parser<A, B>): Parser<A, Array<B>> => (
  input: A
) => {
  const results: Array<B> = []
  let prev: ParseResult<A, B> = parser(input)
  if (!prev.ok) {
    return pOK(results, input)
  }
  let curr: ParseResult<A, B> = prev
  while (curr.ok) {
    results.push(curr.value)
    prev = curr
    curr = parser(curr.rest)
  }
  return pOK(results, prev.rest)
}

export const alt = <A>(expected: A) => <B>(...alts: Array<Parser<A, B>>): Parser<A, B> => (
  input: A
) => {
  for (const parser of alts) {
    const result = parser(input)
    if (result.ok) {
      return result
    }
  }
  return pFail(expected, input)
}

export const lazy = <A, B>(getParser: () => Parser<A, B>) => (input: A) =>
  getParser()(input)

export const precededBy = <A, B, C>(left: Parser<A, B>, right: Parser<A, C>) => (input: A) => {
  const pleft = left(input)
  if (!pleft.ok) return pleft
  const pright = right(pleft.rest)
  return pright
}

export const followedBy = <A, B, C>(left: Parser<A, B>, right: Parser<A, C>) => (input: A) => {
  const pleft = left(input)
  if (!pleft.ok) return pleft
  const pright = right(pleft.rest)
  if (!pright.ok) return pright
  return pOK(pleft.value, pright.rest)
}

export const surroundedBy = <A, B, C, D>(
  left: Parser<A, B>,
  mid: Parser<A, C>,
  right: Parser<A, D>
): Parser<A, C> => (input: A) => {
    const first = precededBy(left, mid)(input)
    if (!first.ok) return first
    const rest = right(first.rest)
    if (!rest.ok) return rest
    return pOK(first.value, rest.rest)
  }
