import { equivalent, EquivalentCtx } from "../equivalent/index.js"
import { type Neutral } from "../neutral/index.js"
import * as Values from "../value/index.js"

export function equivalentNeutral(
  ctx: EquivalentCtx,
  left: Neutral,
  right: Neutral,
): boolean {
  switch (left["@kind"]) {
    case "Var": {
      return right["@kind"] === "Var" && right.name === left.name
    }

    case "Ap": {
      return (
        right["@kind"] === "Ap" &&
        equivalentNeutral(ctx, left.target, right.target) &&
        equivalent(ctx, left.arg, right.arg)
      )
    }

    case "Fixpoint": {
      return (
        right["@kind"] === "Fixpoint" &&
        equivalent(
          ctx,
          Values.fixpointWrap(left.fixpoint),
          Values.fixpointWrap(right.fixpoint),
        )
      )
    }
  }
}
