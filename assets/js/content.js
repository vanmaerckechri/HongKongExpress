"use strict";
class Tools
{
	static creatElem(tag, attributes, values)
	{
		let element = document.createElement(tag);
		for (let i = attributes.length - 1; i >= 0; i--)
		{
			element.setAttribute(attributes[i], values[i]);
		}
		return element;
	}
}

class Content 
{
	constructor() 
	{
		/*this.cartes = 
		{
			"potages": [],
			"entrees": [],
			"volailles": [],
			"viandes": [],
			"rizEtNouilles" : [],
			"desserts" : []
		};*/
		this.cartes = 
		{
			"potages": [],
			"entrees": [],
			"volailles": [],
		};

		this.loadContents()
		this.initMenuBtn()
	}

	displayContent(contentFam, contentName)
	{
		let famContainer = Tools.creatElem("div", ["class"], [contentFam + "-container"]);
		let container = Tools.creatElem("div", ["class"], [contentName + "-container"]);
		let main = document.getElementById("main");
		let content = this[contentFam][contentName];

		for (let i = 0, length = content.length; i < length; i++ )
		{
			let row = Tools.creatElem("div", ["class"], ["food-row"]);
			let code = Tools.creatElem("p", ["class"], ["food-code"]);
			let name = Tools.creatElem("p", ["class"], ["food-name"]);
			let price = Tools.creatElem("p", ["class"], ["food-price"]);

			code.innerHTML = content[i]["code"];
			name.innerHTML = content[i]["nom"];
			price.innerHTML = content[i]["prix"];

			row.appendChild(code);
			row.appendChild(name);
			row.appendChild(price);

			container.appendChild(row);
		}
		famContainer.appendChild(container);
		main.innerHTML = "";
		main.appendChild(famContainer);
	}

	initMenuBtn()
	{
		let that = this;
		let contentFam = ["cartes"];

		for (let i = contentFam.length - 1; i >= 0; i--)
		{
			let btnLoadContent = document.querySelectorAll(".btn-load_" + contentFam);
			console.log(btnLoadContent)
			for (let j = btnLoadContent.length - 1; j >= 0; j--)
			{
				let id = btnLoadContent[j].id;
				// slince index 9 => btn-load_...
				let contentName = id.slice(9, id.length);
				btnLoadContent[j].addEventListener("click", that.displayContent.bind(this, contentFam[i], contentName), false);
			}
		}
	}

	loadContents()
	{
		let that = this;
		for (let carteName in this.cartes)
		{
			let requestURL = './assets/content/' + carteName + '.json';
			let request = new XMLHttpRequest();
			request.open('GET', requestURL);
			request.responseType = 'json';
			request.send();

			request.onload = function()
			{
				that.cartes[carteName] = request.response;
				//console.log(that.cartes[carteName])
			}
		}
	}
}

let test = new Content;