# Smart Progress Bar
## Usage
1. Include Bar.
    If you want use as:
   -  a module
    ```html
    <script type="module">
    import { SmartProgressBar } from "./smartprogressbar.esm.js";
    const Settings = { ... }
    const ProgressBar = new SmartProgressBar( Settings );
    </script>
    ```
    - iife-style (you need use global object `SPB`)
    ```html
    <script src="smartprogressbar.iife.js"></script>
    <script>
    const Settings = { ... }
    const ProgressBar = new SPB.SmartProgressBar( Settings );
    </script>
    ```
2. Setting up the bar if needed (object **Settings**)
   (default settings)
    ```js
    const Settings = {
        //  selector a place for place a bar window
        whereSelector: "body", 
        // show pop-up immediately
        show: true, 
        //  displayed text
        headerText: "Loading",
        // display in compact size
        minimize: false,
        // enable change size on click
        changeSizeOnClick: true
    }
    const ProgressBar = new SmartProgressBar( Settings );
    ```

3. After that, you need to create an instance of progress (one or more) like that:
   ```js
    const first = ProgressBar.addProgress({
        // name of your progress
        name: "HungryAlphaBlueWolf.mp4",
        // start procent
        progress: 10,
    });
   ```
4. Now you can change progress anywhere:
   ```js
    first.progress = 58;
   ```
5. If you want delete progress - use this:
   ```js
    ProgressBar.removeProgress(first);
    ```
6. And you can hide main window with `hide()`:
   ```js
   ProgressBar.hide();
   ```