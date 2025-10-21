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
  detect: `Prompt explaining the 2-step process and giving instructions.`,
  select: `Prompt saying it's step 2 and that the AI needs to select the most relevant food items.`,
};
