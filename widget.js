/* global requirejs cprequire cpdefine chilipeppr THREE */
// Defining the globals above helps Cloud9 not show warnings for those variables

// ChiliPeppr Widget/Element Javascript

requirejs.config({
    /*
    Dependencies can be defined here. ChiliPeppr uses require.js so
    please refer to http://requirejs.org/docs/api.html for info.
    
    Most widgets will not need to define Javascript dependencies.
    
    Make sure all URLs are https and http accessible. Try to use URLs
    that start with // rather than http:// or https:// so they simply
    use whatever method the main page uses.
    
    Also, please make sure you are not loading dependencies from different
    URLs that other widgets may already load like jquery, bootstrap,
    three.js, etc.
    
    You may slingshot content through ChiliPeppr's proxy URL if you desire
    to enable SSL for non-SSL URL's. ChiliPeppr's SSL URL is
    https://i2dcui.appspot.com which is the SSL equivalent for
    http://chilipeppr.com
    */
    paths: {
        Three: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r76/three',
        ThreeTextGeometry: '//i2dcui.appspot.com/js/three/TextGeometry',
        ThreeFontUtils: '//i2dcui.appspot.com/js/three/FontUtils',
        ThreeHelvetiker: '//i2dcui.appspot.com/js/three/threehelvetiker',
        Clipper: '//i2dcui.appspot.com/js/clipper/clipper_unminified'
    },
    shim: {
       ThreeTextGeometry: ['Three'],
       ThreeFontUtils: ['Three', 'ThreeTextGeometry'],
       ThreeHelvetiker: ['Three', 'ThreeTextGeometry', 'ThreeFontUtils'],
    }
});

cprequire_test(["inline:com-chilipeppr-widget-pcb"], function(pcbw) {

    // Test this element. This code is auto-removed by the chilipeppr.load()
    // when using this widget in production. So use the cpquire_test to do things
    // you only want to have happen during testing, like loading other widgets or
    // doing unit tests. Don't remove end_test at the end or auto-remove will fail.

    console.log("PCBW","test running of " + pcbw.id);
    //ew.init();

    $('#com-chilipeppr-widget-pcb').css('position', 'relative');
    $('#com-chilipeppr-widget-pcb').css('background', 'none');
    $('#com-chilipeppr-widget-pcb').css('width', '320px');
    $('body').prepend('<div id="3dviewer"></div>');

    chilipeppr.load(
      "#3dviewer",
      "http://raw.githubusercontent.com/chilipeppr/widget-3dviewer/master/auto-generated-widget.html",
      function() {
        cprequire(['inline:com-chilipeppr-widget-3dviewer'], function (threed) {
            threed.init({
                doMyOwnDragDrop: false
            });
            // only init pcb widget once 3d is loaded
            // set doMyOwnDragDrop
            pcbw.init(true);
        });
    });

    $('body').prepend('<div id="test-drag-drop"></div>');
    chilipeppr.load("#test-drag-drop", "http://fiddle.jshell.net/chilipeppr/Z9F6G/show/light/",

    function () {
        cprequire(
        ["inline:com-chilipeppr-elem-dragdrop"],

        function (dd) {
            dd.init();
            dd.bind("body", null);
        });
    });
    
    $('body').prepend('<div id="com-chilipeppr-flash"></div>');
    chilipeppr.load("#com-chilipeppr-flash",
        "http://fiddle.jshell.net/chilipeppr/90698kax/show/light/",

    function () {
        console.log("PCBW","mycallback got called after loading flash msg module");
        cprequire(["inline:com-chilipeppr-elem-flashmsg"], function (fm) {
            //console.log("PCBW","inside require of " + fm.id);
            fm.init();
        });
    });
    
    // test before and after render
    chilipeppr.subscribe("/" + pcbw.id + '/beforeToolPathRender', this, function(pcbWidget) {
        console.log("PCBW","publish test. got the /beforeToolPathRender signal. pcbWidget:", pcbWidget);
    });
    chilipeppr.subscribe("/" + pcbw.id + '/afterToolPathRender', this, function(pcbWidget) {
        console.log("PCBW","publish test. got the /afterToolPathRender signal. pcbWidget:", pcbWidget);
    });
    // // test before and after render
    // chilipeppr.subscribe("/" + pcbw.id + '/beforeLayerGenerate', this, function(pcbWidget) {
    //     console.log("PCBW","publish test. got the /beforeLayerGenerate signal. layer:", pcbWidget.activeLayer, "pcbWidget:", pcbWidget);
    // });
    // chilipeppr.subscribe("/" + pcbw.id + '/afterLayerGenerate', this, function(pcbWidget) {
    //     console.log("PCBW","publish test. got the /afterLayerGenerate signal. layer:", pcbWidget.activeLayer, "eagleWidget:", pcbWidget);
    // });


} /*end_test*/ );

// This is the main definition of your widget. Give it a unique name.
cpdefine("inline:com-chilipeppr-widget-pcb", ["chilipeppr_ready", /* other dependencies here */ ], function() {
    return {
        /**
         * The ID of the widget. You must define this and make it unique.
         */
        id: "com-chilipeppr-widget-pcb", // Make the id the same as the cpdefine id
        name: "Widget / PCB Board v6.0", // The descriptive name of your widget.
        desc: "This widget lets you drag in a PCB board file to mill.", // A description of what your widget does
        url: "(auto fill by runme.js)",       // The final URL of the working widget as a single HTML file with CSS and Javascript inlined. You can let runme.js auto fill this if you are using Cloud9.
        fiddleurl: "(auto fill by runme.js)", // The edit URL. This can be auto-filled by runme.js in Cloud9 if you'd like, or just define it on your own to help people know where they can edit/fork your widget
        githuburl: "(auto fill by runme.js)", // The backing github repo
        testurl: "(auto fill by runme.js)",   // The standalone working widget so can view it working by itself
        /**
         * Define pubsub signals below. These are basically ChiliPeppr's event system.
         * ChiliPeppr uses amplify.js's pubsub system so please refer to docs at
         * http://amplifyjs.com/api/pubsub/
         */
        /**
         * Define the publish signals that this widget/element owns or defines so that
         * other widgets know how to subscribe to them and what they do.
         */
        publish: {
            // Define a key:value pair here as strings to document what signals you publish.
            '/onExampleGenerate': 'Example: Publish this signal when we go to generate gcode.'
        },
        /**
         * Define the subscribe signals that this widget/element owns or defines so that
         * other widgets know how to subscribe to them and what they do.
         */
        subscribe: {
            // Define a key:value pair here as strings to document what signals you subscribe to
            // so other widgets can publish to this widget to have it do something.
            // '/onExampleConsume': 'Example: This widget subscribe to this signal so other widgets can send to us and we'll do something with it.'
        },
        /**
         * Document the foreign publish signals, i.e. signals owned by other widgets
         * or elements, that this widget/element publishes to.
         */
        foreignPublish: {
            // Define a key:value pair here as strings to document what signals you publish to
            // that are owned by foreign/other widgets.
            // '/jsonSend': 'Example: We send Gcode to the serial port widget to do stuff with the CNC controller.'
        },
        /**
         * Document the foreign subscribe signals, i.e. signals owned by other widgets
         * or elements, that this widget/element subscribes to.
         */
        foreignSubscribe: {
            // Define a key:value pair here as strings to document what signals you subscribe to
            // that are owned by foreign/other widgets.
            // '/com-chilipeppr-elem-dragdrop/ondropped': 'Example: We subscribe to this signal at a higher priority to intercept the signal. We do not let it propagate by returning false.'
        },
        /**
         * Global Objects
         */
        board: {},
        sceneGroups: {board:null, layers:[]},
        blankBoundaries: null,
        regHoles: {
            use: true,
            pattern: 411,
            diameter: 2,
            distance: 3
        },
        /**
         * All widgets should have an init method. It should be run by the
         * instantiating code like a workspace or a different widget.
         */
        init: function(doMyOwnDragDrop) {
            // the workspace may want to handle the drag drop
            // but when in dev mode it makes sense for us to do our own
            if (doMyOwnDragDrop) {
                this.setupDragDrop();
            } else {
                // the workspace is doing the drag/drop. this is important
                // because this code base for this widget is huge and thus
                // the workspace should handle dragging in BRD files
                // and once it sees one, it should then load this widget
                // so that users who don't use ChiliPeppr for BRD files
                // don't have to load all this insane code
                
            }

            this.setupUiFromLocalStorage();
            this.btnSetup();
            this.forkSetup();
            this.open();
            console.log("PCBW","I am done being initted.");
        },
        setupDragDrop: function () {
            // subscribe to events
            chilipeppr.subscribe("/com-chilipeppr-elem-dragdrop/ondragover", this, this.onDragOver);
            chilipeppr.subscribe("/com-chilipeppr-elem-dragdrop/ondragleave", this, this.onDragLeave);
            // /com-chilipeppr-elem-dragdrop/ondropped
            chilipeppr.subscribe("/com-chilipeppr-elem-dragdrop/ondropped", this, this.onDropped, 9); // default is 10, we do 9 to be higher priority
        },
        /**
         * Call this method from init to setup all the buttons when this widget
         * is first loaded. This basically attaches click events to your 
         * buttons. It also turns on all the bootstrap popovers by scanning
         * the entire DOM of the widget.
         */
        btnSetup: function() {

            // Chevron hide/show body
            var that = this;
            $('#' + this.id + ' .hidebody').click(function(evt) {
                console.log("PCBW","hide/unhide body");
                if ($('#' + that.id + ' .panel-body').hasClass('hidden')) {
                    // it's hidden, unhide
                    that.showBody(evt);
                }
                else {
                    // hide
                    that.hideBody(evt);
                }
            });

            // Ask bootstrap to scan all the buttons in the widget to turn
            // on popover menus
            $('#' + this.id + ' .btn').popover({
                delay: 1000,
                animation: true,
                placement: "auto",
                trigger: "hover",
                container: 'body'
            });
        },
        /**
         * User options are available in this property for reference by your
         * methods. If any change is made on these options, please call
         * saveOptionsLocalStorage()
         */
        options: null,
        /**
         * Call this method on init to setup the UI by reading the user's
         * stored settings from localStorage and then adjust the UI to reflect
         * what the user wants.
         */
        setupUiFromLocalStorage: function() {
            //TODO: SETUP WIDGET OPTIONS
            // Read vals from localStorage. Make sure to use a unique
            // key specific to this widget so as not to overwrite other
            // widgets' options. By using this.id as the prefix of the
            // key we're safe that this will be unique.

            // Feel free to add your own keys inside the options 
            // object for your own items

            var options = localStorage.getItem(this.id + '-options');

            if (options) {
                options = $.parseJSON(options);
                console.log("PCBW","just evaled options: ", options);
            }
            else {
                options = {
                    showBody: true,
                    tabShowing: 1,
                    customParam1: null,
                    customParam2: 1.0
                };
            }

            this.options = options;
            console.log("PCBW","options:", options);

            // show/hide body
            if (options.showBody) {
                this.showBody();
            }
            else {
                this.hideBody();
            }

        },
        /**
         * When a user changes a value that is stored as an option setting, you
         * should call this method immediately so that on next load the value
         * is correctly set.
         */
        saveOptionsLocalStorage: function() {
            // You can add your own values to this.options to store them
            // along with some of the normal stuff like showBody
            var options = this.options;

            var optionsStr = JSON.stringify(options);
            console.log("PCBW","saving options:", options, "json.stringify:", optionsStr);
            // store settings to localStorage
            localStorage.setItem(this.id + '-options', optionsStr);
        },
        /**
         * Show the body of the panel.
         * @param {jquery_event} evt - If you pass the event parameter in, we 
         * know it was clicked by the user and thus we store it for the next 
         * load so we can reset the user's preference. If you don't pass this 
         * value in we don't store the preference because it was likely code 
         * that sent in the param.
         */
        showBody: function(evt) {
            $('#' + this.id + ' .panel-body').removeClass('hidden');
            $('#' + this.id + ' .panel-footer').removeClass('hidden');
            $('#' + this.id + ' .hidebody span').addClass('glyphicon-chevron-up');
            $('#' + this.id + ' .hidebody span').removeClass('glyphicon-chevron-down');
            if (!(evt == null)) {
                this.options.showBody = true;
                this.saveOptionsLocalStorage();
            }
            // this will send an artificial event letting other widgets know to resize
            // themselves since this widget is now taking up more room since it's showing
            $(window).trigger("resize");
        },
        /**
         * Hide the body of the panel.
         * @param {jquery_event} evt - If you pass the event parameter in, we 
         * know it was clicked by the user and thus we store it for the next 
         * load so we can reset the user's preference. If you don't pass this 
         * value in we don't store the preference because it was likely code 
         * that sent in the param.
         */
        hideBody: function(evt) {
            $('#' + this.id + ' .panel-body').addClass('hidden');
            $('#' + this.id + ' .panel-footer').addClass('hidden');
            $('#' + this.id + ' .hidebody span').removeClass('glyphicon-chevron-up');
            $('#' + this.id + ' .hidebody span').addClass('glyphicon-chevron-down');
            if (!(evt == null)) {
                this.options.showBody = false;
                this.saveOptionsLocalStorage();
            }
            // this will send an artificial event letting other widgets know to resize
            // themselves since this widget is now taking up less room since it's hiding
            $(window).trigger("resize");
        },
        /**
         * This method loads the pubsubviewer widget which attaches to our 
         * upper right corner triangle menu and generates 3 menu items like
         * Pubsub Viewer, View Standalone, and Fork Widget. It also enables
         * the modal dialog that shows the documentation for this widget.
         * 
         * By using chilipeppr.load() we can ensure that the pubsubviewer widget
         * is only loaded and inlined once into the final ChiliPeppr workspace.
         * We are given back a reference to the instantiated singleton so its
         * not instantiated more than once. Then we call it's attachTo method
         * which creates the full pulldown menu for us and attaches the click
         * events.
         */
        forkSetup: function() {
            var topCssSelector = '#' + this.id;

            $(topCssSelector + ' .panel-title').popover({
                title: this.name,
                content: this.desc,
                html: true,
                delay: 1000,
                animation: true,
                trigger: 'hover',
                placement: 'auto'
            });

            var that = this;
            chilipeppr.load("http://fiddle.jshell.net/chilipeppr/zMbL9/show/light/", function() {
                require(['inline:com-chilipeppr-elem-pubsubviewer'], function(pubsubviewer) {
                    pubsubviewer.attachTo($(topCssSelector + ' .panel-heading .dropdown-menu'), that);
                });
            });

        },
        statusEl: null, // cache the status element in DOM
        status: function (txt) {
            console.log("PCBW","status. txt:", txt);
            if (this.statusEl == null) this.statusEl = $('#' + this.id + '-status');
            var len = this.statusEl.val().length;
            if (len > 30000) {
                console.log("PCBW","truncating status area text");
                this.statusEl.val(this.statusEl.val().substring(len - 5000));
            }
            this.statusEl.val(this.statusEl.val() + txt + "\n");
            this.statusEl.scrollTop(
            this.statusEl[0].scrollHeight - this.statusEl.height());
        },
        mySceneGroup: null,
        sceneReAddMySceneGroup: function() {
            if (this.obj3d && this.mySceneGroup) {
                this.obj3d.add(this.mySceneGroup);
            }
            this.obj3dmeta.widget.wakeAnimate();
        },
        sceneRemoveMySceneGroup: function() {
            if (this.obj3d && this.mySceneGroup) {
                this.obj3d.remove(this.mySceneGroup);
            }
            this.obj3dmeta.widget.wakeAnimate();
        },
        sceneAdd: function (obj) {
            
            // this method of adding puts us in the object that contains rendered Gcode
            // that's one option, but when we send gcode to workspace we get overwritten
            // then
            //this.obj3d.add(obj);
            
            // let's add our board content outside the scope of the Gcode content
            // so that we have it stay while the Gcode 3D Viewer still functions
            if (this.mySceneGroup == null) {
                this.mySceneGroup = new THREE.Group();
                this.obj3d.add(this.mySceneGroup);
            }
            this.mySceneGroup.add(obj);
            
            this.obj3dmeta.widget.wakeAnimate();
        },
        sceneRemove: function (obj) {
            if (this.mySceneGroup != null)
                this.mySceneGroup.remove(obj);
            this.obj3dmeta.widget.wakeAnimate();
        },
        onDropped: function (data, info) {
            console.log("PCBW","onDropped. len of file:", data.length, "info:", info);
            // we have the data
            // double check it's a board file, cuz it could be gcode
            var droppedFile = Board.supportedFiles.find(function(f){
                return f.signature.test(data);
            });
            if (droppedFile !== undefined) {
                console.log("PCBW","we have " + droppedFile.type + " board file!");
                // this.colorSignal = 9249571;
                // this.colorSmd = 9249571;
                localStorage.setItem(this.id + '-lastDropped', data);
                localStorage.setItem(this.id = '-lastDropped-info', JSON.stringify(info));
                this.fileInfo = info;
                console.log("PCBW","saved brd file to localstorage");
                this.open(data, info);
                return false;
            }
            else {
                chilipeppr.publish("/com-chilipeppr-elem-flashmsg/flashmsg", "Looks like you dragged a " + droppedFile.ext + " file with unsupported contensts");
                var extRegEx = new RegExp(droppedFile.ext + '$', 'i');
                if(info.name.match(extRegEx)){
                    return false;
                }
            }
        },
        onDragOver: function () {
            console.log("PCBW","onDragOver");
            $('#' + this.id).addClass("panel-primary");
        },
        onDragLeave: function () {
            console.log("PCBW","onDragLeave");
            $('#' + this.id).removeClass("panel-primary");
        },
        open: function (data, info) {
            
            // if we are passed the file data, then use that, otherwise look to 
            // see if we had one saved from before, i.e. this is a browser reload scenario
            // and we'd like to show them their recent board file
            var file;
            if (data) {
                console.log("PCBW","open. loading from passed in data. data.length:", data.length, "info:", info);
                file = data;
                this.fileInfo = info;
                $('#' + this.id + ' .board-draghere').addClass("hidden");
            } else {
                
                // try to retrieve the most recent board file
                file = localStorage.getItem(this.id + '-lastDropped');
                if (file && file.length > 0) {
                    this.fileInfo = localStorage.getItem(this.id + '-lastDropped-info');
                    if (this.fileInfo && this.fileInfo.match(/^{/)) {
                        this.fileInfo = JSON.parse(this.fileInfo);
                    }
                    console.log("PCBW","open. loading data from localStorage. file.length:", file.length, "info:", this.fileInfo);
                } else {
                    // there's no file, just return
                    return;
                }

            }
            
            if (file) {
                // make sure this file is a supported board
                var droppedFile = Board.supportedFiles.find(function(f){
                    return f.signature.test(file);
                });
                if (droppedFile === undefined) {
                    chilipeppr.publish("/com-chilipeppr-elem-flashmsg/flashmsg", "Error Loading board file", "It looks like you had a previous board file, but it doesn't seem to be the correct format.", 10 * 1000);
                    return;
                }

                chilipeppr.publish("/com-chilipeppr-elem-flashmsg/flashmsg", "Opening " + droppedFile.type + " BRD", "Parsing " + droppedFile.type + " file and do 3D rendering.", 3000, true);
                // reset main properties
                //this.activeLayer = 'Top';
                this.clearBoard();
                this.clear3dViewer();
                // create board
                this.board = new Board(droppedFile.type);
                this.board.loadText(file);
                console.log("Ameen: Board", this.board);

                this.render3d(function() {
                    console.log("PCBW","got callback from draw3d");
                });
                
                chilipeppr.publish('/com-chilipeppr-widget-3dviewer/drawextents' );
                chilipeppr.publish('/com-chilipeppr-widget-3dviewer/viewextents' );
                // $('#com-chilipeppr-widget-eagle .btn-eagle-sendgcodetows').prop('disabled', false);
            } else {
                console.log("PCBW","no last file, so not opening");
            }
        },
        /**
         * This method is called from the main workspace telling us the user
         * just activated us as a widget. This is not the same as load. Load
         * happens once. Activate happens many times if user closes then opens
         * us.
         */
        activateWidget: function() {
            console.log("PCBW","PCBW","activating PCB widget");
            //TODO: Uncomment next line after adding functionality
            //this.reactivateMouseMove();
            this.sceneReAddMySceneGroup();
        },
        unactivateWidget: function() {
            console.log("PCBW","unactivating PCB widget");
            this.sceneRemoveMySceneGroup();
            //TODO: Uncomment next line after adding functionality
            //this.deactivateMouseMove();
            //TODO: Uncomment following two lines after adding solder mask functionality
            // // hide solder mask as well
            // setTimeout(this.solderMaskRenderHide.bind(this), 10);
        },
        /**
         * Try to get a reference to the 3D viewer.
         */
        init3d: function () {
            this.get3dObj();
            if (this.obj3d == null) {
                console.log("PCBW","loading 3d scene failed, try again in 1 second");
                var attempts = 1;
                var that = this;
                setTimeout(function () {
                    that.get3dObj();
                    if (that.obj3d == null) {
                        attempts++;
                        setTimeout(function () {
                            that.get3dObj();
                            if (that.obj3d == null) {
                                console.log("PCBW","giving up on trying to get 3d");
                            } else {
                                console.log("PCBW","succeeded on getting 3d after attempts:", attempts);
                                that.onInit3dSuccess();
                            }
                        }, 5000);
                    } else {
                        console.log("PCBW","succeeded on getting 3d after attempts:", attempts);
                        that.onInit3dSuccess();
                    }
                }, 1000);
            } else {
                this.onInit3dSuccess();
            }

        },
        onInit3dSuccess: function () {
            console.log("PCBW","onInit3dSuccess. That means we finally got an object back.");
            this.clear3dViewer();
            // open the last file
            this.open();
        },
        obj3d: null, // gets the 3dviewer obj stored in here on callback
        obj3dmeta: null, // gets metadata for 3dviewer
        userCallbackForGet3dObj: null,
        get3dObj: function (callback) {
            this.userCallbackForGet3dObj = callback;
            chilipeppr.subscribe("/com-chilipeppr-widget-3dviewer/recv3dObject", this, this.get3dObjCallback);
            chilipeppr.publish("/com-chilipeppr-widget-3dviewer/request3dObject", "");
            chilipeppr.unsubscribe("/com-chilipeppr-widget-3dviewer/recv3dObject", this.get3dObjCallback);
        },
        get3dObjCallback: function (data, meta) {
            console.log("PCBW","got 3d obj:", data, meta);
            this.obj3d = data;
            this.obj3dmeta = meta;
            if (this.userCallbackForGet3dObj) {
                this.userCallbackForGet3dObj();
                this.userCallbackForGet3dObj = null;
            }
        },
        is3dViewerReady: false,
        clear3dViewer: function () {
            console.log("PCBW","clearing 3d viewer");
            chilipeppr.publish("/com-chilipeppr-widget-3dviewer/sceneclear");
            this.is3dViewerReady = true;
        },
        clearBoard: function() {
            this.get3dObj(this.clearBoardStep2.bind(this));
        },
        clearBoardStep2: function() {
            console.log("PCBW","clearing board. this.obj3d:", this.obj3d, "this.mySceneGroup:", this.mySceneGroup);
            // remove all 3d viewer stuff
            this.sceneRemoveMySceneGroup();
            this.mySceneGroup = null;
            console.log("PCBW","after clearing board. this.obj3d:", this.obj3d, "this.mySceneGroup:", this.mySceneGroup);
            
            // this.threePathEndMill = [];
            
            // // now reset arrays since they're useless now that
            // // we removed them and will regenerate below
            // this.threePathEndMillArr = [];
            // this.threePathDeflatedActualArr = [];
            // this.threePathInflatedActualArr = [];
            // this.pathEndMillArr = [];
            // this.pathEndMillHolesArr = [];
            // this.pathInflatedActualArr = [];
            // this.pathDeflatedActualArr = [];
            
            // // reset all main properties
            // //this.pathsUnion = null;
            // this.clipperBySignalKey = [];
            // this.intersectObjects = [];
            // this.clipperDimension = [];
            // this.clipperDimensionInfo = []; //V5.3D201701XX Added
            // this.dimensionsToMill = [];
            // this.clipperSignalWires = [];
            // this.clipperElements = [];
            // this.clipperPads = [];
            // this.clipperSmds = [];
            // this.clipperVias = [];
            // this.holesToDrill = {}; //V5.2D20170105
            // this.holesToMill = [];  //V5.2D20170105
            // this.holesUnhandledCount = 0;   //V5.2D20170105
            // this.paths = null; // final paths generated from onRefresh() used to export gcode
            // this.pathsUnion = null;
            // this.pathsUnionHoles = null;
            
        },
        
        render3d: function(){
            this.clear3dViewer();
            this.render3dBoard();
            this.render3dSignals();
            this.sceneAdd(this.sceneGroups.board);
            //this.sceneAdd(this.sceneGroups.layers[1]);
            this.sceneGroups.layers.forEach(function(layerGroup){
                this.sceneAdd(layerGroup);
            }, this);
        },
        render3dSignals: function(){
            var z = 0, zInc = this.board.fr4.depth / (this.board.signalLayersCount-1)*2;
            this.sceneGroups.layers = [];
            this.board.layers.forEach(function(layer){
                if(layer.signals !== undefined && layer.type == "signal"){
                    console.log("PCBW-Layer", layer.name, z);
                    
                    var layerGroup = new THREE.Group();
                    layer.signals.forEach(function(signal){
                        var signalPaths = [];
                        if(signal.wires !== undefined){
                            signal.wires.forEach(function(wire){
                                var wirePath = this.createRectangularPath(wire.x1, wire.y1, wire.x2, wire.y2, wire.width);
                                var strPath = this.createCircularPath(wire.x1, wire.y1, wire.width/2);
                                var endPath = this.createCircularPath(wire.x2, wire.y2, wire.width/2);
                                signalPaths.push(wirePath);
                                signalPaths.push(strPath);
                                signalPaths.push(endPath);
                            }, this);
                        }
                        if(signal.vias !== undefined && false){
                            signal.vias.forEach(function(via){
                                var viaPath = this.createCircularPath(via.x, via.y, via.diameter/2);
                                signalPaths.push(viaPath);
                            }, this);
                        }
                        var signalMat = new THREE.LineBasicMaterial({
                            color: 0x805000+0xff*z,
                            transparent: true,
                            polygonOffset: true, plygonOffsetFactor: 2, polygonOffsetUnits: 1,
                            opacity: .4
                        });
                        var sp = this.getUnionOfClipperPaths(signalPaths);
                        var signalMesh = this.createGeometryFromPaths(signalPaths, z);
                        //var signalMesh = new THREE.Mesh(signalGeo, signalMat);
                        layerGroup.add(signalMesh);
                        
                    }, this);
                    this.sceneGroups.layers.push(layerGroup);
                    z -= zInc;
                }
            },this);
        },
        render3dBoard: function(){
            var x1 = this.board.fr4.x,
                x2 = this.board.fr4.x + this.board.fr4.width,
                y1 = this.board.fr4.y,
                y2 = this.board.fr4.y + this.board.fr4.height,
                z1 = 0.1,
                z2 = z1-this.board.fr4.depth,
                
                regColor = 0xB87333,
                
                wireMat = new THREE.MeshBasicMaterial({
                color: regColor,
                linewidth: 2,
                //polygonOffset: true, plygonOffsetFactor: 1, polygonOffsetUnits: 1,
                transparent: true,
                opacity: .6
                }),
                
                boardMat = new THREE.LineBasicMaterial({
                color: regColor/2,
                transparent: false,
                //polygonOffset: true, plygonOffsetFactor: 2, polygonOffsetUnits: 1,
                opacity: .2
                }),
                
                boardPath,
                holePaths = [];
                
            boardPath = [
                {X: x1, Y: y1},
                {X: x2, Y: y1},
                {X: x2, Y: y2},
                {X: x1, Y: y2},
                {X: x1, Y: y1}
                ];
                
            holePaths = this.getRegHolePaths();
            this.board.holes.forEach(function(hole){
                holePaths.push(this.createCircularPath(hole.x, hole.y, hole.drill/2));
            }, this);
            //holePaths.push([{X:50, Y:50}, {X:100, Y:50},{X:100, Y:90},{X:50, Y:90},{X:50, Y:50}]);
            var boardMesh = this.createMeshFromPath(boardPath, boardMat, holePaths, z2);
            
            var shape = new THREE.Shape();
            shape.moveTo(x1, y1);
            shape.lineTo(x1, y2);
            shape.lineTo(x2, y2);
            shape.lineTo(x2, y1);
            shape.lineTo(x1, y1);
            
            var extrudeSettings = {
            	amount: z2,
            	bevelEnabled: false
            };
            
            var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
            var mesh = new THREE.Mesh( geometry, boardMat);
            
            var geo = new THREE.EdgesGeometry(mesh.geometry);
            var wireframe = new THREE.LineSegments(geo, wireMat);
            
            this.sceneGroups.board = new THREE.Group();
            //console.log("PCBW-Holes", holePaths);
            for(var i = 0; i < holePaths.length; i++){
                var lineGeo1 = new THREE.Geometry();
                var lineGeo2 = new THREE.Geometry();
                var hole = holePaths[i];
                for (var n = 0; n < hole.length; n++) {
                    lineGeo1.vertices.push(new THREE.Vector3(hole[n].X, hole[n].Y, z1));
                    lineGeo2.vertices.push(new THREE.Vector3(hole[n].X, hole[n].Y, z2));
                }
                var line1 = new THREE.Line(lineGeo1, wireMat);
                var line2 = new THREE.Line(lineGeo2, wireMat);
                this.sceneGroups.board.add(line1);
                this.sceneGroups.board.add(line2);
            }
            this.sceneGroups.board.add(boardMesh);
            this.sceneGroups.board.add(wireframe);
                
        },
        getRegHolePaths: function(){
            var pattern = this.regHoles.pattern;
            var count = Math.round(pattern/100);
            var onSides = Math.round((pattern - 100 * count)/10) == 1;
            var v = (pattern - 100 * count - 10 * onSides) == 0;
            
            var x = this.board.fr4.x,
                y = this.board.fr4.y,
                w = this.board.fr4.width,
                h = this.board.fr4.height,
                d = this.regHoles.distance;
            
            var centers = [];
            if(count == 4){
                centers.push({x: x + d,                 y: y + (onSides?h/2:d)});
                centers.push({x: x + (onSides?w/2:d),   y: y + h - d});
                centers.push({x: x + w - d,             y: y + (onSides?h/2:h-d)});
                centers.push({x: x + (onSides?w/2:w-d), y: y + d});
            }
            else {
                centers.push({x: x + (onSides?(v?w/2:d)  :d  ), y: y + (onSides?(v?d:h/2)  :(v?d:h-d))});
                centers.push({x: x + (onSides?(v?w/2:w-d):w-d), y: y + (onSides?(v?h-d:h/2):(v?h-d:d))});
            }
            
            var holes = [];
            centers.forEach(function(center){
                holes.push(this.createCircularPath(center.x, center.y, this.regHoles.diameter/2));
            }, this);
            return holes;
        },
        /**
         * Utility Functions.
         */
        getUnionOfClipperPaths: function (subj_paths) {
            //console.log("getUnionOfClipperPaths");
            var cpr = new ClipperLib.Clipper();
            var scale = 100000;
            ClipperLib.JS.ScaleUpPaths(subj_paths, scale);
            cpr.AddPaths(subj_paths, ClipperLib.PolyType.ptSubject, true);
            var subject_fillType = ClipperLib.PolyFillType.pftNonZero;
            var clip_fillType = ClipperLib.PolyFillType.pftNonZero;
            var solution_paths = new ClipperLib.Paths();
            cpr.Execute(ClipperLib.ClipType.ctUnion, solution_paths, subject_fillType, clip_fillType);
            //console.log(JSON.stringify(solution_paths));
            //console.log("solution:", solution_paths);
            // scale back down
            for (var i = 0; i < solution_paths.length; i++) {
                for (var j = 0; j < solution_paths[i].length; j++) {
                    solution_paths[i][j].X = solution_paths[i][j].X / scale;
                    solution_paths[i][j].Y = solution_paths[i][j].Y / scale;
                }
            }
            ClipperLib.JS.ScaleDownPaths(subj_paths, scale);
            return solution_paths;
        },
        createGeometryFromPaths: function(paths, z){
            if (!(Array.isArray(paths))) paths = [paths];
            var allGeometry = new THREE.Geometry();
            var material = new THREE.MeshLambertMaterial({color: 0});
            paths.forEach(function(path){
                var shape = new THREE.Shape();
                var firstVetex = true;
                path.forEach(function(vertex){
                    if(firstVetex)
                        {shape.moveTo(vertex.X, vertex.Y); firstVetex = false;}
                    else
                        shape.lineTo(vertex.X, vertex.Y);
                }, this);
                var geometry = new THREE.ShapeGeometry(shape);
                var mesh = new THREE.Mesh(geometry, material);
                allGeometry.merge(mesh.geometry, mesh.matrix);
            }, this);
            var signalMesh = new THREE.Mesh(allGeometry, material);
            signalMesh.position.setZ(z); 
            return signalMesh;
        },
        createMeshFromPaths: function (paths, material, depth){
            var group = new THREE.Object3D();
            if (!(Array.isArray(paths))) paths = [paths];
            for (var i = 0; i < paths.length; i++) {
                var shape = new THREE.Shape();
                for (var j = 0; j < paths[i].length; j++) {
                    var pt = paths[i][j];
                    if (j == 0) shape.moveTo(pt.X, pt.Y); else shape.lineTo(pt.X, pt.Y);
                }
                var geometry;
                if(depth !== undefined){
                    var extrudeSettings = {
                    	amount: depth,
                    	bevelEnabled: false
                    };
                    geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
                }
                else
                    geometry = new THREE.ShapeGeometry( shape );
                
                var shapeMesh = new THREE.Mesh(geometry, material);
                group.add(shapeMesh);
            }
            return group;
        },
        createMeshFromPath: function (outerPath, material, holePaths, depth){

            var group = new THREE.Object3D();
            //for (var i = 0; i < paths.length; i++) {
            var shape = new THREE.Shape();
            for (var j = 0; j < outerPath.length; j++) {
                var pt = outerPath[j];
                if (j == 0) shape.moveTo(pt.X, pt.Y); else shape.lineTo(pt.X, pt.Y);
            }
            if (holePaths !== undefined && holePaths != null) {
                if (!(Array.isArray(holePaths))) holePaths = [holePaths];
                
                for (var hi = 0; hi < holePaths.length; hi++) {
                    var hp = holePaths[hi];
                    var hole = new THREE.Path();
                    for (var j = 0; j < hp.length; j++) {
                        var pt = hp[j];
                        if (j == 0) hole.moveTo(pt.X, pt.Y);
                        else hole.lineTo(pt.X, pt.Y);
                    }
                    shape.holes.push(hole);
                }
            }
            var geometry;
            if(depth !== undefined){
                var extrudeSettings = {
                	amount: depth,
                	bevelEnabled: false
                };
                geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
            }
            else
                geometry = new THREE.ShapeGeometry( shape );
            
            var shapeMesh = new THREE.Mesh(geometry, material);
            group.add(shapeMesh);
            return group;
        },
        createCircularPath: function (x, y, radius, seg){
            seg = seg || 0;
            var segments = seg>0? seg: Math.max(Math.round(2 * Math.PI * radius) * 10, 32),
                step = 2 * Math.PI / segments,
                path = [];
            for(var a = 0; a < 2 * Math.PI; a+=step){
                path.push({X: x + radius * Math.cos(a),
                           Y: y + radius * Math.sin(a)});
            }
            path.push({X: path[0].X, Y: path[0].Y});
            return path;
        },
        createRectangularPath: function(x1, y1, x2, y2, width){
            var angle = Math.atan2(y1-y2, x1-x2),
                dx = width*Math.sin(angle)/2,
                dy = width*Math.cos(angle)/2,
                path = [];
            
            path.push({X: x1 + dx, Y: y1 - dy});
            path.push({X: x2 + dx, Y: y2 - dy});
            path.push({X: x2 - dx, Y: y2 + dy});
            path.push({X: x1 - dx, Y: y1 + dy});
            
            path.push({X: path[0].X, Y: path[0].Y});
            return path;
        }
    };
});

function Board(type){
    this.type = type;
    this.fr4 = {x:0, y: 0, width: 150, height: 100, depth: 1.7};
    this.classes = [];
    this.signalLayersCount = 0;

    this.signals = [];
    this.layers = [];
    this.holes = [];
    this.dimensions = [];
}
Board.type = {eagle: "Eagle", kiCad: "KiCad"};

Board.supportedFiles = [
    {type: Board.type.eagle, ext:".brd", signature: /<!DOCTYPE eagle SYSTEM "eagle.dtd">[\s\S]*<board>/im},
    {type: Board.type.kiCad, ext:".kicad_pcb", signature: /\(kicad_pcb \(version \d+\) \(host pcbnew/i}];


Board.prototype.loadText = function (text){
    if(this.type == Board.type.eagle){
        var eParser = new DOMParser();
        this.boardXML = eParser.parseFromString(text, "text/xml");
        this.parseEagle();
        //console.log("PCBW-XML", this.boardXML);
        return;
    }
    else
    if(this.type == Board.type.kiCad){
        var kParser = new kiCadXmlParser();
        this.boardXML = kParser.parse(text);
        this.parseKiCad();
        //console.log("PCBW-XML", this.boardXML, this);
        return;
    }
};

function byKey(item){
    return item.key == this;
}

function byName(item){
    return item.name == this;
}

Board.prototype.parseEagle = function () {
    
};

Board.prototype.parseKiCad = function () {
    
    function parseLayer(layer){
        return {
            key: parseFloat(layer.getAttribute('id')),
            name: layer.getAttribute('name'),
            type: layer.getAttribute('type')
        };
    }
    
    function parseSignal(signal){
        return {
            key: parseFloat(signal.getAttribute('id')),
            name: signal.getAttribute('name')
            };
    }
    
    function parseSegment(segment){
        return {
            x1: parseFloat(segment.getAttribute('x1')),
            y1: 100-parseFloat(segment.getAttribute('y1')),
            x2: parseFloat(segment.getAttribute('x2')),
            y2: 100-parseFloat(segment.getAttribute('y2')),
            width: parseFloat(segment.getAttribute('width')),
            layerName: segment.getAttribute('layer'),
            signalKey: parseInt(segment.getAttribute('net'), 10)
        };
    }
    
    function parseVia(via){
        var x = parseFloat(via.getAttribute('x'));
        var y = 100-parseFloat(via.getAttribute('y'));
        return {
            x: x,
            y: y,
            diameter: parseFloat(via.getAttribute('size'))
        };
    }
    
    console.group("KiCad Parse");
    var xmlLayers = this.boardXML.getElementsByTagName('layer');
    Array.from(xmlLayers).forEach(function(xmlLayer){
        var layer = parseLayer(xmlLayer);
        this.layers.push(layer);
        if(layer.type == "signal") this.signalLayersCount++;
    }, this);
    
    var xmlSignals = this.boardXML.getElementsByTagName('net');
    Array.from(xmlSignals).forEach(function(xmlSignal){
        this.signals.push(parseSignal(xmlSignal));
    }, this);
    
    var xmlSegments = this.boardXML.getElementsByTagName('segment');
    Array.from(xmlSegments).forEach(function(xmlSegment){
        var wire = parseSegment(xmlSegment),
            layerName = xmlSegment.getAttribute('layer'),
            signalKey = parseInt(xmlSegment.getAttribute('net'), 10),
            layer = this.layers.find(byName, layerName);
            console.log("debug layer.find", layer);
        if(layer.signals === undefined) {layer.signals = []; console.log("debug layer has no signals");}
        var signal = layer.signals.find(byKey, signalKey);
        console.log("debug layer.signal.find", signal);
        if (signal === undefined){
            var s = this.signals.find(byKey, signalKey);
            signal = {key: s.key, name: s.name};
            layer.signals.push(signal);
            console.log("debug layer.signal.push", signal);
        }
        if(signal.wires === undefined) signal.wires = [];
        signal.wires.push(wire);

    }, this);
    
    var xmlVias = this.boardXML.getElementsByTagName('via');
    Array.from(xmlVias).forEach(function(xmlVia){
        var via = parseVia(xmlVia);
        this.holes.push({x: via.x, y: via.y, drill: parseFloat(xmlVia.getAttribute('drill'))});
        var signalKey = parseInt(xmlVia.getAttribute('net'),10);
        xmlVia.getAttribute('viaLayers').split(/\s/).forEach(function(layerName){
            var layer = this.layers.find(byName, layerName);
            if(layer.signals === undefined) layer.signals = [];
            var signal = layer.signals.find(byKey, signalKey);
            if (signal === undefined){
                var s = this.signals.find(byKey, signalKey);
                signal = {key: s.key, name: s.name};
                layer.signals.push(signal);
            }
            if(signal.vias === undefined) signal.vias = [];
            signal.vias.push(via);
        }, this);
    }, this);
};

/**
 * Class to parse KiCad_pcb text file to XML format.
 */
function kiCadXmlParser(){
    var that = this;
    
    function getEndIndex(text, oIndex){
        var i = oIndex+1, l=text.length, bCount=1;
        while (i<l && bCount!=0){
            if(text[i] == "(") bCount++;
            if(text[i] == ")") bCount--;
            //console.log("PCBW-", i, bCount);
            i++;
        }
        return i-1;
    }
    
    function getAttributes(text){
        var hasChildren = /\(/.test(text),
            endIndex = hasChildren? text.indexOf("(") : text.length,
            values = text.substring(0, endIndex).trim().match(/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g),
            name = values[0];
        return {
            name: name,
            values: values,
            hasChildren: hasChildren
        };
    }
    
    function assigneAttributes(element, values){
        var name = values[0];
        if(name == "net_class" || name == "module" || name == "model")
            element.setAttribute("name", values[1]);
        else if(name == "pad"){
            element.setAttribute("net", values[1]);
            element.setAttribute("type", values[2]);
            element.setAttribute("shape", values[3]);
        }
        else if(name == "dimension")
            element.setAttribute("value", values[1]);
        else if(name == "fp_text"){
            element.setAttribute("type", values[1]);
            element.setAttribute("text", values[2]);
        }
        else if(name == "gt_text")
            element.setAttribute("text", values[1]);
    }
    
    function getDrawingElement(){
        var element = that.doc.createElement("drawing");
        var board = that.doc.createElement("board");
        var nets = that.doc.createElement("nets");
        var netClasses = that.doc.createElement("net_classes");
        var modules = that.doc.createElement("modules");
        var graphics = that.doc.createElement("graphics");
        var segments = that.doc.createElement("segments");
        var vias = that.doc.createElement("vias");
        board.appendChild(nets);
        board.appendChild(netClasses);
        board.appendChild(modules);
        board.appendChild(graphics);
        board.appendChild(segments);
        board.appendChild(vias);
        element.appendChild(board);
        return element;
    }
    
    function addChild(parent, element){
        if(parent.nodeName != "drawing") {
            parent.appendChild(element);
            return;
        }
        var name = element.nodeName;
        if(name == "net_class")
            parent.getElementsByTagName("net_classes")[0].appendChild(element);
        else if(name == "module")
            parent.getElementsByTagName("modules")[0].appendChild(element);
        else if(name == "segment")
            parent.getElementsByTagName("segments")[0].appendChild(element);
        else if(name == "via")
            parent.getElementsByTagName("vias")[0].appendChild(element);
        else if(name.startsWith("gr_"))
            parent.getElementsByTagName("graphics")[0].appendChild(element);
        else
            parent.appendChild(element);
    }
    
    function parseText(text, parent){
        var obi = 0, cbi = 0;
        text = text.trim();
        while(cbi <text.length - 1 && obi != -1 && cbi != -1){
            //console.log("PCBW-loop", text.length, obi, cbi);
            obi = text.indexOf("(", cbi);
            cbi = getEndIndex(text, obi);
            var innerText = text.substring(obi+1, cbi).trim();
            var attributes = getAttributes(innerText);
            //console.log("PCBW-Parsing", attributes.name, obi, cbi);
            if(attributes.hasChildren){
                if(parent.nodeName == attributes.name){
                    assigneAttributes(parent, attributes.values);
                    var element = getDrawingElement();
                    parseText(innerText, element);
                    parent.appendChild(element);
                }
                else{
                    var element = that.doc.createElement(attributes.name);
                    //console.log("PCBW-recursive", attributes.values);
                    assigneAttributes(element, attributes.values);
                    parseText(innerText, element);
                    //console.log("PCBW-Parsed", element);
                    addChild(parent, element);
                    //parent.appendChild(element);
                }
            }
            else {
                var vals = text.substring(obi+1, cbi).match(/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g);
                //console.log("PCBW-attributes", attributes.name, vals);
                if(parent.nodeName == "layers"){
                    var layer = that.doc.createElement("layer");
                    layer.setAttribute("id", vals[0]);
                    layer.setAttribute("name", vals[1]);
                    layer.setAttribute("type", vals[2]);
                    parent.appendChild(layer);
                }
                else if(parent.nodeName == "setup"){
                    var param = that.doc.createElement("param");
                    param.setAttribute("name", vals[0]);
                    param.setAttribute("value", vals[1]);
                    parent.appendChild(param);
                }
                else if(parent.nodeName == "pcbplotparams"){
                    var param = that.doc.createElement("param");
                    param.setAttribute("name", vals[0]);
                    param.setAttribute("value", vals[1]);
                    parent.appendChild(param);
                }
                else if(parent.nodeName == "pts"){
                    var xy = that.doc.createElement("xy");
                    xy.setAttribute("x", vals[1]);
                    xy.setAttribute("y", vals[2]);
                    parent.appendChild(xy);
                }
                else if(parent.nodeName == "via" && vals[0]=="layers"){
                    var layers = "";
                    for(var i=1; i<vals.length; i++) layers+=vals[i] + " ";
                    parent.setAttribute("viaLayers", layers.trim());
                }
                else if(parent.nodeName == "pad" && vals[0]=="layers"){
                    var layers = "";
                    for(var i=1; i<vals.length; i++) layers+=vals[i] + " ";
                    parent.setAttribute("padLayers", layers.trim());
                }
                else if(parent.nodeName == "drawing" && vals[0] == "net"){
                    var net = that.doc.createElement(vals[0]);
                    net.setAttribute("id", vals[1]);
                    net.setAttribute("name", vals[2]);
                    parent.getElementsByTagName("nets")[0].appendChild(net);
                }
                else if(vals[0] == "add_net"){
                    var net = that.doc.createElement(vals[0]);
                    net.setAttribute("name", vals[1]);
                    parent.appendChild(net);
                }
                else if(vals[0] == "area"){
                    var area = that.doc.createElement("area");
                    area.setAttribute("x1", vals[1]);
                    area.setAttribute("y1", vals[2]);
                    area.setAttribute("x2", vals[3]);
                    area.setAttribute("y2", vals[4]);
                    parent.appendChild(area);
                }
                else if(vals[0] == "xyz"){
                    parent.setAttribute("x", vals[1]);
                    parent.setAttribute("y", vals[2]);
                    parent.setAttribute("z", vals[3]);
                }
                else if(vals[0] == "start"){
                    parent.setAttribute("x1", vals[1]);
                    parent.setAttribute("y1", vals[2]);
                }
                else if(vals[0] == "end"){
                    parent.setAttribute("x2", vals[1]);
                    parent.setAttribute("y2", vals[2]);
                }
                else if(vals[0] == "at"){
                    parent.setAttribute("x", vals[1]);
                    parent.setAttribute("y", vals[2]);
                    if(vals.length == 4)
                        parent.setAttribute("angle", vals[3]);
                }
                else if(vals[0] == "size" && vals.length == 3){
                    parent.setAttribute("width", vals[1]);
                    parent.setAttribute("height", vals[2]);
                }
                else if(vals[0] == "host"){
                    that.doc.documentElement.setAttribute(vals[0], vals[1] + " " + vals[2]);
                }
                else if(vals[0] == "version")
                    that.doc.documentElement.setAttribute(vals[0], vals[1]);
                else
                    parent.setAttribute(vals[0], vals[1]);
            }
        }
    }
    
    this.parse = function(text) {
        console.group("KiCad XML Parser");
        
        var dt = document.implementation.createDocumentType('kicad_pcb', '', 'http://kicad-pcb.org/help/file-formats/');
        this.doc = document.implementation.createDocument("","kicad_pcb", dt);
        
        parseText(text, this.doc.documentElement);
        
        //console.log("PCBW-XML", this.doc);
        console.groupEnd();
        
        return this.doc;
    };
}