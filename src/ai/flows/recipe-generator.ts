'use server';

/**
 * @fileOverview Recipe generator flow that suggests recipes based on user provided ingredients and products from the store.
 *
 * - generateRecipe - A function that generates recipe suggestions.
 * - RecipeGeneratorInput - The input type for the generateRecipe function.
 * - RecipeGeneratorOutput - The return type for the generateRecipe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecipeGeneratorInputSchema = z.object({
  ingredients: z
    .string()
    .describe('A comma-separated list of ingredients the user has at home.'),
  availableProducts: z
    .string()
    .describe('A comma-separated list of products available in the store.'),
});
export type RecipeGeneratorInput = z.infer<typeof RecipeGeneratorInputSchema>;

const RecipeGeneratorOutputSchema = z.object({
  recipeName: z.string().describe('The name of the suggested recipe.'),
  ingredients: z.string().describe('A list of ingredients for the recipe.'),
  instructions: z.string().describe('Step-by-step instructions for the recipe.'),
  reasoning: z.string().describe('Reasoning why this recipe is well suited to the ingredients provided.'),
});
export type RecipeGeneratorOutput = z.infer<typeof RecipeGeneratorOutputSchema>;

export async function generateRecipe(input: RecipeGeneratorInput): Promise<RecipeGeneratorOutput> {
  return recipeGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recipeGeneratorPrompt',
  input: {schema: RecipeGeneratorInputSchema},
  output: {schema: RecipeGeneratorOutputSchema},
  prompt: `You are a world-class chef specializing in Indian cuisine. Given the ingredients a user has at home and the products available in our AndrAmrut Naturals store, suggest a delicious and creative recipe.

Remember our brand promise: "Every Taste Has A Story"

Available AndrAmrut Naturals products: {{{availableProducts}}}

Consider the available products to enhance the recipe and make it uniquely flavorful. Explain your reasoning for choosing this recipe based on the available ingredients and AndrAmrut Naturals products.

Please provide your response in the following format:
Recipe Name: [Name]
Ingredients: [List]
Instructions: [Step by step]
Reasoning: [Explanation of why this recipe is suitable and how AndrAmrut Naturals products enhance it]`,
});

const recipeGeneratorFlow = ai.defineFlow(
  {
    name: 'recipeGeneratorFlow',
    inputSchema: RecipeGeneratorInputSchema,
    outputSchema: RecipeGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
