const fs = require('fs');
const path = require('path');

// Read the favorite meal IDs from favourite.txt
function readFavorites() {
    const pathName = path.join(__dirname, 'Files');
    const filePath = path.join(pathName, 'favourite.txt');
    fs.readFile(filePath, 'utf8', function(err, data) {
        if (err) {
    console.error('Error reading from file:', err);
    return;
    }

    // Parse the file data into an array
    const favoritesArray = JSON.parse(data);

    // Fetch the meal details for each favorite meal ID
    for (const mealName of favoritesArray) {
        (function(mealName) {
            fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`)
                .then((response) => response.json())
                .then((meal) => {
            displaymealDetails(meal, favoritesArray, filePath);
        });
        })(mealName);
    }
    });
}

readFavorites();

function displaymealDetails(meal, favoritesArray, filePath) {
    // Check if the required data is present in the API response
    if (!meal || !meal.meals || meal.meals.length === 0) {
        console.error('Invalid API response:', meal);
        return;
    }

    const mealData = meal.meals[0];

    // Create a div element to display the meal details
    const mealDiv = document.createElement('div');
    mealDiv.classList.add('meal');

    // Add the meal image
    const image = document.createElement('img');
    image.src = mealData.strMealThumb;
    image.alt = mealData.strMeal;
    mealDiv.appendChild(image);

    // Add the meal name
    const name = document.createElement('p');
    name.textContent = mealData.strMeal;
    mealDiv.appendChild(name);

    // Add a delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Recipe';
    deleteButton.addEventListener('click', () => {
        // Remove the meal from the favorites array
        const index = favoritesArray.indexOf(mealData.strMeal);
        if (index > -1) {
            favoritesArray.splice(index, 1);
        }

        // Update the favorites.txt file
        fs.writeFile(filePath, JSON.stringify(favoritesArray), function(err) {
            if (err) {
                console.error('Error writing to file:', err);
            }

            // Remove the meal div from the favorites container
            document.getElementById('favourites-container').removeChild(mealDiv);
        });
    });
    mealDiv.appendChild(deleteButton);

    // Append the meal div to the favorites container
    document.getElementById('favourites-container').appendChild(mealDiv);
}
