import { run } from './run'
import { Num } from './expr'
import { Val } from './result'

test('simple addition', () => {
  const complexExpression = `(add 1 1)`
  expect(run(complexExpression)).toStrictEqual(
    Val(Num(2))
  )
})

test('nested addition', () => {
  const complexExpression = `(add (add 1 2) (add 3 (add 4 5)))`
  expect(run(complexExpression)).toStrictEqual(
    Val(Num(15))
  )
})
