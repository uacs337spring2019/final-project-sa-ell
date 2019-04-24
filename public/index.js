// Sahachel Flores & Ellen Hales
// CSC 337, Spring 2019

// requests all of the categories from the service

(function() {
	window.onload = function() {
		document.getElementById("search").onclick = search;
		document.getElementById("home").onclick = clear;
		document.getElementById("favorites").onclick = showFavorites;
	};


	function search() {

		let food = document.getElementById("searchFood").value;
		let foodName = "";
		let foodSplit = food.split(/[ \t\n]+/);

		for(let i = 0; i < foodSplit.length; i++){
			foodName += foodSplit[i];
			if(i + 1 < foodSplit.length){
				foodName += "+";
			}
		}

		let url = "https://www.themealdb.com/api/json/v1/1/search.php?s="+foodName;
		fetch(url)
			.then(checkStatus)
			.then(function(responseText) {
				let json = JSON.parse(responseText);

				if(json.meals == null){
					clear();
					error();
				}
				else{
					console.log(json);
					showResult(json);
				}
			})
			.catch(function(error) {
				console.log(error);
			});
	}

	function showResult(json) {
		console.log("entering show");
		clear();
		let items = [];
		for(let i = 0; i < json.meals.length; i++){

			let div = document.createElement("div");
			let p = document.createElement("p");
			let img = document.createElement("img");

			//we are appending the name and picture that the search result gave up
			div.id = "meal"+i;
			div.innerHTML = json.meals[i].strMeal;
			img.src = json.meals[i].strMealThumb;
			//console.log(img.src);
			p.appendChild(img);
			document.getElementById("result").appendChild(div);
			document.getElementById("result").appendChild(p);

			div.onclick = pickFood;
		}

	}

	function pickFood() {
		console.log("entering pickFood");
		let food = document.getElementById(this.id).innerHTML;
		let foodName = "";
		let foodSplit = food.split(/[ \t\n]+/);

		for(let i = 0; i < foodSplit.length; i++){
			foodName += foodSplit[i];
			if(i + 1 < foodSplit.length){
				foodName += "+";
			}
		}

		let url = "https://www.themealdb.com/api/json/v1/1/search.php?s="+foodName;
		console.log(url);
		fetch(url)
			.then(checkStatus)
			.then(function(responseText) {
				let json = JSON.parse(responseText);
				console.log(json);
				clear();
				addTop(json);
				addIngredients(json);
				addDirections(json);
				extras(json);
			})
			.catch(function(error) {
				console.log(error);
			});
	}

	function addTop(json) {
		let b = document.createElement("input");

		b.type ="submit";
		b.value = "Add To Favorites";
		b.onclick = addFavorites;

		document.getElementById("addFavorites").appendChild(b);
		document.getElementById("name").innerHTML = json.meals[0].strMeal;
		document.getElementById("image").src = json.meals[0].strMealThumb;

	}
	function addIngredients(json) {
		console.log("entering ingredients");
		let ingredients = [];
		let measure = [];
		let y = Object.entries(json.meals[0]);

		for(let i = 9; i < y.length;i++){
			if(y[i][0] == "strIngredient"+(i-8)){
				ingredients.push(y[i][1]);
			}
		}

		for(let i = 29; i < y.length;i++){
			if(y[i][0] == "strMeasure"+(i-28)){
				measure.push(y[i][1]);
			}
		}

		let p1 = document.createElement("p");
		let p2 = document.createElement("p");
		p1.innerHTML="<span>Ingredients:</span> </br>"
		p2.innerHTML="<span>Measure:</span> </br>"

		let i = 0;
		while(ingredients[i] != ""){
			let div = document.getElementById("ingredients");

			p1.innerHTML += ingredients[i]+" </br>";
			div.appendChild(p1);
			i++;
		}

		i=0;
		while(measure[i] != ""){
			let div = document.getElementById("ingredients");

			p2.innerHTML += measure[i]+" </br>";
			div.appendChild(p2);
			i++;
		}

	}

	function addDirections(json) {
		let p = document.createElement("p");
		p.innerHTML = "<span>Instructions: </span></br>";
		p.innerHTML += json.meals[0].strInstructions;
		document.getElementById("instructions").appendChild(p);

	}

	function extras(json){
		let p = document.createElement("p");
		p.innerHTML = "<span>For more information click below: </span></br>"
		p.innerHTML += json.meals[0].strSource +" </br>";
		p.innerHTML += json.meals[0].strYoutube;
		document.getElementById("extra").appendChild(p);
	}

	function clear() {
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

	function addFavorites() {
		let name = document.getElementById("name").innerHTML;
		let image = document.getElementById("image").src;

		console.log(name);
		console.log(image);
		const message = {name: name,
					 image: image,
					 };
		const fetchOptions = {
			method : 'POST',
			headers : {
				'Accept': 'application/json',
				'Content-Type' : 'application/json'
			},
			body : JSON.stringify(message)
		};

		let url = "https://hungry-students-csc-337.herokuapp.com";

		fetch(url, fetchOptions)
			.then(checkStatus)
			.then(function(responseText) {
				let json = JSON.parse(responseText);
				 console.log("json returns: "+json.msg);
			})
			.catch(function(error) {
				console.log(error);
			});

	}

	function showFavorites() {
		console.log("entering show favorites");
		clear();
		let url = "https://hungry-students-csc-337.herokuapp.com";

		fetch(url, {method: "GET"})
			.then(checkStatus)
			.then(function(responseText) {
				let json = JSON.parse(responseText);

				console.log(json);
				for(let i =0; i < json.meals.length;i++){
					if(json.meals[i].name != ""){
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

	function error(){
		"entering erro";
		let food = document.getElementById("searchFood").value;
		let error = document.createElement("h3");
		error.innerHTML = "Sorry, there are no recipes with "+food+", try again";
		document.getElementById("error").appendChild(error);
	}
	function checkStatus(response) {
		if (response.status >= 200 && response.status < 300) {
			return response.text();
		} else if (response.status == 404) {
			// sends back a different error when we have a 404 than when we have
			// a different error
			return Promise.reject(new Error("Sorry, we couldn't find that page"));
		} else {
			return Promise.reject(new Error(response.status+": "+response.statusText));
		}
	}
})();
