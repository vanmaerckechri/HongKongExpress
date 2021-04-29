(function()
{
	"use strict";

	CVM.SmoothScrollToDestination = function(btn, destination, )
	{
		this.interval = null;

		this.add(btn, destination);
	};

	CVM.SmoothScrollToDestination.prototype.add = function(btn, destination)
	{
		btn.addEventListener("click", this.goToDestination.bind(this, destination));
	};
	
	CVM.SmoothScrollToDestination.prototype.goToDestination = function(destination, e)
	{
		e.preventDefault();

		if (this.interval) 
		{
			return;
		}

		var startPos = window.pageYOffset;
		var speed = destination.getBoundingClientRect().top <= 0 ? -100 : 100;
		var distTrav = 0;
		var startAt = new Date();
		this.interval = setInterval(function()
		{ 
			distTrav += speed;
			window.scrollTo(0, startPos + distTrav);
			var length = destination.getBoundingClientRect().top;
			if ((length < Math.abs(speed) && length > -1 * Math.abs(speed)) || (new Date() - startAt > 1000))
			{
				window.scrollTo(0, window.pageYOffset + length)
				clearInterval(this.interval);
				this.interval = null;
				return;
			}
		}.bind(this));
	}
}());