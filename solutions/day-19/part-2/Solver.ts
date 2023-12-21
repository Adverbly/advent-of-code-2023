type Part = {
  x: number;
  m: number;
  a: number;
  s: number;
};

type WorkflowId = string;
type Pointer = WorkflowId | "A" | "R";
type RuleId = string;

type Rule = {
  type: "lessThan" | "greaterThan";
  comparison: number;
  ifTrue: Pointer;
  field: keyof Part;
  ruleId: RuleId;
};

type Workflow = {
  rules: Rule[];
  ifFalse: Pointer;
  workflowId: WorkflowId;
};

type WorkflowChain = { workflow: Workflow; ruleId: RuleId | null }[];

export class Solver {
  parts: Part[] = [];
  workflowsById: Record<WorkflowId, Workflow> = {};
  rulesById: Record<RuleId, Rule> = {};
  rootWorkflowId = "in";
  workflowA: Workflow = {
    ifFalse: "A",
    workflowId: "A",
    rules: [],
  };

  constructor(lines: string[]) {
    this.parseLines(lines);
  }

  tailWorkflow(chain: WorkflowChain) {
    return chain[chain.length - 1].workflow;
  }

  bfs({ horizon }: { horizon: WorkflowChain[] }) {
    const results: WorkflowChain[] = [];
    while (horizon.length > 0) {
      const workflowChain = horizon.shift()!;
      const tailWorkflow = this.tailWorkflow(workflowChain);

      if (tailWorkflow.ifFalse === "A") {
        results.push([
          ...workflowChain,
          {
            ruleId: null,
            workflow: this.workflowA,
          },
        ]);
      } else if (tailWorkflow.ifFalse !== "R") {
        const nextWorkflow = this.workflowsById[tailWorkflow.ifFalse];
        horizon.push([
          ...workflowChain,
          {
            ruleId: null,
            workflow: nextWorkflow,
          },
        ]);
      }

      tailWorkflow.rules.forEach((rule) => {
        const nextWorkflow = this.workflowsById[rule.ifTrue];
        if (rule.ifTrue === "A") {
          results.push([
            ...workflowChain,
            {
              ruleId: rule.ruleId,
              workflow: this.workflowA,
            },
          ]);
          return;
        }
        if (!nextWorkflow) {
          return;
        }
        horizon.push([
          ...workflowChain,
          {
            ruleId: rule.ruleId,
            workflow: nextWorkflow,
          },
        ]);
      });
    }
    return results;
  }

  solve() {
    const workflowChains = this.bfs({
      horizon: [
        [{ workflow: this.workflowsById[this.rootWorkflowId], ruleId: null }],
      ],
    });

    return workflowChains.reduce((sum, chain) => {
      return sum + this.chainCombinationCount(chain);
    }, 0);
  }

  rulesForField(chain: WorkflowChain, field: keyof Part) {
    const netComparison = chain.slice(1).reduce(
      ({ greaterThan, lessThan }, { ruleId }, index) => {
        const workflow = chain[index].workflow;
        for (const rule of workflow.rules) {
          if (rule.ruleId === ruleId) {
            if (rule.field === field) {
              if (rule.type === "greaterThan") {
                greaterThan = Math.max(greaterThan, rule.comparison);
              } else {
                lessThan = Math.min(lessThan, rule.comparison);
              }
            }
            break;
          } else {
            if (rule.field === field) {
              if (rule.type === "greaterThan") {
                lessThan = Math.min(lessThan, rule.comparison + 1);
              } else {
                greaterThan = Math.max(greaterThan, rule.comparison - 1);
              }
            }
          }
        }
        return { lessThan, greaterThan };
      },
      { greaterThan: 0, lessThan: 4001 }
    );

    return netComparison;
  }
  chainCombinationCount(chain: WorkflowChain) {
    return ["a", "x", "m", "s"].reduce((product, field) => {
      const { greaterThan, lessThan } = this.rulesForField(
        chain,
        field as keyof Part
      );
      return product * (lessThan - greaterThan - 1);
    }, 1);
  }

  parseLines(lines: string[]) {
    let ruleIdCounter = 1;
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

          const rule = {
            field,
            type,
            comparison: Number(comparisonString.slice(2)),
            ifTrue: pointer,
            ruleId: (ruleIdCounter++).toString(),
          } as Rule;

          this.rulesById[rule.ruleId] = rule;
          return rule;
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
