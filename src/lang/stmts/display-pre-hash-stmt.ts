import { Env } from "../env"
import { Exp } from "../exp"
import { Mod } from "../mod"
import { Stmt } from "../stmt"

export class DisplayPreHashStmt extends Stmt {
  constructor(public exp: Exp) {
    super()
  }

  async execute(mod: Mod): Promise<void> {
    const value = this.exp.evaluate(mod, new Env())
    const output = `(pre-hash ${value.preHash})`
    console.log(output)
    mod.output += output + "\n"
  }
}