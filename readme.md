# Smart Progress Bar
Easly create the pop-up bar with several progress elements in one window

### [Live Template](https://garoncode.github.io/smart-progress-bar/liveTemplate/)
![alt-текст](https://github.com/GaronCode/smart-progress-bar/blob/217bc7d59539d806ed4933deac4648d3037a73ae/docs/img/preview.png?raw=true "Live template preview")
### [Full Documentation](https://garoncode.github.io/smart-progress-bar/)

***
## Usage
1. Include Bar.
    If you want use as:
   - ***NPM***
    add to project
    ```batch
    npm install smart-progress-bar
    ```
    and import it
    ```js
    import { SmartProgressBar } from "smart-progress-bar";
    ```
   -  ***MODULE***
   copy file from [this](https://github.com/GaronCode/smart-progress-bar/blob/217bc7d59539d806ed4933deac4648d3037a73ae/dist/smartprogressbar.esm.js)  (or [minify version](https://github.com/GaronCode/smart-progress-bar/blob/217bc7d59539d806ed4933deac4648d3037a73ae/dist/smartprogressbar.esm.mini.js)) to your project
    ```html
    <script type="module">
    import { SmartProgressBar } from "./smartprogressbar.esm.js";
    ...
    </script>
    ```
    - ***iife-style*** (you need use global object `SPB`)
    copy file from [this](https://github.com/GaronCode/smart-progress-bar/blob/217bc7d59539d806ed4933deac4648d3037a73ae/dist/smartprogressbar.iife.js)  (or [minify version](https://github.com/GaronCode/smart-progress-bar/blob/217bc7d59539d806ed4933deac4648d3037a73ae/dist/smartprogressbar.iife.mini.js)) to your project
    ```html
    <script src="smartprogressbar.iife.js"></script>
    <script>
        ...
    </script>
    ```
2. Setting up the bar if needed
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