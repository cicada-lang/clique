import { LangError } from "../errors"
import * as Exps from "../exps"
import { Value } from "../value"

export function apply(target: Value, arg: Value): Value {
  if (target instanceof Exps.LazyValue) {
    return apply(target.active(), arg)
  }

  if (target instanceof Exps.NotYetValue) {
    return new Exps.NotYetValue(new Exps.ApNeutral(target.neutral, arg))
  }

  if (target instanceof Exps.FnValue) {
    return target.apply(arg)
  }

  if (target instanceof Exps.FixpointValue) {
    return target.apply(arg)
  }

  throw new LangError(
    `I expect the target to be a function, instead of ${target.constructor.name}`
  )
}
