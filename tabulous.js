(function($){
$.fn.tabulous = function(opts){
	var methods = {
		st: {
			tabClass: 'tabu-tab-active',
			contentClass: 'tabu-cont-active',
			event: 'click',
			index: 0,
			callback: null,
			checkJS: true
		},
		
		markHtml: function(){
			if(st.checkJS){
				var $html = $(document.documentElement), cls = 'js-tabulous';
				if(!$html.hasClass(cls)){$html.addClass(cls);}
			}
		},

		resetTabs: function($a){
			var $li = $a.parent(),
				$aLi = $li.siblings('li.' + st.tabClass),
				id = $aLi.find('a').attr('href');
			
			$aLi.removeClass(st.tabClass);
			$(id).removeClass(st.contentClass);
		},
		
		handleEvent: function(e){
			e.preventDefault();
			
			var $this = $(this),
				_this = methods,
				$cont = $($this.attr('href'));
				
			if($this.parent().hasClass(st.tabClass)){return;}
			
			if(st.callback){
				if(st.callback($this, $cont) === false){
					return;
				}
			}
			
			_this.resetTabs($this);
			$this.parent().addClass(st.tabClass);
			$cont.addClass(st.contentClass);
		}
	},
	st = methods.st;
	
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