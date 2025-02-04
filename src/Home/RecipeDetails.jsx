import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const RecipeDetails = () => {
    const { name } = useParams();
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5000/recipes?name=${name}`)
            .then(res => res.json())
            .then(data => {
                const theData = data.recipeData;
                if (theData.length > 0) {
                    setRecipe(theData[0]); // Assuming you want the first recipe from the array
                } else {
                    setRecipe(null); // Handle case when no recipe is found
                }
            })
            .catch(err => {
                console.error("Error fetching recipe:", err);
                setRecipe(null); // Handle error
            });
    }, [name]);
    console.log(recipe);

    if (!recipe) return <div>Loading...</div>; 

    console.log(recipe); // Add this to check the full recipe object

    return (
        <div className="max-w-4xl mx-auto mt-10">
            <img
                src={recipe.image}
                alt={recipe.name}
                className="w-full h-96 object-cover rounded-lg mb-6"
            />
            <h1 className="text-4xl font-bold mb-4">{recipe.name}</h1>
            <p className="text-lg mb-4">{recipe.description}</p>

            {/* Check if ingredients is an array before rendering */}
            <p className="text-base text-black">Ingredients:-</p>
            {Array.isArray(recipe.Ingredients) && recipe.Ingredients.length > 0 ? (
                <ul className="list-disc list-inside text-gray-700 text-sm">
                    {recipe.Ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                    ))}
                </ul>
            ) : (
                <p>No ingredients available</p>
            )}

            <p className="text-base text-black my-4">Instructions: <span className='text-gray-600'>{recipe.instructions}</span></p>
            <p className="text-base text-black mb-4">Cooking Time: <span className='text-gray-600'>{recipe.cookingTime} minutes</span></p>
            <p className="text-base text-black mb-4">Category: <span className='text-gray-600'>{recipe.category}</span></p>
            <p className="text-base text-black mb-4">Created By: <span className='text-gray-600'>{recipe.createdBy}</span></p> 
            
            <div className="flex justify-end">
                <button
                    className="text-xl text-red-500 mb-8"
                    // onClick={() => handleFavorite(recipeId)}
                >
                    ♥ Favorite
                </button>
            </div>
        </div>
    );
};

export default RecipeDetails;
