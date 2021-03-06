##Background

Tabulous provides an easy method of creating tabbed interfaces. As long as the specified HTML
structure is followed, the tabulous plugin will take care of creating the tabbed functionality.

##Usage

First you must set up the proper HTML structure:

```html
<div id="tab_container_1" class="tab-container">
  <!-- tabs -->
  <ul id="tabs" class="tabs">
    <!-- set the first tab as active -->
    <li class="tabu-tab-active"><a href="#tab_1">one</a></li>
    <li><a href="#tab_2">two</a></li>
    <li><a href="#tab_3">three</a></li>
  </ul>

  <!-- content blocks, first block is set active -->
  <div id="tab_1" class="content tabu-cont-active">Tab 1 contents. Lorem Ipsum.</div>
  <div id="tab_2" class="content">Tab 2 contents. Lorem Ipsum.</div>
  <div id="tab_3" class="content">Tab 3 contents. Lorem Ipsum.</div>
</div>
```

By default, Tabulous applies the "tabu-tab-active" class name to the active tab element, and the
"tabu-cont-active" class name to the active content block element.

Use these class names to set the display properties of the content elements to either
"display:block" or "display:none":
```css
.content {display: none;}
.tabu-cont-active {display: block;}
```

Each of your content blocks must contain a unique ID attribute. The HREF attribute of each tab must 
match the ID attribute of the corresponding content block. Initialize the plugin by applying it to
the UL element wrapping the tabs.

```javascript
$('ul.tabs').tabulous();
```

For best performance, use an ID attribute to initialize the tabs, or a parent element as reference
that contains a unique ID.

Initialize with an ID on the UL tab wrapper:
```javascript
$('#tabs').tabulous();
```

Initialize using a parent reference:
```javascript
$('#tab_container_1').find('ul.tabs').tabulous();
```

Tabulous attaches a class name to the <html> tag of the page to indicate that JavaScript is enabled.
The class name is "js-tabulous". Use this as a qualifier to hide the non active content blocks. For
example:

```css
.js-tabulous .content {display: none;} /* content blocks are hidden when JS is enabled */
.js-tabulous .tabu-cont-active {display: block;} /* show the active content block */
```

This ensures graceful degradation in the case that JavaScript is disabled, as all the content blocks
will still be visible to the user.

Note: all structural and show/hide settings must be set up via CSS. This is to ensure maximum 
customization and to keep stylistic and behavioral layers separate. See the included index.html for 
examples. The included base.css features the basic base styles needed to create a tab structure.


##Options

Tabulous features 6 optional settings.

- **tabClass**: A custom class name applied to the active tab element. Default is "tabu-tab-active".
- **contentClass**: A custom class name applied to the active content element. Default is 
"tabu-cont-active".
- **event**: Tabulous works with either the "click" event or the "mouseover" event. Default is
"click".
- **index**: The zero based index of the tab that should be active on initialization. For performance 
reasons, it is recommended that you simply hardcode the initial active tab in your HTML. But, it is 
understood that in some instances you need to load a previously saved state, and this is when the 
index setting comes to use. The index option is ignored until it is explicitly set.
- **callback**: A custom callback function that runs when a tab is clicked or moused over. The anchor element and content
  block element instances, respectively, are passed as arguments in the callback. Returning false within the callback
  function will stop the execution of the tab switch. Use the callback to create more complex interactions, such
  as ajax and dynamic content generation.
- **checkJS**: Turns off the injection of the "js-tabulous" class name to the <html> element on initialization. Default
  setting is true, set to false to disable this JavaScript check.

Example:
```javascript
$('#tabs').tabulous({
  tabClass: 'my-active-tab',          // default is 'tabu-tab-active'
  contentClass: 'my-active-content',  // default is 'tabu-cont-active'
  event: 'click',                     // can be set to either 'click' (default) or 'mouseover'
  index: 0,                           // the 0 based index of that tab that should be active on init
  callback: null,                     // callback function that runs when tab switch is triggered
  checkJS: true                       // prevent class attachment to the HTML element on init, default is true,
                                      // set to false to disable
});
```


##Additional Info

See index.html for more usage guides and examples.