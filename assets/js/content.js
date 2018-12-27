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
		this.home = document.getElementById("home").cloneNode(true);

		this.init()
	}

	search()
	{
		let searchWord = document.querySelector(".search-container input").value;
		if (searchWord != "")
		{
			searchWord = searchWord.toLowerCase();

			//search in cartes
			for (let i = this.cartes.length - 1; i >= 0; i--)
			{
				// check in cartes title and summaries
				let title = this.cartes[i]["titre"].toLowerCase();
				let summaries = this.cartes[i]["commentaires"].toLowerCase();
				if (title.indexOf(searchWord) !== -1)
				{
					console.log(this.cartes[i]["titre"]);
				}

				// check in dishies name
				let dishies = this.cartes[i]["plats"];
				for (let j = dishies.length - 1; j >= 0; j--)
				{
					let dishName = dishies[j]["nom"].toLowerCase();
					if (dishName.indexOf(searchWord) !== -1)
					{
						console.log(this.cartes[i]["titre"]);
					}
				}
			}
			//search in menus
			for (let i = this.menus.length - 1; i >= 0; i--)
			{
				// check in menus title and summaries
				let title = this.menus[i]["titre"].toLowerCase();
				let summaries = this.menus[i]["commentaires"].toLowerCase();
				if (title.indexOf(searchWord) !== -1 || summaries.indexOf(searchWord) !== -1)
				{
					console.log(this.menus[i]["titre"])
				}

				// check in dishies name
				let dishies = this.menus[i]["plats"];
				for (let j = dishies.length - 1; j >= 0; j--)
				{
					let dish = dishies[j].toLowerCase();
					if (dish.indexOf(searchWord) !== -1)
					{
						console.log(this.menus[i]["titre"])
					}
				}
			}
		}
	}

	changeCursorPageSelected(newBtnSelected)
	{
		let navBtn = document.querySelectorAll("nav li");
		for (let i = navBtn.length - 1; i >= 0; i--)
		{
			if (navBtn[i].classList.contains("pageSelected"))
			{
				navBtn[i].classList.remove("pageSelected");
			}
		}
		// select li if her child is clicked
		if (newBtnSelected.nodeName != "LI")
		{
			newBtnSelected = newBtnSelected.parentNode;
		}
		// for folder nav (cartes and menus)
		if (newBtnSelected.parentNode.parentNode.classList.contains("menu-folder-container"))
		{
			newBtnSelected.parentNode.parentNode.classList.add("pageSelected");
		}
		newBtnSelected.classList.add("pageSelected");
	}

	displayHome(event)
	{
		event.preventDefault();
		let main = document.getElementById("main");
		main.innerHTML = "";
		main.appendChild(this.home);
		this.changeCursorPageSelected(event.target);
	}

	displayContent(parentCatName, cat, event)
	{
		event.preventDefault();

		let catTitle = cat["titre"];
		let summaries = cat["commentaires"];
		let dishes = cat["plats"];

		let famContainer = Tools.creatElem("section", ["class"], [parentCatName + "-container maxWidth-container"]);
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

				famContainer.appendChild(row);
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
				famContainer.appendChild(row);
			}
		}

		main.innerHTML = "";
		main.appendChild(famContainer);

		this.changeCursorPageSelected(event.target)
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

			btn.addEventListener("click", that.displayContent.bind(this, parentCatName, parent[i]), false);
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

		document.getElementById("home-btn").addEventListener("click", this.displayHome.bind(this), false);

		document.querySelector(".search-container button").addEventListener("click", this.search.bind(this), false);
	}
}

let loadContent = new Content;