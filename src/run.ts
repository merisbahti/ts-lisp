import { parse } from './parse'
import { evaluate } from './evaluate'
import { Val, Result, Err } from './result'

export const run = (input: string) => {
  const parsed = parse(input)
  if (!parsed.ok) {
    return Err(`Failed parsing, expected ${parsed.expected} but found: ${parsed.actual}`)
  }
  return evaluate(parsed.value)
}
