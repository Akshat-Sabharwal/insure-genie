import type { Message } from '../types';

interface AIContext {
  mode: 'claims' | 'recommendation';
  messages: Message[];
  documents: Array<{ name: string; id: string }>;
  userInput: string;
}

export async function generateAIResponse(context: AIContext): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const { mode, messages, documents, userInput } = context;

  if (mode === 'claims') {
    return generateClaimsResponse(userInput, documents, messages);
  } else {
    return generateRecommendationResponse(userInput, messages);
  }
}

function generateClaimsResponse(
  userInput: string,
  documents: Array<{ name: string; id: string }>,
  messages: Message[]
): string {
  if (messages.length === 0 || messages.filter(m => m.role === 'user').length === 1) {
    if (documents.length > 0) {
      return `Great! I've received your insurance document "${documents[0].name}". Let me help you file your claim.

Based on typical insurance claims, here's what I can help you with:

**Step-by-Step Claims Process:**

1. **Document Review** - I'll analyze your policy to understand your coverage
2. **Incident Details** - Tell me what happened and when
3. **Evidence Collection** - Gather photos, receipts, and relevant documentation
4. **Claim Submission** - I'll guide you through filling out the claim form
5. **Follow-up** - Track your claim status and communicate with your insurer

To get started, could you please tell me:
- What type of claim are you filing? (auto accident, home damage, health, etc.)
- When did the incident occur?
- Have you already contacted your insurance company?`;
    } else {
      return `I'm here to help you file your insurance claim. To provide the best guidance, I need to understand your situation better.

**Please tell me:**
- What type of insurance claim do you need to file? (auto, home, health, life, etc.)
- What happened that led to this claim?
- When did the incident occur?

If you have your insurance policy document, you can upload it using the "Upload Document" button above, and I'll help you understand your coverage and guide you through the claims process.`;
    }
  }

  const lowerInput = userInput.toLowerCase();

  if (lowerInput.includes('car') || lowerInput.includes('auto') || lowerInput.includes('accident')) {
    return `I understand you're filing an auto insurance claim. Here's the step-by-step process:

**Auto Insurance Claim Process:**

1. **Immediate Actions (If not done already):**
   - Ensure everyone's safety
   - Contact police if needed (get police report number)
   - Exchange information with other parties
   - Take photos of damage and accident scene

2. **Contact Your Insurer:**
   - Call within 24 hours: Use the claims hotline on your policy
   - Have ready: Policy number, date/time/location, other driver's info
   - Claim number will be assigned

3. **Documentation Needed:**
   - Photos of vehicle damage (all angles)
   - Police report copy
   - Witness contact information
   - Medical records if injuries occurred
   - Repair estimates

4. **Adjuster Meeting:**
   - Your insurer will assign a claims adjuster
   - They'll inspect your vehicle
   - Get multiple repair estimates if possible

5. **Resolution:**
   - Insurer approves repairs or totals vehicle
   - You receive settlement or authorization for repairs
   - Typical timeline: 7-30 days

**Important Tips:**
- Don't admit fault at the scene
- Keep all receipts for rental cars, medical visits
- Follow up weekly on claim status

Would you like me to help you prepare any specific documentation or answer questions about your coverage?`;
  }

  if (lowerInput.includes('home') || lowerInput.includes('property') || lowerInput.includes('house')) {
    return `I'll help you with your home insurance claim. Here's what you need to do:

**Home Insurance Claim Process:**

1. **Immediate Protection:**
   - Prevent further damage (tarp leaks, board windows)
   - Document EVERYTHING with photos/videos
   - Keep damaged items (insurer may need to see them)
   - Make emergency repairs (keep receipts)

2. **File Your Claim:**
   - Contact insurer within 48 hours
   - Provide: Policy number, date of loss, description
   - Ask about emergency living expenses if home is uninhabitable

3. **Documentation Required:**
   - Photos/videos of all damage
   - List of damaged/destroyed items with approximate values
   - Receipts for emergency repairs
   - Police/fire report if applicable
   - Contractor estimates for repairs

4. **Claims Adjuster Visit:**
   - Schedule inspection within 3-7 days
   - Walk through damage with adjuster
   - Provide your damage list and estimates
   - Take notes during inspection

5. **Settlement:**
   - Insurer sends initial payment (often partial)
   - Complete repairs with approved contractors
   - Submit final invoices
   - Receive remaining payment
   - Typical timeline: 2-8 weeks

**Common Coverage Areas:**
- Dwelling (structure itself)
- Personal property (contents)
- Additional living expenses (temporary housing)
- Liability (if someone injured on property)

What type of damage occurred to your home? This will help me provide more specific guidance.`;
  }

  if (lowerInput.includes('health') || lowerInput.includes('medical')) {
    return `Let me guide you through filing a health insurance claim:

**Health Insurance Claim Process:**

1. **Verify Coverage:**
   - Check if provider is in-network
   - Understand your deductible and co-pay
   - Confirm procedure is covered

2. **Most Common Scenarios:**

   **If Provider Files (Preferred):**
   - Healthcare provider submits claim directly
   - You receive Explanation of Benefits (EOB)
   - Pay remaining balance to provider

   **If You File:**
   - Get itemized bill from provider
   - Complete claim form from insurer
   - Attach medical records if required
   - Submit within deadline (usually 90 days)

3. **Documentation Needed:**
   - Itemized medical bills
   - Receipts for payments made
   - Prescription receipts
   - Medical records/diagnosis
   - Provider tax ID and license number

4. **Submission Methods:**
   - Online portal (fastest)
   - Mail to address on insurance card
   - Fax (keep confirmation)

5. **Follow-up:**
   - Claims processed in 30-45 days
   - Check EOB for approval/denial
   - Appeal if denied (you have rights!)

**Pro Tips:**
- Keep copies of everything
- Get pre-authorization for major procedures
- Understand difference between co-pay, co-insurance, and deductible
- Check EOB carefully for errors

What specific medical situation are you claiming for? I can provide more targeted guidance.`;
  }

  return `I'm here to help with your insurance claim. Based on what you've told me, I can provide specific guidance.

Could you provide more details about:
- The type of claim (auto, home, health, etc.)
- What happened and when
- What documentation you already have
- Any specific questions about the process

The more information you provide, the better I can guide you through filing your claim successfully. I can help you understand:
- Required documentation
- Steps to take
- Timeline expectations
- How to communicate with your insurer
- Your rights as a policyholder

What would be most helpful for you right now?`;
}

function generateRecommendationResponse(userInput: string, messages: Message[]): string {
  if (messages.length === 0 || messages.filter(m => m.role === 'user').length === 1) {
    return `I'm excited to help you find the right insurance coverage! To provide personalized recommendations, I need to understand your situation better.

**Let me know about:**
- What do you need insurance for? (new car, home, health, life, etc.)
- Your current situation (age, family status, location)
- Any existing insurance coverage
- Your budget considerations
- Specific concerns or priorities

The more details you share, the better I can match you with insurance options that truly fit your needs.

What brings you here today?`;
  }

  const lowerInput = userInput.toLowerCase();

  if (lowerInput.includes('car') || lowerInput.includes('auto') || lowerInput.includes('vehicle')) {
    return `Great! Let me help you find the right auto insurance for your new car.

**Auto Insurance Coverage Types:**

**Essential Coverage:**
1. **Liability Insurance** (Required in most states)
   - Bodily Injury: $50,000/$100,000 recommended
   - Property Damage: $50,000 minimum
   - Cost: $400-800/year

2. **Collision Coverage**
   - Covers damage to your car from accidents
   - Recommended for cars worth >$3,000
   - Cost: $300-1,000/year (varies by deductible)

3. **Comprehensive Coverage**
   - Covers theft, vandalism, weather, animals
   - Recommended for financed/leased vehicles
   - Cost: $150-500/year

**Additional Options:**
4. **Uninsured/Underinsured Motorist**
   - Protects if hit by uninsured driver
   - Highly recommended
   - Cost: $100-300/year

5. **Medical Payments/PIP**
   - Covers medical expenses regardless of fault
   - Cost: $50-200/year

6. **Rental Reimbursement**
   - Pays for rental while car is repaired
   - Cost: $30-60/year

**Recommended Package for New Car:**
- Full coverage: Liability + Collision + Comprehensive
- $500 deductible (good balance of premium vs out-of-pocket)
- Uninsured motorist coverage
- Estimated total: $1,200-2,500/year

**Money-Saving Tips:**
- Bundle with home insurance (10-25% discount)
- Good driver discount
- Safety features discount (anti-theft, airbags)
- Pay annually instead of monthly
- Increase deductible to lower premium

**Top Insurers to Consider:**
- State Farm (best customer service)
- GEICO (competitive rates)
- Progressive (good for high-risk drivers)
- USAA (if military eligible)

**Next Steps:**
1. Get quotes from 3-5 insurers
2. Compare coverage levels (not just price)
3. Check financial strength ratings
4. Read customer reviews
5. Ask about all applicable discounts

Can you tell me more about your car (make, model, year) and your driving history? I can provide more specific recommendations!`;
  }

  if (lowerInput.includes('home') || lowerInput.includes('house') || lowerInput.includes('property')) {
    return `Excellent! Home insurance is one of the most important investments you can make. Let me guide you through your options.

**Homeowners Insurance Coverage:**

**Core Coverage Types:**

1. **Dwelling Coverage (Coverage A)**
   - Protects structure of your home
   - Recommendation: Full replacement cost
   - Typical: $200,000-500,000+ depending on home value
   - Don't base on market value (land doesn't need coverage)

2. **Personal Property (Coverage C)**
   - Covers belongings inside home
   - Usually 50-70% of dwelling coverage
   - Choose replacement cost vs actual cash value
   - Create home inventory (important!)

3. **Liability Protection (Coverage E)**
   - Protects if someone injured on property
   - Minimum: $300,000 recommended
   - Better: $500,000-1,000,000
   - Covers legal fees and medical bills

4. **Additional Living Expenses (Coverage D)**
   - Pays for temporary housing if home uninhabitable
   - Usually 20% of dwelling coverage
   - Critical coverage - don't skip

**Important Considerations:**

**Deductible Options:**
- $500: Higher premium, lower out-of-pocket
- $1,000: Most common, good balance
- $2,500: Lower premium, affordable if emergency fund exists

**Special Additions:**
- Flood insurance (separate policy, highly recommended in flood zones)
- Earthquake coverage (separate in high-risk areas)
- Sewer/water backup (often excluded, add for $50-100/year)
- Valuables rider (jewelry, art, collectibles over limits)

**Estimated Costs:**
- Basic policy: $1,000-2,000/year
- Comprehensive: $1,500-3,500/year
- High-value homes: $3,000-10,000+/year

**Money-Saving Strategies:**
- Increase deductible
- Bundle with auto insurance (20-25% savings)
- Security system discount (5-20%)
- New home discount
- Claims-free discount
- Pay annually

**Red Flags to Avoid:**
- Too-low coverage amounts
- Actual cash value instead of replacement cost
- High deductibles you can't afford
- Missing flood coverage in flood zones

**Recommended Insurers:**
- Amica (highest customer satisfaction)
- State Farm (widespread availability)
- Chubb (high-value homes)
- USAA (military families)
- Lemonade (tech-forward, affordable)

**Next Steps:**
1. Determine home's replacement cost (not market value)
2. Inventory valuable possessions
3. Get quotes from 3-5 insurers
4. Check coverage details carefully
5. Verify insurer's financial strength (A.M. Best rating)

Tell me more about your home - is it new or existing? What's the approximate value? Any special features or concerns?`;
  }

  if (lowerInput.includes('health') || lowerInput.includes('medical')) {
    return `Health insurance is crucial for financial protection. Let me break down your options:

**Health Insurance Types:**

**1. Employer-Sponsored Plans**
   - Often most affordable option
   - Employer typically pays 70-80% of premium
   - Check annual enrollment period

**2. Individual/Family Plans (Marketplace)**
   - Healthcare.gov or state exchanges
   - May qualify for subsidies based on income
   - Open enrollment: November-January (usually)

**3. Short-Term Health Insurance**
   - Temporary coverage (3-12 months)
   - Lower cost but limited benefits
   - Doesn't cover pre-existing conditions
   - Use as gap coverage only

**Plan Types:**

**HMO (Health Maintenance Organization)**
- Lower premiums and out-of-pocket costs
- Must use network providers
- Need referrals for specialists
- Best for: Budget-conscious, healthy individuals

**PPO (Preferred Provider Organization)**
- Higher premiums
- More provider flexibility
- No referrals needed
- Out-of-network coverage available
- Best for: Those wanting choice and flexibility

**EPO (Exclusive Provider Organization)**
- Middle ground between HMO and PPO
- No referrals needed
- Must stay in network
- Best for: Balance of cost and flexibility

**HDHP with HSA (High Deductible Health Plan)**
- Lowest premiums
- High deductible ($1,500+ individual)
- HSA tax advantages (triple tax benefit!)
- Best for: Healthy individuals with emergency funds

**Metal Tiers (Marketplace):**

- **Bronze**: Lowest premium, highest out-of-pocket (60% coverage)
- **Silver**: Moderate premium and out-of-pocket (70% coverage)
- **Gold**: Higher premium, lower out-of-pocket (80% coverage)
- **Platinum**: Highest premium, lowest out-of-pocket (90% coverage)

**Key Terms to Understand:**

- **Premium**: Monthly payment
- **Deductible**: Amount you pay before insurance kicks in
- **Co-pay**: Fixed amount per visit
- **Co-insurance**: Percentage you pay after deductible
- **Out-of-pocket max**: Maximum you'll pay in a year

**Typical Costs:**
- Individual: $450-600/month (unsubsidized)
- Family: $1,200-1,800/month (unsubsidized)
- Subsidies can reduce dramatically based on income

**What to Consider:**
1. Your health needs (chronic conditions, prescriptions)
2. Preferred doctors (are they in network?)
3. Budget (balance premium vs potential costs)
4. Prescription coverage
5. Family needs

**Pro Tips:**
- Choose plan based on expected healthcare usage
- Check prescription drug formulary
- Verify provider networks
- Consider total cost (premium + likely out-of-pocket)
- Utilize HSA if eligible (free money!)

Tell me more about your situation:
- Are you employed with benefits option?
- Any ongoing health conditions?
- Family coverage needed?
- Budget considerations?

This will help me recommend the best approach for you!`;
  }

  if (lowerInput.includes('life') || lowerInput.includes('life insurance')) {
    return `Life insurance is an important financial safety net for your loved ones. Let me explain your options:

**Types of Life Insurance:**

**1. Term Life Insurance** (Most Common)
- Coverage for specific period (10, 20, 30 years)
- Most affordable option
- No cash value
- Best for: Most people, especially young families

**Typical Costs (Healthy 30-year-old):**
- $250,000/20 years: $15-25/month
- $500,000/20 years: $25-40/month
- $1,000,000/20 years: $40-70/month

**2. Whole Life Insurance**
- Lifetime coverage
- Builds cash value
- 10-15x more expensive than term
- Best for: Estate planning, high net worth

**3. Universal Life Insurance**
- Flexible premiums and death benefit
- Cash value with interest
- More complex
- Best for: Those wanting flexibility

**How Much Coverage Do You Need?**

**Quick Formula:**
10x annual income + debts + future needs

**Example for $60,000 salary:**
- Income replacement: $600,000
- Mortgage: $200,000
- College fund (2 kids): $200,000
- Final expenses: $20,000
- **Total needed: $1,020,000**

**Better Approach - Calculate Needs:**

**Add up:**
- Annual income x years until kids independent
- Outstanding debts (mortgage, car loans)
- College education costs
- Final expenses ($10,000-15,000)
- Emergency fund for family

**Subtract:**
- Existing savings
- Current life insurance
- Social Security survivor benefits

**When You Need Life Insurance:**
- Getting married
- Having children
- Buying a home
- Starting a business
- Anyone depends on your income

**When You May Not Need It:**
- No dependents
- Sufficient assets to cover needs
- Retired with adequate savings

**Factors Affecting Cost:**
- Age (younger = cheaper)
- Health (better health = lower rates)
- Smoking status (huge impact)
- Coverage amount
- Term length
- Occupation (some higher risk)

**Application Process:**
1. Get quotes (no obligation)
2. Apply online or with agent
3. Medical exam (often required over $250k)
4. Underwriting review (2-6 weeks)
5. Approval and coverage starts

**Money-Saving Tips:**
- Buy when young and healthy
- Choose term over whole (unless specific need)
- Compare multiple insurers
- Bundle with other insurance
- Improve health before applying (stop smoking 12 months prior)
- Annual vs monthly payment

**Top-Rated Insurers:**
- Northwestern Mutual (strongest financially)
- MassMutual (excellent customer service)
- State Farm (good for bundling)
- Haven Life (100% online, fast approval)
- Ladder (flexible coverage amounts)

**Red Flags to Avoid:**
- Buying at work only (usually insufficient)
- Whole life when term would work
- Not shopping around
- Waiting until you need it (costs rise)

Tell me about your situation:
- Do you have dependents?
- What's your annual income?
- Any major debts?
- Age and general health?

I can help you determine the right coverage amount and type!`;
  }

  return `I'd love to help you find the right insurance! Insurance is essential for protecting yourself financially from unexpected events.

**Common Insurance Types I Can Help With:**

1. **Auto Insurance** - For your vehicle
2. **Homeowners/Renters Insurance** - For your property
3. **Health Insurance** - For medical expenses
4. **Life Insurance** - For your family's financial security
5. **Disability Insurance** - For income protection
6. **Umbrella Insurance** - For additional liability protection

**To Give You the Best Recommendation:**

Please tell me:
- What type of insurance are you interested in?
- What's your current situation? (just bought a car, new home, starting family, etc.)
- Do you have any existing coverage?
- Any specific concerns or priorities?
- Your approximate budget

Each type of insurance has different coverage options, and I can help you understand:
- What coverage you actually need
- How much it typically costs
- Ways to save money
- Best insurers for your situation
- How to compare quotes effectively

What would you like to explore first?`;
}
