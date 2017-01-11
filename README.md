# Ghost Ocular Implants Upgrade

[![N|Solid](http://vignette2.wikia.nocookie.net/starcraft/images/1/1e/InterOcImp_Terran_SC1.PNG/revision/latest?cb=20100605035249)](https://github.com/wbarahona/ghost-ocular-implants)

**Cost:**
**100** Mineral ![N|Solid](http://vignette2.wikia.nocookie.net/starcraft/images/a/a3/Minerals_Terran_SC1.png/revision/latest?cb=20080313030234)
**100** Gas ![N|Solid](http://vignette3.wikia.nocookie.net/starcraft/images/a/aa/Gas_Terran_SC1.png/revision/latest?cb=20080313024810)

Increases ghost sight range by 2 (to 11), making sight range greater than the nuke blast radius and allowing ghost to search for posts by title and tag names.

---

## Usage
Above all you need to activate the public API by logging into the admin, then click on Labs, then click on public API. Follow these [instructions](https://www.ghostforbeginners.com/how-to-enable-ghosts-public-api/) for further info.

Now, you need to define some html markup, a form with an input element will do the trick.
```html
    <form action="/">
        <input type="text" name="search" class="search" />
    </form>
    <ul id="results"></ul>
```

Then you need some javascript like:
```javascript
    $('.search').ghostOcularImplants();
```

Et Voil&agrave;! You can now search through the post list and display results into a result box.

---

### Options
You can customize certain parameters on how this plugin will behave:

### Results
By default and as a fallback, the results are appended a results id element or to the body but it is better you define a results box of your own.
Create a results box like the example below
```html
    <ul class="post-results"></ul>
```
Once you have to defined a searchbox, you can pass it by setting the name in the parameters.

```javascript
    $('.search').ghostOcularImplants({results: '.post-results'});
```

### Template
The default template is a list item with a link pointing to the post url, the post title, the post tags and the post date.
You can have a custom template as well, and you can define the field outputs in &agrave;la [handlebars] fashion.
```javascript
    {template: '<li>{{title}}</li>'}
```
This later will be replaced by the post title under a list item.
You can have access to the response, if you further read the [ghostapi-post] response you can state what entities or properties you want to output in your template.
```javascript
    {template: '<li>{{slug}} - {{title}} - {{author.name}}<li>'}
```
The above will output a list item with the post slug - the title - author name


**About the {{tags}} entity:**
This 'special' entity will output the post tags automatically for you, so you need only to place the entity and done, all post tags will be shown separated by comma.

**About the {{date: [ date format ]**
This 'special' entity will output the post date in a friendly way, as ghost blog stores the save date as string in javascript date format we can have access to it and modify it as we see fit, but this plugin has a more friendly way to present dates other than **"2017-01-10T17:24:55.000Z"**. Now you can simply use:
```javascript
    {template: '<li>{{title}} on: {{date: MM-DD-YYYY}}</li>'}
```
That above will output the post date in the MM-DD-YYYY format, sadfuly for now you can only use the following formats:
- MM-DD-YYYY
- MMM-DD-YYYY
- DD-MM-YYYY
- DD-MMM-YYYY
- YYYY-MM-DD
- YYYY-MMM-DD

and all the above with the two digit year format (YY).

### No results template
You can define a custom template when no results are found, you can set it by passing the following option:
```javascript
    {noresults: '<p>Welp! No results, no fun!</p>'}
```
The above defines a custom message for the user, easy!

---

## Todos

 - Write Tests
 - Output debugging method
 - More date formats
 - Time entity

License
----

GNU GENERAL PUBLIC LICENSE




   [mustache]: <http://handlebarsjs.com/>
   [git-repo-url]: <https://github.com/wbarahona/ghost-ocular-implants>
   [willmer]: <http://wbarahona.me>
   [@wubarahona]: <http://twitter.com/wubarahona>
   [ghostapi-post]: <https://api.ghost.org/docs/posts>
