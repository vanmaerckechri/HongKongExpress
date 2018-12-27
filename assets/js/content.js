"use strict";
class Tools
{
	static creatElem(tag, attributes = false, values = false)
	{
		let element = document.createElement(tag);
		if (attributes != false)
		{
			for (let i = attributes.length - 1; i >= 0; i--)
			{
				element.setAttribute(attributes[i], values[i]);
			}
		}
		return element;
	}
}

class Content 
{
	constructor() 
	{
		this.cartes = [];
		this.menus = [];
		this.home = document.getElementById("horaires").cloneNode(true);

		this.init()
	}

	search(that)
	{
		let searchWord = document.querySelector(".search-container input").value;
		searchWord = searchWord.toLowerCase();

		for (let i = that.cartes.length - 1; i >= 0; i--)
		{
			// check in carte title
			let title = that.cartes[i]["titre"].toLowerCase();
			if (title.indexOf(searchWord) !== -1)
			{
				console.log(that.cartes[i]["titre"])
			}

			// check in dishies name
			let dishies = that.cartes[i]["plats"];
			for (let j = dishies.length - 1; j >= 0; j--)
			{
				let dishName = dishies[j]["nom"].toLowerCase();
				if (dishName.indexOf(searchWord) !== -1)
				{
					console.log(that.cartes[i]["titre"])
					console.log(dishies[j]["code"])
					console.log(dishies[j]["nom"])
					console.log(dishies[j]["prix"])
				}
			}
		}
	}

	displayHome(that, event)
	{
		event.preventDefault();

		let main = document.getElementById("main");
		main.innerHTML = "";
		main.appendChild(this.home);
	}

	displayContent(parentCatName, cat, that, event)
	{
		event.preventDefault();

		let catTitle = cat["titre"];
		let summaries = cat["commentaires"];
		let dishes = cat["plats"];

		let famContainer = Tools.creatElem("div", ["class"], [parentCatName + "-container maxWidth-container"]);
		let container = Tools.creatElem("div");
		let main = document.getElementById("main");

		// title and comments
		let title = Tools.creatElem("h2");
		title.textContent = catTitle;
		famContainer.appendChild(title);

		if (summaries != "")
		{
			let comments = Tools.creatElem("p", ["class"], ["food-comments"]);
			comments.textContent = summaries;
			famContainer.appendChild(comments);
		}

		// -- CARTES --
		if (parentCatName == "cartes")
		{
			// food - code, name, price
			for (let i = 0, length = dishes.length; i < length; i++ )
			{
				let row = Tools.creatElem("div", ["class"], ["row"]);
				let code = Tools.creatElem("p", ["class"], ["food-code"]);
				let name = Tools.creatElem("p", ["class"], ["food-name"]);
				let price = Tools.creatElem("p", ["class"], ["food-price"]);

				code.textContent = dishes[i]["code"] + ".";
				name.textContent = dishes[i]["nom"];
				price.textContent = dishes[i]["prix"].toFixed(2) + "€";

				row.appendChild(code);
				row.appendChild(name);
				row.appendChild(price);

				container.appendChild(row);
			}
		}
		// -- MENUS --
		else
		{
			// dishes
			for (let i = 0, length = dishes.length; i < length; i++ )
			{
				let row = Tools.creatElem("div", ["class"], ["row"]);
				let dish = Tools.creatElem("p");
				dish.textContent = dishes[i];

				row.appendChild(dish);
				container.appendChild(row);
			}
		}

		famContainer.appendChild(container);
		main.innerHTML = "";
		main.appendChild(famContainer);
	}

	buildMenu(parentCatName)
	{
		let that = this;
		let parent = this[parentCatName];

		for (let i = 0, length = parent.length; i < length; i++)
		{
			let childCatBtnName = parent[i]["bouton"];
			let childCatId = parent[i]["id"];

			let container = document.getElementById(parentCatName);
			let li = Tools.creatElem("li");
			let btn = Tools.creatElem("a", ["id", "class", "href"], ["btn-load_" + childCatId, "btn-load_" + parentCatName, "#"]);
			btn.textContent = childCatBtnName;

			li.appendChild(btn);
			container.appendChild(li);

			btn.addEventListener("click", that.displayContent.bind(this, parentCatName, parent[i],that), false);
		}
	}

	importJson(jsonFile)
	{
		let requestURL = './assets/content/' + jsonFile + '.json';
		let request = new XMLHttpRequest();
		request.open('GET', requestURL);
		request.responseType = 'json';
		request.send();

		return request;
	}

	importContent(parentCatName)
	{
		let that = this;
		// count dishes has loaded
		let dishesLoadCount = 0;
		// import dishies categories
		let reqCat = this.importJson(parentCatName);

		reqCat.onload = function()
		{
			// import dishes
			that[parentCatName] = reqCat.response;
			let parent = that[parentCatName];
			for (let i = parent.length - 1; i >= 0; i--)
			{
				let jsonFile = parent[i]["fichier"];
				let reqDishes = that.importJson(jsonFile);

				reqDishes.onload = function()
				{
					parent[i]["plats"] = reqDishes.response;
					// when every dishes is loaded build menu
					dishesLoadCount += 1;
					if (dishesLoadCount == parent.length)
					{
						that.buildMenu(parentCatName);
					}
				}
			}
		}
	}

	init()
	{
		let that = this;

		this.importContent("cartes");
		this.importContent("menus");

		document.getElementById("home").addEventListener("click", this.displayHome.bind(this, that), false);
		document.querySelector(".search-container button").addEventListener("click", this.search.bind(this, that), false);
	}
}

let loadContent = new Content;