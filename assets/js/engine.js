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
		this.init()
	}

	hideElements(selectorName)
	{
		let elementsToHide = document.querySelectorAll(selectorName);
		for (let i = elementsToHide.length - 1; i >= 0; i--)
		{
			if (!elementsToHide[i].classList.contains("displayNone"))
			{
				elementsToHide[i].classList.add("displayNone");
			}
		}
	}

	unhideAllSubElements(selectorName)
	{
		let elementsToHide = document.querySelectorAll(selectorName);
		for (let i = elementsToHide.length - 1; i >= 0; i--)
		{
			if (elementsToHide[i].classList.contains("displayNone"))
			{
				elementsToHide[i].classList.remove("displayNone");
			}
		}		
	}

	changePage(pageName, event)
	{
		event.preventDefault();

		this.hideElements("section");

		if (!Array.isArray(pageName))
		{
			let page = document.getElementById(pageName + "-page")
			this.unhideAllSubElements("." + pageName + "-container");
			page.classList.remove("displayNone");
		}
		else
		{
			for (let i = pageName.length - 1; i >= 0; i--)
			{
				let page = document.getElementById(pageName[i] + "-page")
				page.classList.remove("displayNone");
			}
		}
	}

	changeSubPage(page, subPage, event)
	{
		event.preventDefault();

		this.hideElements("section");
		this.hideElements("." + page + "-container");

		subPage = document.getElementById(subPage);
		page = document.getElementById(page + "-page");

		page.classList.remove("displayNone");
		subPage.classList.remove("displayNone");
	}

	initStyleSheet()
	{
		let head = document.querySelector("head");
		let style = document.createElement('style');
		style.type = 'text/css';

		let css = '.infos-page, .menus-container { background-image: url("../img/parchemin_light.jpg"); }';
		let cssRow = '.infos-page .row:nth-of-type(2n+1), .menus-container .row:nth-of-type(2n) { background: linear-gradient(to right, transparent, #cfcfb8 10%, #cfcfb8 85%, transparent); }';
		let cssSection = 'section > div { box-shadow: none; }';

  		style.textContent = css + cssRow + cssSection;
  		head.appendChild(style)
	}

	initButtons()
	{
		// load infos page
		let infosBtn = document.getElementById("infos-btn");
		infosBtn.addEventListener("click", this.changePage.bind(this, ["home", "infos"]), false);
		// load cartes page
		let cartesBtn = document.getElementById("cartes-btn");
		cartesBtn.addEventListener("click", this.changePage.bind(this, "cartes"), false);
		// load menus page
		let menusBtn = document.getElementById("menus-btn");
		menusBtn.addEventListener("click", this.changePage.bind(this, "menus"), false);
	}

	initNavSub(name)
	{
		let btn = document.querySelector("#" + name + "-btn").parentNode;
		let ids = document.querySelectorAll("." + name + "-container")
		let titles = document.querySelectorAll("." + name + "-page .title-container h3")

		let navSubContainer = Tools.creatElem("div", ["class"], ["subMenu-container displayNone"]);
		let navSubContent = Tools.creatElem("ul", ["class"], ["subMenu-content maxWidth-container"]);
		for (let i = 0, length = titles.length; i < length; i++)
		{
			let title = titles[i].className ? titles[i].className : titles[i].textContent;
			let btnRow = Tools.creatElem("li", [], []);
			let btnLink = Tools.creatElem("a", ["id", "href"], [ids[i].id + "-btn", "#"]);
			btnLink.textContent = title;
			btnRow.appendChild(btnLink);
			navSubContent.appendChild(btnRow);
			btnLink.addEventListener("click", this.changeSubPage.bind(this, name, ids[i].id), false);
		}
		navSubContainer.appendChild(navSubContent);
		btn.appendChild(navSubContainer);
		btn.classList.add("subMenu-btn");
	}

	initHomeNav()
	{
		let mainMenu = document.getElementById("mainMenu");

		let homeBtnRow = Tools.creatElem("li", [], []);
		let homeBtnLink = Tools.creatElem("a", ["id", "href"], ["infos-btn", "#"]);
		homeBtnLink.textContent = "Infos";
		homeBtnRow.appendChild(homeBtnLink);

		mainMenu.insertBefore(homeBtnRow, mainMenu.firstChild);
	}

	initPages()
	{
		let sections = document.querySelectorAll("section");
		for (let i = sections.length - 1; i >= 0; i--)
		{
			if (sections[i].querySelector("h2"))
			{
				sections[i].querySelector("h2").classList.add("displayNone");
			}
			if (!sections[i].classList.contains("home-page") && !sections[i].classList.contains("infos-page"))
			{
				sections[i].classList.add("displayNone");
			}
		}
	}

	init()
	{
		this.initPages();
		this.initHomeNav();
		this.initNavSub("cartes");
		this.initNavSub("menus");
		this.initButtons();
		this.initStyleSheet();
	}
}

let loadContent = new Content;