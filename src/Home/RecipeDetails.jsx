import { getAuth } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import auth from '../firebase/firebase.config';
import axios from 'axios';
import { Helmet } from 'react-helmet';

const RecipeDetails = () => {
    const { name } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);


    useEffect(() => {
        const loggedInUserId = localStorage.getItem('userId');
        setUserId(loggedInUserId);  // Set userId if found

        fetch(`https://instant-chef-api-1.onrender.com/recipes?name=${name}`)
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

     // Add the recipe to favorites
     const addFavorite = async (recipeId) => {

        try {
            const auth = getAuth();
            const user = auth.currentUser;
            console.log("i am user",user)
            if (!user) {
                alert("Please log in to add favorites.");
                return;
            }
            
            const userId= user.uid;
            const uemail = user.email;
            // Get the Firebase ID token
            const idToken = await user.getIdToken();
            console.log(userId, 
                uemail,
                recipeId);

            const response = await axios.post(
                "https://instant-chef-api-1.onrender.com/recipes/favorite",
                {
                    userId, 
                    uemail,
                    recipeId
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${idToken}`, // Include Firebase ID token in the header
                    },
                }
            );
            
            const data = await response.data;

            if (response.status === 200) {
                setIsFavorite(true);
                //alert("Recipe is in your favorites!");
            
            } if(response.status === 400){
                alert('It is already in favourite');
            }
            else {
                alert(data.message || "Failed to add recipe to favorites.");
            }
            
        } catch (error) {
            console.error("Error:", error);
        }
    };
    
    
    

    if (!recipe) return  <div className="flex justify-center items-center h-screen">
    <div className="border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full animate-spin"></div>
  </div>; 

    console.log(recipe); // Add this to check the full recipe object

    return (
        <div className="max-w-4xl mx-auto mt-10">
            <Helmet>
        <title>Instant Chef || Details</title>
        </Helmet>
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
                    onClick={() => addFavorite(recipe)}
                >
                    {isFavorite ? '✓ Favorited' : '♥ Favorite'}
                </button>
                
            </div>
            <p>[Note: you can ask our AI Chef if you need any help with the ingregients alternative or instruction, also you can dive into the cooking world with the help of our AI Chef]</p>
            <Link to='/chatbot'>  <button class="fixed bottom-10 right-6 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 text-lg transition">
            💬
         Ask AI Chef
</button></Link>
        </div>
    );
};

export default RecipeDetails;
