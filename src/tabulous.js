(function($){
  'use strict';

  var defaults = {
        tabCSS:     'tabu-tab-active',
        contentCSS: 'tabu-cont-active',
        event:      'click',
        index:      0,
        callback:   function(){}
      },
      CONSTANTS = {
        NAMESPACE: 'tabulous',
        METHODS: [
          'add',
          'get',
          'remove',
          'set',
          'updateDOM'
        ],
        ARIA: {
          ROLE: 'role',
          TAB: 'tab',
          TABPANEL: 'tabpanel',
          PRES: 'presentation',
          HIDDEN: 'aria-hidden',
          SELECTED: 'aria-selected',
          CONTROLS: 'aria-controls',
          LABELLEDBY: 'aria-labelledby'
        }
      },
      Tabulous = function(){
        this.init.apply(this, arguments);
      };

  $.extend(Tabulous.prototype, {
    init: function($el, config){
      var isValidEvt = false;

      this.$el = $el;
      this.config = $.extend({}, defaults, config || {});

      this._active = -1;

      this._reindex();

      isValidEvt = this.config.event === 'click' || this.config.event === 'mouseover';
      this.config.event = isValidEvt ? this.config.event : 'click';

      this._addEvents();

      this.$el.attr('role', 'tablist');
      this.set(this.config.index);
    },

    _generateID: function(){
      var id = CONSTANTS.NAMESPACE + '_',
          chars = '0123456789',
          charsLen = chars.length,
          len = 10,
          rStr = '';

      while (len--){
        rStr += chars.charAt(Math.floor(Math.random() * charsLen));
      }

      id += rStr;

      return id;
    },

    _addAriaTab: function($el, $tab){
      var aria = CONSTANTS.ARIA,
          tabAttrs = {};

      if ($el.attr(aria.ROLE) !== aria.PRES){
        $el.attr(aria.ROLE, aria.PRES);
      }

      if ($tab.attr(aria.ROLE) !== aria.TAB){
        tabAttrs[aria.ROLE] = aria.TAB;
      }

      if ($tab.attr(aria.SELECTED) !== false){
        tabAttrs[aria.SELECTED] = false;
      }

      if (typeof $tab.attr(aria.CONTROLS) === 'undefined'){
        tabAttrs[aria.CONTROLS] = $tab.prop('hash').substr(1);
      }

      if (typeof $tab.attr('id') === 'undefined'){
        tabAttrs.id = this._generateID();
      }

      $tab.attr(tabAttrs);
    },

    _addAriaContent: function($el, $content){
      var aria = CONSTANTS.ARIA,
          contAttr = {};

      if ($content.attr(aria.HIDDEN) !== true){
        contAttr[aria.HIDDEN] = true;
      }

      if ($content.attr(aria.ROLE) !== aria.TABPANEL){
        contAttr[aria.ROLE] = aria.TABPANEL;
      }

      if (typeof $content.attr(aria.LABELLEDBY) === 'undefined'){
        contAttr[aria.LABELLEDBY] = $el.attr('id');
      }

      $content.attr(contAttr);
    },

    _addAria: function($el, $tab, $content){
      this._addAriaTab($el, $tab);
      this._addAriaContent($tab, $content);
    },

    _reindex: function(){
      var $el,
          $tab,
          $content;

      this.cache = [];

      this.$el.find('li').each(
        $.proxy(function(index, element){
          $el = $(element);
          $tab = $el.find('a');
          $content = $($tab.prop('hash'));

          this._addAria($el, $tab, $content);

          this.cache.push({
            tab: $el,
            content: $content
          });
        }, this)
      );
    },

    _addEvents: function(){
      this.$el.on(
        this.config.event + '.' + CONSTANTS.NAMESPACE,
        'a',
        $.proxy(function(evt){
          var $el = $(evt.target),
              index = $el.parent().index();

          this.set(index, evt);
        }, this)
      );
    },

    _switchTab: function(evt){
      var $el = $(evt.target.parentNode),
          index = $el.index();

      this.set(index, evt);
    },

    _setState: function(i, action){
      var selected = true,
          hidden = false;

      if (action !== 'add'){
        action = 'remove';
        selected = false;
        hidden = true;
      }

      if (this.cache[i]){
        this.cache[i]
          .tab[action + 'Class'](this.config.tabCSS)
          .find('a')
          .attr(CONSTANTS.ARIA.SELECTED, selected);

        this.cache[i]
          .content[action + 'Class'](this.config.contentCSS)
          .attr(CONSTANTS.ARIA.HIDDEN, hidden);
      }
    },

    _reset: function(){
      this._setState(this._active);
      this._active = -1;
    },

    set: function(index, evt){
      var n = this.get();

      if (index === n){
        if (evt){
          evt.preventDefault();
        }
        return;
      }

      if (typeof this.config.callback === 'function'){
        if (this.config.callback(index, this.cache[index].tab, this.cache[index].content) === false){
          return;
        }
      }

      if (evt){
        evt.preventDefault();
      }

      if (n > -1){
        this._setState(n);
      }

      this._setState(index, 'add');
      this._active = index;
    },

    get: function(){
      return this._active;
    },

    updateDOM: function(callback, index){
      if (typeof callback === 'function'){
        callback();
      }

      if (typeof index !== 'undefined'){
        this._reset();
        this._reindex();
        this.set(index);
      } else {
        this._reindex();
      }
    },

    add: function(tab, content, position){
      var len = this.cache.length,
          n = this.get(),
          $tab = $(tab),
          $content = $(content);

      if (position > len){
        return;
      }
      
      this._reset();

      if (position <= n){
        n++;
      }

      if (position === len){
        this.cache[position - 1].tab.after($tab);
        this.cache[position - 1].content.after($content);

        this.cache.push({
          tab: $tab,
          content: $content
        });
      } else if(position < len){
        this.cache[position].tab.before($tab);
        this.cache[position].content.before($content);

        this.cache.splice(position, 0, {
          tab: $tab,
          content: $content
        });
      }

      this._addAria($tab, $tab.find('a'), $content);
      this.set(n);
    },

    remove: function(position){
      var n = this.get();

      if (this.cache[position]){
        this.cache[position].tab.remove();
        this.cache[position].content.remove();

        if (position === this._active){
          this._reset();

          if (!this.cache[position + 1] && this.cache[position - 1]){
            n--;
          }
        }

        this._reindex();

        if (this.cache.length){
          this.set(n);
        }
      }
    }
  });

  $.fn.tabulous = function(){
    var args = [].slice.call(arguments),
        instance,
        method,
        $el;

    if (typeof args[0] === 'string'){
      return this.each(function(index, element){
        $el = $(element);

        if ($el.data(CONSTANTS.NAMESPACE)){
          instance = $el.data(CONSTANTS.NAMESPACE);

          if ($.inArray(args[0], CONSTANTS.METHODS) > -1){
            method = args.shift();
            instance[method].apply(instance, args);
          }
        }
      });
    } else {
      return this.each(function(index, element){
        $el = $(element);

        if (!$el.data(CONSTANTS.NAMESPACE)){
          $el.data(CONSTANTS.NAMESPACE, new Tabulous($el, args[0]));
        }
      });
    }
  };
}(jQuery));