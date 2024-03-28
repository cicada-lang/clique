import * as Exps from "../exp/index.js"
import { type Exp } from "../exp/index.js"
import {
  substitutionAppend,
  substitutionExtend,
  substitutionIsEmpty,
  substitutionKeepNames,
  substitutionMapExp,
  type Substitution,
} from "../substitution/index.js"
import { freshen } from "../utils/freshen.js"
import { lookup } from "./lookup.js"

// NOTE `substitute` should not call `reduce.

export function substitute(substitution: Substitution, body: Exp): Exp {
  substitution = substitutionKeepNames(
    substitution,
    Exps.freeNames(new Set(), body),
  )

  if (substitutionIsEmpty(substitution)) {
    return body
  }

  switch (body["@kind"]) {
    case "Var": {
      const found = lookup(body.name, substitution)
      if (found) {
        return found
      } else {
        return body
      }
    }

    case "Fn": {
      const freshName = freshen(body.name)
      return Exps.Fn(
        freshName,
        Exps.Let(
          substitutionExtend(substitution, body.name, Exps.Var(freshName)),
          body.ret,
        ),
      )
    }

    case "Ap": {
      return Exps.Ap(
        Exps.Let(substitution, body.target),
        Exps.Let(substitution, body.arg),
      )
    }

    case "Let": {
      return substitute(
        substitutionAppend(
          substitution,
          substitutionMapExp(body.substitution, (exp) =>
            substitute(substitution, exp),
          ),
        ),
        body.body,
      )
    }
  }
}
