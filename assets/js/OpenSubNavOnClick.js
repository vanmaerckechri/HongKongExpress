(function()
{
	"use strict";

	CVM.OpenSubNavOnClick = function(btn)
	{
		this.btn = btn;

		this.init();
	};

	CVM.OpenSubNavOnClick.prototype.init = function()
	{	
        this.btn.classList.remove("subMenu-btn");
        this.btn.addEventListener('click', this.toggleStatus.bind(this));
	};

    CVM.OpenSubNavOnClick.prototype.toggleStatus = function()
	{	
		if (!this.btn.classList.contains("subMenu-btn-click"))
		{
            this.btn.classList.add("subMenu-btn-click");
		}
		else
		{
            this.btn.classList.remove("subMenu-btn-click");
		}
	};
}());