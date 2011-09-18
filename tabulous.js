/*
* Tabulous jQuery Plugin v1.1
*
* Copyright (c) 2011 Andrew A. Lee
*
* Dual licensed under the MIT and GPL licenses, located in
* MIT-LICENSE.txt and GPL-LICENSE.txt respectively.
*
* Sun Sep 18 2011 15:32:29 GMT-0500 (CDT)
*/
(function($){
$.fn.tabulous = function(opts){
	var st = {
		tabClass: 'tabu-tab-active',
		contentClass: 'tabu-cont-active',
		event: 'click',
		index: 0,
		callback: null,
		checkJS: true
	};

	var methods = {
		markHtml: function(){
			if(st.checkJS){
				var $html = $(document.documentElement), cls = 'js-tabulous';
				if(!$html.hasClass(cls)){$html.addClass(cls);}
			}
		},

		resetTabs: function($a){
			var $li = $a.parent(),
				$aLi = $li.siblings('li.' + st.tabClass),
				id = $aLi.find('a')[0].hash;
			
			$aLi.removeClass(st.tabClass);
			$(id).removeClass(st.contentClass);
		},
		
		handleEvent: function(e){
			e.preventDefault();
			
			var $this = $(this),
				_this = methods,
				$cont = $(this.hash);
				
			if($this.parent().hasClass(st.tabClass)){return;}
			
			if(st.callback && typeof st.callback == 'function'){
				if(st.callback($this, $cont) === false){
					return;
				}
			}
			
			_this.resetTabs($this);
			$this.parent().addClass(st.tabClass);
			$cont.addClass(st.contentClass);
		}
	};

	$.extend(st, opts || {});
	
	if(st.event != 'click' && st.event != 'mouseover'){st.event = 'click';}
	
	methods.markHtml();
	
	return this.each(function(){
		var $this = $(this);
		
		if(st.index > 0){
			var $li = $this.find('li:nth-child(' + st.index + ')'),
				$cont = $($li.find('a').attr('href'));
			
			$li.addClass(st.tabClass);
			$cont.addClass(st.contentClass);
		}
		
		$this.delegate('a', st.event + '.tabulous', methods.handleEvent);
	});
};
})(jQuery);