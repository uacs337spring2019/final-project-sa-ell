/*
Sahachel Flores & Ellen Hales
CSC 337 - Spring 2019 - April 22nd, 2019
Final Project
This is the JS of our recipe page. Here, an API from online is used. This API
provides us with the recipes, instructions, images, and links to the recipes.
We also connect and fetch the images and recipes stored in a file when the
Favorites button is pressed. When a recipe is clicked and the user clicks the
Add to Favorite button, it will post the recipe to the file favorites.txt
that we later fetch.
*/
"use strict";

(function() {

	let errorName = null;
	window.onload = function() {
		clear();
		document.getElementById("search").onclick = search;
		document.getElementById("home").onclick = clear;
		document.getElementById("favorites").onclick = showFavorites;
	};

	/**
	 * This function obtains the objects/recipes from an online API.
	 */
	function search() {
		let food = document.getElementById("searchFood").value;
		let foodName = "";
		let foodSplit = food.split(/[ \t\n]+/);

		for(let i = 0; i < foodSplit.length; i++) {
			foodName += foodSplit[i];
			if(i + 1 < foodSplit.length) {
				foodName += "+";
			}
		}

		let url = "https://www.themealdb.com/api/json/v1/1/search.php?s="+foodName;
		fetch(url)
			.then(checkStatus)
			.then(function(responseText) {
				let json = JSON.parse(responseText);

				if(json.meals == null) {
					errorName = document.getElementById("searchFood").value;
					clear();
					error();
				}
				else {
					showResult(json);
				}
			})
			.catch(function(error) {
				console.log(error);
			});
	}

	/**
	 * This function will show the list of recipes depending on the name submitted
	 * by user.
	 */
	function showResult(json) {
		clear();
		for(let i = 0; i < json.meals.length; i++) {
			let div = document.createElement("div");
			let p2 = document.createElement("p");
			let p = document.createElement("p");
			let img = document.createElement("img");

			//we are appending the name and picture that the search result gave up
			p2.id = "meal"+i;
			div.className = "name";
			p2.innerHTML = json.meals[i].strMeal;
			img.src = json.meals[i].strMealThumb;

			div.appendChild(p2);
			p.appendChild(img);
			document.getElementById("result").appendChild(div);
			document.getElementById("result").appendChild(p);

			p2.onclick = pickFood;
		}
	}

	/**
	 * This function displays the specific recipe/instructions/image for the
	 * recipe that the user selected.
	 */
	function pickFood() {

		document.getElementById("searchFood").value = "";
		let food = document.getElementById(this.id).innerHTML;
		let foodName = "";
		let foodSplit = food.split(/[ \t\n]+/);

		for(let i = 0; i < foodSplit.length; i++) {
			foodName += foodSplit[i];
			if(i + 1 < foodSplit.length) {
				foodName += "+";
			}
		}

		let url = "https://www.themealdb.com/api/json/v1/1/search.php?s="+foodName;
		fetch(url)
			.then(checkStatus)
			.then(function(responseText) {
				let json = JSON.parse(responseText);
				clear();
				addTop(json);
				addIngredients(json);
				addDirections(json);
				extras(json);
				document.getElementById("image").style.visibility = "visible";
			})
			.catch(function(error) {
				console.log(error);
				let error1 = document.getElementById("error");
				error1.innerHTML = "Sorry a problem occurred with API, try another name";
			});
	}

	/**
	 * This function adds the add favorites button as well as the name of the
	 * recipe that the user selected when this specific page is showed.
	 */
	function addTop(json) {
		let b = document.createElement("input");

		b.type ="submit";
		b.value = "Add To Favorites";
		b.onclick = addFavorites;

		document.getElementById("addFavorites").appendChild(b);
		document.getElementById("name").innerHTML = json.meals[0].strMeal;
		document.getElementById("image").src = json.meals[0].strMealThumb;
	}

	/**
	 * This functions adds the ingredients of the specific recipe chosen by user.
	 */
	function addIngredients(json) {
		let ingredients = [];
		let measure = [];
		let y = Object.entries(json.meals[0]);

		for(let i = 9; i < y.length; i++) {
			if(y[i][0] == "strIngredient"+(i-8)) {
				ingredients.push(y[i][1]);
			}
		}

		for(let i = 29; i < y.length; i++) {
			if(y[i][0] == "strMeasure"+(i-28)) {
				measure.push(y[i][1]);
			}
		}

		let p1 = document.createElement("p");
		let p2 = document.createElement("p");
		p1.innerHTML="<span>Ingredients:</span> </br>";
		p2.innerHTML="<span>Measure:</span> </br>";

		let i = 0;
		while(ingredients[i] != "") {
			let div = document.getElementById("ingredients");
			p1.innerHTML += ingredients[i]+" </br>";
			div.appendChild(p1);
			i++;
		}

		i=0;
		while(measure[i] != "") {
			let div = document.getElementById("ingredients");
			p2.innerHTML += measure[i]+" </br>";
			div.appendChild(p2);
			i++;
		}
	}

	/**
	 * This functions adds the instructions/directions of the specific recipe
	 * chosen by user.
	 */
	function addDirections(json) {
		let p = document.createElement("p");
		p.innerHTML = "<span>Instructions: </span></br>";
		p.innerHTML += json.meals[0].strInstructions;
		document.getElementById("instructions").appendChild(p);
	}

	/**
	 * This functions adds the links of the specific recipe chosen by user. For
	 * example, youtube video link.
	 */
	function extras(json) {
		let link1 = document.createElement("a");
		let link2 = document.createElement("a");
		document.getElementById("extra").innerHTML = "<span>For more information"+
			" if applicable, click below: </span></br>";

		if(json.meals[0].strSource !=null) {
			link1.innerHTML = "Source </br>";
			link1.href = json.meals[0].strSource;
		}
		if(json.meals[0].strYoutube != null) {
			link2.innerHTML = "Youtube";
			link2.href = json.meals[0].strYoutube;
		}
		document.getElementById("extra").appendChild(link1);
		document.getElementById("extra").appendChild(link2);
	}

	/**
	 * This functions clears all of the elements when it is called. To display
	 * a fresh page.
	 */
	function clear() {
		document.getElementById("image").style.visibility = "hidden";
		document.getElementById("searchFood").value = "";
		document.getElementById("result").innerHTML = "";
		document.getElementById("displayFavorites").innerHTML = "";
		document.getElementById("addFavorites").innerHTML = "";
		document.getElementById("name").innerHTML = "";
		document.getElementById("image").src = "";
		document.getElementById("ingredients").innerHTML = "";
		document.getElementById("instructions").innerHTML = "";
		document.getElementById("extra").innerHTML = "";
		document.getElementById("error").innerHTML="";
	}

	/**
	 * This functions adds uses PUSH to add the recipes that the user wants when
	 * they click the Add to Favorites button. The server will then create a file
	 * that holds all of these recipes.
	 */
	function addFavorites() {
		let name = document.getElementById("name").innerHTML;
		let image = document.getElementById("image").src;

		const message = {name: name,
			image: image };
		const fetchOptions = {
			method : 'POST',
			headers : {
				'Accept': 'application/json',
				'Content-Type' : 'application/json'
			},
			body : JSON.stringify(message)
		};

		let url = "http://localhost:3000";

		fetch(url, fetchOptions)
			.then(checkStatus)
			.then(function(responseText) {
				let json = JSON.parse(responseText);
				let m = document.createElement("p");
				m.id = "success";
				m.innerHTML = json.msg;
				document.getElementById("addFavorites").append(m);

			})
			.catch(function(error) {
				console.log(error);
			});
	}

	/**
	 * This functions fetches the recipes stored in the file favorites.txt. This
	 * is called when the Favorites button is clicked and will show all recipes!
	 */
	function showFavorites() {
		document.getElementById("searchFood").value = "";
		clear();

		let url = "http://localhost:3000";
		fetch(url, {method: "GET"})
			.then(checkStatus)
			.then(function(responseText) {
				let json = JSON.parse(responseText);
				for(let i=0; i < json.meals.length; i++) {
					if(json.meals[i].name != "") {
						let name = document.createElement("h1");
						let imag = document.createElement("img");
						let p = document.createElement("p");

						name.id = "food"+i;
						name.innerHTML = json.meals[i].name;
						imag.src = json.meals[i].image;

						p.appendChild(imag);
						document.getElementById("displayFavorites").appendChild(name);
						document.getElementById("displayFavorites").appendChild(p);

						name.onclick = pickFood;
					}
				}
			})
			.catch(function(error) {
				console.log(error);
			});
	}

	/**
	 * This function sends a message when the user types a name that does not
	 * have any recipes on the API.
	 */
	function error() {
		let error = document.createElement("h3");
		error.innerHTML = "Sorry there are no recipes with "+errorName+", try again!";
		document.getElementById("error").appendChild(error);
	}

	/**
   * This function checks whether request is valir or not. If it is, it will
   * return the response text. If not, returns error!
   */
	function checkStatus(response) {
		if (response.status >= 200 && response.status < 300) {
			return response.text();
		}
		else if (response.status == 404) {
			// sends back a different error when we have a 404 than when we have
			// a different error
			return Promise.reject(new Error("Sorry, we couldn't find that page"));
		}
		else {
			return Promise.reject(new Error(response.status+": "+response.statusText));
		}
	}

})();
