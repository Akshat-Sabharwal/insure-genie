import type { Message } from "../types";

interface AIContext {
  mode: "claims" | "recommendation";
  messages: Message[];
  documents: Array<{ name: string; id: string }>;
  userInput: string;
}

const INITIAL_CLAIMS_RESPONSE = `I'm here to help you file your insurance claim. Tell me:

- What type of claim? (auto, home, health, etc.)
- What happened and when?
- Any documents uploaded?

I'll guide you through the process step-by-step.`;

const INITIAL_RECOMMENDATION_RESPONSE = `I'd love to help you find the right insurance. Tell me:

- What do you need insurance for?
- Your situation (age, family, location)
- Any existing coverage
- Budget considerations

The more details, the better.`;

const AUTO_RECOMMENDATION_RESPONSE = `Auto insurance guidance:

- Liability, collision, and comprehensive are core coverages.
- Consider uninsured motorist and medical payments.
- Tips: bundle policies, maintain a good driving record, compare quotes.`;

const HOME_RECOMMENDATION_RESPONSE = `Home insurance guidance:

- Cover dwelling, personal property, liability, and additional living expenses.
- Consider flood/earthquake riders where relevant.
- Tips: inventory valuables, compare replacement cost vs actual cash value.`;

const HEALTH_RECOMMENDATION_RESPONSE = `Health insurance guidance:

- Employer plans, marketplace plans, and short-term options exist.
- Check premium, deductible, network, and prescription coverage.
- Use HSA-eligible plans if appropriate.`;

const LIFE_RECOMMENDATION_RESPONSE = `Life insurance guidance:

- Term life is affordable for income replacement.
- Whole/universal have cash value but are more expensive.
- Determine coverage based on income, debts, and future needs.`;

export async function generateAIResponse(context: AIContext): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const { mode, messages, documents, userInput } = context;
  const input = (userInput || "").toLowerCase();
  const userCount = messages.filter((m) => m.role === "user").length;

  if (mode === "claims") {
    if (userCount <= 1) {
      if (documents && documents.length > 0) {
        return `Received document "${documents[0].name}". ${INITIAL_CLAIMS_RESPONSE}`;
      }
      return INITIAL_CLAIMS_RESPONSE;
    }

    if (
      input.includes("car") ||
      input.includes("auto") ||
      input.includes("accident")
    ) {
      return `Auto claim helper: ${AUTO_RECOMMENDATION_RESPONSE}`;
    }
    if (
      input.includes("home") ||
      input.includes("house") ||
      input.includes("property")
    ) {
      return `Home claim helper: ${HOME_RECOMMENDATION_RESPONSE}`;
    }
    if (input.includes("health") || input.includes("medical")) {
      return `Health claim helper: ${HEALTH_RECOMMENDATION_RESPONSE}`;
    }

    return `I'm here to help with your claim. Provide: type, what happened, when, and any documents.`;
  }

  // recommendation mode
  if (userCount <= 1) return INITIAL_RECOMMENDATION_RESPONSE;

  if (
    input.includes("car") ||
    input.includes("auto") ||
    input.includes("vehicle")
  ) {
    return AUTO_RECOMMENDATION_RESPONSE;
  }
  if (
    input.includes("home") ||
    input.includes("house") ||
    input.includes("property")
  ) {
    return HOME_RECOMMENDATION_RESPONSE;
  }
  if (input.includes("health") || input.includes("medical")) {
    return HEALTH_RECOMMENDATION_RESPONSE;
  }
  if (input.includes("life") || input.includes("life insurance")) {
    return LIFE_RECOMMENDATION_RESPONSE;
  }

  return `What type of insurance interests you? (auto, home, health, life)`;
}
