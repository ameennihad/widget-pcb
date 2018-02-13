# com-chilipeppr-widget-pcb
This widget lets you drag in a PCB board file to mill.

![alt text](screenshot.png "Screenshot")

## ChiliPeppr Widget / PCB Board v1.0

All ChiliPeppr widgets/elements are defined using cpdefine() which is a method
that mimics require.js. Each defined object must have a unique ID so it does
not conflict with other ChiliPeppr widgets.

| Item                  | Value           |
| -------------         | ------------- | 
| ID                    | com-chilipeppr-widget-pcb |
| Name                  | Widget / PCB Board v1.0 |
| Description           | This widget lets you drag in a PCB board file to mill. |
| chilipeppr.load() URL | http://raw.githubusercontent.com/ameennihad/widget-pcb/master/auto-generated-widget.html |
| Edit URL              | http://ide.c9.io/ameennihad/widget-pcb |
| Github URL            | http://github.com/ameennihad/widget-pcb |
| Test URL              | https://preview.c9users.io/ameennihad/widget-pcb/widget.html |

## Example Code for chilipeppr.load() Statement

You can use the code below as a starting point for instantiating this widget 
inside a workspace or from another widget. The key is that you need to load 
your widget inlined into a div so the DOM can parse your HTML, CSS, and 
Javascript. Then you use cprequire() to find your widget's Javascript and get 
back the instance of it.

```javascript
// Inject new div to contain widget or use an existing div with an ID
$("body").append('<' + 'div id="myDivWidgetPcb"><' + '/div>');

chilipeppr.load(
  "#myDivWidgetPcb",
  "http://raw.githubusercontent.com/ameennihad/widget-pcb/master/auto-generated-widget.html",
  function() {
    // Callback after widget loaded into #myDivWidgetPcb
    // Now use require.js to get reference to instantiated widget
    cprequire(
      ["inline:com-chilipeppr-widget-pcb"], // the id you gave your widget
      function(myObjWidgetPcb) {
        // Callback that is passed reference to the newly loaded widget
        console.log("Widget / PCB Board v1.0 just got loaded.", myObjWidgetPcb);
        myObjWidgetPcb.init();
      }
    );
  }
);

```

## Publish

This widget/element publishes the following signals. These signals are owned by this widget/element and are published to all objects inside the ChiliPeppr environment that listen to them via the 
chilipeppr.subscribe(signal, callback) method. 
To better understand how ChiliPeppr's subscribe() method works see amplify.js's documentation at http://amplifyjs.com/api/pubsub/

  <table id="com-chilipeppr-elem-pubsubviewer-pub" class="table table-bordered table-striped">
      <thead>
          <tr>
              <th style="">Signal</th>
              <th style="">Description</th>
          </tr>
      </thead>
      <tbody>
      <tr valign="top"><td>/com-chilipeppr-widget-pcb/onExampleGenerate</td><td>Example: Publish this signal when we go to generate gcode.</td></tr>    
      </tbody>
  </table>

## Subscribe

This widget/element subscribes to the following signals. These signals are owned by this widget/element. Other objects inside the ChiliPeppr environment can publish to these signals via the chilipeppr.publish(signal, data) method. 
To better understand how ChiliPeppr's publish() method works see amplify.js's documentation at http://amplifyjs.com/api/pubsub/

  <table id="com-chilipeppr-elem-pubsubviewer-sub" class="table table-bordered table-striped">
      <thead>
          <tr>
              <th style="">Signal</th>
              <th style="">Description</th>
          </tr>
      </thead>
      <tbody>
      <tr><td colspan="2">(No signals defined in this widget/element)</td></tr>    
      </tbody>
  </table>

## Foreign Publish

This widget/element publishes to the following signals that are owned by other objects. 
To better understand how ChiliPeppr's subscribe() method works see amplify.js's documentation at http://amplifyjs.com/api/pubsub/

  <table id="com-chilipeppr-elem-pubsubviewer-foreignpub" class="table table-bordered table-striped">
      <thead>
          <tr>
              <th style="">Signal</th>
              <th style="">Description</th>
          </tr>
      </thead>
      <tbody>
      <tr><td colspan="2">(No signals defined in this widget/element)</td></tr>    
      </tbody>
  </table>

## Foreign Subscribe

This widget/element publishes to the following signals that are owned by other objects.
To better understand how ChiliPeppr's publish() method works see amplify.js's documentation at http://amplifyjs.com/api/pubsub/

  <table id="com-chilipeppr-elem-pubsubviewer-foreignsub" class="table table-bordered table-striped">
      <thead>
          <tr>
              <th style="">Signal</th>
              <th style="">Description</th>
          </tr>
      </thead>
      <tbody>
      <tr><td colspan="2">(No signals defined in this widget/element)</td></tr>    
      </tbody>
  </table>

## Methods / Properties

The table below shows, in order, the methods and properties inside the widget/element.

  <table id="com-chilipeppr-elem-methodsprops" class="table table-bordered table-striped">
      <thead>
          <tr>
              <th style="">Method / Property</th>
              <th>Type</th>
              <th style="">Description</th>
          </tr>
      </thead>
      <tbody>
      <tr valign="top"><td>id</td><td>string</td><td>"com-chilipeppr-widget-pcb"<br><br>The ID of the widget. You must define this and make it unique.</td></tr><tr valign="top"><td>name</td><td>string</td><td>"Widget / PCB Board v1.0"</td></tr><tr valign="top"><td>desc</td><td>string</td><td>"This widget lets you drag in a PCB board file to mill."</td></tr><tr valign="top"><td>url</td><td>string</td><td>"http://raw.githubusercontent.com/ameennihad/widget-pcb/master/auto-generated-widget.html"</td></tr><tr valign="top"><td>fiddleurl</td><td>string</td><td>"http://ide.c9.io/ameennihad/widget-pcb"</td></tr><tr valign="top"><td>githuburl</td><td>string</td><td>"http://github.com/ameennihad/widget-pcb"</td></tr><tr valign="top"><td>testurl</td><td>string</td><td>"http://widget-pcb-ameennihad.c9users.io/widget.html"</td></tr><tr valign="top"><td>publish</td><td>object</td><td>Please see docs above.<br><br>Define the publish signals that this widget/element owns or defines so that
other widgets know how to subscribe to them and what they do.</td></tr><tr valign="top"><td>subscribe</td><td>object</td><td>Please see docs above.<br><br>Define the subscribe signals that this widget/element owns or defines so that
other widgets know how to subscribe to them and what they do.</td></tr><tr valign="top"><td>foreignPublish</td><td>object</td><td>Please see docs above.<br><br>Document the foreign publish signals, i.e. signals owned by other widgets
or elements, that this widget/element publishes to.</td></tr><tr valign="top"><td>foreignSubscribe</td><td>object</td><td>Please see docs above.<br><br>Document the foreign subscribe signals, i.e. signals owned by other widgets
or elements, that this widget/element subscribes to.</td></tr><tr valign="top"><td>init</td><td>function</td><td>function (doMyOwnDragDrop) <br><br>All widgets should have an init method. It should be run by the
instantiating code like a workspace or a different widget.</td></tr><tr valign="top"><td>onFileInputChanged</td><td>function</td><td>function (e)</td></tr><tr valign="top"><td>getElementId</td><td>function</td><td>function (id) </td></tr><tr valign="top"><td>getElementClass</td><td>function</td><td>function (id) </td></tr><tr valign="top"><td>init3d</td><td>function</td><td>function () <br><br>Try to get a reference to the 3D viewer.</td></tr><tr valign="top"><td>onInit3dSuccess</td><td>function</td><td>function () </td></tr><tr valign="top"><td>obj3d</td><td>object</td><td></td></tr><tr valign="top"><td>obj3dmeta</td><td>object</td><td></td></tr><tr valign="top"><td>userCallbackForGet3dObj</td><td>object</td><td></td></tr><tr valign="top"><td>get3dObj</td><td>function</td><td>function (callback) </td></tr><tr valign="top"><td>get3dObjCallback</td><td>function</td><td>function (data, meta) </td></tr><tr valign="top"><td>is3dViewerReady</td><td>boolean</td><td></td></tr><tr valign="top"><td>clear3dViewer</td><td>function</td><td>function () </td></tr><tr valign="top"><td>setupDragDrop</td><td>function</td><td>function () </td></tr><tr valign="top"><td>btnSetup</td><td>function</td><td>function () <br><br>Call this method from init to setup all the buttons when this widget
is first loaded. This basically attaches click events to your
buttons. It also turns on all the bootstrap popovers by scanning
the entire DOM of the widget.</td></tr><tr valign="top"><td>options</td><td>object</td><td>User options are available in this property for reference by your
methods. If any change is made on these options, please call
saveOptionsLocalStorage()</td></tr><tr valign="top"><td>setupUiFromLocalStorage</td><td>function</td><td>function () <br><br>Call this method on init to setup the UI by reading the user's
stored settings from localStorage and then adjust the UI to reflect
what the user wants.</td></tr><tr valign="top"><td>saveOptionsLocalStorage</td><td>function</td><td>function () <br><br>When a user changes a value that is stored as an option setting, you
should call this method immediately so that on next load the value
is correctly set.</td></tr><tr valign="top"><td>showBody</td><td>function</td><td>function (evt) <br><br>Show the body of the panel.
<br><br><b>evt</b> ({jquery_event})  - If you pass the event parameter in, we
know it was clicked by the user and thus we store it for the next
load so we can reset the user's preference. If you don't pass this
value in we don't store the preference because it was likely code
that sent in the param.</td></tr><tr valign="top"><td>hideBody</td><td>function</td><td>function (evt) <br><br>Hide the body of the panel.
<br><br><b>evt</b> ({jquery_event})  - If you pass the event parameter in, we
know it was clicked by the user and thus we store it for the next
load so we can reset the user's preference. If you don't pass this
value in we don't store the preference because it was likely code
that sent in the param.</td></tr><tr valign="top"><td>forkSetup</td><td>function</td><td>function () <br><br>This method loads the pubsubviewer widget which attaches to our
upper right corner triangle menu and generates 3 menu items like
Pubsub Viewer, View Standalone, and Fork Widget. It also enables
the modal dialog that shows the documentation for this widget.<br><br>By using chilipeppr.load() we can ensure that the pubsubviewer widget
is only loaded and inlined once into the final ChiliPeppr workspace.
We are given back a reference to the instantiated singleton so its
not instantiated more than once. Then we call it's attachTo method
which creates the full pulldown menu for us and attaches the click
events.</td></tr><tr valign="top"><td>statusEl</td><td>object</td><td></td></tr><tr valign="top"><td>status</td><td>function</td><td>function (txt) </td></tr><tr valign="top"><td>mySceneGroup</td><td>object</td><td></td></tr><tr valign="top"><td>sceneReAddMySceneGroup</td><td>function</td><td>function () </td></tr><tr valign="top"><td>sceneRemoveMySceneGroup</td><td>function</td><td>function () </td></tr><tr valign="top"><td>sceneAdd</td><td>function</td><td>function (obj) </td></tr><tr valign="top"><td>sceneRemove</td><td>function</td><td>function (obj) </td></tr><tr valign="top"><td>onDropped</td><td>function</td><td>function (data, info) </td></tr><tr valign="top"><td>onDragOver</td><td>function</td><td>function () </td></tr><tr valign="top"><td>onDragLeave</td><td>function</td><td>function () </td></tr><tr valign="top"><td>raycaster</td><td>object</td><td></td></tr><tr valign="top"><td>projector</td><td>object</td><td></td></tr><tr valign="top"><td>arrowHelper</td><td>object</td><td></td></tr><tr valign="top"><td>intersectObjects</td><td>object</td><td></td></tr><tr valign="top"><td>renderArea</td><td>object</td><td></td></tr><tr valign="top"><td>infoArea</td><td>object</td><td></td></tr><tr valign="top"><td>infoSignalArea</td><td>object</td><td></td></tr><tr valign="top"><td>lastIntersect</td><td>object</td><td></td></tr><tr valign="top"><td>hidePopupsElem</td><td>object</td><td></td></tr><tr valign="top"><td>setupMouseOver</td><td>function</td><td>function () </td></tr><tr valign="top"><td>reactivateMouseMove</td><td>function</td><td>function () </td></tr><tr valign="top"><td>deactivateMouseMove</td><td>function</td><td>function () </td></tr><tr valign="top"><td>hidePopups</td><td>function</td><td>function () </td></tr><tr valign="top"><td>lastIntersectOtherMaterials</td><td>object</td><td></td></tr><tr valign="top"><td>onMouseUp</td><td>function</td><td>function (event) </td></tr><tr valign="top"><td>onMouseDown</td><td>function</td><td>function (event) </td></tr><tr valign="top"><td>onDblClick</td><td>function</td><td>function (event) </td></tr><tr valign="top"><td>onEditPopupClose</td><td>function</td><td>function (event) </td></tr><tr valign="top"><td>onMouseOver</td><td>function</td><td>function (event) </td></tr><tr valign="top"><td>updateInfoArea</td><td>function</td><td>function (header, footer, info) </td></tr><tr valign="top"><td>open</td><td>function</td><td>function (data, info) </td></tr><tr valign="top"><td>draw3d</td><td>function</td><td>function (callback) </td></tr><tr valign="top"><td>onDraw3dReady</td><td>function</td><td>function () </td></tr><tr valign="top"><td>onDraw3dReadyAfter</td><td>function</td><td>function () </td></tr><tr valign="top"><td>activateWidget</td><td>function</td><td>function () <br><br>This method is called from the main workspace telling us the user
just activated us as a widget. This is not the same as load. Load
happens once. Activate happens many times if user closes then opens
us.</td></tr><tr valign="top"><td>unactivateWidget</td><td>function</td><td>function () </td></tr><tr valign="top"><td>clearBoard</td><td>function</td><td>function () </td></tr><tr valign="top"><td>clearBoardStep2</td><td>function</td><td>function () </td></tr><tr valign="top"><td>millDiameter</td><td>number</td><td>Global objects</td></tr><tr valign="top"><td>millDiameterMin</td><td>number</td><td></td></tr><tr valign="top"><td>minWireWidthToMill</td><td>number</td><td></td></tr><tr valign="top"><td>selectedLayer</td><td>object</td><td></td></tr><tr valign="top"><td>cuttingToolOption</td><td>number</td><td></td></tr><tr valign="top"><td>ignoreSmallWires</td><td>boolean</td><td></td></tr><tr valign="top"><td>dimensionsToMill</td><td>object</td><td></td></tr><tr valign="top"><td>tabs</td><td>object</td><td></td></tr><tr valign="top"><td>fr4</td><td>object</td><td></td></tr><tr valign="top"><td>regHoles</td><td>object</td><td></td></tr><tr valign="top"><td>regHoleGcodePara</td><td>object</td><td></td></tr><tr valign="top"><td>readFr4Values</td><td>function</td><td>function () </td></tr><tr valign="top"><td>readRegHoleGcodeValues</td><td>function</td><td>function () </td></tr><tr valign="top"><td>readRegHoleValues</td><td>function</td><td>function () </td></tr><tr valign="top"><td>setupUiParameters</td><td>function</td><td>function () </td></tr><tr valign="top"><td>onChangeBoardDropdowns</td><td>function</td><td>function () <br><br>Event handelers</td></tr><tr valign="top"><td>onChangeRenderSignals</td><td>function</td><td>function (layerIndex) </td></tr><tr valign="top"><td>onChangeRenderPolygons</td><td>function</td><td>function (layerIndex) </td></tr><tr valign="top"><td>onChangeRenderClearance</td><td>function</td><td>function (layerIndex) </td></tr><tr valign="top"><td>onChangeRenderBoard</td><td>function</td><td>function () </td></tr><tr valign="top"><td>onChangeRenderHoles</td><td>function</td><td>function () </td></tr><tr valign="top"><td>onChangeRenderTabs</td><td>function</td><td>function () </td></tr><tr valign="top"><td>onChangeRenderBlank</td><td>function</td><td>function () </td></tr><tr valign="top"><td>onChangeBlankBoardParamenters</td><td>function</td><td>function () </td></tr><tr valign="top"><td>onChangeRegHolesGcodeParamenters</td><td>function</td><td>function () </td></tr><tr valign="top"><td>onChangeRegHolesParamenters</td><td>function</td><td>function () </td></tr><tr valign="top"><td>render3d</td><td>function</td><td>function () <br><br>3D Rendering functions</td></tr><tr valign="top"><td>adjustBoards3dPositions</td><td>function</td><td>function () </td></tr><tr valign="top"><td>calculateHolePaths</td><td>function</td><td>function () </td></tr><tr valign="top"><td>calculateDimensionPaths</td><td>function</td><td>function () </td></tr><tr valign="top"><td>calculateSignalPaths</td><td>function</td><td>function () </td></tr><tr valign="top"><td>create3dScene</td><td>function</td><td>function () </td></tr><tr valign="top"><td>create3dBoardV2</td><td>function</td><td>function () </td></tr><tr valign="top"><td>render3dBoard</td><td>function</td><td>function () </td></tr><tr valign="top"><td>copyPath</td><td>function</td><td>function (original) </td></tr><tr valign="top"><td>render3dTabs</td><td>function</td><td>function () </td></tr><tr valign="top"><td>exportGcodeRegistrationHoles</td><td>function</td><td>function () </td></tr><tr valign="top"><td>sendRegHoleGcodeToWorkspace</td><td>function</td><td>function () </td></tr><tr valign="top"><td>getTabMesh</td><td>function</td><td>function (width, d) <br><br>Utility Functions.</td></tr><tr valign="top"><td>getRegHoles</td><td>function</td><td>function () </td></tr><tr valign="top"><td>getRegHolePaths</td><td>function</td><td>function () </td></tr><tr valign="top"><td>getHolesPaths</td><td>function</td><td>function () </td></tr><tr valign="top"><td>getBoardDimensionsToMill</td><td>function</td><td>function () </td></tr><tr valign="top"><td>fixAngle</td><td>function</td><td>function (angle) </td></tr><tr valign="top"><td>getCurveParameters</td><td>function</td><td>function (x1, y1, x2, y2, curve) </td></tr><tr valign="top"><td>getPadPathIntersectedWithPolygon</td><td>function</td><td>function (polygons, padPath, layerNumber) </td></tr><tr valign="top"><td>createPolygonMeshFromPaths</td><td>function</td><td>function (paths, material, z) </td></tr><tr valign="top"><td>createSignalMeshFromPaths</td><td>function</td><td>function (paths, material, z) </td></tr><tr valign="top"><td>createSignalMeshFromPathsV2</td><td>function</td><td>function (paths, material, z) </td></tr><tr valign="top"><td>createMeshFromPaths</td><td>function</td><td>function (paths, holePaths, material, depth, wireMaterial) </td></tr><tr valign="top"><td>createThreeGroupFromPolyTree</td><td>function</td><td>function (polyTree, material, depth, wireMaterial) </td></tr><tr valign="top"><td>createMeshFromPath</td><td>function</td><td>function (outerPath, material, holePaths, depth) </td></tr><tr valign="top"><td>createPolygonPath</td><td>function</td><td>function (polygon) </td></tr><tr valign="top"><td>createPadPath</td><td>function</td><td>function (pad, layerNumber) </td></tr><tr valign="top"><td>createViaPath</td><td>function</td><td>function (via) </td></tr><tr valign="top"><td>createWirePath</td><td>function</td><td>function (x1, y1, x2, y2, width, curve) </td></tr><tr valign="top"><td>createThermalPaths</td><td>function</td><td>function (pad, polygon) </td></tr><tr valign="top"><td>createCrossPath</td><td>function</td><td>function (thikness) </td></tr>
      </tbody>
  </table>


## About ChiliPeppr

[ChiliPeppr](http://chilipeppr.com) is a hardware fiddle, meaning it is a 
website that lets you easily
create a workspace to fiddle with your hardware from software. ChiliPeppr provides
a [Serial Port JSON Server](https://github.com/johnlauer/serial-port-json-server) 
that you run locally on your computer, or remotely on another computer, to connect to 
the serial port of your hardware like an Arduino or other microcontroller.

You then create a workspace at ChiliPeppr.com that connects to your hardware 
by starting from scratch or forking somebody else's
workspace that is close to what you are after. Then you write widgets in
Javascript that interact with your hardware by forking the base template 
widget or forking another widget that
is similar to what you are trying to build.

ChiliPeppr is massively capable such that the workspaces for 
[TinyG](http://chilipeppr.com/tinyg) and [Grbl](http://chilipeppr.com/grbl) CNC 
controllers have become full-fledged CNC machine management software used by
tens of thousands.

ChiliPeppr has inspired many people in the hardware/software world to use the
browser and Javascript as the foundation for interacting with hardware. The
Arduino team in Italy caught wind of ChiliPeppr and now
ChiliPeppr's Serial Port JSON Server is the basis for the 
[Arduino's new web IDE](https://create.arduino.cc/). If the Arduino team is excited about building on top
of ChiliPeppr, what
will you build on top of it?

