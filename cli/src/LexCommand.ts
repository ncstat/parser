import { NcParser } from "@ncstat/parser";
import { Command } from "clipanion";

import { readFile } from "./lib/readFile";

export default class LexCommand extends Command {
  @Command.String({ required: true })
  public filepath!: string;

  @Command.Boolean(`-d,--debug`)
  public debug = false;

  @Command.Path(`lex`)
  async execute(): Promise<void> {
    const parser = new NcParser({ debug: this.debug });

    parser.on("error", (error: Error) => {
      this.context.stderr.write(error.toString());
    });

    const lexer = parser.getLexer();

    try {
      const tokens = lexer.tokenize(await readFile(this.filepath));

      for (const token of tokens) {
        this.context.stdout.write(`${token}\n`);
      }
    } catch (err) {
      this.context.stderr.write(err.toString());
    }
  }
}