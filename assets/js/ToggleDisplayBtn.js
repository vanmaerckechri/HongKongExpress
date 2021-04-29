(function()
{
	"use strict";

	CVM.ToggleDisplayBtn = function(btn)
	{
        this.btn = btn;

        this.init();
	};

	CVM.ToggleDisplayBtn.prototype.init = function()
	{
        window.addEventListener("scroll", this.toggle.bind(this));
        this.toggle();
	};

    CVM.ToggleDisplayBtn.prototype.toggle = function()
	{
		var height = Math.round(window.innerHeight / 4);

		if (document.body.scrollTop > height || document.documentElement.scrollTop > height)
		{
			this.btn.classList.remove("disable");
		}
		else
		{
			this.btn.classList.add("disable");
		}
	}
}());