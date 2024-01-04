import * as commonmark from "commonmark"
import * as Errors from "../lang/errors/index.js"
import type { Mod } from "../lang/mod/index.js"
import { Parser } from "../lang/syntax/index.js"
import { Script } from "../script/index.js"

export class MarkdownScript extends Script {
  parser = new Parser()

  constructor(
    public mod: Mod,
    public text: string,
  ) {
    super()
  }

  async run(): Promise<void> {
    for (const block of collectBlocks(this.text)) {
      await this.runBlock(block)
    }
  }

  buildText(block: Block): string | undefined {
    if (block.info === "lambda") {
      return block.code
    }
  }

  async runBlock(block: Block): Promise<void> {
    const text = this.buildText(block)
    if (text === undefined) return

    try {
      const stmts = this.parser.parseStmts(text)
      await this.mod.executeStmts(stmts)
    } catch (error) {
      if (error instanceof Errors.ParsingError) {
        throw new Errors.ErrorReport(error.report(text))
      }

      if (error instanceof Errors.ElaborationError) {
        throw new Errors.ErrorReport(error.report(text))
      }

      throw error
    }
  }
}

type Block = { index: number; info: string; code: string }

function collectBlocks(text: string): Array<Block> {
  const reader = new commonmark.Parser()
  const parsed: commonmark.Node = reader.parse(text)
  const blocks = []
  const walker = parsed.walker()
  let counter = 0
  let event, node
  while ((event = walker.next())) {
    node = event.node
    if (event.entering && node.type === "code_block") {
      const [start_pos, _end_pos] = node.sourcepos
      const [row, col] = start_pos
      blocks.push({
        index: counter++,
        info: node.info || "",
        code: node.literal || "",
      })
    }
  }

  return blocks
}
