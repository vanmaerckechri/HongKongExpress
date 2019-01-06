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

	static foundParent(child, parentFocus, by = "default")
	{
		let body = document.querySelector("body");
		let parent = child.parentNode;

		if (by == "default")
		{
			while(parent != parentFocus)
			{
				parent = parent.parentNode;
				if (parent === body)
				{
					return false;
				}
			}
		}
		// by parentClassName
		else
		{
			while(!parent.classList.contains(parentFocus))
			{
				parent = parent.parentNode;
				if (parent === body)
				{
					return false;
				}
			}
		}
		return parent;
	}

	static is_touch_device()
	{  
		try
		{  
			document.createEvent("TouchEvent");  
			return true;  
		} 
		catch(e)
		{  
			return false;  
		}  
	}
}

class Content 
{
	constructor() 
	{
		this.subMenuOpen = false;
		this.tempoScrollTo;
		this.init()
	}

	displaySearch(searchTitle, containers, carteRows, menus, event)
	{
		let search = document.getElementById("search");
		search.innerHTML = "";
		let domElem;
		let title = Tools.creatElem("h2");
		title.textContent = 'Recherche: "' + searchTitle + '"';
		search.appendChild(title);

		// cartes and menus by containers
		for (let i = 0, length = containers.length; i < length; i ++)
		{
			domElem = containers[i].cloneNode(true);
			search.appendChild(domElem);
		}

		// cartes by rows
		for (let subTitleName in carteRows)
		{
			let rowsContainers = Tools.creatElem("div", ["class"], ["cartes-container"]);
			let subtitleContainer = Tools.creatElem("div", ["class"], ["title-container"]);
			let subtitle = Tools.creatElem("h3");
			subtitle.textContent = subTitleName;

			subtitleContainer.appendChild(subtitle);
			rowsContainers.appendChild(subtitleContainer);

			let dish = carteRows[subTitleName];

			for (let i = 0, length = dish.length; i < length; i ++)
			{
				domElem = dish[i].cloneNode(true);
				rowsContainers.appendChild(domElem);
			}
			search.appendChild(rowsContainers);
		}

		// menus by rows
		for (let i = 0, length = menus.length; i < length; i ++)
		{
			domElem = menus[i].cloneNode(true);
			search.appendChild(domElem);
		}

		// delete all img title
		let titlesImg = search.querySelectorAll(".titleImg-container");
		for (let i = titlesImg.length - 1; i >= 0; i--)
		{
			titlesImg[i].remove();
		}
		

		this.hideElements("section");
		search.classList.remove("displayNone");
		this.smoothScroll(0, "top", 100);
	}

	launchSearch(that, event)
	{
		event.preventDefault();

		this.menuSelected(event.target);
		this.closeSubMenus();

		let cleanRows = function(childArray, parent)
		{
			let newArray = [];
			let isChild;

			for (let i = childArray.length - 1; i >= 0; i--)
			{
				isChild = Tools.foundParent(childArray[i], parent);
				if (isChild === false)
				{
					newArray.push(childArray[i]);
				}
			}
			return newArray;
		}

		let searchWord = document.getElementById("search-input").value;
		let searchWordClean = searchWord.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
		if (searchWordClean != "")
		{
			let form = document.getElementById("search-form");

			// search in cartes and menus
			let searchContainers = ["horaires", "address", "cartes", "menus"];
			let selectedContainer = [];
			let selectedRows = {};
			let selectedMenus = [];

			for (let i = 0, ctnLength = searchContainers.length; i < ctnLength; i++)
			{
				// home page
				if (searchContainers[i] == "horaires")
				{
					let parent = document.getElementById(searchContainers[i] + "-container");
					let parentContent = parent.textContent.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
					if (parentContent.indexOf(searchWordClean) !== -1 || searchWordClean.indexOf("horair") !== -1)
					{
						selectedContainer.push(parent);
					}
				}
				else if (searchContainers[i] == "address")
				{
					let parent = document.getElementById(searchContainers[i] + "-container");
					let parentContent = parent.textContent.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
					if (parentContent.indexOf(searchWordClean) !== -1 || searchWordClean.indexOf("itinerair") !== -1 ||searchWordClean.indexOf("rout") !== -1 || searchWordClean.indexOf("acce") !== -1)
					{
						selectedContainer.push(parent);
					}
				}
				// only for cartes and menus
				else
				{
					let container = document.getElementById(searchContainers[i] + "-page");
					let titles = container.querySelectorAll("h3");
					let rows = container.querySelectorAll(".row");
					// title
					for (let j = 0, length = titles.length; j < length; j ++)
					{
						let divContent = titles[j].textContent;
						if (divContent.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").indexOf(searchWordClean) !== -1)
						{
							let parent = Tools.foundParent(titles[j], searchContainers[i] + "-container", "className");

							selectedContainer.push(parent);
							rows = cleanRows(rows, parent);
						}
					}
					// rows
					for (let j = 0, length = rows.length; j < length; j ++)
					{
						let divContent = rows[j].textContent;
						if (divContent.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").indexOf(searchWordClean) !== -1)
						{
							let parent = Tools.foundParent(rows[j], searchContainers[i] + "-container", "className");
							let title = parent.querySelector("h3").textContent;

							// cartes
							if (searchContainers[i] == "cartes")
							{
								selectedRows[title] = typeof selectedRows[title] == "undefined" ? [] : selectedRows[title];
								selectedRows[title].push(rows[j]);
							}
							// menus
							else
							{
								selectedMenus.push(parent);
							}
						}
					}
				}
			}

			that.displaySearch(searchWord, selectedContainer, selectedRows, selectedMenus);
		}
	}

	smoothScroll(destination, direction, speed, event = false)
	{
		if (event !== false)
		{
 			event.preventDefault();
		}

		let that = this;
		let distance = window.pageYOffset;
		let destTop = destination.offsetTop - document.getElementById("mainMenu").offsetHeight;
		this.tempoScrollTo = setInterval(function()
		{ 
			window.scrollTo(0, distance)
			if (direction == "bottom")
			{
				distance += speed;
				if (destTop <= distance)
				{
					window.scrollTo(0, destTop)
					clearInterval(that.tempoScrollTo);
				}		
			}
			else
			{
				distance -= speed;
				if (destination >= distance)
				{
					window.scrollTo(0, destination)
					clearInterval(that.tempoScrollTo);
				}					
			}
		}, 1);
	}

	/*adaptHomePageHeight()
	{
		// adapt home page height on mobile with stupid toolbar
		let home = document.querySelector(".home-content");
		let headerHead = document.querySelector("header").offsetHeight;
		let screenHeight = document.documentElement.clientHeight;
		let homeHeight = screenHeight - headerHead;
		home.style.height = homeHeight + "px";
	}*/

	scrollEvents()
	{
		// mainMenu
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
		
		// back top btn
		let backTopBtn = document.getElementById("backTop");
		if (backTopBtn.classList.contains("displayNone"))
		{
			if (window.pageYOffset >= screen.height - document.getElementById("mainMenu").offsetHeight)
			{
				backTopBtn.classList.remove("displayNone");
			}
		}
		else
		{
			if (window.pageYOffset < screen.height - document.getElementById("mainMenu").offsetHeight)
			{
				backTopBtn.classList.add("displayNone");		
			}
		}

		// bottomBar
		let bottomBar = document.getElementById("bottomBar-container");
		let footer = document.querySelector("footer");
		let footerHeight = footer.getBoundingClientRect().height;
		if (!bottomBar.classList.contains("bottomBar-updateBottom"))
		{
			if (window.pageYOffset + screen.height >= document.querySelector("body").offsetHeight - footerHeight)
			{
				bottomBar.classList.add("bottomBar-updateBottom");
			}
		}
		else
		{
			if (window.pageYOffset + screen.height < document.querySelector("body").offsetHeight - footerHeight)
			{
				bottomBar.classList.remove("bottomBar-updateBottom");
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

	closeSubMenus()
	{
		let subMenus = document.querySelectorAll(".subMenu-container");
		for (let i = subMenus.length - 1; i >= 0; i--)
		{
			if (subMenus[i].classList.contains("subMenu-open"))
			{
				subMenus[i].classList.remove("subMenu-open");
			}
		}
	}

	toggleSubMenu(btn, event)
	{
		event.preventDefault();

		let subMenu = document.querySelector("nav .subMenu-container");

		if (!subMenu.classList.contains("subMenu-open"))
		{
			subMenu.classList.add("subMenu-open");
			this.subMenuOpen = btn;
		}
		else
		{
			subMenu.classList.remove("subMenu-open");
		}
	}

	menuSelected(btn)
	{
		let navBtn = document.querySelectorAll("nav a");
		for (let i = navBtn.length - 1; i >= 0; i--)
		{
			if (navBtn[i].classList.contains("menuSelected"))
			{
				navBtn[i].classList.remove("menuSelected");
			}
		}
		// subMenu if is not search btn
		if (btn.id !== "search-btn")
		{
			if (this.subMenuOpen !== false)
			{
				this.subMenuOpen.classList.add("menuSelected");
			}
			btn.classList.add("menuSelected");
		}
	}

	changePage(pageName, event)
	{
		event.preventDefault();

		// if user click on a main nav btn => reset subMenuOpen
		if (Tools.foundParent(event.target, "subMenu-content", "className") === false)
		{
			this.subMenuOpen = false;
		}

		this.menuSelected(event.target);
		this.closeSubMenus();
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

		this.smoothScroll(0, "top", 100);
	}

	changeSubPage(page, subPage, event)
	{
		event.preventDefault();

		this.menuSelected(event.target);
		this.closeSubMenus();
		this.hideElements("section");
		this.hideElements("." + page + "-container");

		subPage = document.getElementById(subPage);
		page = document.getElementById(page + "-page");

		page.classList.remove("displayNone");
		subPage.classList.remove("displayNone");

		this.smoothScroll(0, "top", 100);
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
		let that = this;
		// load infos page
		let infosBtn = document.getElementById("infos-btn");
		infosBtn.addEventListener("click", this.changePage.bind(this, ["home", "infos"]), false);
		// load menus page
		let menusBtn = document.getElementById("menus-btn");
		menusBtn.addEventListener("click", this.changePage.bind(this, "menus"), false);
		// next page
		let homeNextPage = document.getElementById("home-nextPage");
		let page = document.getElementById("infos-page");
		homeNextPage.addEventListener("click", this.smoothScroll.bind(this, page, "bottom", 100), false);
		// back to top
		let backTop = document.getElementById("backTop");
		backTop.addEventListener("click", this.smoothScroll.bind(this, 0, "top", 100), false);
		// search
		let searchBtn = document.getElementById("search-btn");
		searchBtn.addEventListener("click", this.launchSearch.bind(this, that), false);
	}

	initFixedBottomBar()
	{
		let bottomBarContainer = Tools.creatElem("div", ["id", "class"], ["bottomBar-container", "bottomBar-container"]);
		let bottomBarContent = document.getElementById("backTop-container");
		let backTop = document.getElementById("backTop");
		bottomBarContent.id = "";
		bottomBarContent.className = "bottomBar-content maxWidth-container";

		// move phone
		let main = document.getElementById("main");
		let phone = document.getElementById("phone");
		bottomBarContent.insertBefore(phone, backTop);

		// down menu
		let downMenu = document.getElementById("downMenu");
		bottomBarContent.insertBefore(downMenu, backTop);
		document.getElementById("downMenu-container").remove();

		// back top menu
		document.getElementById("backTop").classList.add("displayNone");

		bottomBarContainer.appendChild(bottomBarContent);
		main.appendChild(bottomBarContainer);

		// update footer
		let footer = document.querySelector(".footer-content");
		let copyright = Tools.creatElem("p", [], []);
		copyright.textContent = "Copyright © 2019 - Hong Kong Express - Wavre";
		footer.insertBefore(copyright, footer.firstChild);
	}

	initNavSub(name)
	{
		let btn = document.querySelector("#" + name + "-btn");
		let nav = document.querySelector("nav");
		btn.addEventListener("click", this.toggleSubMenu.bind(this, btn), false);

		let ids = document.querySelectorAll("." + name + "-container")
		let titles = document.querySelectorAll("." + name + "-page .title-container h3")

		let navSubContainer = Tools.creatElem("div", ["class"], ["subMenu-container"]);
		let navSubContent = Tools.creatElem("ul", ["class"], ["subMenu-content maxWidth-container"]);

		// build "load all cat" btn
		let btnRow = Tools.creatElem("li", [], []);
		let btnLink = Tools.creatElem("a", ["id", "href"], [name + "All" + "-btn", "#"]);
		btnLink.textContent = "toutes";
		btnRow.appendChild(btnLink);
		navSubContent.appendChild(btnRow);

		btnLink.addEventListener("click", this.changePage.bind(this, "cartes"), false);

		// build cartes btn by cat
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
		nav.appendChild(navSubContainer);
		btn.classList.add("subMenu-btn");
	}

	initNav()
	{
		let mainMenu = document.getElementById("mainMenu");

		// add info nav
		let homeBtnRow = Tools.creatElem("li", [], []);
		let homeBtnLink = Tools.creatElem("a", ["id", "class", "href"], ["infos-btn", "menuSelected", "#"]);
		homeBtnLink.textContent = "Infos";
		homeBtnRow.appendChild(homeBtnLink);

		mainMenu.insertBefore(homeBtnRow, mainMenu.firstChild);
	}

	initPages()
	{
		let main = document.getElementById("main");
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
		// add search section
		let searchSection = Tools.creatElem("section", ["id", "class"], ["search", "searchResult-page displayNone"]);
		main.appendChild(searchSection);
	}

	init()
	{
		this.initPages();
		this.initNav();
		this.initNavSub("cartes");
		this.initFixedBottomBar()
		this.initButtons();
		this.initNavPosition();
		this.initStyleSheet();
	}
}

let loadContent = new Content;