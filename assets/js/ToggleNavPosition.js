(function()
{
	"use strict";

	CVM.ToggleNavPosition = function(header, nav, main)
	{
		this.header = header;
		this.nav = nav;
		this.main = main;

		this.init();
	};

	CVM.ToggleNavPosition.prototype.init = function()
	{	
        window.addEventListener('scroll', this.toggleStatus.bind(this));
	};

    CVM.ToggleNavPosition.prototype.toggleStatus = function()
	{	
		if (!this.nav.classList.contains("fixed"))
		{
			var navInfo = this.nav.getBoundingClientRect();
			if (navInfo.top <= 0)
			{
				this.nav.classList.add("fixed");
				this.main.style.marginTop = navInfo.height + "px";
			}
		}
		else
		{
			var headerInfo = this.header.getBoundingClientRect();
			if (headerInfo.bottom >= 0)
			{
				this.nav.classList.remove("fixed");
				this.main.style.marginTop = "";
			}
		}
	};
}());