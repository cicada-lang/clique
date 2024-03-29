import {
  cons,
  match,
  matchList,
  matchString,
  matchSymbol,
  v,
  type Sexp,
} from "@cicada-lang/sexp"
import * as Exps from "../exp/index.js"
import * as Stmts from "../stmt/index.js"
import { type Stmt } from "../stmt/index.js"
import { matchExp } from "./matchExp.js"

export function matchStmt(sexp: Sexp): Stmt {
  return match<Stmt>(sexp, [
    [
      ["define", cons(v("name"), v("args")), v("exp")],
      ({ name, args, exp }) =>
        Stmts.Define(
          matchSymbol(name),
          matchList(args, matchSymbol).reduceRight(
            (fn, name) => Exps.Fn(name, fn),
            matchExp(exp),
          ),
        ),
    ],
    [
      ["define", v("name"), v("exp")],
      ({ name, exp }) => Stmts.Define(matchSymbol(name), matchExp(exp)),
    ],
    [
      cons("import", cons(v("url"), v("entries"))),
      ({ url, entries }) =>
        Stmts.Import(matchString(url), matchList(entries, matchImportEntry)),
    ],
    [
      cons("assert-equal", v("exps")),
      ({ exps }) => Stmts.AssertEqual(matchList(exps, matchExp)),
    ],
    [
      cons("assert-not-equal", v("exps")),
      ({ exps }) => Stmts.AssertNotEqual(matchList(exps, matchExp)),
    ],
    [v("exp"), ({ exp }) => Stmts.Compute(matchExp(exp))],
  ])
}

function matchImportEntry(sexp: Sexp): Stmts.ImportEntry {
  return match<Stmts.ImportEntry>(sexp, [
    [
      ["rename", v("name"), v("rename")],
      ({ name, rename }) => ({
        name: matchSymbol(name),
        rename: matchSymbol(rename),
      }),
    ],
    [v("name"), ({ name }) => ({ name: matchSymbol(name) })],
  ])
}
