TODOs
====

1. Multi-seat with custom hatching fills implementation
2. Improved transitions, etc. Touch up styling.
3. Extensions such as generating circle charts

Done
====

1. Pen components -- DONE
2. Council search component? -- DONE
3. Map components -- DONE
4. Logical implementation of painting -- DONE
5. Download buttons -- DONE
6. UI navigation and deep-links switching between councils -- DONE
7. import/export functionality -- DONE

Ideas
=====
can create custom party pens for single fill colour
can create custom stripe pens from other party pens (and give option to create new party pen at that point)
then give edit and delete buttons like on the corner when hover for those pens

then can maybe look at autogenerating a semicircle chart :o

creation in a modal - with preview (disabled input obvs)
back it with localstorage for party/pens
deeplinks for different councils
golden!

by using a pattern and matched url to fill a square we can also easily tell what it's filled with
and can then cascade an update of colour or deletion


SPA URL/Routing
====

/{group slug}/{boundary slug}/ - load as group + boundary file

if no boundary slug - load single one as default, or display list to choose from
