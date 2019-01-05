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

	smoothScroll(destination, direction, speed, event)
	{
 		event.preventDefault();

		let distance = window.pageYOffset;
		let tempo = setInterval(function()
		{ 
			window.scrollTo(0, distance)
			if (direction == "bottom")
			{
				distance += speed;
				if (destination <= distance)
				{
					window.scrollTo(0, destination)
					clearInterval(tempo);
				}		
			}
			else
			{
				distance -= speed;
				if (destination >= distance)
				{
					window.scrollTo(0, destination)
					clearInterval(tempo);
				}					
			}
		}, 1);
	}

	scrollEvents()
	{
		let main = document.getElementById("main");
		let nav = document.querySelector("nav");
		if (!nav.classList.contains("mainMenu-fixed"))
		{
			let navInfo = nav.getBoundingClientRect();
			if (navInfo.top <= 0)
			{
				nav.classList.add("mainMenu-fixed");
				main.style.marginTop = navInfo.height + "px";
			}
		}
		else
		{
			let header = document.querySelector("header");
			let headerInfo = header.getBoundingClientRect();
			if (headerInfo.bottom >= 0)
			{
				nav.classList.remove("mainMenu-fixed");
				main.style = "";
			}
		}
		let backTopBtn = document.getElementById("backTop");
		if (backTopBtn.classList.contains("displayNone"))
		{
			if (window.pageYOffset >= screen.height)
			{
				backTopBtn.classList.remove("displayNone");
			}
		}
		else
		{
			if (window.pageYOffset < screen.height)
			{
				backTopBtn.classList.add("displayNone");		
			}
		}
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

		this.smoothScroll(0, "top", 25, event);
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

		let subMenuContainer = document.querySelectorAll(".subMenu-container");
		for (let i = subMenuContainer.length - 1; i >= 0; i--)
		{
			subMenuContainer[i].style.display = "none";
			setTimeout(function()
			{
				subMenuContainer[i].style = "";
			}, 1000)
		}

		this.smoothScroll(0, "top", 25, event)
	}

	initStyleSheet()
	{
		let head = document.querySelector("head");
	    let link  = document.createElement('link');
	    link.rel  = 'stylesheet';
	    link.type = 'text/css';
	    link.href = './assets/css/jsallow.css';
	    link.media = 'all';
	    head.appendChild(link);
	}

	initNavPosition()
	{
		window.addEventListener("scroll", this.scrollEvents, false);
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
		// next page
		let homeNextPage = document.getElementById("home-nextPage");
		let infosPage = document.getElementById("infos-page").offsetTop;
		homeNextPage.addEventListener("click", this.smoothScroll.bind(this, infosPage, "bottom", 25), false);
		// back to top
		let backTop = document.getElementById("backTop");
		backTop.addEventListener("click", this.smoothScroll.bind(this, 0, "top", 25), false);
	}

	initFixedBottomBar()
	{
		let main = document.getElementById("main");
		let phone = document.getElementById("phone");
		let bottomBarContainer = Tools.creatElem("div", ["id", "class"], ["bottomBar-container", "bottomBar-container"]);
		document.getElementById("backTop").classList.add("displayNone");

		let bottomBarContent = document.getElementById("backTop-container");
		bottomBarContent.id = "";
		bottomBarContent.className = "bottomBar-content maxWidth-container";

		bottomBarContent.insertBefore(phone, bottomBarContent.firstChild);
		bottomBarContainer.appendChild(bottomBarContent);
		main.appendChild(bottomBarContainer);
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
		this.initFixedBottomBar()
		this.initButtons();
		this.initNavPosition();
		this.initStyleSheet();
	}
}

let loadContent = new Content;