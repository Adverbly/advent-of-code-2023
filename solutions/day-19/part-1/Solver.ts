type Part = {
  x: number;
  m: number;
  a: number;
  s: number;
};

type WorkflowId = string;
type Pointer = WorkflowId | "A" | "R";

type Rule = {
  type: "lessThan" | "greaterThan";
  comparison: number;
  ifTrue: Pointer;
  field: keyof Part;
};
type Workflow = {
  rules: Rule[];
  ifFalse: Pointer;
  workflowId: WorkflowId;
};

export class Solver {
  parts: Part[] = [];
  workflowsById: Record<WorkflowId, Workflow> = {};
  rootWorkflowId = "in";

  constructor(lines: string[]) {
    this.parseLines(lines);
  }

  workflowAcceptsPart(workflow: Workflow, part: Part): boolean {
    console.log(workflow);

    const pointer =
      workflow.rules.find(({ comparison, field, type }) => {
        const partValue = part[field];
        if (type === "greaterThan") {
          return partValue > comparison;
        } else {
          return partValue < comparison;
        }
      })?.ifTrue || workflow.ifFalse;
    if (pointer === "A") {
      return true;
    } else if (pointer === "R") {
      return false;
    }
    return this.workflowAcceptsPart(this.workflowsById[pointer], part);
  }

  scorePart(part: Part) {
    return part.x + part.a + part.m + part.s;
  }

  solve() {
    return this.parts
      .filter((part) => {
        let workflow = this.workflowsById[this.rootWorkflowId];
        return this.workflowAcceptsPart(workflow, part);
      })
      .reduce((sum, part) => sum + this.scorePart(part), 0);
  }

  parseLines(lines: string[]) {
    lines.forEach((line) => {
      if (line.startsWith("{")) {
        const part: Partial<Part> = {};
        line
          .slice(1, line.length - 1)
          .split(",")
          .forEach((assignment) => {
            const [name, value] = assignment.split("=");
            part[name as keyof Part] = Number(value);
          });
        this.parts.push(part as Part);
      } else if (line.length > 3) {
        const [workflowId, afterWorkflowId] = line.split("{");
        const ruleStrings = afterWorkflowId
          .slice(0, afterWorkflowId.length - 1)
          .split(",");
        const ifFalse = ruleStrings.pop() as string;
        const rules = ruleStrings.map((ruleString) => {
          const [comparisonString, pointer] = ruleString.split(":");
          const field = comparisonString[0];
          const type = comparisonString[1] === ">" ? "greaterThan" : "lessThan";

          return {
            field,
            type,
            comparison: Number(comparisonString.slice(2)),
            ifTrue: pointer,
          } as Rule;
        });

        this.workflowsById[workflowId] = {
          rules,
          ifFalse,
          workflowId,
        };
      }
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
