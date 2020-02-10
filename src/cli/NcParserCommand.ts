/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Command } from "clipanion";

import { getBlockGenerator } from "../NcBlock";
import { getTokenGenerator } from "../NcLexer";
import { GetFileContents } from "./GetFileContents";

export class NcParserCommand extends GetFileContents {
  @Command.Boolean(`-d,--debug`)
  public debug = false;

  @Command.Path(`parse`)
  async execute() {
    try {
      const tokens = getTokenGenerator(
        await this.getFileContents(),
        this.debug
      );
      const blocks = getBlockGenerator(tokens);

      for (const block of blocks) {
        this.context.stdout.write(block.toString());
        this.context.stdout.write("\n");
      }
    } catch (err) {
      this.context.stderr.write(err.toString());
    }
  }
}
