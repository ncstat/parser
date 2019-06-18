import chalk from "chalk";
import cli from "commander";
import { Program } from "../src";

const { log, error } = console;

cli
  .version(process.env.npm_package_version)
  .description("An app for analyzing NC files")
  .option("-t, --tool-list", "Show a list of tools found")
  .option("-c, --canned-cycles", "Show found canned cycles in toolpaths")
  .option("-p, --canned-points", "Show the location of points in canned cycles")
  .parse(process.argv);

if (cli.args.length === 0) {
  error("ERR: You must provide the path to a NC file");
  cli.help();
  process.abort();
}

const program = new Program(cli.args[0]);

(async () => {
  try {
    const toolpaths = await program.analyze();

    let output =
      "---------------------------------------------------------------------------------------\n";
    output += `Program #${program.getNumber()} ${program.getTitle()}\n`;
    output +=
      "---------------------------------------------------------------------------------------\n";

    toolpaths.forEach(toolpath => {
      if (toolpath.hasFeedrates()) {
        // const feedrates = toolpath.getFeedrates()

        output += chalk.magenta(`T${toolpath.tool.num}`);
        output += " | ";
        output += chalk.blue(`${toolpath.tool.desc}\n`);

        if (cli.cannedCycles && toolpath.cannedCycles.length > 0) {
          toolpath.cannedCycles.forEach(cannedCycle => {
            output += chalk.greenBright(cannedCycle.retractCommand) + " ";
            output += chalk.greenBright(cannedCycle.cycleCommand);
            output += " with ";
            output += chalk.yellow(cannedCycle.getPointCount().toString());
            output += " points\n";

            if (cli.cannedPoints) {
              cannedCycle.getPoints().forEach(position => {
                output += `X${position.X}, Y${position.Y}\n`;
              });
            }
          });
        }

        // const minFeedrate = chalk.red.bold(_.min(feedrates).toFixed(3))

        // const average = _.sum(feedrates) / feedrates.length
        // const averageFeedrate = chalk.red.bold(average.toFixed(3))

        // const meanFeedrate = chalk.red.bold(_.mean(feedrates).toFixed(3))

        // const maxFeedrate = chalk.red.bold(_.max(feedrates).toFixed(3))

        // console.log(`${toolNum} | ${toolDesc} | MIN: ${minFeedrate} MAX: ${maxFeedrate} MEAN: ${meanFeedrate}`)
      }
    });
    log(output);
    log(`Analyzed ${program.toolpaths.length} toolpaths.`);
  } catch (err) {
    log(err);
  }
})();
