import { forEach } from "lodash";

import { NcCodeDef } from "./codes";

const MOTION: Record<string, string> = {
  G00: "RAPID",
  G01: "LINEAR",
  G02: "CW_ARC",
  G03: "CCW_ARC",
  G04: "DWELL",
  G05: "NON-MODAL_RAPID",
  G09: "EXACT_STOP_CHECK",
  G27: "REFERENCE_RETURN_CHECK",
  G28: "RETURN_TO_HOME",
  G29: "RETURN_FROM_REFERENCE",
  G90: "ABSOLUTE",
  G91: "INCREMENTAL",
  G92: "Offset coordinate system and save parameters",
  G94: "FEED_PER_MINUTE",
  G95: "FEED_PER_REV",
  G96: "Constant surface speed",
  G97: "Cancel constant surface speed"
};

const COMPENSATION: Record<string, string> = {
  G10: "PROGRAMMABLE_OFFSET_INPUT",
  G40: "Tool cutter compensation off (radius comp.)",
  G41: "Tool cutter compensation left (radius comp.)",
  G42: "Tool cutter compensation right (radius comp.)",
  G43: "Apply tool length compensation (plus)",
  G44: "Apply tool length compensation (minus)",
  G49: "Tool length compensation cancel",
  G50: "Reset all scale factors to 1.0",
  G51: "Turn on scale factors"
};

const COORDINATE: Record<string, string> = {
  G15: "Turn Polar Coordinates OFF, return to Cartesian Coordinates",
  G16: "Turn Polar Coordinates ON",
  G17: "SELECT_X-Y_PLANE",
  G18: "SELECT_X-Z_PLANE",
  G19: "SELECT_Y-Z_PLANE",
  G20: "Program coordinates are inches",
  G21: "Program coordinates are mm",
  G52: "Local workshift for all coordinate systems, add XYZ offsets",
  G53: "Machine coordinate system (cancel work offsets)",
  G54: "Work coordinate system (1st Workpiece)",
  G55: "Work coordinate system (2nd Workpiece)",
  G56: "Work coordinate system (3rd Workpiece)",
  G57: "Work coordinate system (4th Workpiece)",
  G58: "Work coordinate system (5th Workpiece)",
  G59: "Work coordinate system (6th Workpiece)",
  G68: "Coordinate System Rotation",
  G69: "Cancel Coordinate System Rotation",
  G92: "Offset coordinate system and save parameters"
};

const OTHER: Record<string, string> = {
  G61: "Exact stop check mode",
  G62: "Automatic corner override",
  G63: "Tapping mode",
  G64: "Best speed path",
  G65: "Custom macro simple call",
  G101: "TOOL_SET_OR_CHECK",
  G187: "SET_SMOOTHNESS_LEVEL"
};

const CANNED: Record<string, string> = {
  G73: "High speed drilling cycle (small retract)",
  G74: "LH_TAP_CYCLE",
  G76: "Fine boring cyle",
  G80: "CANCEL_CANNED",
  G81: "PLUNGE_DRILL",
  G82: "DRILL_WITH_DWELL",
  G83: "DRILL_WITH_PECK",
  G84: "RH_TAP_CYCLE",
  G85: "FEED_IN_FEED_OUT_REAMING",
  G86: "FEED_IN_RAPID_OUT_REAMING",
  G87: "Back boring canned cycle",
  G88: "Boring canned cycle, spindle stop, manual out",
  G89: "Boring canned cycle, dwell, feed out",
  G98: "RETURN_TO_INITIAL_Z_PLANE",
  G99: "RETURN_TO_INITIAL_R_PLANE"
};

export const G_CODE_GROUPS = {
  MOTION,
  COMPENSATION,
  COORDINATE,
  OTHER,
  CANNED
};

export const G_CODES: {
  [K: string]: NcCodeDef;
} = {};

/**
 * @TODO FIX THIS!!!!!!!!!
 */
export function gCode(query: string): string {
  forEach(G_CODE_GROUPS, (groupName, group) => {
    forEach(groupName, (command, gcode) => {
      G_CODES[gcode] = {
        COMMAND: command,
        GROUP: group
      };
    });
  });

  return G_CODES[query].COMMAND;
}