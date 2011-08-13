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
			if(this.st.checkJS){
				var $html = $(document.documentElement), cls = 'js-tabulous';
				if(!$html.hasClass(cls)){$html.addClass(cls);}
			}
		},

		resetTabs: function($a){
			var $li = $a.parent(),
				$aLi = $li.siblings('li.' + this.st.tabClass),
				id = $aLi.find('a').attr('href');
			
			$aLi.removeClass(this.st.tabClass);
			$(id).removeClass(this.st.contentClass);
		},
		
		handleEvent: function(e){
			e.preventDefault();
			
			var $this = $(this),
				_this = methods,
				$cont = $($this.attr('href'));
				
			if($this.parent().hasClass(_this.st.tabClass)){return;}
			
			if(_this.st.callback){
				if(!_this.st.callback($this, $cont)){
					return;
				}
			}
			
			_this.resetTabs($this);
			$this.parent().addClass(_this.st.tabClass);
			$cont.addClass(_this.st.contentClass);
		}
	};
	
	$.extend(methods.st, opts || {});
	
	if(methods.st.event != 'click' && methods.st.event != 'mouseenter'){methods.st.event = 'click';}
	
	methods.markHtml();
	
	return this.each(function(){
		
		var $a = $(this).find('li a'),
			$sa = methods.st.index + 1 == $a.length ? $a.slice(methods.st.index) : $a.slice(methods.st.index, methods.st.index + 1),
			$cont = $($sa.attr('href'));
			
		$sa.parent().addClass(methods.st.tabClass);
		$cont.addClass(methods.st.contentClass);
		
		$a.bind(methods.st.event + '.tabulous', methods.handleEvent);
	});
};
})(jQuery);