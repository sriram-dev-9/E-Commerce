"use client";

import { useState, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { generateRecipeAction } from "./actions";
import { fetchProducts } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, ChefHat } from "lucide-react";

type Recipe = {
  recipeName: string;
  ingredients: string;
  instructions: string;
  reasoning: string;
} | null;

const initialState: { recipe: Recipe; error: string | null } = {
  recipe: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        "Generate Recipe"
      )}
    </Button>
  );
}

function RecipeDisplay({ recipe }: { recipe: Recipe }) {
    if (!recipe) return null;
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-3xl text-primary">{recipe.recipeName}</CardTitle>
                <CardDescription>{recipe.reasoning}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-headline text-xl mb-2">Ingredients</h3>
                    <p className="whitespace-pre-line text-muted-foreground">{recipe.ingredients}</p>
                </div>
                <div>
                    <h3 className="font-headline text-xl mb-2">Instructions</h3>
                    <p className="whitespace-pre-line text-muted-foreground">{recipe.instructions}</p>
                </div>
            </CardContent>
        </Card>
    )
}

export default function RecipesPage() {
  const [state, formAction] = useFormState(generateRecipeAction, initialState);
  const [availableProducts, setAvailableProducts] = useState("");

  useEffect(() => {
    async function loadProducts() {
      const products = await fetchProducts();
      setAvailableProducts(products.map(p => p.name).join(", "));
    }
    loadProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <ChefHat className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="font-headline text-5xl mb-2">AI Recipe Suggester</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Tell us what ingredients you have, and our AI chef will suggest a delicious recipe using our authentic products.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div>
          <form action={formAction}>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Your Ingredients</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="ingredients">List the ingredients you have at home</Label>
                  <Textarea
                    id="ingredients"
                    name="ingredients"
                    placeholder="e.g., chicken, onions, tomatoes, yogurt"
                    rows={5}
                    required
                  />
                </div>
                <input type="hidden" name="availableProducts" value={availableProducts} />
                <SubmitButton />
              </CardContent>
            </Card>
          </form>
        </div>

        <div className="lg:col-span-2">
            {state.error && <p className="text-destructive mb-4">{state.error}</p>}
            {state.recipe ? (
                <RecipeDisplay recipe={state.recipe} />
            ) : (
                <div className="flex flex-col items-center justify-center h-full border-2 border-dashed rounded-lg p-8 bg-card">
                    <ChefHat className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-center">Your generated recipe will appear here.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
