# OpenAI Agent Builder - Complete Documentation

*Retrieved on October 9, 2025*

---

## Table of Contents

1. [Agent Builder Overview](#agent-builder-overview)
2. [Node Reference](#node-reference)
3. [Safety in Building Agents](#safety-in-building-agents)

---

## Agent Builder Overview

### What is Agent Builder?

**Agent Builder** is a visual canvas for building multi-step agent workflows.

You can start from templates, drag and drop nodes for each step in your workflow, provide typed inputs and outputs, and preview runs using live data. When you're ready to deploy, embed the workflow into your site with ChatKit, or download the SDK code to run it yourself.

### Agents and Workflows

To build useful agents, you create workflows for them. A **workflow** is a combination of agents, tools, and control-flow logic. A workflow encapsulates all steps and actions involved in handling your tasks or powering your chats, with working code you can deploy when you're ready.

**Access Agent Builder**: [Open Agent Builder](https://platform.openai.com/agent-builder)

### Three Main Steps in Building Agents

There are three main steps in building agents to handle tasks:

1. **Design a workflow** in [Agent Builder](https://platform.openai.com/agent-builder). This defines your agents and how they'll work.
2. **Publish your workflow**. It's an object with an ID and versioning.
3. **Deploy your workflow**. Pass the ID into your [ChatKit](https://platform.openai.com/docs/guides/chatkit) integration, or download the Agents SDK code to deploy your workflow yourself.

### Compose with Nodes

In Agent Builder, insert and connect nodes to create your workflow. Each connection between nodes becomes a typed edge. Click a node to configure its inputs and outputs, observe the data contract between steps, and ensure downstream nodes receive the properties they expect.

#### Examples and Templates

Agent Builder provides templates for common workflow patterns. Start with a template to see how nodes work together, or start from scratch.

**Example: Homework Helper Workflow**
- Uses agents to take questions
- Reframe them for better answers
- Route them to other specialized agents
- Return an answer

#### Available Nodes

Nodes are the building blocks for agents. To see all available nodes and their configuration options, see the [node reference documentation](https://platform.openai.com/docs/guides/node-reference).

### Preview and Debug

As you build, you can test your workflow by using the **Preview** feature. Here, you can interactively run your workflow, attach sample files, and observe the execution of each node.

### Safety and Risks

Building agent workflows comes with risks, like prompt injection and data leakage. See [safety in building agents](https://platform.openai.com/docs/guides/agent-builder-safety) to learn about and help mitigate the risks of agent workflows.

### Evaluate Your Workflow

Run [trace graders](https://platform.openai.com/docs/guides/trace-grading) inside of Agent Builder. In the top navigation, click **Evaluate**. Here, you can select a trace (or set of traces) and run custom graders to assess overall workflow performance.

### Publish Your Workflow

Agent Builder autosaves your work as you go. When you're happy with your workflow, publish it to create a new major version that acts as a snapshot. You can then use your workflow in [ChatKit](https://platform.openai.com/docs/guides/chatkit), an OpenAI framework for embedding chat experiences.

You can create new versions or specify an older version in your API calls.

### Deploy in Your Product

When you're ready to implement the agent workflow you created, click **Code** in the top navigation. You have two options for implementing your workflow in production:

**ChatKit**: Follow the [ChatKit quickstart](https://platform.openai.com/docs/guides/chatkit) and pass in your workflow ID to embed this workflow into your application. If you're not sure, we recommend this option.

**Advanced integration**: Copy the workflow code and use it anywhere. You can run ChatKit on your own infrastructure and use the Agents SDK to build and customize agent chat experiences.

### Next Steps

Now that you've created an agent workflow, bring it into your product with ChatKit:
- [ChatKit quickstart](https://platform.openai.com/docs/guides/chatkit) →
- [Advanced integration](https://platform.openai.com/docs/guides/custom-chatkit) →

---

## Node Reference

Explore all available nodes for composing workflows in Agent Builder.

[Agent Builder](https://platform.openai.com/agent-builder) is a visual canvas for composing agentic workflows. Workflows are made up of nodes and connections that control the sequence and flow. Insert nodes, then configure and connect them to define the process you want your agents to follow.

### Core Nodes

Get started with basic building blocks. All workflows have start and agent nodes.

#### Start

Define inputs to your workflow. For user input in a chat workflow, start nodes do two things:

1. Append the user input to the conversation history
2. Expose `input_as_text` to represent the text contents of this input

All chat start nodes have `input_as_text` as an input variable. You can add state variables too.

#### Agent

Define instructions, tools, and model configuration, or attach evaluations.

Keep each agent well defined in scope. In our homework helper example, we use one agent to rewrite the user's query for more specificity and relevance with the knowledge base. We use another agent to classify the query as either Q&A or fact-finding, and another agent to field each type of question.

Add model behavior instructions and user messages as you would with any other model prompt. To pipe output from a previous step, you can add it as context.

You can have as many agent nodes as you'd like.

#### Note

Leave comments and explanations about your workflow. Unlike other nodes, notes don't *do* anything in the flow. They're just helpful commentary for you and your team.

### Tool Nodes

Tool nodes let you equip your agents with tools and external services. You can retrieve data, monitor for misuse, and connect to external services.

#### File Search

Retrieve data from vector stores you've created in the OpenAI platform. Search by vector store ID, and add a query for what the model should search for. You can use variables to include output from previous nodes in the workflow.

See the [file search documentation](https://platform.openai.com/docs/guides/tools-file-search) to set up vector stores and see supported file types.

To search outside of your hosted storage with OpenAI, use [MCP](https://platform.openai.com/docs/guides/node-reference#mcp) instead.

#### Guardrails

Set up input monitors for unwanted inputs such as personally identifiable information (PII), jailbreaks, hallucinations, and other misuse.

Guardrails are pass/fail by default, meaning they test the output from a previous node, and you define what happens next. When there's a guardrails failure, we recommend either ending the workflow or returning to the previous step with a reminder of safe use.

#### MCP

Call third-party tools and services. Connect with OpenAI connectors or third-party servers, or add your own server. MCP connections are helpful in a workflow that needs to read or search data in another application, like Gmail or Zapier.

Browse options in the Agent Builder. To learn more about MCP, see the [connectors and MCP documentation](https://platform.openai.com/docs/guides/tools-connectors-mcp).

### Logic Nodes

Logic nodes let you write custom logic and define the control flow—for example, looping on custom conditions, or asking the user for approval before continuing an operation.

#### If/Else

Add conditional logic. Use [Common Expression Language](https://cel.dev/) (CEL) to create a custom expression. Useful for defining what to do with input that's been sorted into classifications.

**Example**: If an agent classifies input as Q&A, route that query to the Q&A agent for a straightforward answer. If it's an open-ended query, route to an agent that finds relevant facts. Else, end the workflow.

#### While

Loop on custom conditions. Use [Common Expression Language](https://cel.dev/) (CEL) to create a custom expression. Useful for checking whether a condition is still true.

#### Human Approval

Defer to end-users for approval. Useful for workflows where agents draft work that could use a human review before it goes out.

**Example**: Picture an agent workflow that sends emails on your behalf. You'd include an agent node that outputs an email widget, then a human approval node immediately following. You can configure the human approval node to ask, "Would you like me to send this email?" and, if approved, proceeds to an MCP node that connects to Gmail.

### Data Nodes

Data nodes let you define and manipulate data in your workflow. Reshape outputs or define global variables for use across your workflow.

#### Transform

Reshape outputs (e.g., object → array). Useful for enforcing types to adhere to your schema or reshaping outputs for agents to read and understand as inputs.

#### Set State

Define global variables for use across the workflow. Useful for when an agent takes input and outputs something new that you'll want to use throughout the workflow. You can define that output as a new global variable.

---

## Safety in Building Agents

Minimize prompt injections and other risks when building agents.

As you build and deploy agents with [Agent Builder](https://platform.openai.com/docs/guides/agent-builder), it's important to understand the risks. Learn about risk types and how to mitigate them when building multi-agent workflows.

### Types of Risk

Certain agent workflow patterns are more vulnerable to risk. In chat workflows, two important considerations are protecting user input and being careful about MCP tool calling.

#### Prompt Injections

**Prompt injections** are a common and dangerous type of attack. A prompt injection happens when untrusted text or data enters an AI system, and malicious contents in that text or data attempt to override instructions to the AI. The end goals of prompt injections vary but can include exfiltrating private data via downstream tool calls, taking misaligned actions, or otherwise changing model behavior in an unintended way. 

**Example**: A prompt might trick a data lookup agent into sending raw customer records instead of the intended summary. See an example in context in the [Codex internet access docs](https://developers.openai.com/codex/cloud/internet-access/).

#### Private Data Leakage

**Private data leakage**, when an agent accidentally shares private data, is also a risk to guard against. It's possible for a model to leak private data in a way that's not intended, without an attacker behind it. For example, a model may send more data to an MCP than the user expected or intended. While guardrails provide better control to limit the information included in context, you don't have full control over what the model chooses to share with connected MCPs.

Use the following guidance to reduce the attack surface and mitigate these risks. However, *even with these mitigations*, agents won't be perfect and can still make mistakes or be tricked; as a result, it's important to understand these risks and use caution in what access you give agents and how you apply agents.

### Don't Use Untrusted Variables in Developer Messages

Because developer messages take precedence over user and assistant messages, injecting untrusted input directly into developer messages gives attackers the highest degree of control. Pass untrusted inputs through user messages to limit their influence. This is especially important for workflows where user inputs are passed to sensitive tools or privileged contexts.

### Use Structured Outputs to Constrain Data Flow

Prompt injections often rely on the model freely generating unexpected text or commands that propagate downstream. By defining structured outputs between nodes (e.g., enums, fixed schemas, required field names), you eliminate freeform channels that attackers can exploit to smuggle instructions or data.

### Steer the Agent with Clear Guidance and Examples

Agent workflows may do something you don't want due to hallucination, misunderstanding, ambiguous user input, etc. For example, an agent may offer a refund it's not supposed to or delete information it shouldn't. The best way to mitigate this risk is to strengthen your prompts with good documentation of your desired policies and clear examples. Anticipate unintended scenarios and provide examples so the agent knows what to do in these cases.

### Use GPT-5 or GPT-5-mini

These models are more disciplined about following developer instructions and exhibit stronger robustness against jailbreaks and indirect prompt injections. Configure these models at the agent node level for a more resilient default posture, especially for higher-risk workflows.

### Keep Tool Approvals On

When using MCP tools, always enable tool approvals so end users can review and confirm every operation, including reads and writes. In Agent Builder, use the [human approval](https://platform.openai.com/docs/guides/node-reference#human-approval) node.

### Use Guardrails for User Inputs

Sanitize incoming inputs using built-in [guardrails](https://platform.openai.com/docs/guides/node-reference#guardrails) to redact personally identifiable information (PII) and detect jailbreak attempts. While the guardrails nodes in Agent Builder alone are not foolproof, they're an effective first wave of protection.

### Run Trace Graders and Evals

If you understand what models are doing, you can better catch and prevent mistakes. Use [evals](https://platform.openai.com/docs/guides/evaluation-getting-started) to evaluate and improve performance. Trace grading provides scores and annotations to specific parts of an agent's trace—such as decisions, tool calls, or reasoning steps—to assess where the agent performed well or made mistakes.

### Combine Techniques

By combining these techniques and hardening critical steps, you can significantly reduce risks of prompt injection, malicious tool use, or unexpected agent behavior.

Design workflows so untrusted data never directly drives agent behavior. Extract only specific structured fields (e.g., enums or validated JSON) from external inputs to limit injection risk from flowing between nodes. Use guardrails, tool confirmations, and variables passed via user messages to validate inputs.

Risk rises when agents process arbitrary text that influences tool calls. Structured outputs and isolation greatly reduce, *but don't fully remove*, this risk.

---

## Summary

OpenAI's Agent Builder is a powerful visual tool for creating multi-step agentic workflows with:

- **Visual canvas** for drag-and-drop workflow design
- **Multiple node types**: Core (Start, Agent, Note), Tools (File Search, Guardrails, MCP), Logic (If/Else, While, Human Approval), and Data (Transform, Set State)
- **Templates** for common patterns (homework helper, etc.)
- **Preview and debug** capabilities
- **Safety features** including guardrails and human approval nodes
- **Evaluation tools** with trace grading
- **Deployment options** via ChatKit or Agents SDK

### Key Safety Considerations:

1. Avoid untrusted variables in developer messages
2. Use structured outputs to constrain data flow
3. Provide clear guidance and examples in prompts
4. Use GPT-5 or GPT-5-mini for better robustness
5. Keep tool approvals enabled
6. Implement guardrails for user inputs
7. Run regular evals and trace graders
8. Combine multiple security techniques

### Access Points:

- **Agent Builder**: https://platform.openai.com/agent-builder
- **Documentation**: https://platform.openai.com/docs/guides/agent-builder
- **Node Reference**: https://platform.openai.com/docs/guides/node-reference
- **Safety Guide**: https://platform.openai.com/docs/guides/agent-builder-safety

---

*Note: This documentation was retrieved from OpenAI's platform on October 9, 2025, and represents the current state of Agent Builder at that time.*
