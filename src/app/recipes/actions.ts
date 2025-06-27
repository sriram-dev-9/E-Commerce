"use server";

import { generateRecipe, RecipeGeneratorInput } from "@/ai/flows/recipe-generator";
import { z } from "zod";

const FormSchema = z.object({
    ingredients: z.string().min(3, "Please list at least one ingredient."),
    availableProducts: z.string(),
});

type State = {
    recipe: {
        recipeName: string;
        ingredients: string;
        instructions: string;
        reasoning: string;
    } | null;
    error: string | null;
}

export async function generateRecipeAction(prevState: State, formData: FormData): Promise<State> {
    const validatedFields = FormSchema.safeParse({
        ingredients: formData.get('ingredients'),
        availableProducts: formData.get('availableProducts'),
    });

    if (!validatedFields.success) {
        return {
            recipe: null,
            error: "Invalid form data. Please check your inputs.",
        };
    }

    try {
        const input: RecipeGeneratorInput = {
            ingredients: validatedFields.data.ingredients,
            availableProducts: validatedFields.data.availableProducts,
        };
        const recipeOutput = await generateRecipe(input);

        if (!recipeOutput) {
            return { recipe: null, error: "Failed to generate recipe. Please try again." };
        }

        return {
            recipe: {
                recipeName: recipeOutput.recipeName,
                ingredients: recipeOutput.ingredients,
                instructions: recipeOutput.instructions,
                reasoning: recipeOutput.reasoning,
            },
            error: null,
        };
    } catch (error) {
        console.error(error);
        return { recipe: null, error: "An unexpected error occurred. Please try again later." };
    }
}
