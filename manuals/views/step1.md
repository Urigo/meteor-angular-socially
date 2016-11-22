[{]: <region> (header)
# Step 1: Static Template
[}]: #
[{]: <region> (body)
Let's create a purely static HTML page and then examine how we can turn this HTML code into a template that Angular 1 will use to dynamically display the same result with any set of data.

Add this template HTML to `client/main.html`:

[{]: <helper> (diff_step 1.1)
#### Step 1.1: Add some static HTML the to main page

##### Changed client/main.html
```diff
@@ -1 +1,14 @@
-┊ 1┊  ┊<p>Nothing here {{ 'yet' + '!' }}</p>
+┊  ┊ 1┊<ul>
+┊  ┊ 2┊  <li>
+┊  ┊ 3┊    <span>Dubstep-Free Zone</span>
+┊  ┊ 4┊    <p>
+┊  ┊ 5┊      Can we please just for an evening not listen to dubstep.
+┊  ┊ 6┊    </p>
+┊  ┊ 7┊  </li>
+┊  ┊ 8┊  <li>
+┊  ┊ 9┊    <span>All dubstep all the time</span>
+┊  ┊10┊    <p>
+┊  ┊11┊      Get it on!
+┊  ┊12┊    </p>
+┊  ┊13┊  </li>
+┊  ┊14┊</ul>
```
[}]: #

Next we'll dynamically generate the same list using Angular 1.

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Intro](../../README.md) | [Next Step >](step2.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #