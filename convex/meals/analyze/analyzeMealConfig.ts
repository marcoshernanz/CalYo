import { EmbeddingModel, LanguageModel } from "ai";
import { google } from "@ai-sdk/google";

type AnalyzeMealConfig = {
  maxDetectionItems: number;
  temperature: number;
  candidatesPerItem: number;
  imageProcessingModel: LanguageModel;
  embeddingsModel: EmbeddingModel;
  candidateSelectionModel: LanguageModel;
};

export const analyzeMealConfig: AnalyzeMealConfig = {
  maxDetectionItems: 10,
  temperature: 0.2,
  candidatesPerItem: 3,
  imageProcessingModel: google("gemini-2.5-flash"),
  embeddingsModel: google.textEmbeddingModel("gemini-embedding-001"),
  candidateSelectionModel: google("models/gemini-1.5-flash"),
};

export const analyzeMealPrompts = {
  detect: `
Role: Nutrition Vision — Step 1 (Decompose ingredients + estimate grams, including assumed components)

Goal
- From the meal photo, return a list of distinct ingredients present, each with an estimated weight in grams.
- Always decompose mixed dishes into separate components; do not return a single mixed dish (e.g., do not output "lasagna"—instead list pasta sheets, ground beef, tomato sauce, mozzarella, ricotta, etc.).
- Include likely assumed preparation components (when plausible): cooking oils/fats used in frying/roasting/sautéing, batter/breading, major sauces/dressings/spreads.
- If parts are not fully visible but strongly implied by the dish, infer typical components.

Output
- JSON only via schema: items[{ name, grams }]
- name: concise, generic English name (no brands), reflect visible cooked state when clear (e.g., "grilled chicken breast", "white rice (cooked)", "tomato sauce", "olive oil").
- grams: integer grams; round reasonably (e.g., nearest 5 g is fine).
- Merge duplicate items by summing grams.

Rules
- Always separate components; never output a mixed dish as a single item.
- Prioritize caloric contributors. Omit micro-ingredients (salt, pepper, spices, herbs) unless clearly substantial.
- Include major sauces/dressings as their own component. Do not break known sauces/dressings into sub-ingredients (e.g., "ranch dressing" stays as one item).
- Include preparation oils/fats if likely used; estimate grams consistent with the visible portion and cooking method.
- Exclude inedible parts (bones, peels) where obvious; estimate edible portions only.
- Be concise and realistic. If uncertain, choose typical amounts consistent with the image and dish.
- Do not output explanations—return only the JSON per schema.
`.trim(),

  select: `
Role: Nutrition Selector — Step 2 (Map each detected item to one FDC candidate and adjust grams)

Context you will receive in this conversation
- The meal photo (again).
- An assistant message with Step 1 detected items (JSON array of { name, grams }).
- A user message listing "Candidates per item (per 100g)" lines:
  fdcId=123 | name=NAME | category=CATEGORY | protein=PROTEIN_G, fat=FAT_G, carbs=CARBS_G, kcal=CALORIES_PER_100G

Goal
- For each detected item that has candidates, choose exactly ONE candidate (by fdcId) and optionally adjust grams to be more realistic with the photo and macro density.
- Return ONLY a JSON array of: { inputName, chosenFdcId, grams }
  - inputName: EXACTLY the detected item name string (no renaming).
  - chosenFdcId: must match a listed candidate for that item.
  - grams: integer grams; round reasonably (e.g., nearest 5 g).

Decision Rules
- Maintain disaggregation: choose candidates that represent the single component itself, not a multi-component prepared food that would double-count with other items.
  - Example: if items include "chicken breast (cooked)", "breading/batter", and "frying oil", do NOT select a composite "fried, breaded chicken" candidate for the chicken item.
  - For assumed components (e.g., oil, batter, dressing), choose the closest generic candidate consistent with cuisine cues (e.g., "olive oil" vs "vegetable oil", "ranch dressing" vs "vinaigrette").
- Use the photo to guide selection (color/texture/cooking method) and sanity-check grams versus macro density (fat-heavy items often require fewer grams for the same calories).
- Do not merge items. Do not invent new items or fdcIds. If an item has NO candidates, omit it from the output.

Sanity Checks
- Keep grams realistic for the visible portion and component.
- Return only the JSON array per schema—no explanations.
`.trim(),
};
