# Visualization Pitfall Detector
#### Chrome Extension created for CMSC 25900 

## Demo Video
#### https://youtu.be/mFZ3pT9sia0 
--- 
## How to use

### Installation 

This Chrome Extension does not yet exist on the chrome web store, so you will need to manually enable it. 
(Steps taken and modified slightly from https://developer.chrome.com/extensions/getstarted)

1. Clone or download this repository. All the files need to be in a single folder.
2. Open the Chrome Extension Management page by navigating to `chrome://extensions`
3. Enable Developer Mode by clicking the toggle switch next to Developer mode.
4. Click the LOAD UNPACKED button
5. Select the folder that you downloaded in (1)
6. Make sure the toggle in the box displaying the extension is toggled on.

The extension should now be enabled, and appear in your toolbar next to the url box. You may need to refresh the page or restart your browser. 

### Usage

1. Visit a webpage with a graph you would like to inspect.
2. Click on the toolbar icon for the extension. 
3. Click the "start" button in the popup.
4. Click on the visualization in the webpage
   1. A message may appear warning you that limited or no information could be parsed. (See Limitations section). Even if no or limited information was parsable, you can click "ok" to proceed and see what the tool could gather and generic visualization pitfalls to look out for, or you can click "cancel" and choose a new chart to try.
5. A new tab/window will open with the results of parsing the visualization
6. To parse a new graph, repeat the process from (1). 

### Examples
Here are a few charts that the extension works well with, from two different news sources. Consider these as a proof-of-concept. 
- https://www.nytimes.com/interactive/2020/world/coronavirus-maps.html 
  - Total Cases chart at top of page
  - New reported cases/deaths charts halfway down
- https://www.wsj.com/articles/drivers-take-advantage-of-low-gas-prices-as-states-reopen-11591003803
  - Average price chart
  - Apple Maps requests chart
- Also see the description of the video above for more examples. 
---
## Limitations
- Limited parsing abilities
  - It is way more difficult than I thought it would be to get information from svg/html tags, and there is an extreme lack of consistency between charts. It's like there's an every chart for itself mentality for creators, there is very little standardization
- Only supports 2 chart types, line and bar
- Assumes the y-axis is the independent axis when displaying possible pitfalls. 
- Can only generate specific feedback about axis labels if they fit in a few defined categories or intersection of categories. Other advice is generic based on chart type. 
- Doesn't show chart on same page as results. 
  
---
## Future plans 
- Show a capture of the chart on the results page, or show the results in the popup
  - Currently hindered by issues with permissions and message passing with extension scripts
- Add support for more chart types
- Use nlp to parse meaning out of chart titles or arbitrary axis labels
- Look in the surrounding text to find references to the chart
- Add parsing of the data source if cited, and include information on that
- Improve code logic/efficiency.
  - Communication between scripts in Chrome extensions is messy, as is loading/updating a results page. 

Results page based on a template modified from Thomas Hardy: http://www.thomashardy.me.uk/free-responsive-html-css3-cv-template
