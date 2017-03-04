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

                this.draw3d(function() {
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
        
        draw3d: function(){
            this.clear3dViewer();
            this.render3dBlankBoard2();
            this.sceneAdd(this.sceneGroups.board);
        },
        render3dBlankBoard2: function(){
            var x1 = this.board.fr4.x,
                x2 = this.board.fr4.x + this.board.fr4.width,
                y1 = this.board.fr4.y,
                y2 = this.board.fr4.y + this.board.fr4.height,
                z1 = 0,
                z2 = -this.board.fr4.depth,
                
                regColor = 0xB87333,
                
                wireMat = new THREE.MeshBasicMaterial({
                color: regColor,
                linewidth: 2,
                transparent: true,
                opacity: .6
                }),
                
                boardMat = new THREE.LineBasicMaterial({
                color: regColor,
                transparent: true,
                opacity: .4
                }),
                
                boardPath = new ClipperLib.Paths(),
                holePaths = new ClipperLib.Paths();
                
            boardPath.push([
                {X: x1, Y: y1},
                {X: x2, Y: y1},
                {X: x2, Y: y2},
                {X: x1, Y: y1},
                ]);
                
            holePaths.push([
                {X: 5, Y: 5},
                {X: 9, Y: 5},
                {X: 9, Y: 9},
                {X: 5, Y: 9},
                ]);
                
            var mesh = this.createClipperPathsAsMesh(boardPath, boardMat, holePaths, z2);
                
            var geo = new THREE.EdgesGeometry(mesh.geometry);
            var wireframe = new THREE.LineSegments( geo, wireMat );
            
            this.sceneGroups.board = new THREE.Group();
            
            this.sceneGroups.board.add(mesh);
            this.sceneGroups.board.add(wireframe);
                
        },
        render3dBlankBoard: function(){

            var x1 = this.board.fr4.x,
                x2 = this.board.fr4.x + this.board.fr4.width,
                y1 = this.board.fr4.y,
                y2 = this.board.fr4.y + this.board.fr4.height,
                z1 = 0,
                z2 = -this.board.fr4.depth,
                regColor = 0xB87333,
                wireMat = new THREE.MeshBasicMaterial({
                color: regColor,
                linewidth: 2,
                transparent: true,
                opacity: .6
                }),
                boardMat = new THREE.LineBasicMaterial({
                color: regColor,
                transparent: true,
                opacity: .4
                });
            
            this.blankBoundaries = {
                MinimumX: x1,
                MinimumY: y1,
                MaximumX: x2,
                MaximumY: y2
            };
            
            var shape = new THREE.Shape();
            shape.moveTo(x1, y1);
            shape.lineTo(x1, y2);
            shape.lineTo(x2, y2);
            shape.lineTo(x2, y1);
            shape.lineTo(x1, y1);
            
            var extrudeSettings = {
            	amount: -this.board.fr4.depth,
            	bevelEnabled: false
            };
            
            var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
            var mesh = new THREE.Mesh( geometry, boardMat ) ;
            
            // var cube_bsp = new ThreeBSP( mesh );
            // var sphere_geometry = new THREE.SphereGeometry( 50, 32, 30 );
            // var sphere_mesh = new THREE.Mesh( sphere_geometry );
            // sphere_mesh.position.x = -7;
            // var sphere_bsp = new ThreeBSP( sphere_mesh );
            // var subtract_bsp = cube_bsp.subtract( sphere_bsp );
            // var result = subtract_bsp.toMesh( new THREE.MeshLambertMaterial({ shading: THREE.SmoothShading}) );
            // result.geometry.computeVertexNormals();
            
            
            
            var geo = new THREE.EdgesGeometry(mesh.geometry);
            var wireframe = new THREE.LineSegments( geo, wireMat );
            
            this.sceneGroups.board = new THREE.Group();
            
            this.sceneGroups.board.add(mesh);
            this.sceneGroups.board.add(wireframe);
        },
        
        /**
         * Utility Functions.
         */
        createClipperPathsAsMesh: function (paths, material, holePath, depth){

            var group = new THREE.Object3D();
            for (var i = 0; i < paths.length; i++) {
                var shape = new THREE.Shape();
                for (var j = 0; j < paths[i].length; j++) {
                    var pt = paths[i][j];
                    if (j == 0) shape.moveTo(pt.X, pt.Y); else shape.lineTo(pt.X, pt.Y);
                }
               if (holePath !== undefined && holePath != null) {
                    if (!(Array.isArray(holePath))) {
                        holePath = [holePath];
                    }
                    
                    for (var hi = 0; hi < holePath.length; hi++) {
                        var hp = holePath[hi];
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
            }
            return group;
        },
    }
});

function Board(type){
    this.type = type;
    this.fr4 = {x:0, y: 0, width: 150, height: 100, depth: 1.7};
    this.classes = [];
    this.nets = [];
    this.layers = [];
    this.holes = [];
    
}
Board.type = {eagle: "Eagle", kiCad: "KiCad"};

Board.supportedFiles = [
    {type: Board.type.eagle, ext:".brd", signature: /<!DOCTYPE eagle SYSTEM "eagle.dtd">[\s\S]*<board>/im},
    {type: Board.type.kiCad, ext:".kicad_pcb", signature: /\(kicad_pcb \(version \d+\) \(host pcbnew/i}];

Board.prototype.classes = [];
Board.prototype.nets = [];
Board.prototype.layers = [];
Board.prototype.holes = [];
Board.prototype.dimensions = [];

Board.prototype.loadText = function (text){
    if(this.type == Board.type.eagle){
        var parser = new DOMParser();
        this.boardXML = parser.parseFromString(text, "text/xml");
        this.parseEagle();
        return;
    }
    
    if(this.type == Board.type.kiCad){
        this.parseKiCad();
        return;
    }
}

Board.prototype.parseEagle = function () {
    
}

Board.prototype.parseKiCad = function () {
    
}