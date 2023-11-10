function buttonClicked() {
    var search = document.getElementById('meal').value;

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`)
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        displayProducts(data)

        
    });
}

function displayProducts(products) {
    var html = '';

    for (var i = 0; i < 9; i++) {
        var meal = products.meals[i];
        var ingredientsList = '<ul>'; 
        
        for (var i = 1; i <= 15; i++) {
            var ingredient = meal[`strIngredient${i}`];
            var measure = meal[`strMeasure${i}`];
        
            if (ingredient && ingredient.trim() !== '') {
                ingredientsList += `<li>${ingredient} - ${measure}</li>`; 
            }
        }
        
        ingredientsList += '</ul>'; 
        
        var instructionsSteps = meal.strInstructions.split('\r\n'); // step dio kito jadi list
        var instructionsList = '<ul>'; 
        
        instructionsSteps.forEach(step => {
            if (step.trim() !== '') {
                instructionsList += `<li>${step}</li>`; //list item step dio
            }
        });
        
        instructionsList += '</ul>'; 
        
        var youtubeLink = meal.strYoutube; 
        
        var pic = meal.strMealThumb
        
        //document.getElementById('display').innerHTML = `<img src="${pic}" alt="sent recipe">
          //                                              <h2>Meal: ${meal.strMeal}</h2> 
            //                                            <h3>Instructions:</h3> 
              //                                          ${instructionsList} 
                //                                        <h3>Ingredients:</h3> 
                  //                                      ${ingredientsList}
                    //                                    <h3>Video Reference:</h3>
                      //                                  <a href="${youtubeLink}" target="_blank">${youtubeLink}</a>`;
    html += `
        <div class="meals">
            <div class="meals-recipe">
                <img src="${pic}" alt="meal(s)">
            </div>
            <div class="desc">
                <h2>${meal.strMeal}</h2><br>    
                <h3>Instructions:</h3>
                <p>${instructionsList}</p><br>
                <h3>Ingredients:</h3>
                <p>${ingredientsList}<p><br>
                <h4>Video References</h4>
                <a href="${youtubeLink}" target="_blank">${youtubeLink}</a>
                <button onclick="favorite('${meal.strMeal}', event)">Add to Favorite</button>
            </div>
        </div>`
    }

    document.getElementById('display').innerHTML = html;
}

const path = require('path');
const fs = require('fs');

function favorite(mealName, event) {
  // Prevent the default action of the link
event.preventDefault();

  // Stop the click event from propagating up to the parent <a> element
event.stopPropagation();

let pathName = path.join(__dirname, 'Files');
let filePath = path.join(pathName, 'favourite.txt');

    fs.readFile(filePath, 'utf8', function(err, data) {
    if (err) {
      // If file doesn't exist, initialize data with an empty array
        if (err.code === 'ENOENT') {
        data = '[]';
    } else {
        console.error('Error reading from file:', err);
        return;
    }
    }

    // Check if the file data is empty and initialize it with an empty array string if it is
    if (data === '') {
        data = '[]';
    }

    // Parse the file data into an array
    let favoritesArray = JSON.parse(data);

    // Check if the meal ID is already in the array
    if (favoritesArray.includes(mealName)) {
      // Show the modal and update the modal text
        showModal('The recipe is already in your favourite recipe', 'added');
    return;
    }


    // Add the new meal ID to the array
    favoritesArray.push(mealName);

    // Write the updated array back to the file
    fs.writeFile(filePath, JSON.stringify(favoritesArray), function(err) {
        if (err) {
        console.error('Error writing to file:', err);
        return;
    }

    showModal('Recipe was added to your list', 'added');
    });
    });
}

function showModal(text, modalId) {
    var modal = document.getElementById(modalId);
    var modalText = modal.querySelector("p");

    // Update the modal text
    modalText.textContent = text;

    // Show the modal
    modal.style.display = "block";

    // Get the close button element
    var closeBtn = modal.querySelector(".close");

    // Add a click event listener to the close button
    closeBtn.onclick = function() {
        modal.style.display = "none";
        window.removeEventListener('click', outsideClickListener);
    }

    function outsideClickListener(event) {
        if (event.target == modal) {
        modal.style.display = "none";
        window.removeEventListener('click', outsideClickListener);
    }
    }

    // Add a click event listener to the window to close the modal when the user clicks outside of it
    window.addEventListener('click', outsideClickListener);
}