# Quick Evaluation — V1 Structure

> **Purpose:** Define the first version of Worth It's Quick Evaluation before building the UI, data model and calculation functions.
>
> **Status:** Draft implementation plan. Decisions marked **V1 proposal** are the recommended starting point and can be adjusted after testing.

## Product principles

- Quick Evaluation must be available to **registered and guest users**. Registration must never be required to complete an evaluation.
- Keep the three areas separate: **Financial**, **Learning** and **Satisfaction**.
- Show each area's result independently. User priorities affect **only the total result**, never the individual area results.
- Let users exclude any area they do not want to evaluate. An excluded area is omitted, not treated as a score of zero.
- Keep the calculations independent of the UI and Firebase so they can be tested and changed easily.
- Treat the total score as a **personalised assessment**, not an objective judgement of a job.
- Keep V1 simple. Test it with real examples before adding more variables or complex benchmarks.

---

# 1. Evaluation areas

## 1.1 Financial

**Goal:** Calculate how much the job effectively pays for every hour the person commits to it.

### Inputs

- **Net income:** Total income from the job after taxes. Include regular pay, bonuses, tips, commissions and other job income.
- **Benefits value (optional):** Monetary value of benefits that genuinely save the user money, such as free meals or accommodation.
- **Job-related expenses:** Additional costs caused by having this job, such as commuting, extra food, equipment or uniforms.
- **Total committed hours:** Actual working hours, commuting, required work at home and other required unpaid job-related time.
- **Minimum acceptable hourly earnings:** The user's personal minimum effective net hourly rate. This is needed to calculate the financial suitability score, but not to calculate the actual hourly earnings.

### Calculation

```text
Effective net hourly earnings =
  (Net income + Benefits value - Job-related expenses)
  / Total committed hours
```

### Rules

- All financial amounts must use the **same currency and the same period**. Total hours must cover that same period.
- Benefits should be counted only when they have a realistic monetary value to the user. Do not count the same saving as both a benefit and an expense.
- Count only additional expenses caused by the job, not ordinary personal expenses that would exist anyway.
- The total committed hours must include unpaid time required by the job.
- Do not calculate a result if total committed hours are zero or invalid.
- Keep the raw hourly result visible, even if it is negative or below the user's target.

### V1 financial score proposal

Use the user's **minimum acceptable hourly earnings** as the personal benchmark:

```text
Financial score = clamp(
  (Effective net hourly earnings / Minimum acceptable hourly earnings) * 100,
  0,
  100
)
```

- A result below the minimum target scores proportionally (e.g. 50% of the target = 50 points).
- Meeting or exceeding the target gives 100 points.
- The score is capped at 100, but the actual hourly earnings are always displayed. Therefore, users can still distinguish between two jobs that both meet their minimum but pay different amounts.
- The minimum target must be greater than zero and use the same currency as the financial inputs. If a saved profile target uses another currency, do not compare the values until the user updates the target or a verified currency conversion is deliberately added in a later version.
- If no minimum target is available, show the calculated hourly earnings but **do not invent a financial score or a Worth It verdict**.
- Do not use a country's legal minimum wage or average salary as the user's personal target in V1. There is no universal rate that makes a job worthwhile for everyone.

**Possible later improvement:** Let users define both a minimum and an ideal hourly target, giving more scoring detail above the minimum. Do not add this complexity until V1 has been tested.

## 1.2 Learning and career growth

**Goal:** Evaluate whether the job helps the user develop skills, progress professionally or make useful connections.

Use a 1–5 rating for each of these three questions:

1. **New skills:** How much useful knowledge or how many transferable skills am I developing?
2. **CV and career relevance:** How useful is this job for my CV, chosen career, experience or next career step?
3. **Networking:** How much opportunity does this job give me to meet useful professional contacts, mentors or collaborators?

Also include one separate indicator:

- **Academic credits / placement requirement:** `Yes`, `No` or `Not applicable`.
- This is useful information, but it is **not included in the Learning score**. It records whether the job fulfils a requirement rather than rating the quality of the learning experience.

### Five-star descriptions — Learning

Use the following descriptions for the relevant question. The user should be able to see the descriptions before choosing a rating; do not show only generic words such as “Poor” or “Good”.

| Rating | New skills | CV and career relevance | Networking |
|---|---|---|---|
| **1** | I am not learning useful skills; the work is repetitive and offers no development. | The job has no meaningful connection to my CV or career direction. | I have virtually no useful professional contact or opportunity to meet relevant people. |
| **2** | I learn something new only rarely; development is very limited. | The job has only a weak connection to my career and offers little useful experience. | I meet very few relevant people; interactions are mostly superficial. |
| **3** | I learn some useful skills, but opportunities to practise or improve are occasional. | The job provides some relevant experience or could add something useful to my CV. | I meet some potentially useful people, but meaningful contact is limited. |
| **4** | I regularly learn and practise useful skills that improve my abilities. | The job is clearly relevant and builds experience that supports my career direction. | I regularly meet relevant people and have opportunities to build professional relationships. |
| **5** | I develop significant, transferable skills and can clearly see my abilities progressing. | The job is a strong step towards my career goals and creates valuable future opportunities. | I build strong professional connections, have access to mentors or can identify real career opportunities. |

## 1.3 Satisfaction

**Goal:** Evaluate the user's everyday experience and how sustainable the job is for their personal life.

Use a 1–5 rating for each of these four questions:

1. **Colleagues:** How friendly, respectful and supportive are the people I work with?
2. **Management:** How respectful, fair, clear and supportive is my management?
3. **Work-life balance:** How well does the job fit around my personal life and responsibilities?
4. **Manageable stress:** How manageable and sustainable is the workload and stress?

A higher rating must always mean a better experience. For stress, rate **how manageable it is**, not how stressful it is.

### Five-star descriptions — Satisfaction

| Rating | Colleagues | Management | Work-life balance | Manageable stress |
|---|---|---|---|---|
| **1** | The environment is hostile or isolating; colleagues are often disrespectful and provide no support. | Management is consistently disrespectful or unfair, communicates poorly and does not address problems. | Work regularly takes over my personal life; I cannot maintain necessary rest or personal commitments. | Stress is overwhelming most of the time and regularly affects my wellbeing or life outside work. |
| **2** | Colleagues are often unfriendly or unhelpful; support is rare. | Communication and support are poor; expectations or decisions are often unclear or unfair. | Work frequently disrupts my personal life and makes it difficult to plan or recover. | Stress is frequently high and difficult to manage; recovery is often insufficient. |
| **3** | Relationships are generally civil, but support and friendliness are mixed or inconsistent. | Management is adequate, but communication, fairness or support can be inconsistent. | The balance is generally manageable, although work sometimes requires personal sacrifices. | Stress is moderate or periodic; I can usually manage it, although some periods are difficult. |
| **4** | Colleagues are friendly, respectful and supportive most of the time. | Management is usually respectful, fair, clear and helpful. | Hours and expectations usually leave enough time for personal life and responsibilities. | Stress is usually manageable, and I have enough support and recovery time. |
| **5** | Colleagues are consistently welcoming, respectful, collaborative and dependable. | Management consistently communicates well, treats people fairly, provides support and addresses concerns. | The job has sustainable boundaries and flexibility; my personal life is consistently well supported. | Workload and stress are consistently sustainable; pressure is manageable and does not regularly affect my wellbeing. |

## Advanced Evaluation only

Do **not** include these in Quick Evaluation V1. Consider them for a later Advanced Evaluation:

- Paid holidays, sick pay and parental/maternity/paternity leave.
- Pension, health insurance and other employment benefits.
- Contract stability, guaranteed hours and job security.
- Schedule flexibility, remote work and working conditions.
- Promotion opportunities and long-term career prospects.
- Relocation, moving away from home and distance from family or friends.
- Other personal circumstances or costs that need a more detailed assessment.

---

# 2. Individual area results

Each selected area must have its own result. These results are calculated **before** applying user priorities.

## 2.1 Financial result

Display:

- **Effective net hourly earnings**, including currency (e.g. `€12.40/hour`).
- A concise breakdown of income, benefits, expenses and committed hours, where useful.
- The user's minimum acceptable hourly target.
- Whether the result is **below** or **meets/exceeds** that target.
- Financial score out of 100, when a valid target is available.

The actual hourly earnings are the main financial result. The score represents how well the job meets the user's personal minimum, not how much the job pays compared with everyone else's job.

## 2.2 Learning result

Display:

- Average rating out of 5 (e.g. `4.0 / 5`).
- Number of answered/scored questions (e.g. `3 of 3`).
- Academic credits / placement requirement indicator separately.

Calculate the average from the valid 1–5 ratings. If an individual question is marked `Not applicable`, exclude it from the average rather than treating it as zero. Make the number of scored questions visible so the result has context. At least one question must have a valid rating; if all questions are `Not applicable` or unanswered, the area is incomplete and cannot contribute to the total.

## 2.3 Satisfaction result

Display:

- Average rating out of 5 (e.g. `3.5 / 5`).
- Number of answered/scored questions (e.g. `4 of 4`).

Calculate the average from the valid 1–5 ratings. If a question is marked `Not applicable`, exclude it from the average rather than treating it as zero. Make the number of scored questions visible. At least one question must have a valid rating; if all questions are `Not applicable` or unanswered, the area is incomplete and cannot contribute to the total.

## Normalising Learning and Satisfaction for the total score

The area result can display its natural average out of 5. For the weighted total, convert it to a 0–100 score:

```text
Normalised area score = ((Average rating - 1) / 4) * 100
```

This maps 1 star to 0, 3 stars to 50 and 5 stars to 100. Keep the displayed average out of 5; use the normalised value only for the total calculation.

---

# 3. Total result

## 3.1 User priorities and included areas

Users decide which areas matter to them. Priorities affect **only the total result**.

### V1 proposal for registered and guest users

- All areas are included by default, with equal weights.
- The user can exclude Financial, Learning or Satisfaction. At least one area must remain selected.
- The user can adjust the weights of the included areas. Weights must be non-negative and normalised to total 100% across the included areas.
- If an area is excluded, do not score it as zero. Redistribute/normalise the remaining weights across the included areas.
- A single included area receives 100% of the total weight.
- Changing weights must never change the underlying Financial, Learning or Satisfaction result.

**Registered users:** Use saved profile priorities as the initial preferences when available. Allow an evaluation-specific override. Save the preferences in the profile only when the user chooses to update them.

**Guest users and registered users without saved preferences:** Use equal weights by default. Let them customise the current evaluation without signing in. Do not block the evaluation because no profile settings exist. Persisting guest preferences across sessions can be considered later; it is not required for V1.

Save a snapshot of the included areas, weights and financial target with each saved evaluation. Future profile changes must not silently change the result of an older evaluation.

## 3.2 Overall score calculation

Every included area must have a valid 0–100 score before an overall score can be calculated.

```text
Overall score =
  (Financial score * Financial weight)
  + (Learning score * Learning weight)
  + (Satisfaction score * Satisfaction weight)
```

Weights are represented as fractions in this calculation (e.g. 50% = 0.5) and must add up to 1 after normalisation. Omit excluded areas entirely.

If a selected area does not have a valid score, show the available individual results but do not present a misleading overall score or verdict. For example, if Financial is selected but no minimum acceptable hourly target is available, show the effective hourly earnings and ask the user to set a target before producing the total result.

## 3.3 Worth It verdict

Display both:

- A numeric score out of 100, useful for comparing evaluations.
- A clear descriptive verdict.

Proposed verdict labels:

| Score band | Verdict |
|---:|---|
| 0–39 | Not worth it! |
| 40–54 | Probably not worth it |
| 55–69 | It depends |
| 70–84 | Worth it! |
| 85–100 | Definitely worth it! |

**These score boundaries are provisional.** Test them with realistic examples before treating them as final. The verdict is personalised: it reflects the areas the user selected, the weights they chose and their financial target.

## 3.4 Comparison and transparency

- Always show the three individual area results alongside the total result.
- Show which areas were included and the weights used.
- Keep the raw effective hourly earnings visible; do not make the overall score the only comparison value.
- A total score is most comparable with another evaluation made using the same included areas, priorities, financial target and scoring rules. If Financial is excluded, make it clear that the result does not assess financial value.
- Store the evaluation's scoring/version information so results can be interpreted if the algorithm changes later.
- Do not imply that a personalised score is an objective rating of the job or that it is directly comparable with every other user's score.

---

# 4. Functions to implement

Keep these as **pure TypeScript functions**: no React hooks, UI code, Firebase reads/writes or navigation inside the calculation functions. They should accept data and return results. This makes them reusable and straightforward to unit test.

## Core functions

- [ ] `validateQuickEvaluationInput(input)`
  - Check required values, valid numbers, non-negative expenses/benefit values, positive total hours, valid ratings, valid currency/period consistency and a positive financial target when a financial score is requested.
  - Return clear validation errors; do not silently replace invalid values with zero.

- [ ] `calculateEffectiveHourlyEarnings(financialInput)`
  - Calculate `(netIncome + benefitsValue - expenses) / totalCommittedHours`.
  - Return the raw hourly result. Reject invalid or zero hours.

- [ ] `calculateFinancialScore(effectiveHourlyEarnings, minimumAcceptableHourlyEarnings)`
  - Apply the V1 minimum-target formula and clamp the score between 0 and 100.
  - Also return whether the hourly earnings meet the user's minimum target.

- [ ] `calculateLearningScore(learningRatings)`
  - Average valid 1–5 ratings for new skills, CV/career relevance and networking.
  - Exclude `Not applicable` values and return the average plus the number of scored questions.

- [ ] `calculateSatisfactionScore(satisfactionRatings)`
  - Average valid 1–5 ratings for colleagues, management, work-life balance and manageable stress.
  - Exclude `Not applicable` values and return the average plus the number of scored questions.

- [ ] `normaliseRatingScore(averageRating)`
  - Convert an average from 1–5 to the 0–100 scale used by the total result: `((averageRating - 1) / 4) * 100`.

- [ ] `normaliseAreaWeights(includedAreas, selectedWeights)`
  - Use equal weights when no user preferences exist.
  - Ignore excluded areas and normalise the remaining weights so they total 100%.
  - Handle the one-area case and reject a configuration with no included areas or no usable positive weight.

- [ ] `calculateOverallScore(areaScores, normalisedWeights)`
  - Calculate the weighted average of the included areas' 0–100 scores.
  - Do not treat a missing score as zero. Return a clear incomplete result when an included area has no valid score.

- [ ] `getWorthItVerdict(overallScore)`
  - Convert the score into one of the proposed verdict labels.
  - Keep the score boundaries in one place so they can be adjusted after testing.

- [ ] `calculateQuickEvaluationResult(input)`
  - Orchestrate the functions above and return the complete result: individual area results, included areas, normalised weights, overall score and verdict (when available), plus any validation/incomplete-state information.

## Suggested result shape

The exact TypeScript interfaces can be finalised during implementation. The result should conceptually contain:

```ts
{
  financial: {
    effectiveHourlyEarnings: number;
    minimumTarget?: number;
    meetsMinimumTarget?: boolean;
    score?: number;
  };
  learning: {
    averageRating: number;
    scoredQuestions: number;
    academicRequirement: "yes" | "no" | "notApplicable";
    scoreForTotal: number;
  };
  satisfaction: {
    averageRating: number;
    scoredQuestions: number;
    scoreForTotal: number;
  };
  includedAreas: Array<"financial" | "learning" | "satisfaction">;
  weights: {
    financial?: number;
    learning?: number;
    satisfaction?: number;
  };
  overallScore?: number;
  verdict?: string;
  calculationVersion: number;
}
```

The actual result should only include scores for areas that are selected and valid. The example is a guide to the information we need, not a requirement to use exactly this interface.

---

# 5. Implementation checklist

## Product and UX

- [ ] Confirm the final input labels and helper text for the Financial area.
- [ ] Decide how the financial input period is selected and make sure income, benefits, expenses and hours refer to the same period.
- [ ] Add the minimum acceptable hourly earnings input and explain why it is needed.
- [ ] Confirm the Learning and Satisfaction question wording.
- [ ] Display the specific five-star descriptions beside each rating question.
- [ ] Add the academic credits / placement requirement indicator separately from the Learning score.
- [ ] Let users include or exclude each area.
- [ ] Let users set priorities for included areas and show the resulting weights clearly.
- [ ] Provide equal-weight defaults for guests and users without saved preferences.
- [ ] Show separate area results before the total result.
- [ ] Show the overall score and descriptive verdict only when all included areas have valid scores.
- [ ] Clearly explain that the overall verdict is based on the user's selected areas, weights and personal financial target.

## Logic and data

- [ ] Define TypeScript input and result types.
- [ ] Implement and unit test the pure calculation functions.
- [ ] Store a snapshot of the financial target, included areas, weights and calculation version with each evaluation.
- [ ] Load registered users' saved preferences when available, without making them mandatory.
- [ ] Ensure guest evaluation works without authentication or profile settings.
- [ ] Ensure profile preference changes do not rewrite historical evaluation results.

## Test cases

- [ ] Income, benefits, expenses and hours produce the expected effective hourly earnings.
- [ ] Benefits and expenses cannot double-count the same saving/cost.
- [ ] Zero or invalid hours produce a validation error.
- [ ] Expenses greater than income produce a negative raw hourly result and a financial score of zero (when a valid target exists).
- [ ] Missing financial target still shows hourly earnings but does not produce a financial score or final verdict when Financial is included.
- [ ] Ratings of 1, 3 and 5 produce the expected averages and normalised scores.
- [ ] `Not applicable` ratings are excluded from averages.
- [ ] Equal weights are applied when no preferences exist.
- [ ] Excluding an area redistributes the remaining weights correctly.
- [ ] Evaluating only one area gives that area 100% of the total weight.
- [ ] Changing weights changes the overall score but does not change any individual area score.
- [ ] A missing score in an included area prevents a misleading overall score.
- [ ] Verdict boundaries return the correct labels.
- [ ] A historical evaluation keeps its original target, weights and calculation version after profile preferences change.

---

# 6. V1 decisions to revisit after testing

- [ ] Are the financial target and financial score understandable to users?
- [ ] Does the minimum-target financial scoring formula give useful comparisons, or should V2 add an ideal hourly target?
- [ ] Are the five-star descriptions clear and distinct enough in real use?
- [ ] Are equal default weights appropriate for first-time users?
- [ ] Are the proposed overall score bands and verdict labels meaningful?
- [ ] Does the total score help users compare jobs without hiding important differences between areas?
- [ ] Should guest preferences be saved locally between sessions?
- [ ] Which Advanced Evaluation factors are most valuable to add next?

**V1 principle:** Build the simplest transparent version, test it with different types of jobs and user priorities, then adjust the scoring rules based on what the results actually communicate.



1 Finalise TypeScript data models – preferences, evaluation inputs, area results and overall result.
2 Build calculation functions – financial earnings, learning score, 
  satisfaction score, weighted total   and final verdict.
3 Write calculation tests – verify formulas, weights, missing values and edge cases.
4 Build the personalisation screen – main goal, priorities, optional hourly target and currency.
5 Build the Quick Evaluation form – Financial, Learning and Satisfaction, 
  with clear rating descriptions.
6 Build the results screen – three separate area results plus overall score and verdict.
  Include Save and Share actions on the results page.
7 Implement data persistence – registered-user preferences and saved evaluation 
  snapshots, while keeping guest access. Persist saved evaluations for registered users.
8 Test the complete flow – different priorities, excluded areas, financial scenarios and comparisons
