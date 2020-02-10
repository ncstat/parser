import { NcBlock, parseLine } from "../../src/NcBlock";

const line = "N15 ( M5 X 0.8 ROLL TAP )";
const block = parseLine(line);

it(`parsed "${line}" into a NcBlock`, () => {
  expect(block).toBeInstanceOf(NcBlock);
});

it("created the correct number of tokens", () => {
  expect(block.tokens).toHaveLength(2);
});

describe("block.N", () => {
  it(`defined the property`, () => {
    expect(block.N).not.toBeNaN();
  });

  it(`assigned the value`, () => {
    expect(block.N).toBe(15);
  });
});

describe("block.comment", () => {
  test(`defined the property`, () => {
    expect(block.comment).not.toBeUndefined();
  });

  it(`assigned the value`, () => {
    expect(block.comment).toBe("M5 X 0.8 ROLL TAP");
  });
});
