type NodeId = string;
type Broadcaster = {
  nodeIds: NodeId[];
};
type FlipFlop = {
  id: NodeId;
  nodeIds: NodeId[];
  type: "ff";
};
type Conjunction = {
  id: NodeId;
  nodeIds: NodeId[];
  type: "conjunction";
};
const LOW_PULSE = 0;
const HIGH_PULSE = 1;

type ConjunctionState = Record<NodeId, typeof LOW_PULSE | typeof HIGH_PULSE>;
type FlipFlopState = typeof LOW_PULSE | typeof HIGH_PULSE;
type Pulse = {
  type: typeof LOW_PULSE | typeof HIGH_PULSE;
  toId: NodeId;
  fromId: NodeId;
};

export class Solver {
  broadcaster!: Broadcaster;
  modules: Record<NodeId, Conjunction | FlipFlop> = {};
  conjunctionStates: Record<NodeId, ConjunctionState> = {};
  flipFlopStates: Record<NodeId, FlipFlopState> = {};
  orderedConjunctions: string[];
  orderedFlipFlops: string[];
  lowPulseCount: number = 0;
  highPulseCount: number = 0;
  buttonPressCount: number = 0;
  detectedPeriods = {
    ch: null,
    gh: null,
    th: null,
    sv: null,
  };

  constructor(lines: string[]) {
    this.parseLines(lines);
    this.orderedConjunctions = Object.keys(this.conjunctionStates).sort();
    this.orderedFlipFlops = Object.keys(this.flipFlopStates).sort();
  }

  stableStringify(obj: Record<string, any>): string {
    return JSON.stringify(
      Object.entries(obj)
        .sort(([leftKey], [rightKey]) => (leftKey > rightKey ? 1 : -1))
        .map(([, value]) =>
          typeof value === "object" ? this.stableStringify(value) : value
        )
    );
  }

  currentState() {
    return this.stableStringify({
      ff: this.flipFlopStates,
      c: this.conjunctionStates,
    });
  }

  createPulse(fromId: NodeId, toId: NodeId, type: Pulse["type"]): Pulse {
    const pulse = { toId, type, fromId };
    this[type === LOW_PULSE ? "lowPulseCount" : "highPulseCount"]++;
    if (toId === "cn" && type === HIGH_PULSE) {
      console.log(this.buttonPressCount, JSON.stringify(pulse));
    }

    return pulse;
  }

  processPulse(pulse: Pulse): Pulse[] {
    const module = this.modules[pulse.toId];
    if (!module) {
      return [];
    }
    const nodeId = module.id;

    if (module.type === "conjunction") {
      const state = this.conjunctionStates[nodeId];
      state[pulse.fromId] = pulse.type;

      const type = Object.values(state).some((v) => v === LOW_PULSE)
        ? HIGH_PULSE
        : LOW_PULSE;

      return module.nodeIds.map((toId) => this.createPulse(nodeId, toId, type));
    } else {
      if (pulse.type === HIGH_PULSE) {
        //noop
        return [];
      } else {
        this.flipFlopStates[nodeId] =
          this.flipFlopStates[nodeId] === HIGH_PULSE ? LOW_PULSE : HIGH_PULSE;

        return module.nodeIds.map((toId) =>
          this.createPulse(nodeId, toId, this.flipFlopStates[nodeId])
        );
      }
    }
  }

  button() {
    this.lowPulseCount++;

    let pulses: Pulse[] = this.broadcaster.nodeIds.map((nodeId) =>
      this.createPulse("-1", nodeId, LOW_PULSE)
    );
    while (pulses.length > 0) {
      pulses = pulses.flatMap((pulse) => this.processPulse(pulse));
    }
  }

  solve() {
    const seen = new Set();
    let currentState = this.currentState();
    while (!seen.has(currentState)) {
      seen.add(currentState);
      this.button();
      currentState = this.currentState();
      this.buttonPressCount++;
    }
    // new Array(1000).fill(0).map(() => this.button());
    return this.lowPulseCount * this.highPulseCount;
  }

  parseLines(lines: string[]) {
    lines.forEach((line) => {
      if (line.startsWith("broadcaster")) {
        this.broadcaster = {
          nodeIds: line.split("-> ")[1].split(", "),
        };
        return;
      }
      const [id, nodeIdsString] = line.slice(1).split(" -> ");
      const nodeIds = nodeIdsString.split(", ");
      this.modules[id] = {
        id,
        nodeIds,
        type: line[0] === "%" ? "ff" : "conjunction",
      };
      if (this.modules[id].type === "conjunction") {
        this.conjunctionStates[id] = {};
      } else {
        this.flipFlopStates[id] = 0;
      }
    });
    Object.values(this.modules).forEach((module) => {
      module.nodeIds.forEach((nodeId) => {
        if (this.modules[nodeId]?.type === "conjunction") {
          this.conjunctionStates[nodeId][module.id] = LOW_PULSE;
        }
      });
    });
  }
}

if (import.meta.main) {
  const dir = import.meta.dir.split("/");
  const day = dir[dir.length - 2].split("-")[1];
  const part = dir[dir.length - 1].split("-")[1];
  Bun.env.AOC_DAY = day;
  Bun.env.AOC_PART = part;
  Bun.env.AOC_INPUT = "part-1/example.txt";
  import(`../../../index.ts`);
}
