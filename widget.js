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
        Three: "https://cdnjs.cloudflare.com/ajax/libs/three.js/r76/three",
        ThreeTextGeometry: "//i2dcui.appspot.com/js/three/TextGeometry",
        ThreeFontUtils: "//i2dcui.appspot.com/js/three/FontUtils",
        ThreeHelvetiker: "//i2dcui.appspot.com/js/three/threehelvetiker",
        Clipper: "//i2dcui.appspot.com/js/clipper/clipper_unminified"
    },
    shim: {
        ThreeTextGeometry: ["Three"],
        ThreeFontUtils: ["Three", "ThreeTextGeometry"],
        ThreeHelvetiker: ["Three", "ThreeTextGeometry", "ThreeFontUtils"],
    }
});

cprequire_test(["inline:com-chilipeppr-widget-pcb"], function(pcbw) {

    // Test this element. This code is auto-removed by the chilipeppr.load()
    // when using this widget in production. So use the cpquire_test to do things
    // you only want to have happen during testing, like loading other widgets or
    // doing unit tests. Don't remove end_test at the end or auto-remove will fail.

    console.info("PCBW", "test running of " + pcbw.id);
    //ew.init();

    $("#com-chilipeppr-widget-pcb").css("position", "relative");
    $("#com-chilipeppr-widget-pcb").css("background", "none");
    $("#com-chilipeppr-widget-pcb").css("width", "320px");
    $("body").prepend("<div id=\"3dviewer\"></div>");

    chilipeppr.load(
        "#3dviewer",
        "http://raw.githubusercontent.com/ameennihad/widget-3dviewer/master/auto-generated-widget.html",
        function() {
            cprequire(["inline:com-chilipeppr-widget-3dviewer"], function(threed) {
                threed.init({
                    doMyOwnDragDrop: false
                });
                // only init pcb widget once 3d is loaded
                // set doMyOwnDragDrop
                pcbw.init(true);
            });
        });
    $("body").prepend("<div id=\"test-drag-drop\"></div>");
    chilipeppr.load("#test-drag-drop", "http://raw.githubusercontent.com/chilipeppr/elem-dragdrop/master/auto-generated-widget.html",

        function() {
            cprequire(
                ["inline:com-chilipeppr-elem-dragdrop"],

                function(dd) {
                    dd.init();
                    dd.bind("body", null);
                });
        });

    $("body").prepend("<div id=\"com-chilipeppr-flash\"></div>");
    chilipeppr.load("#com-chilipeppr-flash",
        "http://raw.githubusercontent.com/chilipeppr/element-flash/master/auto-generated-widget.html",

        function() {
            cprequire(["inline:com-chilipeppr-elem-flashmsg"], function(fm) {
                fm.init();
            });
        });

    // test before and after render
    chilipeppr.subscribe("/" + pcbw.id + "/beforeToolPathRender", this, function(pcbWidget) {});
    chilipeppr.subscribe("/" + pcbw.id + "/afterToolPathRender", this, function(pcbWidget) {});
    // // test before and after render
    // chilipeppr.subscribe("/" + pcbw.id + "/beforeLayerGenerate", this, function(pcbWidget) {
    // });
    // chilipeppr.subscribe("/" + pcbw.id + "/afterLayerGenerate", this, function(pcbWidget) {
    // });


} /*end_test*/ );

// This is the main definition of your widget. Give it a unique name.
cpdefine("inline:com-chilipeppr-widget-pcb", ["chilipeppr_ready", "Clipper", "jqueryuiWidget"], function() {
    return {
        /**
         * The ID of the widget. You must define this and make it unique.
         */
        id: "com-chilipeppr-widget-pcb", // Make the id the same as the cpdefine id
        name: "Widget / PCB Board v1.0", // The descriptive name of your widget.
        desc: "This widget lets you drag in a PCB board file to mill.", // A description of what your widget does
        url: "(auto fill by runme.js)", // The final URL of the working widget as a single HTML file with CSS and Javascript inlined. You can let runme.js auto fill this if you are using Cloud9.
        fiddleurl: "(auto fill by runme.js)", // The edit URL. This can be auto-filled by runme.js in Cloud9 if you'd like, or just define it on your own to help people know where they can edit/fork your widget
        githuburl: "(auto fill by runme.js)", // The backing github repo
        testurl: "(auto fill by runme.js)", // The standalone working widget so can view it working by itself
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
            "/onExampleGenerate": "Example: Publish this signal when we go to generate gcode."
        },
        /**
         * Define the subscribe signals that this widget/element owns or defines so that
         * other widgets know how to subscribe to them and what they do.
         */
        subscribe: {
            // Define a key:value pair here as strings to document what signals you subscribe to
            // so other widgets can publish to this widget to have it do something.
            // "/onExampleConsume": "Example: This widget subscribe to this signal so other widgets can send to us and we'll do something with it."
        },
        /**
         * Document the foreign publish signals, i.e. signals owned by other widgets
         * or elements, that this widget/element publishes to.
         */
        foreignPublish: {
            // Define a key:value pair here as strings to document what signals you publish to
            // that are owned by foreign/other widgets.
            // "/jsonSend": "Example: We send Gcode to the serial port widget to do stuff with the CNC controller."
        },
        /**
         * Document the foreign subscribe signals, i.e. signals owned by other widgets
         * or elements, that this widget/element subscribes to.
         */
        foreignSubscribe: {
            // Define a key:value pair here as strings to document what signals you subscribe to
            // that are owned by foreign/other widgets.
            // "/com-chilipeppr-elem-dragdrop/ondropped": "Example: We subscribe to this signal at a higher priority to intercept the signal. We do not let it propagate by returning false."
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
            }
            else {
                // the workspace is doing the drag/drop. this is important
                // because this code base for this widget is huge and thus
                // the workspace should handle dragging in BRD files
                // and once it sees one, it should then load this widget
                // so that users who don't use ChiliPeppr for BRD files
                // don't have to load all this insane code
            }

            //TODO: Remove this line & onFileInputChanged event when drag/drop is implemented
            $(this.getElementId("pcbw-file-input")).change(this.onFileInputChanged.bind(this));

            this.readFr4Values();
            this.readRegHoleGcodeValues();
            this.readRegHoleValues();

            this.setupUiFromLocalStorage();
            this.btnSetup();
            this.forkSetup();
            this.init3d();
            //this.open();
            this.setupMouseOver();
        },
        onFileInputChanged: function(e){
            var file = e.target.files[0];
                if (!file) {
                return;
            }
            var reader = new FileReader();
            var that = this;
            reader.onload = function(e) {
                var contents = e.target.result;
                var info = {
                	name: e.target.fileName,
                	lastModified: new Date()
                };
                that.open(contents, info);
            };
            reader.readAsText(file, "UTF-8");
        },
        getElementId: function(id) {
            return "#" + this.id + " #" + id;
        },
        getElementClass: function(id) {
            return "#" + this.id + " ." + id;
        },
        /**
         * Try to get a reference to the 3D viewer.
         */
        init3d: function() {
            this.get3dObj();
            if (this.obj3d === null) {
                console.info("PCBW", "loading 3d scene failed, try again in 1 second");
                var attempts = 1;
                var that = this;
                setTimeout(function() {
                    that.get3dObj();
                    if (that.obj3d === null) {
                        attempts++;
                        setTimeout(function() {
                            that.get3dObj();
                            if (that.obj3d === null) {
                                console.info("PCBW", "giving up on trying to get 3d");
                            }
                            else {
                                console.info("PCBW", "succeeded on getting 3d after attempts:", attempts);
                                that.onInit3dSuccess();
                            }
                        }, 5000);
                    }
                    else {
                        console.info("PCBW", "succeeded on getting 3d after attempts:", attempts);
                        that.onInit3dSuccess();
                    }
                }, 1000);
            }
            else {
                this.onInit3dSuccess();
            }

        },
        onInit3dSuccess: function() {
            console.info("PCBW", "onInit3dSuccess. That means we finally got an object back.");
            //this.clear3dViewer();
            // open the last file
            this.open();
        },
        obj3d: null, // gets the 3dviewer obj stored in here on callback
        obj3dmeta: null, // gets metadata for 3dviewer
        userCallbackForGet3dObj: null,
        get3dObj: function(callback) {
            this.userCallbackForGet3dObj = callback;
            chilipeppr.subscribe("/com-chilipeppr-widget-3dviewer/recv3dObject", this, this.get3dObjCallback);
            chilipeppr.publish("/com-chilipeppr-widget-3dviewer/request3dObject", "");
            chilipeppr.unsubscribe("/com-chilipeppr-widget-3dviewer/recv3dObject", this.get3dObjCallback);
        },
        get3dObjCallback: function(data, meta) {
            console.info("PCBW", "got 3d obj:", data, meta);
            this.obj3d = data;
            this.obj3dmeta = meta;
            if (this.userCallbackForGet3dObj) {
                this.userCallbackForGet3dObj();
                this.userCallbackForGet3dObj = null;
            }
        },
        is3dViewerReady: false,
        clear3dViewer: function() {
            console.info("PCBW", "clearing 3d viewer");
            chilipeppr.publish("/com-chilipeppr-widget-3dviewer/sceneclear");
            this.is3dViewerReady = true;
        },
        setupDragDrop: function() {
            // subscribe to events
            chilipeppr.subscribe("/com-chilipeppr-elem-dragdrop/ondragover", this, this.onDragOver);
            chilipeppr.subscribe("/com-chilipeppr-elem-dragdrop/ondragleave", this, this.onDragLeave);
            // /com-chilipeppr-elem-dragdrop/ondropped
            chilipeppr.subscribe("/com-chilipeppr-elem-dragdrop/ondropped", this, this.onDropped, 8); // default is 10, we do 9 to be higher priority
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
            $("#" + this.id + " .hidebody").click(function(evt) {
                console.info("PCBW", "hide/unhide body");
                if ($("#" + that.id + " .panel-body").hasClass("hidden")) {
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
            $("#" + this.id + " .btn").popover({
                delay: 1000,
                animation: true,
                placement: "auto",
                trigger: "hover",
                container: "body"
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

            var options = localStorage.getItem(this.id + "-options");

            if (options) {
                options = $.parseJSON(options);
                console.info("PCBW", "just evaled options: ", options);
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
            console.info("PCBW", "options:", options);

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
            console.info("PCBW", "saving options:", options, "json.stringify:", optionsStr);
            // store settings to localStorage
            localStorage.setItem(this.id + "-options", optionsStr);
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
            $("#" + this.id + " .panel-body").removeClass("hidden");
            $("#" + this.id + " .panel-footer").removeClass("hidden");
            $("#" + this.id + " .hidebody span").addClass("glyphicon-chevron-up");
            $("#" + this.id + " .hidebody span").removeClass("glyphicon-chevron-down");
            if (evt !== null) {
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
            $("#" + this.id + " .panel-body").addClass("hidden");
            $("#" + this.id + " .panel-footer").addClass("hidden");
            $("#" + this.id + " .hidebody span").removeClass("glyphicon-chevron-up");
            $("#" + this.id + " .hidebody span").addClass("glyphicon-chevron-down");
            if (evt !== null) {
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
            var topCssSelector = "#" + this.id;

            $(topCssSelector + " .panel-title").popover({
                title: this.name,
                content: this.desc,
                html: true,
                delay: 1000,
                animation: true,
                trigger: "hover",
                placement: "auto"
            });

            var that = this;
            chilipeppr.load("http://raw.githubusercontent.com/chilipeppr/widget-pubsubviewer/master/auto-generated-widget.html", function() {
                require(["inline:com-chilipeppr-elem-pubsubviewer"], function(pubsubviewer) {
                    pubsubviewer.attachTo($(topCssSelector + " .panel-heading .dropdown-menu"), that);
                });
            });

        },
        statusEl: null, // cache the status element in DOM
        status: function(txt) {
            console.info("PCBW", "status. txt:", txt);
            if (this.statusEl === null) this.statusEl = $("#" + this.id + "-status");
            var len = this.statusEl.val().length;
            if (len > 30000) {
                console.info("PCBW", "truncating status area text");
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
        sceneAdd: function(obj) {

            // this method of adding puts us in the object that contains rendered Gcode
            // that's one option, but when we send gcode to workspace we get overwritten
            // then
            //this.obj3d.add(obj);

            // let's add our board content outside the scope of the Gcode content
            // so that we have it stay while the Gcode 3D Viewer still functions
            if (this.mySceneGroup === null) {
                this.mySceneGroup = new THREE.Group();
                this.obj3d.add(this.mySceneGroup);
            }
            this.mySceneGroup.add(obj);

            this.obj3dmeta.widget.wakeAnimate();
        },
        sceneRemove: function(obj) {
            if (this.mySceneGroup !== null)
                this.mySceneGroup.remove(obj);
            this.obj3dmeta.widget.wakeAnimate();
        },
        onDropped: function(data, info) {
            console.info("PCBW", "onDropped. len of file:", data.length, "info:", info);
            // we have the data
            // double check it's a board file, cuz it could be gcode
            var droppedFile = Board.supportedFiles.find(function(f) {
                return f.signature.test(data);
            });

            if (droppedFile !== undefined) {
                console.info("PCBW", "we have " + droppedFile.type + " board file!");
                // this.colorSignal = 9249571;
                // this.colorSmd = 9249571;
                localStorage.setItem(this.id + "-lastDropped", data);
                localStorage.setItem(this.id + "-lastDropped-info", JSON.stringify(info));
                this.fileInfo = info;
                console.info("PCBW", "saved brd file to localstorage");
                this.open(data, info);
                return false;
            }
            else {
                droppedFile = Board.supportedFiles.find(function(f) {
                    var extRegEx = new RegExp(f.ext + "$", "i");
                    if (info.name.match(extRegEx)) return f;
                    else return null;
                });
                console.log("droppedFile", droppedFile);
                if (droppedFile !== undefined) {
                    if (droppedFile.type == Board.types.eagle)
                        chilipeppr.publish("/com-chilipeppr-elem-flashmsg/flashmsg", "Error Loading Eagle BRD File", "Looks like you dragged in an Eagle BRD file, but it seems to be in binary. You can open this file in Eagle and then re-save it to a new file to create a text version of your Eagle BRD file.", 15 * 1000);
                    else if (droppedFile.type == Board.types.kiCad)
                        chilipeppr.publish("/com-chilipeppr-elem-flashmsg/flashmsg", "Error Loading KiCad File", "Looks like you dragged in a file with kicad_pcb extension, but it seems to be in unsupported format.", 15 * 1000);
                    return false;
                }
            }
        },
        onDragOver: function() {
            console.info("PCBW", "onDragOver");
            $("#" + this.id).addClass("panel-primary");
        },
        onDragLeave: function() {
            console.info("PCBW", "onDragLeave");
            $("#" + this.id).removeClass("panel-primary");
        },
        raycaster: null,
        projector: null, // = new THREE.Projector();
        arrowHelper: null,
        intersectObjects: [], // contains three.js objects that we want to detect on mouse movement in the 3d viewer
        renderArea: null, // cache for renderarea dom element
        infoArea: null, // store dom that shows info
        infoSignalArea: null,
        lastIntersect: null, // last obj we showed info for
        hidePopupsElem: null, // quick access to hide checkbox
        setupMouseOver: function() {
            this.raycaster = new THREE.Raycaster();
            //this.projector = new THREE.Projector();
            $("#com-chilipeppr-widget-3dviewer-renderArea").mousemove(this.onMouseOver.bind(this));
            //$("#com-chilipeppr-widget-3dviewer-renderArea").click(this.onMouseOver.bind(this));
            $("#com-chilipeppr-widget-3dviewer-renderArea").mousedown(this.onMouseDown.bind(this));
            $("#com-chilipeppr-widget-3dviewer-renderArea").mouseup(this.onMouseUp.bind(this));
            $("#com-chilipeppr-widget-3dviewer-renderArea").dblclick(this.onDblClick.bind(this));
            this.mouseButtonStatus = "up";
            $("#com-chilipeppr-widget-pcb #edit-dimension .edit-popup-close").click(this.onEditPopupClose.bind(this));
            this.renderArea = $("#com-chilipeppr-widget-3dviewer-renderArea");
            this.infoArea = $(".com-chilipeppr-widget-pcb-info");
            this.infoArea.prependTo(this.renderArea);
            //this.infoSignalArea = $(".com-chilipeppr-widget-pcb-info-signal");
            //this.infoSignalArea.prependTo(this.renderArea);
            this.hidePopupsElem = $("#com-chilipeppr-widget-pcb .popups-hide");
            console.log("Popup", this.hidePopupsElem);
            this.hidePopupsElem.change(function(evt) {
                console.log("Popup", this.hidePopupsElem);
                if (this.hidePopupsElem.is(":checked")) {
                    // hide
                    this.deactivateMouseMove();
                }
                else {
                    // unhide
                    this.reactivateMouseMove();
                }
            }, this);

        },
        reactivateMouseMove: function() {
            // add mouseover event
            //console.log("reactivateMouseMove");
            $("#com-chilipeppr-widget-3dviewer-renderArea").mousemove(this.onMouseOver.bind(this));
        },
        deactivateMouseMove: function() {
            //console.log("deactivateMouseMove");
            // remove mouseover event
            $("#com-chilipeppr-widget-3dviewer-renderArea").unbind("mousemove");
            this.hidePopups();
        },
        hidePopups: function() {

            //console.log("hiding popups and resetting opacities");
            //this.infoSignalArea.addClass("hidden");
            this.infoArea.addClass("hidden");

            // reset opacities
            if (this.lastIntersect !== null) {
                // console.log("lastIntersect:", this.lastIntersect);
                // also reset opacity for other items we hilited
                // if (this.lastIntersectOtherMaterials !== null) {
                //     //console.log("lastIntersectOtherMaterials:", this.lastIntersectOtherMaterials);
                //     this.lastIntersectOtherMaterials.forEach(function(material) {
                //         material.opacity = material.opacityBackup;
                //     });
                //     this.lastIntersectOtherMaterials = [];
                // }
                this.lastIntersect.object.material.opacity = this.lastIntersect.object.material.opacityBackup;
                this.lastIntersect.object.material.transparent = this.lastIntersect.object.material.transparentBackup;
            }
        },
        lastIntersectOtherMaterials: [], // array to hold materials modified by mouseover so we can reset them later to normal opacity
        onMouseUp: function(event) {
            this.mouseButtonStatus = "up";
        },
        onMouseDown: function(event) {
            this.mouseButtonStatus = "down";
            this.hidePopups();
        },
        onDblClick: function(event) {
            var x = event.clientX;
            var y = event.clientY;

            var modal = $("#com-chilipeppr-widget-pcb #edit-dimension")[0];
            modal.style.display = "block";
        },
        onEditPopupClose: function(event) {
            $("#com-chilipeppr-widget-pcb #edit-dimension")[0].style.display = "none";
        },
        onMouseOver: function(event) {
            if (this.mouseButtonStatus == "down") return;
            this.obj3dmeta.widget.wakeAnimate();
            var vector = new THREE.Vector3();

            var containerWidth = this.renderArea.innerWidth();
            var containerHeight = this.renderArea.innerHeight();

            var x = event.clientX;
            var y = event.clientY;
            vector.set((event.clientX / containerWidth) * 2 - 1, -(event.clientY / containerHeight) * 2 + 1, 0.5);

            var matrix = new THREE.Matrix4();
            var matrixInverse = matrix.getInverse(this.obj3dmeta.camera.projectionMatrix);
            matrix.multiplyMatrices(this.obj3dmeta.camera.matrixWorld, matrixInverse);
            vector.applyProjection(matrix);
            vector.sub(this.obj3dmeta.camera.position);
            vector.normalize();
            this.raycaster.ray.set(this.obj3dmeta.camera.position, vector);
            var intersects = this.raycaster.intersectObjects(this.intersectObjects, true);
            // reset last object
            if (this.lastIntersect !== null) {
                // also reset opacity for other items we hilited
                // if (this.lastIntersectOtherMaterials !== null) {
                //     this.lastIntersectOtherMaterials.forEach(function(material) {
                //         material.opacity = material.opacityBackup;
                //     });
                //     this.lastIntersectOtherMaterials = [];
                // }
                this.lastIntersect.object.material.opacity = this.lastIntersect.object.material.opacityBackup;
                this.lastIntersect.object.material.transparent = this.lastIntersect.object.material.transparentBackup;
            }

            if (intersects.length > 0) {
                var obj = intersects[0];
                if (obj != this.lastIntersect) {
                    this.lastIntersect = obj;
                    x += 30;
                    if (!obj.object.material.opacityBackup)
                        obj.object.material.opacityBackup = obj.object.material.opacity;
                    if (!obj.object.material.transparentBackup)
                        obj.object.material.transparentBackup = obj.object.material.transparent;

                    var ud = obj.object.userData;
                    if (!("type" in ud)) {
                        ud = obj.object.parent.userData;
                    }

                    if (ud.type == "ignore") {
                        this.hidePopups();
                        return;
                    }

                    var layerName = this.board.layers.find(byKey, ud.layer || 1).name;
                    if (this.board.type == Board.types.eagle) layerName = ud.layer + " - " + layerName;

                    if (ud.type == "dimension") {
                        this.updateInfoArea("Dimension", "Double click to change", [
                            { title: "Layer", data: layerName },
                            { title: "Wire Width", data: ud.width.toFixed(2) + " mm" },
                            { title: "Milling Width", data: ud.millingWidth.toFixed(2) + " mm" },
                            { title: "Millin Tool", data: ud.tool },
                            { title: "Operation Type", data: ud.dimensionType === 0 ? "Outside path" : ud.dimensionType == 1 ? "Inside path" : "On path" }
                        ]);
                    }
                    else if (ud.type == "signal") {
                        this.updateInfoArea("Signal", "....", [
                            { title: "Signal Key", data: ud.signalKey },
                            { title: "Signal Name", data: ud.name },
                            { title: "Layer", data: layerName },
                            { title: "Class", data: ud.netClassName },
                            { title: "Clearance", data: ud.clearance + " mm (" + Math.round(ud.clearance / 0.0254) + " mil)" }
                        ]);
                    }
                    this.infoArea.removeClass("hidden");
                    this.infoArea.css("left", x + "px").css("top", y + "px");

                    obj.object.material.opacity = 0.8;
                    obj.object.material.transparent = true;
                }
            }
            else {
                // hide info area
                this.infoArea.addClass("hidden");
            }
        },
        updateInfoArea: function(header, footer, info) {
            this.infoArea.find(".info-title").text(header);
            this.infoArea.find(".info-footer").text(footer);
            for (var i = 0; i <= 6; i++) {
                if (i < info.length) {
                    this.infoArea.find(".row" + i + " .title").text(info[i].title);
                    this.infoArea.find(".row" + i + " .info").text(info[i].data);
                    this.infoArea.find(".row" + i).removeClass("hidden");
                }
                else
                    this.infoArea.find(".row" + i).addClass("hidden");
            }
        },
        open: function(data, info) {
            // TODO: Optimize this method and load settings from storage
            // if we are passed the file data, then use that, otherwise look to
            // see if we had one saved from before, i.e. this is a browser reload scenario
            // and we'd like to show them their recent board file
            console.info("PCBW", "open");
            var validFile = false;
            var file;
            if (data) {
                console.info("PCBW", "open. loading from passed in data. data.length:", data.length, "info:", info);
                file = data;
                this.fileInfo = info;
                $(this.getElementClass("pcb-draghere")).addClass("hidden");
                validFile = true;
            }
            else {

                // try to retrieve the most recent board file
                file = localStorage.getItem(this.id + "-lastDropped");
                if (file && file.length > 0) {
                    this.fileInfo = localStorage.getItem(this.id + "-lastDropped-info");
                    if (this.fileInfo && this.fileInfo.match(/^{/)) {
                        this.fileInfo = JSON.parse(this.fileInfo);
                    }
                    console.info("PCBW", "open. loading data from localStorage. file.length:", file.length, "info:", this.fileInfo);
                    validFile = true;
                }
                else
                    validFile = false;
                // else {
                //     // there's no file, just return
                //     return;
                // }
            }
            var droppedFile;
            if (validFile) {
                // make sure this file is a supported board
                droppedFile = Board.supportedFiles.find(function(f) {
                    return f.signature.test(file);
                });
                if (droppedFile === undefined) {
                    chilipeppr.publish("/com-chilipeppr-elem-flashmsg/flashmsg", "Error Loading board file", "It looks like you had a previous board file, but it doesn't seem to be the correct format.", 10 * 1000);
                    validFile = false;
                }
                else
                    chilipeppr.publish("/com-chilipeppr-elem-flashmsg/flashmsg", "Opening " + droppedFile.type + " BRD", "Parsing " + droppedFile.type + " file and do 3D rendering.", 3000, true);
            }

            this.clearBoard();
            this.clear3dViewer();
            if (validFile) {
                this.board = new Board(droppedFile.type, this.fr4);
                this.board.loadText(file);
                this.tools = new TOOLS();
            }
            this.setupUiParameters();
            this.render3d();
            // this.draw3d(function() {
            //         console.log("got callback from draw3d");
            //     });

            chilipeppr.publish('/com-chilipeppr-widget-3dviewer/setunits', "mm" );
            chilipeppr.publish("/com-chilipeppr-widget-3dviewer/drawextents");
            chilipeppr.publish("/com-chilipeppr-widget-3dviewer/viewextents");
        },
        //TODO: Optimze and use the following three methods
        draw3d: function (callback) {
            if (!this.is3dViewerReady) {
                var that = this;
                setTimeout(function () {
                    if (!that.is3dViewerReady) {
                        setTimeout(function () {
                            if (!that.is3dViewerReady) {
                                console.log("giving up on drawing into 3d for Eagle Brd");
                            } else {
                                console.log("ready to draw 3d on 3rd attempt");
                                that.onDraw3dReady();
                                if (callback) callback();
                            }
                        }, 5000);
                    } else {
                        console.log("ready to draw 3d on 2nd attempt");
                        that.onDraw3dReady();
                        if (callback) callback();
                    }
                }, 2000);
            } else {
                console.log("ready to draw 3d on 1st attempt");
                this.onDraw3dReady();
                if (callback) callback();
            }
        },
        onDraw3dReady: function () {

    		console.group("draw3d");

            // inform any listeners that we're starting parsing, i.e. we're done with
            // all of our draw3dxxx functions which means all our three.js objects
            // and clipper objects are generated.
            chilipeppr.publish("/" + this.id + '/beforeLayerGenerate', this);


            this.clear3dViewer();
            this.render3d();
            // obj3d is the original THREE.Object3D() for the 3d
            // viewer. the extents x/y/z vals are calculated off of
            // it so we need a fake object to put in there
            console.log("this.obj3d:", this.obj3d);

            //This line is disable to keep view angle unchanges when refresh is clicked
            //XXXchilipeppr.publish('/com-chilipeppr-widget-3dviewer/viewextents' );

            // inform any listeners that we're done parsing, i.e. we're done with
            // all of our draw3dxxx functions which means all our three.js objects
            // and clipper objects are generated.
            chilipeppr.publish("/" + this.id + '/afterLayerGenerate', this);

            // setTimeout(this.onRefresh.bind(this, null, this.onDraw3dReadyAfter), 2000);

            // for debug, spit out console info
            var that = this;
            setTimeout(function() {
                console.log("DONE GENERATING BOARD. this:", that, "eagle obj we will draw:", that.eagle);
            }, 4000);

            console.log("done drawing Eagle PCB Board");
            console.groupEnd();
        },
        onDraw3dReadyAfter: function() {
            console.log("onDraw3dReadyAfter");
            // ask 3d viewer to set things up now
            chilipeppr.publish('/com-chilipeppr-widget-3dviewer/setunits', "mm" );
            chilipeppr.publish('/com-chilipeppr-widget-3dviewer/drawextents' );
            //This line is disable to keep view angle unchanges when refresh is clicked
            //XXXchilipeppr.publish('/com-chilipeppr-widget-3dviewer/viewextents' );
            $(window).trigger('resize');
            if (this.obj3dmeta && this.obj3dmeta.widget) {
                this.obj3dmeta.widget.wakeAnimate();
            }

        },
        /**
         * This method is called from the main workspace telling us the user
         * just activated us as a widget. This is not the same as load. Load
         * happens once. Activate happens many times if user closes then opens
         * us.
         */
        activateWidget: function() {
            console.info("PCBW", "PCBW", "activating PCB widget");
            //TODO: Uncomment next line after adding functionality
            this.reactivateMouseMove();
            this.sceneReAddMySceneGroup();
        },
        unactivateWidget: function() {
            console.info("PCBW", "unactivating PCB widget");
            this.sceneRemoveMySceneGroup();
            //TODO: Uncomment next line after adding functionality
            this.deactivateMouseMove();
            //TODO: Uncomment following two lines after adding solder mask functionality
            // // hide solder mask as well
            // setTimeout(this.solderMaskRenderHide.bind(this), 10);
        },
        clearBoard: function() {
            this.get3dObj(this.clearBoardStep2.bind(this));
        },
        clearBoardStep2: function() {
            console.info("PCBW", "clearing board. this.obj3d:", this.obj3d, "this.mySceneGroup:", this.mySceneGroup);
            // remove all 3d viewer stuff
            this.sceneRemoveMySceneGroup();
            this.mySceneGroup = null;
            console.info("PCBW", "after clearing board. this.obj3d:", this.obj3d, "this.mySceneGroup:", this.mySceneGroup);

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
        /**
         * Global objects
         */

        millDiameter: 1,
        millDiameterMin: 1,
        minWireWidthToMill: 1,
        selectedLayer: {},
        cuttingToolOption: 0,
        ignoreSmallWires: false,
        // colorFailed: 0xff0000,
        // colorTabs: 0x4020A0,
        // opacitySignals: 0.30,
        // opacityDimensions: 0.6,
        // opacityHoles: 0.8,
        // opacityTabs: 0.5,
        // activeLayerIndex: 0,
        dimensionsToMill: [],
        // board: {},
        // boardPaths: {},
        // sceneGroups: {board:null, holes: null, layers:[], dimensions: null, tabs: null},
        // blankBoundaries: null,
        tabs: {
            useTabs: true,
            distance: 25,
            width: 2,
            height: 0.8,
            useForSlots: false
        },
        // mirrorX: false,
        // mirrorY: false,
        fr4: { x: 0, y: 0, width: 150, height: 100, depth: 1.7, paddingL: 2, paddingB: 2, spacing: 2, seperation: 0 },
        regHoles: { use: true, pattern: 410, diameter: 2, distance: 4 },
        regHoleGcodePara: { depth: -1.7, clearance: 2, feedrate: 200, spindleRPM: 1200 },
        readFr4Values: function() {
            var item;

            item = $(this.getElementClass("blank-pcb-x"));
            if (item.val() === "") item.val(this.fr4.x);
            else this.fr4.x = parseFloat(item.val());

            item = $(this.getElementClass("blank-pcb-y"));
            if (item.val() === "") item.val(this.fr4.y);
            else this.fr4.y = parseFloat(item.val());

            item = $(this.getElementClass("blank-pcb-width"));
            if (item.val() === "") item.val(this.fr4.width);
            else this.fr4.width = parseFloat(item.val());

            item = $(this.getElementClass("blank-pcb-height"));
            if (item.val() === "") item.val(this.fr4.height);
            else this.fr4.height = parseFloat(item.val());

            item = $(this.getElementClass("blank-pcb-depth"));
            if (item.val() === "") item.val(this.fr4.depth);
            else this.fr4.depth = parseFloat(item.val());

            item = $(this.getElementClass("blank-pcb-padding-l"));
            if (item.val() === "") item.val(this.fr4.paddingL);
            else this.fr4.paddingL = parseFloat(item.val());

            item = $(this.getElementClass("blank-pcb-padding-b"));
            if (item.val() === "") item.val(this.fr4.paddingB);
            else this.fr4.paddingB = parseFloat(item.val());

            item = $(this.getElementClass("blank-pcb-spacing"));
            if (item.val() === "") item.val(this.fr4.spacing);
            else this.fr4.spacing = parseFloat(item.val());
        },
        readRegHoleGcodeValues: function() {
            var item, v, min, max;

            item = $(this.getElementClass("reg-holes-depth"));
            if (item.val() === "") item.val(this.regHoleGcodePara.depth);
            else {
                v = parseFloat(item.val());
                min = parseFloat(item[0].min);
                max = parseFloat(item[0].max);
                if (v > max) { v = max;
                    item.val(v); }
                if (v < min) { v = min;
                    item.val(v); }
                this.regHoleGcodePara.depth = v;
            }

            item = $(this.getElementClass("reg-holes-clearance"));
            if (item.val() === "") item.val(this.regHoleGcodePara.clearance);
            else {
                v = parseFloat(item.val());
                min = parseFloat(item[0].min);
                if (v < min) { v = min;
                    item.val(v); }
                this.regHoleGcodePara.clearance = v;
            }

            item = $(this.getElementClass("reg-holes-feedrate"));
            if (item.val() === "") item.val(this.regHoleGcodePara.feedrate);
            else {
                v = parseFloat(item.val());
                min = parseFloat(item[0].min);
                if (v < min) { v = min;
                    item.val(v); }
                this.regHoleGcodePara.feedrate = v;
            }
            item = $(this.getElementClass("reg-holes-spindle-rpm"));
            if (item.val() === "") item.val(this.regHoleGcodePara.spindleRPM);
            else {
                v = parseFloat(item.val());
                min = parseFloat(item[0].min);
                if (v < min) { v = min;
                    item.val(v); }
                this.regHoleGcodePara.spindleRPM = v;
            }
        },
        readRegHoleValues: function() {
            this.regHoles.use = $(this.getElementClass("use-reg-holes")).prop("checked");

            this.regHoles.pattern = parseInt($(this.getElementId("reg-holes-pattern")).val());
            var item, v, min, max;
            item = $(this.getElementClass("reg-holes-diameter"));
            if (item.val() === "") item.val(this.regHoles.diameter);
            else {
                v = parseFloat(item.val());
                min = parseFloat(item[0].min);
                max = parseFloat(item[0].max);
                if (v > max) { v = max;
                    item.val(v); }
                if (v < min) { v = min;
                    item.val(v); }
                this.regHoles.diameter = v;
            }

            item = $(this.getElementClass("reg-holes-distance"));
            if (item.val() === "") item.val(this.regHoles.distance);
            else {
                v = parseFloat(item.val());
                min = parseFloat(item[0].min);
                max = parseFloat(item[0].max);
                if (v > max) { v = max;
                    item.val(v); }
                if (v < min) { v = min;
                    item.val(v); }
                this.regHoles.distance = v;
            }
        },
        setupUiParameters: function() {

            this.intersectObjects = [];
            //DropDownList : Selcted Layer
            var selectedLayerDropdown = $(this.getElementId("selectedLayer"));
            console.log(this.board);
            if (this.board) {
                var signalLayers = this.board.signalLayers();
                selectedLayerDropdown.empty();
                signalLayers.forEach(function(layer) {
                    selectedLayerDropdown.append($("<option />").text(layer.name));
                }, this);
                if (signalLayers.length >= 4) {
                    selectedLayerDropdown.append($("<option />").text("All top layers"));
                    selectedLayerDropdown.append($("<option />").text("All bottom layers"));
                    selectedLayerDropdown.prop("selectedIndex", signalLayers.length);
                }
            }
            else {
                selectedLayerDropdown.append($("<option />").text("None"));
            }
            selectedLayerDropdown.change(this.onChangeBoardDropdowns.bind(this));

            //Flipping Axis : Flipping the board horizontally or verticall
            var flippingAxis = $("#com-chilipeppr-widget-pcb #flippingAxis");
            flippingAxis.change(this.onChangeBoardDropdowns.bind(this));

            //Checkboxes : Items to Render
            var renderSignalsT = $("#com-chilipeppr-widget-pcb #renderSignalsT");
            var renderSignalsB = $("#com-chilipeppr-widget-pcb #renderSignalsB");
            var renderPolygons = $("#com-chilipeppr-widget-pcb #renderPolygons");
            var renderClearance = $("#com-chilipeppr-widget-pcb #renderClearance");
            var renderBoard = $("#com-chilipeppr-widget-pcb #renderBoard");
            var renderHoles = $("#com-chilipeppr-widget-pcb #renderHoles");
            // var renderTabs = $("#com-chilipeppr-widget-pcb #renderTabs");
            var renderBlank = $("#com-chilipeppr-widget-pcb #renderBlank");

            renderSignalsT.prop("checked", true);
            renderSignalsB.prop("checked", true);
            renderPolygons.prop("checked", true);
            renderClearance.prop("checked", true);
            renderBoard.prop("checked", true);
            renderHoles.prop("checked", true);
            // renderTabs.prop("checked", true);
            // renderBlank.prop("checked", true);

            renderSignalsT.change(this.onChangeRenderSignals.bind(this, 0));
            renderSignalsB.change(this.onChangeRenderSignals.bind(this, 1));
            renderPolygons.change(this.onChangeRenderPolygons.bind(this));
            renderClearance.change(this.onChangeRenderClearance.bind(this));
            renderBoard.change(this.onChangeRenderBoard.bind(this));
            renderHoles.change(this.onChangeRenderHoles.bind(this));
            // renderTabs.change(this.onChangeRenderTabs.bind(this));
            renderBlank.change(this.onChangeRenderBlank.bind(this));

            $("#com-chilipeppr-widget-pcb .blank-pcb-width").change(this.onChangeBlankBoardParamenters.bind(this));
            $("#com-chilipeppr-widget-pcb .blank-pcb-height").change(this.onChangeBlankBoardParamenters.bind(this));
            $("#com-chilipeppr-widget-pcb .blank-pcb-depth").change(this.onChangeBlankBoardParamenters.bind(this));
            $("#com-chilipeppr-widget-pcb .blank-pcb-spacing").change(this.onChangeBlankBoardParamenters.bind(this));
            $("#com-chilipeppr-widget-pcb .blank-pcb-padding-l").change(this.onChangeBlankBoardParamenters.bind(this));
            $("#com-chilipeppr-widget-pcb .blank-pcb-padding-b").change(this.onChangeBlankBoardParamenters.bind(this));
            $("#com-chilipeppr-widget-pcb .blank-pcb-x").change(this.onChangeBlankBoardParamenters.bind(this));
            $("#com-chilipeppr-widget-pcb .blank-pcb-y").change(this.onChangeBlankBoardParamenters.bind(this));

            $("#com-chilipeppr-widget-pcb .use-reg-holes").change(this.onChangeRegHolesParamenters.bind(this));
            $("#com-chilipeppr-widget-pcb #reg-holes-pattern").change(this.onChangeRegHolesParamenters.bind(this));
            $("#com-chilipeppr-widget-pcb .reg-holes-diameter").change(this.onChangeRegHolesParamenters.bind(this));
            $("#com-chilipeppr-widget-pcb .reg-holes-distance").change(this.onChangeRegHolesParamenters.bind(this));

            $("#com-chilipeppr-widget-pcb .reg-holes-sendgcodetows").click(this.sendRegHoleGcodeToWorkspace.bind(this));

            $("#com-chilipeppr-widget-pcb .reg-holes-depth").change(this.onChangeRegHolesGcodeParamenters.bind(this));
            $("#com-chilipeppr-widget-pcb .reg-holes-clearance").change(this.onChangeRegHolesGcodeParamenters.bind(this));
            $("#com-chilipeppr-widget-pcb .reg-holes-feedrate").change(this.onChangeRegHolesGcodeParamenters.bind(this));
            $("#com-chilipeppr-widget-pcb .reg-holes-spindle-rpm").change(this.onChangeRegHolesGcodeParamenters.bind(this));
        },


        /**
         * Event handelers
         */
        onChangeBoardDropdowns: function() {
            var selectedIndex = $(this.getElementId("selectedLayer")).prop("selectedIndex");
            var selectedText = $(this.getElementId("selectedLayer :selected")).text();
            var showAll = selectedIndex >= this.board.signalLayersCount;
            this.boards3d.forEach(function(board3d) {
                board3d.group.visible = showAll || board3d.top.name == selectedText || board3d.bottom.name == selectedText;
            }, this);
            var isTopLayer = selectedIndex == this.board.signalLayersCount;
            if (!showAll) {
                var layer = this.board.layers.find(byName, selectedText);
                isTopLayer = this.board.isTopLayer(layer.key);
            }
            var flippingAxis = $(this.getElementId("flippingAxis :selected")).text();
            console.log("flippingAxis", flippingAxis);
            var xa = (flippingAxis.startsWith("X") ? 1 : 0) * (isTopLayer ? 0 : 1);
            var ya = (flippingAxis.startsWith("Y") ? 1 : 0) * (isTopLayer ? 0 : 1);
            this.boards3d.forEach(function(board3d) {
                board3d.group.rotation.x = Math.PI * xa;
                board3d.group.rotation.y = Math.PI * ya;
            }, this);

            this.adjustBoards3dPositions();
            this.render3dBoard();
            if(flippingAxis.includes("complete FR4") && !isTopLayer){
                var xd = this.fr4.width - this.fr4.x;
                var yd = this.fr4.height - this.fr4.y;
                this.boards3d.forEach(function(board3d) {
                    if(ya == 1) board3d.group.position.x = xd - board3d.getX();
                    if(xa == 1) board3d.group.position.y = yd - board3d.getY();
                });
                this.board3dFr4.rotation.x = Math.PI * xa;
                this.board3dFr4.rotation.y = Math.PI * ya;
            }

            this.obj3dmeta.widget.wakeAnimate();
        },
        onChangeRenderSignals: function(layerIndex) {
            if (!this.boards3d) return;
            var renderSignals = layerIndex === 0 ?
                $(this.getElementId("renderSignalsT")).prop("checked") :
                $(this.getElementId("renderSignalsB")).prop("checked");
            var renderPolygons = $(this.getElementId("renderPolygons")).prop("checked");
            var renderClearance = $(this.getElementId("renderClearance")).prop("checked");

            this.boards3d.forEach(function(board3d) {
                board3d.layers[layerIndex].signals.visible = renderSignals;
                board3d.layers[layerIndex].polygons.visible = renderSignals && renderPolygons;
                board3d.layers[layerIndex].clearance.visible = renderSignals && renderClearance;
            }, this);
            this.obj3dmeta.widget.wakeAnimate();
        },
        onChangeRenderPolygons: function(layerIndex) {
            if (!this.boards3d) return;
            var renderPolygons = $(this.getElementId("renderPolygons")).prop("checked");

            this.boards3d.forEach(function(board3d) {
                board3d.layers[0].polygons.visible = renderPolygons;
                board3d.layers[1].polygons.visible = renderPolygons;
            }, this);
            this.obj3dmeta.widget.wakeAnimate();
        },
        onChangeRenderClearance: function(layerIndex) {
            if (!this.boards3d) return;
            var renderClearance = $(this.getElementId("renderClearance")).prop("checked");

            this.boards3d.forEach(function(board3d) {
                board3d.layers[0].clearance.visible = renderClearance;
                board3d.layers[1].clearance.visible = renderClearance;
            }, this);
            this.obj3dmeta.widget.wakeAnimate();
        },
        onChangeRenderBoard: function() {
            if (!this.boards3d) return;
            var renderBoard = $(this.getElementId("renderBoard")).prop("checked");
            this.boards3d.forEach(function(board3d) {
                board3d.copper.visible = renderBoard;
            }, this);
            this.obj3dmeta.widget.wakeAnimate();
        },
        onChangeRenderHoles: function() {
            if (!this.boards3d) return;
            var renderHoles = $(this.getElementId("renderHoles")).prop("checked");
            this.boards3d.forEach(function(board3d) {
                board3d.layers.forEach(function(layer) {
                    layer.holes.visible = renderHoles;
                }, this);

            }, this);
            this.obj3dmeta.widget.wakeAnimate();
        },
        onChangeRenderTabs: function() {
            var renderTabs = $("#com-chilipeppr-widget-pcb #renderTabs").prop("checked");
            if (this.sceneGroups.tabs) {
                this.sceneGroups.tabs.visible = renderTabs;
                this.obj3dmeta.widget.wakeAnimate();
            }
        },
        onChangeRenderBlank: function() {
            var renderBlank = $(this.getElementId("renderBlank")).prop("checked");
            if (this.board3dFr4) {
                // this.board3dFr4.visible = renderBlank;
                if (renderBlank)
                    this.sceneAdd(this.board3dFr4);
                else
                    this.sceneRemove(this.board3dFr4);
                this.obj3dmeta.widget.wakeAnimate();
            }
        },
        onChangeBlankBoardParamenters: function() {
            var item, v, min;
            item = $(this.getElementClass("blank-pcb-x"));
            if (item.val() === "") item.val(this.fr4.x);
            else this.fr4.x = parseFloat(item.val());

            item = $(this.getElementClass("blank-pcb-y"));
            if (item.val() === "") item.val(this.fr4.y);
            else this.fr4.y = parseFloat(item.val());

            item = $(this.getElementClass("blank-pcb-width"));
            if (item.val() === "") item.val(this.fr4.width);
            else {
                v = parseFloat(item.val());
                min = parseFloat(item[0].min);
                if (v < min) { v = min;
                    item.val(v); }
                this.fr4.width = v;
            }

            item = $(this.getElementClass("blank-pcb-height"));
            if (item.val() === "") item.val(this.fr4.height);
            else {
                v = parseFloat(item.val());
                min = parseFloat(item[0].min);
                if (v < min) { v = min;
                    item.val(v); }
                this.fr4.height = v;
            }

            item = $(this.getElementClass("blank-pcb-depth"));
            if (item.val() === "") item.val(this.fr4.depth);
            else {
                v = parseFloat(item.val());
                min = parseFloat(item[0].min);
                if (v < min) { v = min;
                    item.val(v); }
                this.fr4.depth = v;
            }

            item = $(this.getElementClass("blank-pcb-padding-l"));
            if (item.val() === "") item.val(this.fr4.paddingL);
            else {
                v = parseFloat(item.val());
                min = parseFloat(item[0].min);
                if (v < min) { v = min;
                    item.val(v); }
                this.fr4.paddingL = v;
            }

            item = $(this.getElementClass("blank-pcb-padding-b"));
            if (item.val() === "") item.val(this.fr4.paddingB);
            else {
                v = parseFloat(item.val());
                min = parseFloat(item[0].min);
                if (v < min) { v = min;
                    item.val(v); }
                this.fr4.paddingB = v;
            }

            item = $(this.getElementClass("blank-pcb-spacing"));
            if (item.val() === "") item.val(this.fr4.spacing);
            else {
                v = parseFloat(item.val());
                min = parseFloat(item[0].min);
                if (v < min) { v = min;
                    item.val(v); }
                this.fr4.spacing = v;
            }

            //this.adjustBoards3dPositions();
            if (this.boards3d) this.adjustBoards3dPositions();
            this.render3dBoard();

            // if(this.blankBoardSceneGroup !== null) this.sceneRemove(this.blankBoardSceneGroup);

            // this.draw3dBlankBoard();

            // if(this.regHolesSceneGroup !== null) this.sceneRemove(this.regHolesSceneGroup);

            //this.regHoles.holes = this.getRegHoles();
            // this.draw3dRegHoles();
            //this.exportGcodeRegistrationHoles();

            // chilipeppr.publish("/com-chilipeppr-widget-3dviewer/drawextents" );
        },
        onChangeRegHolesGcodeParamenters: function() {
            this.readRegHoleGcodeValues();
        },
        onChangeRegHolesParamenters: function() {
            this.readRegHoleValues();

            if (this.boards3d) this.adjustBoards3dPositions();
            this.render3dBoard();

            //this.regHoles.holes = this.getRegHoles();
            //this.exportGcodeRegistrationHoles();
        },

        /**
         * 3D Rendering functions
         */
        render3d: function() {
            if (this.board) {
                this.calculateHolePaths();
                this.calculateDimensionPaths();
                this.calculateSignalPaths();
                this.boards3d = [];
                this.create3dScene();
                this.boards3d.forEach(function(board3d) {
                    board3d.group = new THREE.Group();
                    board3d.group.add(board3d.copper);
                    board3d.layers.forEach(function(layer) {
                        board3d.group.add(layer.clearance);
                        board3d.group.add(layer.polygons);
                        board3d.group.add(layer.signals);
                        board3d.group.add(layer.mask);
                        board3d.group.add(layer.silk);
                        board3d.group.add(layer.holes);
                    }, this);
                    board3d.center();
                }, this);

                this.adjustBoards3dPositions();
                this.boards3d.forEach(function(board3d) {
                    this.sceneAdd(board3d.group);
                }, this);
            }

            this.render3dBoard();

            var axis = new THREE.AxisHelper(7.5);
            this.sceneAdd(axis);

            this.obj3d.parent.children.forEach(function(child) {
                if (child.type == "DirectionalLight") {
                    child.color.r = 1;
                    child.color.g = 1;
                    child.color.b = 1;
                }
            }, this);
        },
        adjustBoards3dPositions: function() {
            var w = this.board.boardBoundaries.MaximumX - this.board.boardBoundaries.MinimumX,
                h = this.board.boardBoundaries.MaximumY - this.board.boardBoundaries.MinimumY,
                f = this.board.fr4,
                x = f.x + f.paddingL + w / 2,
                y = f.y + f.paddingB + h / 2,
                z = f.depth / 2 - 0.04;
            this.boards3d.forEach(function(board3d) {
                if(board3d.group.visible){
                board3d.group.position.x = x;
                board3d.group.position.y = y;
                //board3d.group.position.z = z;
                console.log("Ameen Z of BRD adj to:", board3d.group.position.z);
                // board3d.width = w;
                // board3d.height = h;
                x += w + f.spacing;
                }
            }, this);
            this.obj3dmeta.widget.wakeAnimate();
        },
        calculateHolePaths: function() {
            this.board.holes.forEach(function(hole) {
                var holePath;
                if (!("drillShape" in hole && hole.drillShape == "oval")) {
                    holePath = PATHS.createCircularPath(0, 0, hole.drill / 2, 32);
                    hole.drillable = false;
                    hole.tool = this.tools.cuttingBits[0]; //TODO: Find a way to select right tool
                }
                else {
                    holePath = PATHS.createOvalPath(0, 0, hole.drillX, hole.drillY, 32);
                    if (hole.revolve !== 0) PATHS.adjustPath(holePath, hole.revolve, 0, 0);
                    var tool = this.tools.getDrillBit(hole.drillX);
                    console.log(tool);
                    if (tool != TOOLS.bitNotFound) {
                        hole.drillable = true;
                        hole.tool = tool;
                    }
                    else {
                        hole.drillable = false;
                        hole.tool = this.tools.cuttingBits[0]; //TODO: Find a way to select right tool
                    }
                }

                var x = hole.x,
                    y = hole.y;
                if ("packageRotation" in hole && "packageX" in hole && "packageY" in hole) {
                    var p = [{ X: x, Y: y }];
                    PATHS.adjustPath(p, hole.packageRotation, hole.packageX, hole.packageY);

                    if ("packageMirror" in hole && hole.packageMirror) {
                        PATHS.mirrorPath(p, hole.packageX, hole.packageY);
                    }
                    x = p[0].X;
                    y = p[0].Y;
                }
                PATHS.adjustPath(holePath, 0, x, y);
                hole.path = holePath;
            }, this);
            //this.boardPaths.holes = PATHS.getUnionOfPaths(this.boardPaths.holes);
        },
        calculateDimensionPaths: function() {
            //Set millDiameter based on user selections
            this.millDiameterMin = this.millDiameter;
            this.board.dimensions.forEach(function(dimension) {
                dimension.tool = this.tools.cuttingBits[0]; //TODO: Auto select tool
                if (dimension.width < this.minWireWidthToMill) {
                    if (this.ignoreSmallWires)
                        dimension.millDiameter = 0;
                    else
                        dimension.millDiameter = this.millDiameter;
                }
                else {
                    if (this.cuttingToolOption == 1) //use one tool
                        dimension.millDiameter = this.millDiameter;
                    else
                        dimension.millDiameter = dimension.width;
                }
                this.millDiameterMin = Math.min(this.millDiameterMin, dimension.millDiameter);
            }, this);

            //sort milling paths by tool size then by path type (1:Deflated, 0:Inflated, -1:open, -2:ignored)
            this.board.dimensions.sort(function(a, b) {
                var ta = a.type,
                    tb = b.type;
                ta = ta < 0 ? 9 : ta;
                tb = tb < 0 ? 9 : tb;
                if (a.millDiameter > b.millDiameter) return 1;
                if (a.millDiameter < b.millDiameter) return -1;
                if (tb > ta) return 1;
                if (tb < ta) return -1;
                return 0;

            });

            this.board.dimensions.forEach(function(dimension) {
                var path = dimension.path;

                if (dimension.millDiameter !== 0) {

                    var paths = new ClipperLib.Paths();
                    dimension.outerPath = [];
                    dimension.innerPath = [];
                    if ((dimension.width < this.minWireWidthToMill) && (dimension.type != -1)) { //Closed path with wire width = zero
                        paths = PATHS.getInflatePaths([path], dimension.type === 0 ? dimension.millDiameter / 2 : -dimension.millDiameter / 2);
                        if (paths.length > 0) {
                            path = [];
                            paths[0].forEach(function(v) {
                                path.push({ X: v.X, Y: v.Y });
                            });
                            path.push({ X: paths[0][0].X, Y: paths[0][0].Y });

                        }
                        else {
                            dimension.type = -2;
                            dimension.outerPath.push(path);
                        }

                    }
                    if (dimension.type != -2) {
                        paths = PATHS.getInflateOpenPaths([path], dimension.millDiameter / 2);
                        paths.forEach(function(path) {
                            if (ClipperLib.Clipper.Orientation(path)) {
                                dimension.outerPath.push(path);
                            }
                            else {
                                dimension.innerPath.push(path);
                            }
                        }, this);
                    }
                }
            }, this);
        },
        calculateSignalPaths: function() {
            var signalLayers = this.board.signalLayers();

            //***************************************************
            //* CLIPPING PATHS FROM BOARD DIMENSIONS            *
            //***************************************************
            var clipOuterPaths = [],
                clipInnerPaths = [];
            this.board.dimensions.forEach(function(dimension) {
                if (dimension.type === 0) {
                    clipOuterPaths.push(dimension.path);
                }
                else {
                    clipInnerPaths.push(dimension.path);
                }
            }, this);

            //***************************************************
            //* RESTRICT PATHS FROM LAYERS 41 & 42 (Ealge)      *
            //***************************************************
            var polyRestrictsTop = [],
                polyRestrictsBottom = [];
            //TODO: Create Restict paths and consider them as cutouts
            this.board.restricts.forEach(function(restrict) {
                if (restrict.type === 0) {
                    var rPaths = PATHS.getInflatePaths([restrict.path], 0);
                    if (restrict.layer == 41) {
                        polyRestrictsTop.push(rPaths[0]);
                    }
                    else {
                        polyRestrictsBottom.push(rPaths[0]);
                    }
                }
            }, this);

            signalLayers.forEach(function(layer) {
                layer.inflatedPaths = [];
                if (layer.signals !== undefined) {
                    var layerGroup = new THREE.Group();
                    layerGroup.name = layer.name;
                    layer.signals.forEach(function(signal) {
                        var signalPaths = [],
                            holes = [];
                        if (signal.wires !== undefined) {
                            signal.wires.forEach(function(wire) {
                                var wirePath = this.createWirePath(wire.x1, wire.y1, wire.x2, wire.y2, wire.width, wire.curve);
                                signalPaths.push(wirePath);
                                if ("cap" in wire && wire.cap == "round") {
                                    var strPath = PATHS.createCircularPath(wire.x1, wire.y1, wire.width / 2);
                                    var endPath = PATHS.createCircularPath(wire.x2, wire.y2, wire.width / 2);
                                    signalPaths.push(strPath);
                                    signalPaths.push(endPath);
                                }
                            }, this);
                        }
                        if (signal.vias !== undefined) {
                            signal.vias.forEach(function(via) {
                                via.paths = this.createViaPath(via);
                                signalPaths.push(via.paths.path);
                                // var hole = PATHS.createCircularPath(via.x, via.y, via.drill/2);
                                // holes.push(hole);
                            }, this);
                        }
                        if (signal.pads !== undefined) {
                            signal.pads.forEach(function(pad) {
                                pad.paths = this.createPadPath(pad, layer.key);
                                signalPaths.push(pad.paths.path);
                                // if(padPath.hole.length) holes.push(padPath.hole);
                            }, this);

                        }

                        if (signal.polygons !== undefined) {
                            var polyPaths = [],
                                polyCuts = [];
                            signal.polygons.forEach(function(polygon) {
                                var polyPath = this.createPolygonPath(polygon);
                                if (polygon.pour == "cutout") {
                                    polyCuts.push(polyPath);
                                }
                                else {
                                    polyPath = PATHS.clipPathsIfIntersected([polyPath], clipOuterPaths);
                                    polyPath = PATHS.getInflatePaths(polyPath, -polygon.isolate);
                                    var d = PATHS.getInflatePaths(clipInnerPaths, polygon.isolate);
                                    polyCuts = polyCuts.concat(d);
                                    this.board.holes.forEach(function(hole) {
                                        if (hole.type == "plain" || hole.type == "package") {
                                            var h = PATHS.getInflatePaths([hole.path], polygon.isolate);
                                            polyCuts.push(h[0]);
                                        }
                                    }, this);
                                    polyPaths = polyPaths.concat(polyPath);
                                }
                                if (signal.pads !== undefined && polygon.thermals) {
                                    signal.pads.forEach(function(pad) {
                                        var thermalPaths = this.createThermalPaths(pad, polygon);
                                        thermalPaths.forEach(function(thermalPath) {
                                            polyCuts.push(thermalPath.path);
                                        }, this);
                                    }, this);

                                }
                                if (signal.vias !== undefined && polygon.thermals && this.board.thermalsForVias()) {
                                    signal.vias.forEach(function(via) {
                                        var thermalViaPaths = this.createThermalPaths(via, polygon);
                                        thermalViaPaths.forEach(function(thermalPath) {
                                            polyCuts.push(thermalPath.path);
                                        }, this);
                                    }, this);
                                }
                            }, this);
                            console.log("AmeenPolys", polyPaths, polyCuts);
                            //if(layer.key == 1) polyCuts = polyCuts.concat(polyRestrictsTop);
                            //if(layer.key == 16) polyCuts = polyCuts.concat(polyRestrictsBottom);
                            signal.polygonPaths = PATHS.getUnionOfPaths(polyPaths);
                            signal.polygonCuts = PATHS.getIntersectionOfPaths(signal.polygonPaths, polyCuts);
                            signal.polygonCuts.forEach(function(iPath) {
                                if (iPath.length > 0) layer.inflatedPaths.push(iPath);
                            }, this);
                        }
                        //TODO: Handel holes generated from following path operations
                        signal.inflatedPaths = PATHS.getInflatePaths(signalPaths, signal.clearance);
                        if (signal.polygonPaths !== undefined) {
                            signal.inflatedPaths = PATHS.getDifferenceOfPaths(signal.inflatedPaths, signal.polygonPaths);
                            console.log("AmeenPolyLayer", signal.inflatedPaths);
                        }
                        signal.inflatedPaths.forEach(function(iPath) {
                            if (iPath.length > 0) layer.inflatedPaths.push(iPath);
                        }, this);
                        signal.outerPaths = PATHS.getUnionOfPaths(signalPaths);
                        signal.innerPaths = PATHS.getUnionOfPaths(holes);
                    }, this);
                }
            }, this);
        },
        create3dScene: function() {
            // this.bb = new THREE.Box3();
            var zDepths = { copper: -0.04, polys: -0.03, clearance: -0.02, signals: -0.01, holes: 0.00, mask: 0.00, silk: 0.00 };
            console.log("AmeenBoard", this.board);

            var signalLayers = this.board.signalLayers();

            var z, zd, isTopLayer, boardDepth = this.board.fr4.depth + zDepths.copper * 2;

            //***************************************
            //* MATERIALS                           *
            //***************************************
            var holeMat = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: false,
                side: THREE.DoubleSide
            });
            var wireMat = new THREE.LineBasicMaterial({
                color: 0xCB6D51,
                opacity: 0.2
            });
            var boardMat = new THREE.MeshPhongMaterial({
                color: 0xDA8A67,
                transparent: false,
                side: THREE.DoubleSide
            });

            for (var b = 0; b < signalLayers.length; b += 2) {

                var board3d = new Board3d();
                z = this.board.layerPositions[b];

                //***************************************
                //* DIMENSIONS                          *
                //***************************************
                var dPaths = [],
                    dHoles = [];
                this.board.dimensions.forEach(function(dimension) {
                    if (dimension.type === 0)
                        dPaths = dPaths.concat(dimension.innerPath);
                    else
                        dHoles = dHoles.concat(dimension.outerPath);
                }, this);
                var solPaths = PATHS.getDifferenceOfPaths(dPaths, dHoles);
                var boardMeshs = this.createThreeGroupFromPolyTree(solPaths, boardMat, boardDepth, wireMat);
                //boardMeshs.position.z = z + zDepths.copper - boardDepth;
                //console.log("Ameen Z - Board No.", b, "Z:", boardMeshs.position.z);
                board3d.copper = boardMeshs;
                boardMeshs.userData.type = "ignore";
                this.intersectObjects.push(boardMeshs);

                //***************************************
                //* LAYERS                              *
                //***************************************
                for (var l = 0; l < 2; l++) {

                    var layer = signalLayers[b + l];
                    isTopLayer = this.board.isTopLayer(layer.key);
                    z = this.board.layerPositions[b + l];

                    board3d.layers[l].name = layer.name;

                    //***************************************
                    //* CLEARANCE                           *
                    //***************************************
                    var clearanceMat = new THREE.MeshBasicMaterial({
                        color: 0xeeeecc,
                        side: isTopLayer ? THREE.FrontSide : THREE.BackSide,
                        transparent: false,
                        opacity: this.opacitySignals
                    });
                    var clearancePaths = PATHS.getDifferenceOfPaths(layer.inflatedPaths, dHoles);
                    var clearanceMeshs = this.createThreeGroupFromPolyTree(clearancePaths, clearanceMat);
                    zd = isTopLayer ? zDepths.clearance : -zDepths.clearance;
                    clearanceMeshs.position.z = z + zd;
                    clearanceMeshs.name = "clearace";
                    board3d.layers[l].clearance = clearanceMeshs;

                    //***************************************
                    //* SIGNALS                             *
                    //***************************************
                    if (layer.signals !== undefined) {
                        zd = isTopLayer ? zDepths.signals : -zDepths.signals;
                        layer.signals.forEach(function(signal) {

                            var signalMat = new THREE.MeshBasicMaterial({
                                color: this.board.layerColor(layer.key),
                                side: THREE.DoubleSide,
                                transparent: false
                            }, this);
                            var signalMesh = this.createMeshFromPaths(signal.outerPaths, signal.innerPaths, signalMat);
                            signalMesh.name = signal.name;
                            signalMesh.position.z = z + zd;
                            signalMesh.userData.type = "signal";
                            signalMesh.userData.signalKey = signal.key;
                            signalMesh.userData.name = signal.name;
                            signalMesh.userData.netClassName = signal.netClassName;
                            signalMesh.userData.clearance = signal.clearance;
                            signalMesh.userData.layer = layer.key;
                            board3d.layers[l].signals.add(signalMesh);
                            this.intersectObjects.push(signalMesh);

                            //***************************************
                            //* SIGNAL POLYGONS                     *
                            //***************************************
                            if (signal.polygons !== undefined) {
                                var polygonMat = new THREE.MeshBasicMaterial({
                                    color: this.board.layerColor(layer.key),
                                    side: isTopLayer ? THREE.FrontSide : THREE.BackSide,
                                    transparent: true,
                                    opacity: 0.8
                                });
                                var solPaths = PATHS.getDifferenceOfPaths(signal.polygonPaths, dHoles);
                                var polygonMeshs = this.createThreeGroupFromPolyTree(solPaths, polygonMat);
                                var pd = isTopLayer ? zDepths.polys : -zDepths.polys;
                                polygonMeshs.position.z = z + pd;
                                board3d.layers[l].polygons.add(polygonMeshs);
                            }
                        }, this);
                    }


                    //***************************************
                    //* HOLES                               *
                    //***************************************
                    zd = isTopLayer ? zDepths.holes : -zDepths.holes;
                    var holePaths = [];
                    this.board.holes.forEach(function(hole) {
                        holePaths.push(hole.path);
                    }, this);
                    var holesMesh = this.createMeshFromPaths(holePaths, [], holeMat);
                    holesMesh.name = "holes";
                    holesMesh.position.z = z + zd;
                    board3d.layers[l].holes = holesMesh;
                }
                this.boards3d.push(board3d);
            }
        },




        create3dBoardV2: function() {

            var canvas = document.createElement("canvas");
            canvas.width = 10000;
            canvas.height = 7000;
            var ctx = canvas.getContext("2d");
            ctx.globalCompositeOperation = "source-over";
            ctx.fillStyle = "#0e2c0e";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "rgb(200, 0, 0)";
            ctx.fillRect(1000, 1000, 5000, 5000);
            ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
            ctx.fillRect(3000, 3000, 5000, 5000);

            //ctx.globalCompositeOperation = "destination-out";
            ctx.fillStyle = "rgba(255, 255, 255, .2)";
            ctx.beginPath();
            ctx.arc(1000, 1000, 500, 0, 2 * Math.PI);
            ctx.fill();

            var Material = THREE.MeshPhongMaterial;

            var bottomTexture = new THREE.Texture(canvas);
            bottomTexture.needsUpdate = true;
            var materials = [
                new Material({ shininess: 80, ambient: 0x333333, specular: 0xcccccc, color: 0x255005 }),
                new Material({ shininess: 80, ambient: 0x333333, specular: 0xcccccc, color: 0x255005 }),
                new Material({ shininess: 80, ambient: 0x333333, specular: 0xcccccc, color: 0x255005 }),
                new Material({ shininess: 80, ambient: 0x333333, specular: 0xcccccc, color: 0x255005 }),
                new Material({ shininess: 00, ambient: 0xaaaaaa, specular: 0xcccccc, map: bottomTexture, overdraw: true }),
                new Material({ shininess: 00, ambient: 0xaaaaaa, specular: 0xcccccc, map: bottomTexture, overdraw: false })
            ];

            var board = new THREE.Mesh(new THREE.BoxGeometry(100, 70, 1.54, 1, 1, 1), new THREE.MeshFaceMaterial(materials));
            //var board = new THREE.Mesh(new THREE.BoxGeometry(100, 70, 1.54), materials);
            board.position.x = 50;
            board.position.y = 35;
            this.sceneGroups.dimensions = new THREE.Group();
            this.sceneGroups.dimensions.add(board);
        },


        render3dBoard: function() {
            this.sceneRemove(this.board3dFr4);
            var zShrink = 0.04,
                x1 = -this.fr4.width / 2,
                x2 = this.fr4.width / 2,
                y1 = -this.fr4.height / 2,
                y2 = this.fr4.height / 2,
                z1 = this.fr4.depth / 2 - zShrink,
                z2 = -this.fr4.depth / 2 + zShrink,

                wireMat = new THREE.LineBasicMaterial({
                    color: 0xCB6D51,
                    opacity: 0.2
                }),
                boardMat = new THREE.MeshPhongMaterial({
                    color: 0xDA8A67,
                    transparent: false,
                    side: THREE.DoubleSide
                }),

                boardPath,
                holePaths = [];

            boardPath = [
                { X: x1, Y: y1 },
                { X: x2, Y: y1 },
                { X: x2, Y: y2 },
                { X: x1, Y: y2 },
                { X: x1, Y: y1 }
            ];

            holePaths = this.getRegHolePaths();
            if (this.board) {
                this.board.dimensions.forEach(function(dimension) {
                    if (dimension.type === 0) {
                        this.boards3d.forEach(function(board3d) {
                            if(board3d.group.visible) {
                            dimension.outerPath.forEach(function(dPath) {
                                var path = this.copyPath(dPath);
                                //PATHS.adjustPath(path, 0, x1 + this.fr4.paddingL, y1 + this.fr4.paddingB);
                                var x = x1 + board3d.getX() + board3d.getDisplacedX() - this.fr4.x;
                                var y = y1 + board3d.getY() + board3d.getDisplacedY() - this.fr4.y;
                                PATHS.adjustPath(path, 0, x, y);
                                holePaths.push(path);
                            }, this);
                            }
                        }, this);
                    }
                }, this);
            }
            holePaths = PATHS.getUnionOfPaths(holePaths);
            // console.log("holePaths", holePaths);
            var fr4Paths = PATHS.getDifferenceOfPaths([boardPath], holePaths);
            // console.log("fr4Paths", fr4Paths);
            this.board3dFr4 = this.createThreeGroupFromPolyTree(fr4Paths, boardMat, z1 - z2, wireMat);
            // this.board3dFr4.children.forEach(function(boardMesh) {boardMesh.geometry.center()});
            this.board3dFr4.position.x = this.fr4.x + this.fr4.width / 2;
            this.board3dFr4.position.y = this.fr4.y + this.fr4.height / 2;
            //this.board3dFr4.position.z = -this.fr4.depth + zShrink;

            var visible = $(this.getElementId("renderBlank")).prop("checked");
            if (visible) this.sceneAdd(this.board3dFr4);
        },
        copyPath: function(original) {
            var destination = [];
            original.forEach(function(v) {
                destination.push({ X: v.X, Y: v.Y });
            });
            return destination;
        },
        render3dTabs: function() {
            if (!this.tabs.useTabs) return;
            this.sceneGroups.tabs = new THREE.Group();
            var dimensions = this.dimensionsToMill;
            for (var i = 0; i < dimensions.length; i++) {
                var diaOfEndmill = dimensions[i].millDiameter;
                var tabMesh = this.getTabMesh(this.tabs.width, diaOfEndmill);
                if (dimensions[i].isOpen) continue;
                var v1 = { X: dimensions[i].X, Y: dimensions[i].Y };

                var count, offset, mesh, angle, x, y, n;

                for (var j = 0; j < dimensions[i].lines.length; j++) {
                    var line = dimensions[i].lines[j];
                    var v2 = { X: line.X, Y: line.Y };
                    if (line.isCurve) {
                        angle = line.C.curve * Math.PI / 180;
                        var alpha = this.tabs.distance / line.C.radius;
                        count = Math.round(Math.abs(angle / alpha) - 0.5);
                        if (!(count > 0)) { v1 = v2; continue; }
                        var sign = line.C.clockWise ? -1 : 1;
                        offset = line.C.startAngle + sign * (Math.abs(angle) - alpha * (count - 1)) / 2;
                        for (n = 0; n < count; n++) {
                            var a = offset + sign * n * alpha;
                            x = line.C.X + line.C.radius * Math.cos(a);
                            y = line.C.Y + line.C.radius * Math.sin(a);
                            mesh = tabMesh.clone();
                            mesh.rotation.z = a + Math.PI / 2;
                            mesh.position.set(x, y, 0.05);
                            this.sceneGroups.tabs.add(mesh);
                        }
                    }
                    else {
                        var length = Math.sqrt((v2.X - v1.X) * (v2.X - v1.X) + (v2.Y - v1.Y) * (v2.Y - v1.Y));
                        count = Math.round(length / this.tabs.distance - 0.5);
                        if (!(count > 0)) { v1 = v2; continue; }
                        angle = Math.atan2(v2.Y - v1.Y, v2.X - v1.X);
                        offset = (length - this.tabs.distance * (count - 1)) / 2;
                        for (n = 0; n < count; n++) {
                            var d = offset + n * this.tabs.distance;
                            x = v1.X + d * Math.cos(angle);
                            y = v1.Y + d * Math.sin(angle);
                            mesh = tabMesh.clone();
                            mesh.rotation.z = angle;
                            mesh.position.set(x, y, 0.05);
                            this.sceneGroups.tabs.add(mesh);
                        }
                    }
                    v1 = v2;
                }
                v1 = { X: dimensions[i].X, Y: dimensions[i].Y };
            }
        },

        exportGcodeRegistrationHoles: function() {

            var holes = this.getRegHoles();
            if (holes.length < 2 || !this.regHoles.use) {
                $(this.getElementClass("reg-holes-gcode")).text("");
                return;
            }

            var clearanceHeight = $(this.getElementClass("reg-holes-clearance")).val();
            var drillDepth = $(this.getElementClass("reg-holes-depth")).val();
            var drillFeedrate = $(this.getElementClass("reg-holes-feedrate")).val();
            var spindleRPM = $(this.getElementClass("reg-holes-spindle-rpm")).val();
            var toolDia = this.regHoles.diameter;
            var g = "";
            g += "(Gcode generated by ChiliPeppr Eagle PCB Widget " + (new Date()).toLocaleString() + ")\n";
            g += "G21 (mm mode)\n";
            g += "G90 (abs mode)\n";
            g += "(------ DRILLING REGISTRATION HOLES -------)\n";
            g += "M5 (spindle off)\n";
            g += "T0 M6 (Drilling holes - diameter " + toolDia + "mm)\n";
            g += "(T0 D=" + toolDia + "mm - PCB Drill Bit)\n";
            g += "M3 S" + spindleRPM + " (spindle on)\n";
            g += "F" + drillFeedrate + "\n";
            holes.forEach(function(hole) {
                g += "G0 Z" + clearanceHeight + "\n";
                g += "G0 X" + hole.x + " Y" + hole.y + "\n";
                g += "G0 Z" + clearanceHeight / 10 + "\n";
                g += "G1 Z" + drillDepth + "\n";
                g += "G1 Z" + clearanceHeight / 10 + "\n";
            });
            g += "G0 Z" + clearanceHeight + "\n";
            g += "M5 (spindle stop)\n";
            g += "M30 (prog stop)\n";

            $(this.getElementClass("reg-holes-gcode")).text(g);

        },
        sendRegHoleGcodeToWorkspace: function() {
            this.exportGcodeRegistrationHoles();
            var info = {
                name: "PCB Registration Holes",
                lastModified: new Date()
            };
            // grab gcode from textarea
            var gcodetxt = $(this.getElementClass("reg-holes-gcode")).text();

            if (gcodetxt.length < 10) {
                chilipeppr.publish("/com-chilipeppr-elem-flashmsg/flashmsg", "Error Sending Gcode", "It looks like you don't have any Gcode to send to the workspace. Huh?", 5 * 1000);
                return;
            }

            // send event off as if the file was drag/dropped
            chilipeppr.publish("/com-chilipeppr-elem-dragdrop/ondropped", gcodetxt, info);

            chilipeppr.publish("/com-chilipeppr-elem-flashmsg/flashmsg", "Sent Gcode to Workspace", "Sent your solder mask Gcode to the workscape. Close the Eagle widget to see it.");

            this.get3dObj(function() {
                console.log("got callback after 3dviewer re-sent us the 3dobj and 3dobjmeta. 3dobj:", this.obj3d, "obj3dmeta:", this.obj3dmeta);
                this.sceneReAddMySceneGroup();
            }, this);
        },
        /**
         * Utility Functions.
         */
        getTabMesh: function(width, d) {
            //var arc, points, path, arcGeo;
            var shape = new THREE.Shape();

            shape.moveTo(-width / 2, -d / 2);
            shape.lineTo(width / 2, -d / 2);
            shape.lineTo(width / 2, d / 2);
            shape.lineTo(-width / 2, d / 2);
            shape.lineTo(-width / 2, -d / 2);

            //shape.moveTo(-width/2-d/2, -d/2);
            // arc = new THREE.ArcCurve( width/2+d/2, 0, d/2, 3*Math.PI/2, Math.PI/2, true );
            // path = new THREE.Path();
            // points = arc.getSpacedPoints( 15 );
            // arcGeo = path.createGeometry( points );
            // for(var i=0; i<arcGeo.vertices.length; i++)
            //     shape.lineTo(arcGeo.vertices[i].x, arcGeo.vertices[i].y);

            // arc = new THREE.ArcCurve(-width/2-d/2, 0, d/2, Math.PI/2, 3*Math.PI/2, true );
            // path = new THREE.Path();
            // points = arc.getSpacedPoints( 15 );
            // arcGeo = path.createGeometry( points );
            // for(var i=0; i<arcGeo.vertices.length; i++)
            //     shape.lineTo(arcGeo.vertices[i].x, arcGeo.vertices[i].y);

            var geometry, material;
            if (false) {
                var extrudeSettings = {
                    steps: 1,
                    amount: this.tabs.height,
                    bevelEnabled: false,
                    bevelThickness: 0,
                    bevelSize: 0,
                    bevelSegments: 0
                };
                geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
                material = new THREE.MeshBasicMaterial({ color: this.colorTabs, transparent: true, opacity: this.opacityTabs });
            }
            else {
                geometry = new THREE.ShapeGeometry(shape);
                material = new THREE.LineBasicMaterial({ color: this.colorTabs, transparent: true, opacity: this.opacityTabs });
            }

            var mesh = new THREE.Mesh(geometry, material);
            return mesh;
        },
        getRegHoles: function() {
            var pattern = this.regHoles.pattern;
            var count = Math.round(pattern / 100);
            var onSides = Math.round((pattern - 100 * count) / 10) == 1;
            var v = (pattern - 100 * count - 10 * onSides) === 0;

            var x = this.fr4.x,
                y = this.fr4.y,
                w = this.fr4.width,
                h = this.fr4.height,
                d = this.regHoles.distance + this.regHoles.diameter / 2;

            var holes = [];
            if (count == 4) {
                holes.push({ x: x + d, y: y + (onSides ? h / 2 : d) });
                holes.push({ x: x + (onSides ? w / 2 : d), y: y + h - d });
                holes.push({ x: x + w - d, y: y + (onSides ? h / 2 : h - d) });
                holes.push({ x: x + (onSides ? w / 2 : w - d), y: y + d });
            }
            else {
                holes.push({ x: x + (onSides ? (v ? w / 2 : d) : d), y: y + (onSides ? (v ? d : h / 2) : (v ? d : h - d)) });
                holes.push({ x: x + (onSides ? (v ? w / 2 : w - d) : w - d), y: y + (onSides ? (v ? h - d : h / 2) : (v ? h - d : d)) });
            }

            return holes;
        },
        getRegHolePaths: function() {
            if (!this.regHoles.use) return [];
            var pattern = this.regHoles.pattern;
            var count = Math.round(pattern / 100);
            var onSides = Math.round((pattern - 100 * count) / 10) == 1;
            var v = (pattern - 100 * count - 10 * onSides) === 0;

            var x = -this.fr4.width / 2,
                y = -this.fr4.height / 2,
                w = this.fr4.width,
                h = this.fr4.height,
                d = this.regHoles.distance + this.regHoles.diameter / 2;

            var centers = [];
            if (count == 4) {
                centers.push({ x: x + d, y: y + (onSides ? h / 2 : d) });
                centers.push({ x: x + (onSides ? w / 2 : d), y: y + h - d });
                centers.push({ x: x + w - d, y: y + (onSides ? h / 2 : h - d) });
                centers.push({ x: x + (onSides ? w / 2 : w - d), y: y + d });
            }
            else {
                centers.push({ x: x + (onSides ? (v ? w / 2 : d) : d), y: y + (onSides ? (v ? d : h / 2) : (v ? d : h - d)) });
                centers.push({ x: x + (onSides ? (v ? w / 2 : w - d) : w - d), y: y + (onSides ? (v ? h - d : h / 2) : (v ? h - d : d)) });
            }

            var holes = [];
            centers.forEach(function(center) {
                holes.push(PATHS.createCircularPath(center.x, center.y, this.regHoles.diameter / 2).reverse());
            }, this);
            return holes;
        },
        getHolesPaths: function() {
            var holes = [];
            this.board.holes.forEach(function(hole) {
                var x = hole.x,
                    y = hole.y;
                if ("packageRotation" in hole && "packageX" in hole && "packageY" in hole) {
                    var p = [{ X: x, Y: y }];
                    PATHS.adjustPath(p, hole.packageRotation, hole.packageX, hole.packageY);

                    if ("packageMirror" in hole && hole.packageMirror) {
                        PATHS.mirrorPath(p, hole.packageX, hole.packageY);
                    }
                    x = p[0].X;
                    y = p[0].Y;
                }
                holes.push(PATHS.createCircularPath(x, y, hole.drill / 2));
            }, this);
            return holes;
        },
        //deprecated
        getBoardDimensionsToMill: function() {
            var boardDimensionsToMill = [];
            // var dLayerNumber;
            // var mLayerNumber;
            // if(this.board.type == Board.types.eagle){
            //     dLayerNumber = 20;
            //     mLayerNumber = 46;
            // }
            // else {
            //     dLayerNumber = 44;
            //     mLayerNumber = -1;
            // }
            //var dLayerNumber = this.board.layers.find(byName, "Dimension").key;
            //var mLayerNumber = this.board.layers.find(byName, "Milling").key;
            var fl = false; //((this.mirrorX && !this.mirrorY) ||(!this.mirrorX & this.mirrorY));
            for (var n = 0; n < this.board.dimensionsInfo.length; n++) {
                var cdi = this.board.dimensionsInfo[n];
                var or = ClipperLib.Clipper.Orientation(this.board.dimensionsInfo.slice(cdi.start, cdi.end + 1));
                // if ((cdi.type == -2) ||
                //     (!this.board.millingLayerUsed && cdi.layer == mLayerNumber) ||
                //     (!this.board.dimensionLayerUsed && cdi.layer == dLayerNumber)  ||
                //     (cdi.millDiameter === 0)) continue;
                if ((cdi.type == -2) || !this.board.isDimensionLayer(cdi.layer) || (cdi.millDiameter === 0))
                    continue;
                var alongPath = cdi.type == -1 || (cdi.type >= 0 && cdi.width >= this.minWireWidthToMill);
                var hasCurves = cdi.curves.length > 0;
                var ci = 0; //curve index
                var dimensionPath = { X: 0, Y: 0, millDiameter: cdi.millDiameter, lines: [], isOpen: (cdi.type < 0) };
                for (var j = cdi.start; j < cdi.end; j++) {
                    var v1i, v2i, v3i, isThisLineCurve, isNextLineCurve, thisCurve = {},
                        nextCurve = {},
                        thisCurveAngle = 0,
                        nextCurveAngle = 0;
                    isThisLineCurve = hasCurves && cdi.curves[ci].start == j;
                    if (isThisLineCurve) {
                        v1i = j;
                        v2i = cdi.curves[ci].end + 1;
                        v3i = cdi.curves[ci].end + 2;
                        thisCurveAngle = cdi.curves[ci].curve;
                        j = cdi.curves[ci].end;
                        if ((ci + 1) < cdi.curves.length) ci++;
                        else ci = 0;
                    }
                    else {
                        v1i = j;
                        v2i = j + 1;
                        v3i = j + 2;
                    }

                    if (v3i > cdi.end) {
                        if (cdi.type < 0) v3i = cdi.start;
                        else { v2i = cdi.start;
                            v3i = cdi.start + 1; }
                    }

                    isNextLineCurve = hasCurves && cdi.curves[ci].start == v2i;
                    if (isNextLineCurve) {
                        v3i = cdi.curves[ci].end + 1;
                        nextCurveAngle = cdi.curves[ci].curve;
                        //if(v3i == cdi.end-1) v3i++;

                    }
                    var v1 = this.board.dimensions[v1i];
                    var v2 = this.board.dimensions[v2i];
                    var v3 = this.board.dimensions[v3i];
                    var angle1 = Math.atan2(v2.Y - v1.Y, v2.X - v1.X) - 3 * Math.PI / 2;
                    var angle2 = Math.atan2(v3.Y - v2.Y, v3.X - v2.X) - 3 * Math.PI / 2;
                    if (or) { angle1 += Math.PI;
                        angle2 += Math.PI; }

                    if (fl) { thisCurveAngle = -thisCurveAngle;
                        nextCurveAngle = -nextCurveAngle; }
                    if (isThisLineCurve) thisCurve = this.getCurveParameters(v1.X, v1.Y, v2.X, v2.Y, thisCurveAngle);
                    if (isNextLineCurve) nextCurve = this.getCurveParameters(v2.X, v2.Y, v3.X, v3.Y, nextCurveAngle);

                    if (alongPath) {
                        if (v1i == cdi.start) { dimensionPath.X = v1.X;
                            dimensionPath.Y = v1.Y; }
                        if (isThisLineCurve) {
                            dimensionPath.lines.push({
                                X: v2.X,
                                Y: v2.Y,
                                isCurve: true,
                                C: {
                                    X: thisCurve.x,
                                    Y: thisCurve.y,
                                    radius: thisCurve.radius,
                                    startAngle: thisCurve.startAngle,
                                    endAngle: thisCurve.endAngle,
                                    curve: thisCurveAngle,
                                    clockWise: thisCurve.clockWise
                                }
                            });
                        }
                        else
                            dimensionPath.lines.push({ X: v2.X, Y: v2.Y, isCurve: false });
                    }
                    else {
                        var dx, dy, rd = cdi.millDiameter / 2;
                        var a1 = this.fixAngle(isThisLineCurve ? thisCurve.startAngle : angle1);
                        var a2 = this.fixAngle(isThisLineCurve ? thisCurve.endAngle : angle1);
                        var a3 = this.fixAngle(isNextLineCurve ? nextCurve.startAngle : angle2);
                        if (cdi.type == 1) {
                            a1 = Math.PI + a1;
                            a2 = Math.PI + a2;
                            a3 = Math.PI + a3;
                        }
                        var isThisConcave = (or && thisCurveAngle < 0) || (!or && thisCurveAngle > 0);
                        var isNextConcave = (or && nextCurveAngle < 0) || (!or && nextCurveAngle > 0);
                        if (isThisConcave) { a2 = a2 - Math.PI;
                            a1 = a1 - Math.PI; }
                        if (isNextConcave) { a3 = a3 - Math.PI; }
                        var a4 = a3 - a2;
                        var a5 = (a2 - a3 + Math.PI) / 2;
                        var s4 = Math.sin(a4);
                        var isCrossing = (!or && (s4 > 0.0001)) || (or && (s4 < -0.0001)); // inflated lines will cross if a4 angle is larger than zero and smaller than 180
                        if (cdi.type == 1) isCrossing = !isCrossing;

                        dx = rd * Math.cos(a1);
                        dy = rd * Math.sin(a1);
                        var v4 = { X: v1.X + dx, Y: v1.Y + dy };
                        dx = rd * Math.cos(a2);
                        dy = rd * Math.sin(a2);
                        var v5 = { X: v2.X + dx, Y: v2.Y + dy };
                        dx = rd * Math.cos(a3);
                        dy = rd * Math.sin(a3);
                        var v6 = { X: v2.X + dx, Y: v2.Y + dy };
                        if (isCrossing) {
                            var hypotenuse = rd * Math.cos(a5) / Math.sin(a5);
                            dx = hypotenuse * Math.cos(a2 + 3 * Math.PI / 2);
                            dy = hypotenuse * Math.sin(a2 + 3 * Math.PI / 2);
                            var v7 = { X: v5.X - dx, Y: v5.Y - dy };
                            v5 = v7;
                        }
                        if (isThisLineCurve) {
                            dimensionPath.lines.push({
                                X: v5.X,
                                Y: v5.Y,
                                isCurve: true,
                                C: {
                                    X: thisCurve.x,
                                    Y: thisCurve.y,
                                    radius: thisCurve.radius + (isThisConcave ? -rd : rd),
                                    startAngle: thisCurve.startAngle,
                                    endAngle: thisCurve.endAngle - isCrossing ? a5 : 0,
                                    curve: thisCurveAngle,
                                    clockWise: thisCurve.clockWise
                                }
                            });
                        }
                        else
                            dimensionPath.lines.push({ X: v5.X, Y: v5.Y, isCurve: false });

                        //var isSameAngle = (Math.abs(a3-a2) % (2*Math.PI)) < 0.0001;
                        var isSameAngle = (Math.abs(Math.sin(a3) - Math.sin(a2)) < 0.0001) &&
                            (Math.abs(Math.cos(a3) - Math.cos(a2)) < 0.0001);
                        if (!isSameAngle && !isCrossing) {
                            var cr = a3 - a2;
                            dimensionPath.lines.push({
                                X: v6.X,
                                Y: v6.Y,
                                isCurve: true,
                                C: {
                                    X: v2.X,
                                    Y: v2.Y,
                                    radius: rd,
                                    startAngle: a2,
                                    endAngle: a3,
                                    curve: cr * 180 / Math.PI,
                                    clockWise: cdi.type == 1 ? or : !or
                                } //or?cr<0:a3-a2>0}
                            });
                        }
                        var ix = dimensionPath.lines.length - 1;
                        dimensionPath.X = dimensionPath.lines[ix].X;
                        dimensionPath.Y = dimensionPath.lines[ix].Y;
                    }
                }
                boardDimensionsToMill.push(dimensionPath);
            }
            return boardDimensionsToMill;
        },
        //deprecated
        fixAngle: function(angle) {
            //This method will covert any angle to an number between 0 and 2PI
            //No effect on functionality but it's useful for debugging
            var a = angle % (2 * Math.PI);
            return (a < 0 ? 2 * Math.PI + a : a);
        },
        getCurveParameters: function(x1, y1, x2, y2, curve) {
            var radian = curve * Math.PI / 180,
                sn = (curve > 0 && curve < 180) || (curve < -180 && curve > -360) ? 1 : -1,
                ql = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)), //distance between points 1 and 2
                rd = Math.abs((ql / 2) / Math.sin(radian / 2)),
                x3 = (x1 + x2) / 2,
                y3 = (y1 + y2) / 2, //the point halfway between points 1 and 2
                dx = (y1 - y2) / ql,
                dy = (x2 - x1) / ql, //direction of mirror line (normalized) that passing through (x, y) an between points 1 and 2
                ax = x3 + sn * Math.sqrt(rd * rd - (ql / 2) * (ql / 2)) * dx, //X coordinate of arc center
                ay = y3 + sn * Math.sqrt(rd * rd - (ql / 2) * (ql / 2)) * dy, //Y coordinate of arc center
                aStartAngle = Math.atan2(y1 - ay, x1 - ax),
                aEndAngle = Math.atan2(y2 - ay, x2 - ax),
                cw = curve < 0;
            return {
                "x": ax,
                "y": ay,
                "radius": rd,
                "startAngle": aStartAngle,
                "endAngle": aEndAngle,
                "clockWise": cw
            };
        },
        getPadPathIntersectedWithPolygon: function(polygons, padPath, layerNumber) {
            polygons.forEach(function(polygon) {
                if (layerNumber == polygon.layer) {
                    var polygonPath = this.createPolygonPath(polygon);
                    polygonPath = polygonPath.reverse();
                    padPath = PATHS.unionPathsIfIntersected(padPath, polygonPath);
                }
            }, this);
            return padPath;
        },
        //deprecated
        createPolygonMeshFromPaths: function(paths, material, z) {
            var allGeometry = new THREE.Geometry();
            paths.forEach(function(path) {
                var shape = new THREE.Shape();
                var firstVetex = true;
                path.forEach(function(vertex) {
                    if (firstVetex) { shape.moveTo(vertex.X, vertex.Y);
                        firstVetex = false; }
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
        //deprecated
        createSignalMeshFromPaths: function(paths, material, z) {
            var allGeometry = new THREE.Geometry();
            paths.forEach(function(signalPart) {
                var shape = new THREE.Shape();
                var firstVetex = true;
                signalPart.path.forEach(function(vertex) {
                    if (firstVetex) { shape.moveTo(vertex.X, vertex.Y);
                        firstVetex = false; }
                    else
                        shape.lineTo(vertex.X, vertex.Y);
                }, this);
                signalPart.holes.forEach(function(holePath) {
                    var hole = new THREE.Path();
                    var firstVetex = true;
                    holePath.forEach(function(vertex) {
                        if (firstVetex) { hole.moveTo(vertex.X, vertex.Y);
                            firstVetex = false; }
                        else
                            hole.lineTo(vertex.X, vertex.Y);
                    });
                    shape.holes.push(hole);
                });
                var geometry = new THREE.ShapeGeometry(shape);
                var mesh = new THREE.Mesh(geometry, material);
                allGeometry.merge(mesh.geometry, mesh.matrix);
            }, this);

            var signalMesh = new THREE.Mesh(allGeometry, material);
            signalMesh.position.setZ(z);
            return signalMesh;
        },
        //deprecated
        createSignalMeshFromPathsV2: function(paths, material, z) {
            console.log("Polygon - Processing", paths);
            var allGeometry = new THREE.Geometry();
            paths.forEach(function(signalPart) {
                var shape = new THREE.Shape();
                var firstVetex = true;
                signalPart.path.forEach(function(vertex) {
                    if (firstVetex) { shape.moveTo(vertex.X, vertex.Y);
                        firstVetex = false; }
                    else
                        shape.lineTo(vertex.X, vertex.Y);
                }, this);
                signalPart.holes.forEach(function(holePath) {
                    var hole = new THREE.Path();
                    var firstVetex = true;
                    holePath.forEach(function(vertex) {
                        if (firstVetex) { hole.moveTo(vertex.X, vertex.Y);
                            firstVetex = false; }
                        else
                            hole.lineTo(vertex.X, vertex.Y);
                    });

                    shape.holes.push(hole);
                });
                var geometry = new THREE.ShapeGeometry(shape);
                var mesh = new THREE.Mesh(geometry, material);
                allGeometry.merge(mesh.geometry, mesh.matrix);
            }, this);

            var signalMesh = new THREE.Mesh(allGeometry, material);
            signalMesh.position.setZ(z);
            return signalMesh;
        },
        createMeshFromPaths: function(paths, holePaths, material, depth, wireMaterial) {
            var group = new THREE.Object3D();

            paths.forEach(function(path) {
                var shape = new THREE.Shape();
                for (var i = 0; i < path.length; i++) {
                    if (i === 0) shape.moveTo(path[i].X, path[i].Y);
                    else shape.lineTo(path[i].X, path[i].Y);
                }
                if (holePaths !== undefined && holePaths !== null) {
                    if (!(Array.isArray(holePaths))) {
                        holePaths = [holePaths];
                    }

                    holePaths.forEach(function(holePath) {
                        var hole = new THREE.Path();
                        for (var j = 0; j < holePath.length; j++) {
                            if (j === 0) hole.moveTo(holePath[j].X, holePath[j].Y);
                            else hole.lineTo(holePath[j].X, holePath[j].Y);
                        }
                        shape.holes.push(hole);
                    }, this);
                }
                var geometry;
                if (depth !== undefined) {
                    var extrudeSettings = { steps: 1, amount: depth, bevelEnabled: false, bevelThickness: 0, bevelSize: 0, bevelSegments: 0 };
                    geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
                }
                else
                    geometry = new THREE.ShapeGeometry(shape);

                var shapeMesh = new THREE.Mesh(geometry, material);
                group.add(shapeMesh);

                if (wireMaterial !== undefined) {
                    var wireGeo = new THREE.EdgesGeometry(shapeMesh.geometry);
                    var wireframe = new THREE.LineSegments(wireGeo, wireMaterial);
                    group.add(wireframe);
                }

            }, this);
            return group;
        },
        createThreeGroupFromPolyTree: function(polyTree, material, depth, wireMaterial) {
            var group = new THREE.Group();
            polyTree.forEach(function(pti) {
                var shape = new THREE.Shape();
                for (var i = 0; i < pti.path.length; i++) {
                    if (i === 0) shape.moveTo(pti.path[i].X, pti.path[i].Y);
                    else shape.lineTo(pti.path[i].X, pti.path[i].Y);
                }
                pti.holes.forEach(function(holePath) {
                    var hole = new THREE.Path();
                    // if(!ClipperLib.Clipper.Orientation(holePath)) holePath.reverse();
                    for (var j = 0; j < holePath.length; j++) {
                        if (j === 0) hole.moveTo(holePath[j].X, holePath[j].Y);
                        else hole.lineTo(holePath[j].X, holePath[j].Y);
                    }
                    shape.holes.push(hole);
                }, this);
                var geometry;
                if (depth !== undefined) {
                    var extrudeSettings = { steps: 1, amount: depth, bevelEnabled: false, bevelThickness: 0, bevelSize: 0, bevelSegments: 0 };
                    geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
                    geometry.vertices.forEach(function(v){
                        if(v.z == 0) v.z = -depth/2; else v.z = depth/2;
                    });
                }
                else
                    geometry = new THREE.ShapeGeometry(shape);

                var shapeMesh = new THREE.Mesh(geometry, material);
                group.add(shapeMesh);

                if (wireMaterial !== undefined) {
                    var wireGeo = new THREE.EdgesGeometry(shapeMesh.geometry);
                    var wireframe = new THREE.LineSegments(wireGeo, wireMaterial);
                    group.add(wireframe);
                }
            }, this);
            return group;
        },
        createMeshFromPath: function(outerPath, material, holePaths, depth) {

            var group = new THREE.Object3D();
            var j, pt;
            //for (var i = 0; i < paths.length; i++) {
            var shape = new THREE.Shape();
            for (j = 0; j < outerPath.length; j++) {
                pt = outerPath[j];
                if (j === 0) shape.moveTo(pt.X, pt.Y);
                else shape.lineTo(pt.X, pt.Y);
            }
            if (holePaths !== undefined && holePaths !== null) {
                if (!(Array.isArray(holePaths))) holePaths = [holePaths];

                for (var hi = 0; hi < holePaths.length; hi++) {
                    var hp = holePaths[hi];
                    var hole = new THREE.Path();
                    for (j = 0; j < hp.length; j++) {
                        pt = hp[j];
                        if (j === 0) hole.moveTo(pt.X, pt.Y);
                        else hole.lineTo(pt.X, pt.Y);
                    }
                    shape.holes.push(hole);
                }
            }
            var geometry;
            if (depth !== undefined) {
                var extrudeSettings = {
                    amount: depth,
                    bevelEnabled: false
                };
                geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            }
            else
                geometry = new THREE.ShapeGeometry(shape);

            var shapeMesh = new THREE.Mesh(geometry, material);
            group.add(shapeMesh);
            return group;
        },
        createPolygonPath: function(polygon) {
            var polygonPath = [];

            for (var vidx = 0; vidx < polygon.vertices.length; vidx++) {
                var v0 = polygon.vertices[vidx];
                var v1 = (polygon.vertices.length == vidx + 1) ? polygon.vertices[0] : polygon.vertices[vidx + 1];
                if ("curve" in v0 && v0.curve !== 0) {
                    var cPoints = PATHS.createCurvePoints(v0.x, v0.y, v1.x, v1.y, v0.curve);
                    cPoints.forEach(function(p) {
                        polygonPath.push({ X: p.x, Y: p.y });
                    });
                }
                else {
                    polygonPath.push({ X: v0.x, Y: v0.y });
                }
            }

            return polygonPath;
        },
        createPadPath: function(pad, layerNumber) {
            var path = [],
                hole = [],
                x = pad.x,
                y = pad.y;

            if (pad.shape == "rect" || pad.shape == "square")
                path = PATHS.createRectangularPath(0, 0, pad.sizeX, pad.sizeY, pad.roundness);
            else if (pad.shape == "circle")
                path = PATHS.createCircularPath(0, 0, pad.sizeX / 2);
            else if (pad.shape == "oval") // KiCad
                path = PATHS.createOvalPath(0, 0, pad.sizeX, pad.sizeY);
            else if (pad.shape == "long") // Eagle
                path = PATHS.createOvalPath(0, 0, pad.sizeX * 2, pad.sizeY);
            else if (pad.shape == "offset") // Eagle
                path = PATHS.createOvalPath(pad.sizeX / 2, 0, pad.sizeX * 2, pad.sizeY);
            else if (pad.shape == "octagon") // Eagle
                path = PATHS.createCircularPath(0, 0, pad.sizeX / 2, 8);


            if (pad.revolve !== 0) PATHS.adjustPath(path, pad.revolve, 0, 0);
            console.log(this.board.packagesByName[pad.pkg]);
            if (this.board.packagesByName !== undefined && this.board.packagesByName[pad.pkg] !== undefined) {
                var polys = this.board.packagesByName[pad.pkg].polygons;
                if (polys !== undefined && polys.length > 0)
                    path = this.getPadPathIntersectedWithPolygon(polys, path, layerNumber);
            }
            var r = Math.sqrt(x * x + y * y);
            var angle = pad.rotation + Math.atan2(y, x);
            x = pad.centerX + r * Math.cos(angle);
            y = pad.centerY + r * Math.sin(angle);
            angle = pad.rotation;
            PATHS.adjustPath(path, angle, x, y);
            if (pad.mirror) PATHS.mirrorPath(path, pad.centerX, pad.centerY);
            if (pad.type == "thru_hole") {
                if (pad.drillShape == "oval") {
                    hole = PATHS.createOvalPath(0, 0, pad.drillX, pad.drillY);
                    if (pad.revolve !== 0) PATHS.adjustPath(hole, pad.revolve, 0, 0);
                }
                else
                    hole = PATHS.createCircularPath(0, 0, pad.drill / 2);
                PATHS.adjustPath(hole, angle, x, y);
                if (pad.mirror) PATHS.mirrorPath(hole, pad.centerX, pad.centerY);
            }
            return { path: path, hole: hole };
        },
        createViaPath: function(via) {
            var path = [],
                hole = [],
                x = via.x,
                y = via.y;

            if (via.shape == "square")
                path = PATHS.createRectangularPath(x, y, via.diameter, via.diameter);
            else if (via.shape == "circle")
                path = PATHS.createCircularPath(x, y, via.diameter / 2);
            else if (via.shape == "octagon") // Eagle
                path = PATHS.createCircularPath(x, y, via.diameter / 2, 8);



            hole = PATHS.createCircularPath(x, y, via.drill / 2);
            return { path: path, hole: hole };
        },
        createWirePath: function(x1, y1, x2, y2, width, curve) {
            var angle = Math.atan2(y1 - y2, x1 - x2),
                path = [];
            if (curve === 0) {
                var dx = width * Math.sin(angle) / 2,
                    dy = width * Math.cos(angle) / 2;

                path.push({ X: x1 + dx, Y: y1 - dy });
                path.push({ X: x2 + dx, Y: y2 - dy });
                path.push({ X: x2 - dx, Y: y2 + dy });
                path.push({ X: x1 - dx, Y: y1 + dy });
                path.push({ X: path[0].X, Y: path[0].Y });
            }
            else {
                var r = curve * Math.PI / 180,
                    angle1 = angle - r / 2,
                    angle2 = angle + r / 2,
                    dx1 = width * Math.sin(angle1) / 2,
                    dy1 = width * Math.cos(angle1) / 2,
                    dx2 = width * Math.sin(angle2) / 2,
                    dy2 = width * Math.cos(angle2) / 2;

                var p1x = x1 + dx1,
                    p1y = y1 - dy1,
                    p2x = x2 + dx2,
                    p2y = y2 - dy2,
                    p3x = x2 - dx2,
                    p3y = y2 + dy2,
                    p4x = x1 - dx1,
                    p4y = y1 + dy1;
                if ((x1 == 59 && y1 == 30) || (x2 == 59 && y2 == 30)) {}
                var arc = this.board.drawArc(p1x, p1y, p2x, p2y, +curve);
                arc.forEach(function(point) {
                    path.push({ X: point.x, Y: point.y });
                }, this);
                arc = this.board.drawArc(p3x, p3y, p4x, p4y, -curve);
                arc.forEach(function(point) {
                    path.push({ X: point.x, Y: point.y });
                }, this);
                //path.push({X: path[0].X, Y: path[0].Y});
            }
            return path;
        },
        createThermalPaths: function(pad, polygon) {
            var x = pad.x,
                y = pad.y;
            var paths = PATHS.getInflatePaths([pad.paths.path], polygon.thermalsClearance);
            var crossPath = this.createCrossPath(polygon.thermalsWidth);
            if ("rotation" in pad) {
                var revolve = this.board.type == Board.types.kiCad && pad.shape == "circle" ? Math.PI / 4 : pad.revolve;
                if (revolve !== 0) PATHS.adjustPath(crossPath, revolve, 0, 0);

                var r = Math.sqrt(x * x + y * y);
                var angle = pad.rotation + Math.atan2(y, x);
                x = pad.centerX + r * Math.cos(angle);
                y = pad.centerY + r * Math.sin(angle);
                angle = pad.rotation;
                PATHS.adjustPath(crossPath, angle, x, y);
                if (pad.mirror) PATHS.mirrorPath(crossPath, pad.centerX, pad.centerY);
            }
            else {
                PATHS.adjustPath(crossPath, 0, x, y);
            }
            crossPath = PATHS.getUnionOfPaths([crossPath, pad.paths.path]);
            paths = PATHS.getDifferenceOfPaths(paths, crossPath);

            return paths;
        },
        createCrossPath: function(thikness) {
            var t = Math.max(thikness, 0.0254) / 2;
            var w = (this.board.boardBoundaries.MaximumX - this.board.boardBoundaries.MinimumX) / 2;
            var h = (this.board.boardBoundaries.MaximumY - this.board.boardBoundaries.MinimumY) / 2;

            return [
                { X: -w, Y: t },
                { X: -t, Y: t },
                { X: -t, Y: h },
                { X: t, Y: h },
                { X: t, Y: t },
                { X: w, Y: t },
                { X: w, Y: -t },
                { X: t, Y: -t },
                { X: t, Y: -h },
                { X: -t, Y: -h },
                { X: -t, Y: -t },
                { X: -w, Y: -t },
                { X: -w, Y: t }
            ];
        },
    };
});





function TOOLS() {}

TOOLS.bitNotFound = "X00";

TOOLS.prototype.cuttingBits = [
    { key: "C00", diameter: 1.0, available: true },
    { key: "C02", diameter: 1.5, available: true },
    { key: "C03", diameter: 2.0, available: true },
    { key: "C04", diameter: 2.5, available: true },
    { key: "C05", diameter: 3.0, available: true }
];

TOOLS.prototype.drillBits = [
    { key: "D00", diameter: 0.3, available: true },
    { key: "D01", diameter: 0.4, available: true },
    { key: "D02", diameter: 0.5, available: true },
    { key: "D03", diameter: 0.6, available: true },
    { key: "M04", diameter: 0.7, available: true },
    { key: "M05", diameter: 0.8, available: true },
    { key: "M06", diameter: 0.9, available: true },
    { key: "M07", diameter: 1.0, available: true },
    { key: "M08", diameter: 1.1, available: true },
    { key: "M09", diameter: 1.2, available: true },
];

TOOLS.prototype.getDrillBit = function(diameter) {
    this.drillBits.forEach(function(drillBit) {
        if (drillBit.diameter == diameter)
            return drillBit;
    }, this);
    return TOOLS.bitNotFound;
};


// ****************************************************************************
// PATHS Class                                                                *
// ****************************************************************************

function PATHS() {
    this.holes = [];
    this.dimensions = [];
}

PATHS.prototype.holes = [];
PATHS.prototype.drills = [];
PATHS.prototype.dimensions = [];

PATHS.scaleDownPath = function(path, scale) {
    var returnPath = [];
    path.forEach(function(vertex) {
        returnPath.push({
            X: vertex.X / scale,
            Y: vertex.Y / scale
        });
    });
    return returnPath;
};
PATHS.getInflatePaths = function(paths, delta, joinType) {
    var scale = 10000;
    ClipperLib.JS.ScaleUpPaths(paths, scale);
    var miterLimit = 2;
    var arcTolerance = 10;
    joinType = joinType ? joinType : ClipperLib.JoinType.jtRound;
    var co = new ClipperLib.ClipperOffset(miterLimit, arcTolerance);
    co.AddPaths(paths, joinType, ClipperLib.EndType.etClosedPolygon);
    var offsetted_paths = new ClipperLib.Paths();
    co.Execute(offsetted_paths, delta * scale);

    // scale back down
    for (var i = 0; i < offsetted_paths.length; i++) {
        for (var j = 0; j < offsetted_paths[i].length; j++) {
            offsetted_paths[i][j].X = offsetted_paths[i][j].X / scale;
            offsetted_paths[i][j].Y = offsetted_paths[i][j].Y / scale;
        }
    }
    ClipperLib.JS.ScaleDownPaths(paths, scale);
    return offsetted_paths;
};
PATHS.getInflateOpenPaths = function(paths, delta, joinType) {
    var scale = 10000;
    ClipperLib.JS.ScaleUpPaths(paths, scale);
    var miterLimit = 2;
    var arcTolerance = 10;
    joinType = joinType ? joinType : ClipperLib.JoinType.jtRound;
    var co = new ClipperLib.ClipperOffset(miterLimit, arcTolerance);
    co.AddPaths(paths, joinType, ClipperLib.EndType.etRound);
    var offsetted_paths = new ClipperLib.Paths();
    co.Execute(offsetted_paths, delta * scale);

    // scale back down
    for (var i = 0; i < offsetted_paths.length; i++) {
        for (var j = 0; j < offsetted_paths[i].length; j++) {
            offsetted_paths[i][j].X = offsetted_paths[i][j].X / scale;
            offsetted_paths[i][j].Y = offsetted_paths[i][j].Y / scale;
        }
    }
    ClipperLib.JS.ScaleDownPaths(paths, scale);
    return offsetted_paths;

};
PATHS.getDifferenceOfPaths = function(subj_paths, clip_paths) {
    var cpr = new ClipperLib.Clipper();
    var scale = 100000;
    ClipperLib.JS.ScaleUpPaths(subj_paths, scale);
    ClipperLib.JS.ScaleUpPaths(clip_paths, scale);
    cpr.AddPaths(subj_paths, ClipperLib.PolyType.ptSubject, true);
    cpr.AddPaths(clip_paths, ClipperLib.PolyType.ptClip, true);
    var subject_fillType = ClipperLib.PolyFillType.pftNonZero;
    var clip_fillType = ClipperLib.PolyFillType.pftNonZero;
    var solution_polytree = new ClipperLib.PolyTree();
    cpr.Execute(ClipperLib.ClipType.ctDifference, solution_polytree, subject_fillType, clip_fillType);

    ClipperLib.JS.ScaleDownPaths(subj_paths, scale);
    ClipperLib.JS.ScaleDownPaths(clip_paths, scale);

    var node = solution_polytree.GetFirst();
    var paths = [],
        pathCount = 0;
    while (node) {
        if (node.IsHole()) {
            var hole = this.scaleDownPath(node.Contour(), scale);
            paths[pathCount - 1].holes.push(hole);
        }
        else {
            var path = this.scaleDownPath(node.Contour(), scale);
            paths.push({ path: path, holes: [] });
            pathCount++;
        }
        node = node.GetNext();
    }
    return paths;
};
PATHS.getUnionOfPaths = function(subj_paths) {
    var cpr = new ClipperLib.Clipper();
    var scale = 100000;
    ClipperLib.JS.ScaleUpPaths(subj_paths, scale);
    cpr.AddPaths(subj_paths, ClipperLib.PolyType.ptSubject, true);
    var subject_fillType = ClipperLib.PolyFillType.pftNonZero;
    var clip_fillType = ClipperLib.PolyFillType.pftNonZero;
    var solution_paths = new ClipperLib.Paths();
    cpr.Execute(ClipperLib.ClipType.ctUnion, solution_paths, subject_fillType, clip_fillType);
    // scale back down
    for (var i = 0; i < solution_paths.length; i++) {
        for (var j = 0; j < solution_paths[i].length; j++) {
            solution_paths[i][j].X = solution_paths[i][j].X / scale;
            solution_paths[i][j].Y = solution_paths[i][j].Y / scale;
        }
    }
    ClipperLib.JS.ScaleDownPaths(subj_paths, scale);
    return solution_paths;
};
PATHS.getIntersectionOfPaths = function(subj_paths, clip_paths) {
    var cpr = new ClipperLib.Clipper();
    var scale = 10000;
    ClipperLib.JS.ScaleUpPaths(subj_paths, scale);
    ClipperLib.JS.ScaleUpPaths(clip_paths, scale);
    cpr.AddPaths(subj_paths, ClipperLib.PolyType.ptSubject, true);
    cpr.AddPaths(clip_paths, ClipperLib.PolyType.ptClip, true);
    var subject_fillType = ClipperLib.PolyFillType.pftNonZero;
    var clip_fillType = ClipperLib.PolyFillType.pftNonZero;
    var solution_paths = new ClipperLib.Path();
    cpr.Execute(ClipperLib.ClipType.ctIntersection, solution_paths, subject_fillType, clip_fillType);

    ClipperLib.JS.ScaleDownPaths(solution_paths, scale);
    ClipperLib.JS.ScaleDownPaths(clip_paths, scale);
    ClipperLib.JS.ScaleDownPaths(subj_paths, scale);
    return solution_paths;
};
PATHS.unionPathsIfIntersected = function(path1, path2) {
    var pathS = this.getIntersectionOfPaths([path1], [path2]);
    if (pathS.length !== 0) {
        pathS = this.getUnionOfPaths([path1, path2]);
        var path = [];
        pathS[0].forEach(function(vertex) {
            path.push({ X: vertex.X, Y: vertex.Y });
        });
        path.push({ X: path[0].X, Y: path[0].Y });

        return path.reverse();
    }
    return path1;
};
PATHS.clipPathsIfIntersected = function(paths, clipPaths) {
    var pathS = this.getIntersectionOfPaths(paths, clipPaths);
    if (pathS.length !== 0) {
        return pathS;
    }
    return paths;
};
PATHS.createCurvePoints = function(x1, y1, x2, y2, curve) {
    var segmentLength = 1; //parseFloat($("#com-chilipeppr-widget-eagle .curve-resolution").val());
    segmentLength = Math.min(segmentLength, 1.0);
    segmentLength = Math.max(segmentLength, 0.1);
    var radian = curve * Math.PI / 180,
        sn = (curve > 0 && curve < 180) || (curve < -180 && curve > -360) ? 1 : -1,
        ql = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)), //distance between points 1 and 2
        rd = Math.abs((ql / 2) / Math.sin(radian / 2)),
        x3 = (x1 + x2) / 2,
        y3 = (y1 + y2) / 2, //the point halfway between points 1 and 2
        dx = (y1 - y2) / ql,
        dy = (x2 - x1) / ql, //direction of mirror line (normalized) that passing through (x, y) an between points 1 and 2
        ax = x3 + sn * Math.sqrt(rd * rd - (ql / 2) * (ql / 2)) * dx, //X coordinate of arc center
        ay = y3 + sn * Math.sqrt(rd * rd - (ql / 2) * (ql / 2)) * dy, //Y coordinate of arc center
        aStartAngle = Math.atan2(y1 - ay, x1 - ax),
        aEndAngle = Math.atan2(y2 - ay, x2 - ax),
        cw = curve < 0;
    var segments = Math.max(rd * Math.abs(radian) / segmentLength, 8); // Segment every [segmentLength] mm, minimum 8 segments
    var arcCurve = new THREE.EllipseCurve(
        ax, ay,
        rd, rd,
        aStartAngle, aEndAngle,
        cw
    );
    var points = arcCurve.getSpacedPoints(segments);

    return points;
};
PATHS.createCircularPath = function(x, y, radius, seg) {
    seg = seg || 0;
    var segments = seg > 0 ? seg : Math.max(Math.round(2 * Math.PI * radius) * 10, 8),
        step = 2 * Math.PI / segments,
        path = [];
    for (var a = 2 * Math.PI; a > 0; a -= step) {
        path.push({
            X: x + radius * Math.cos(a + Math.PI / 8),
            Y: y + radius * Math.sin(a + Math.PI / 8)
        });
    }
    path.push({ X: path[0].X, Y: path[0].Y });
    return path;
};
PATHS.createOvalPath = function(x, y, sizeX, sizeY, seg) {
    seg = seg || 0;
    var radius = Math.min(sizeX, sizeY) / 2;
    var segments = seg > 0 ? seg : Math.max(Math.round(2 * Math.PI * radius) * 10, 8),
        step = 2 * Math.PI / segments,
        dx = 0,
        dy = 0,
        sa, ea, ma,
        path = [];
    if (sizeX > sizeY) {
        dx = sizeX / 4;
        sa = 3 * Math.PI / 2;
        ea = -Math.PI / 2;
        ma = Math.PI / 2;
    }
    else {
        dy = (sizeX == sizeY) ? 0 : sizeY / 4;
        sa = 2 * Math.PI;
        ea = 0;
        ma = sa / 2;
    }
    for (var a = sa; a > ma; a -= step) {

        path.push({
            X: x + dx - radius * Math.cos(a),
            Y: y + dy - radius * Math.sin(a)
        });
    }
    for (a = ma; a > ea; a -= step) {

        path.push({
            X: x - dx - radius * Math.cos(a),
            Y: y - dy - radius * Math.sin(a)
        });
    }
    path.push({ X: path[0].X, Y: path[0].Y });
    return path;
};
PATHS.createArcPath = function(x, y, radius, aStartAngle, aEndAngle, seg) {
    seg = seg || 0;
    var segments = seg > 0 ? seg : Math.max(Math.round(2 * Math.PI * radius) * 10, 8),
        sa = aStartAngle * Math.PI / 180,
        ea = aEndAngle * Math.PI / 180,
        step = (ea - sa) * Math.PI / segments,
        path = [];
    for (var a = sa; a > ea; a += step) {
        path.push({
            X: x + radius * Math.cos(a),
            Y: y + radius * Math.sin(a)
        });
    }
    return path;
};
PATHS.createRectangularPath = function(x, y, w, h, roundness) {
    var dx = w / 2,
        dy = h / 2,
        path = [];
    if (roundness === 0) {
        path.push({ X: x - dx, Y: y - dy });
        path.push({ X: x - dx, Y: y + dy });
        path.push({ X: x + dx, Y: y + dy });
        path.push({ X: x + dx, Y: y - dy });
    }
    else {
        var cx = Math.min(dx, dy) * roundness / 100;
        var cPath = this.createArcPath(x - (dx - cx), y - (dy - cx), cx, 270, 180);
        cPath.forEach(function(p) { path.push(p); });

        cPath = this.createArcPath(x - (dx - cx), y + (dy - cx), cx, 180, 90);
        cPath.forEach(function(p) { path.push(p); });

        cPath = this.createArcPath(x + (dx - cx), y + (dy - cx), cx, 90, 0);
        cPath.forEach(function(p) { path.push(p); });

        cPath = this.createArcPath(x + (dx - cx), y - (dy - cx), cx, 360, 270);
        cPath.forEach(function(p) { path.push(p); });


    }
    path.push({ X: path[0].X, Y: path[0].Y });
    return path;
};
PATHS.adjustPath = function(path, rotation, positionX, positionY) {
    if (rotation === 0) {
        path.forEach(function(vertex) {
            vertex.X += positionX;
            vertex.Y += positionY;
        });
    }
    else {
        path.forEach(function(vertex) {
            var angle = rotation + Math.atan2(vertex.Y, vertex.X);
            var r = Math.sqrt(vertex.X * vertex.X + vertex.Y * vertex.Y);
            vertex.X = positionX + r * Math.cos(angle);
            vertex.Y = positionY + r * Math.sin(angle);
        });
    }
};
PATHS.mirrorPath = function(path, centerX, centerY) {
    path.forEach(function(vertex) {
        vertex.X = centerX - (vertex.X - centerX);
    });
    path.reverse();
};



/**
 * Board3d Class
 * @auther Ameen Nihad
 * @version 1.0
 */
function Board3d() {
    this.copper = new THREE.Group();
    this.top = new Layer3d();
    this.bottom = new Layer3d();
    this.layers = [this.top, this.bottom];


    this.centered = false;

    this.group = new THREE.Group();

    function Layer3d() {
        this.polygons = new THREE.Mesh();
        this.clearance = new THREE.Mesh();
        this.signals = new THREE.Group();
        this.holes = new THREE.Mesh();
        this.mask = new THREE.Mesh();
        this.silk = new THREE.Mesh();
    }

    Board3d.prototype.getX = function(){ return this.group.position.x;};
    Board3d.prototype.getY = function(){ return this.group.position.y;};
    Board3d.prototype.getWidth = function(){
        if(!this.centered) this.center;
        return this.groupBox.max.x - this.groupBox.min.x;
    };
    Board3d.prototype.getHeight = function(){
        if(!this.centered) this.center;
        return this.groupBox.max.y - this.groupBox.min.y;
    };
    Board3d.prototype.getDisplacedX = function(){
        if(!this.centered) this.center;
        return this.center.x;
    };
    Board3d.prototype.getDisplacedY = function(){
        if(!this.centered) this.center;
        return this.center.y;
    };
    Board3d.prototype.center = function() {
        var childBox = new THREE.Box3();
        this.groupBox = new THREE.Box3();
        var that = this;
        this.group.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
                if (!child.geometry.boundingBox || true) {
                    child.geometry.computeBoundingBox();
                }
                childBox.copy(child.geometry.boundingBox);
                child.updateMatrixWorld(true);
                childBox.applyMatrix4(child.matrixWorld);
                that.groupBox.min.min(childBox.min);
                that.groupBox.max.max(childBox.max);
            }
        });
        this.center = new THREE.Vector3(
            -(this.groupBox.min.x + (this.groupBox.max.x - this.groupBox.min.x) / 2),
            -(this.groupBox.min.y + (this.groupBox.max.y - this.groupBox.min.y) / 2),
            -(this.groupBox.min.z + (this.groupBox.max.z - this.groupBox.min.z) / 2));
            console.log("Ameen Z - Center", this.center);
        this.group.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
                child.geometry.vertices.forEach(function(vertex) {
                    //vertex.add(that.center);
                    vertex.x += that.center.x;
                    vertex.y += that.center.y;
                });
                //child.updateMatrixWorld(true);
            }
            else {
                if (child instanceof THREE.LineSegments) {
                    var vals = child.geometry.attributes.position.array;
                    for (var i = 0; i < vals.length; i += 3) {
                        vals[i] += that.center.x;
                        vals[i + 1] += that.center.y;
                        //vals[i + 2] += that.center.z;
                    }
                }
            }
        });
        this.centered = true;
    };
}


/**
 * Board Class
 * @auther Ameen Nihad
 * @version 1.0
 */

function Board(type, fr4) {
    this.type = type;
    this.fr4 = fr4;
    this.netClasses = [];
    this.signalLayersCount = 0;
    this.signals = [];
    this.layers = [];
    this.packagesByName = {};
    this.holes = [];
    this.dimensions = [];
    this.dimensionsInfo = []; //deprecated
}
Board.types = { eagle: "Eagle", kiCad: "KiCad" };

Board.supportedFiles = [
    { type: Board.types.eagle, ext: ".brd", signature: new RegExp("<!DOCTYPE eagle SYSTEM \"eagle.dtd\">[\\s\\S]*<board>", "im") },
    { type: Board.types.kiCad, ext: ".kicad_pcb", signature: new RegExp("\\(kicad_pcb \\(version \\d+\\) \\(host pcbnew", "i") }
];


Board.prototype.loadText = function(text) {
    if (this.type == Board.types.eagle) {
        var eParser = new DOMParser();
        this.boardXML = eParser.parseFromString(text, "text/xml");
        this.parseEagle();
        this.CalculateLayerPositions();
        console.log("Ameen Z Positions", this.layerPositions);
        //console.log("PCBW-XML", this.boardXML);
        return;
    }
    else
    if (this.type == Board.types.kiCad) {
        var kParser = new kiCadXmlParser();
        this.boardXML = kParser.parse(text);
        this.parseKiCad();
        this.CalculateLayerPositions();
        console.log("Ameen Z Positions", this.layerPositions);
        //console.info("PCBW-XML", kParser, JSON.stringify(this.boardXML), this);
        return;
    }
};

function byKey(item) {
    return item.key == this;
}

function byName(item) {
    return item.name == this;
}

Board.prototype.colorPalette = [0];
Board.prototype.layerPositions = [];
Board.prototype.dimensionLayerUsed = true;
Board.prototype.millingLayerUsed = true;

Board.prototype.layerColor = function(layerKey) {
    var layer = this.layers.find(byKey, layerKey);
    if (this.type == Board.types.eagle) {
        return this.colorPalette[layer.color];
    }
    else
    if (this.type == Board.types.kiCad) {
        return this.colorPalette[layer.color % this.colorPalette.length];
    }
};

Board.prototype.thermalsForVias = function() {
    if (this.type == Board.types.eagle)
        return this.param.supply.thermalsForVias;
    else
        return false;
};

Board.prototype.getSignal = function(layer, signalKey) {
    if (layer.signals === undefined) layer.signals = [];
    var signal = layer.signals.find(byKey, signalKey);
    if (signal === undefined) {
        var s = this.signals.find(byKey, signalKey);
        signal = Object.assign({}, s); //{key: s.key, name: s.name};
        layer.signals.push(signal);
    }
    return signal;
};

Board.prototype.getSignalByName = function(layer, signalName) {
    if (layer.signals === undefined) layer.signals = [];
    var s = layer.signals.find(byName, signalName);
    if (s === undefined) {
        s = this.signals.find(byName, signalName);
        if (s === undefined) {
            s = layer.signals.find(byKey, 0);
            if (s === undefined) {
                s = this.signals.find(byKey, 0);
                s = Object.assign({}, s);
                layer.signals.push(s);
            }
            return s;
        }
        s = Object.assign({}, s);
        layer.signals.push(s);
        return s;
    }
    else
        return s;
};

Board.prototype.wiresConnected = function(w1, w2) {
    return ((w1.x2 == w2.x1) && (w1.y2 == w2.y1));
};

Board.prototype.wiresConnectedF = function(w1, w2) {
    if ((w1.x2 == w2.x1) && (w1.y2 == w2.y1)) return true;
    if ((w1.x2 == w2.x2) && (w1.y2 == w2.y2)) {
        var x = w2.x1;
        w2.x1 = w2.x2;
        w2.x2 = x;
        var y = w2.y1;
        w2.y1 = w2.y2;
        w2.y2 = y;
        w2.curve = -w2.curve;
        return true;
    }
    return false;
};

Board.prototype.wiresConnectedB = function(w1, w2) {
    if ((w1.x1 == w2.x2) && (w1.y1 == w2.y2)) return true;
    if ((w1.x1 == w2.x1) && (w1.y1 == w2.y1)) {
        var x = w2.x1;
        w2.x1 = w2.x2;
        w2.x2 = x;
        var y = w2.y1;
        w2.y1 = w2.y2;
        w2.y2 = y;
        w2.curve = -w2.curve;
        return true;
    }
    return false;
};

Board.prototype.drawArc = function(x1, y1, x2, y2, curve) {
    var segmentLength = 0.5; //TODO should be changed by user
    segmentLength = Math.min(segmentLength, 1.0);
    segmentLength = Math.max(segmentLength, 0.1);
    var radian = curve * Math.PI / 180,
        sn = (curve > 0 && curve < 180) || (curve < -180 && curve > -360) ? 1 : -1,
        ql = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)), //distance between points 1 and 2
        rd = Math.abs((ql / 2) / Math.sin(radian / 2)),
        x3 = (x1 + x2) / 2,
        y3 = (y1 + y2) / 2, //the point halfway between points 1 and 2
        dx = (y1 - y2) / ql,
        dy = (x2 - x1) / ql, //direction of mirror line (normalized) that passing through (x, y) an between points 1 and 2
        ax = x3 + sn * Math.sqrt(rd * rd - (ql / 2) * (ql / 2)) * dx, //X coordinate of arc center
        ay = y3 + sn * Math.sqrt(rd * rd - (ql / 2) * (ql / 2)) * dy, //Y coordinate of arc center
        aStartAngle = Math.atan2(y1 - ay, x1 - ax),
        aEndAngle = Math.atan2(y2 - ay, x2 - ax),
        cw = curve < 0;
    var segments = Math.max(rd * Math.abs(radian) / segmentLength, 8); // Segment every [segmentLength] mm, minimum 8 segments
    var arcCurve = new THREE.EllipseCurve(
        ax, ay,
        rd, rd,
        aStartAngle, aEndAngle,
        cw
    );
    var points = arcCurve.getSpacedPoints(segments);

    return points;
};

Board.prototype.isDimensionLayer = function(layerKey) {
    var layer = this.layers.find(byKey, layerKey);
    return (layer !== undefined && layer.dimensionLayer);
};

Board.prototype.isRestrictLayer = function(layerKey) {
    var layer = this.layers.find(byKey, layerKey);
    return (layer !== undefined && layer.restrictLayer);
};

Board.prototype.isSolderMaskLayer = function(layerKey) {
    var layer = this.layers.find(byKey, layerKey);
    return (layer !== undefined && layer.solderMaskLayer);
};

Board.prototype.isZonesLayer = function(layerKey) {
    var layer = this.layers.find(byKey, layerKey);
    return (layer !== undefined && (layer.dimensionLayer || layer.restrictLayer || layer.solderMaskLayer));
};

Board.prototype.isTopLayer = function(layerKey) {
    if (this.type == Board.types.kiCad)
        return (layerKey % 2) === 0;
    else
        return (layerKey % 2) == 1;
};

Board.prototype.signalLayers = function() {
    function isSignalLayer(layer) {
        return layer.signalLayer;
    }

    return this.layers.filter(isSignalLayer);
};

Board.prototype.CalculateLayerPositions = function() {
    this.layerPositions = [];
    for (var i = 0; i < this.signalLayersCount; i++) {
        var d = (i % 2)? -this.fr4.depth / 2 : this.fr4.depth / 2;
        this.layerPositions.push(d  - Math.floor(i / 2) * this.fr4.seperation);
    }
};

Board.prototype.buildBoardZones = function(plainWires, plainCircles, elements) {
    //Build dimesion and Restric polygons
    var wires = [],
        i, h, n, w, wire;

    for (var elemKey in elements) {
        var elem = elements[elemKey];
        var pkg = this.packagesByName[elem.pkg];
        pkg.wires.forEach(function(wire) {
            if (this.isZonesLayer(wire.layer)) {
                var wp = [{ X: wire.x1, Y: wire.y1 }, { X: wire.x2, Y: wire.y2 }];
                PATHS.adjustPath(wp, elem.rotation, elem.x, elem.y);
                wires.push({
                    "curve": wire.curve,
                    "layer": wire.layer,
                    "width": wire.width,
                    "x1": wp[0].X,
                    "x2": wp[1].X,
                    "y1": wp[0].Y,
                    "y2": wp[1].Y
                });
            }
        }, this);
    }
    for (var plainWireKey in plainWires) {
        if (plainWires[plainWireKey].length > 0) {
            for (i = 0; i < plainWires[plainWireKey].length; i++) {
                wire = plainWires[plainWireKey][i];
                if (this.isZonesLayer(wire.layer)) {
                    wires.push(wire);
                }
            }
        }
    }
    for (var plainCircleKey in plainCircles) {
        if (plainCircles[plainCircleKey].length > 0) {
            for (i = 0; i < plainCircles[plainCircleKey].length; i++) {
                var circle = plainCircles[plainCircleKey][i];
                if (this.isZonesLayer(circle.layer)) {
                    // we have a dimension, push the circle as two half-circle wires
                    wires.push({
                        "curve": -180,
                        "layer": circle.layer,
                        "width": circle.width,
                        "x1": circle.x - circle.radius,
                        "x2": circle.x + circle.radius,
                        "y1": circle.y,
                        "y2": circle.y
                    });
                    wires.push({
                        "curve": -180,
                        "layer": circle.layer,
                        "width": circle.width,
                        "x1": circle.x + circle.radius,
                        "x2": circle.x - circle.radius,
                        "y1": circle.y,
                        "y2": circle.y
                    });
                }
            }
        }
    }
    //sort wires by layer and by width
    wires.sort(function(a, b) {
        if (a.layer > b.layer) return 1;
        if (a.layer < b.layer) return -1;
        if (a.width > b.width) return 1;
        if (a.width < b.width) return -1;
        return 0;
    });
    //find start and end of each group of wires (Group by layer  width)
    var wiresInfo = [];
    var wiStartIndex = 0;
    for (i = 0; i < wires.length - 1; i++) {
        h = i + 1;
        var group = (wires[i].layer == wires[h].layer) && (wires[i].width == wires[h].width);

        if (!group || h == wires.length - 1) {
            var wiEndindex = group ? h : i;
            wiresInfo.push({
                "start": wiStartIndex,
                "end": wiEndindex
            });
            wiStartIndex = i + 1;
        }
        if (!group && h == wires.length - 1) {
            wiresInfo.push({
                "start": wiStartIndex,
                "end": wiStartIndex
            });
        }
    }
    //sort wires based on their connections with each otehr
    for (var x = 0; x < wiresInfo.length; x++) {
        var st = wiresInfo[x].start,
            en = wiresInfo[x].end;
        var found = true;
        i = st;
        for (; i < en && found; i++) { //Check if wires are already sorted
            found = this.wiresConnectedF(wires[i], wires[i + 1]);
        }
        if (found) continue; //if wires are sorted skip sorting algorithem and check next wire segment
        var c = 0;
        i = st;
        while (i < en && c <= (en - st)) { //c is added to avoid endless loop, not necessary to keep but it won't harm
            var ix = i + 1,
                ip = i - 1;
            var repeat = false;
            found = ip < st ? false : this.wiresConnectedB(wires[i], wires[ip]);
            for (h = i + 1; !found && h <= en; h++) {
                found = this.wiresConnectedB(wires[i], wires[h]);
                if (found) {
                    w = wires[h];
                    for (n = h; n > i; n--) wires[n] = wires[n - 1];
                    wires[i] = w;
                    var cp = this.wiresConnected(wires[h], wires[i]);
                    for (n = i; n < h && cp; n++) {
                        cp = cp && this.wiresConnected(wires[n], wires[n + 1]);
                    }
                    if (cp) {
                        i = h + 1;
                        c = 0;
                    }
                    repeat = true;
                    c++;
                }
            }
            if (!repeat) { //don't execute following code if current wire need to be compared again in above loop
                found = this.wiresConnectedF(wires[i], wires[ix]);
                for (h = ix + 1; !found && h <= en; h++) {
                    found = this.wiresConnectedF(wires[i], wires[h]);
                    if (found) {
                        w = wires[h];
                        for (n = h; n > ix; n--) wires[n] = wires[n - 1];
                        wires[ix] = w;
                    }
                }
                i++;
                c = 0;
            }
        }
    }
    //Build information array of all paths (a path is a set of connected wires)
    var pathInfo = [];
    var piStartIndex = 0;
    for (i = 0; i < wires.length - 1; i++) {
        h = i + 1;
        var connected = this.wiresConnected(wires[i], wires[h]);

        if (!connected || h == wires.length - 1) {
            var piEndindex = connected ? h : i;
            var piType = this.wiresConnected(wires[piEndindex], wires[piStartIndex]);
            pathInfo.push({
                "start": piStartIndex,
                "end": piEndindex,
                "width": wires[i].width,
                "layer": wires[i].layer,
                "type": piType ? 0 : -1
            });
            piStartIndex = i + 1;
        }
        //if last wire is a path by it's own
        if (!connected && h == wires.length - 1) {
            pathInfo.push({
                "start": piStartIndex,
                "end": piStartIndex,
                "width": wires[i].width,
                "layer": wires[i].layer,
                "type": -1
            });
        }
    }

    this.dimensions = [];
    this.restricts = [];
    this.solderMasks = [];
    piStartIndex = 0;
    var piEndIndex = 0;
    for (n = 0; n < pathInfo.length; n++) {
        var path = [];
        var pi = pathInfo[n];
        var curves = [];
        for (i = pi.start; i <= pi.end; i++) {
            wire = wires[i];
            if (wire.curve === 0) {
                path.push({ X: wire.x1, Y: wire.y1 });
                piEndIndex++;
            }
            else {
                var curveStartIndex = path.length;
                var arc = this.drawArc(wire.x1, wire.y1, wire.x2, wire.y2, wire.curve, 0);
                arc.forEach(function(point) {
                    path.push({ X: point.x, Y: point.y });
                    piEndIndex++;
                }, this);
                curves.push({ "start": curveStartIndex, "end": path.length, "curve": wire.curve });
            }
        }
        //add second vertex of last wire to end of path
        path.push({ X: wire.x2, Y: wire.y2 });
        // var paths = [this.dimensions.slice(cdiStartIndex, cdiEndIndex)];
        var bounds = ClipperLib.Clipper.GetBounds([path]);

        if (this.isDimensionLayer(pi.layer)) {
            this.dimensions.push({
                "type": pi.type,
                "width": pi.width,
                "millDiameter": pi.width,
                "layer": pi.layer,
                "path": path,
                "curves": curves,
                "bounds": bounds
            });
        }
        else if (this.isRestrictLayer(pi.layer)) {
            this.restricts.push({
                "type": pi.type,
                "width": pi.width,
                "layer": pi.layer,
                "path": path,
                "bounds": bounds
            });
        }
        else if (this.isSolderMaskLayer(pi.layer)) {
            this.solderMasks.push({
                "type": pi.type,
                "width": pi.width,
                "layer": pi.layer,
                "path": path,
                "curves": curves,
                "bounds": bounds
            });
        }
        piStartIndex = ++piEndIndex;
    }
    //Calculate board boundries to be used in mirroring feature
    var paths = [];
    for (i = 0; i < this.dimensions.length; i++) {
        paths.push(this.dimensions[i].path);
    }
    bounds = ClipperLib.Clipper.GetBounds(paths);
    this.boardBoundaries = {
        MinimumX: bounds.left,
        MinimumY: bounds.top,
        MaximumX: bounds.right,
        MaximumY: bounds.bottom
    };

    //We now need to check which paths to deflate
    for (i = 0; i < this.dimensions.length; i++) {
        for (var j = 0; j < this.dimensions.length; j++) {
            if (i == j) continue; //skip ourself
            var pi1 = this.dimensions[i];
            if (pi1.type < 0) continue; //skip open path
            var pi2 = this.dimensions[j];
            if (pi1.layer != pi2.layer) continue;
            //if path cdi1 inside path cdi1, deflate cdi1, AMEEN TODO: compare actual paths not bounds
            if ((pi1.bounds.left > pi2.bounds.left) &&
                (pi1.bounds.bottom < pi2.bounds.bottom) &&
                (pi1.bounds.right < pi2.bounds.right) &&
                (pi1.bounds.top > pi2.bounds.top)
            ) {
                this.dimensions[i].type = 1; //deflate

            }
        }
    }
};

Board.prototype.parseEagle = function() {
    this.colorPalette = [0x000000, 0x23238d, 0x238d23, 0x238d8d, 0x8d2323, 0x8d238d, 0x8d8d23, 0x8d8d8d,
        0x272727, 0x0000b4, 0x00b400, 0x00b4b4, 0xb40000, 0xb400b4, 0xb4b400, 0xb4b4b4,
        0xd78737, 0xd7af37, 0x5f8737, 0x87875f, 0x87af87, 0x5f8787, 0x37af87, 0x3787af,
        0xffaf37, 0xffd75f, 0x87af37, 0xafaf87, 0xafd7af, 0x87afaf, 0x5fd7af, 0x37afd7,
        0xaf87af, 0xd7afaf, 0xd78787, 0x87375f, 0x875f87, 0xaf8787, 0x5f87af, 0x5fafaf,
        0xd7afd7, 0xffd7d7, 0xffafaf, 0xaf375f, 0xaf87af, 0xd7afaf, 0x87afd7, 0x87d7d7,
        0xfcc080, 0xc0db60, 0xe6e6e6, 0x838383, 0x9a9a9a, 0xadadad, 0xadadad, 0xadadad,
        0xfdd2a2, 0xe1ff67, 0xe9e9e9, 0xdf5454, 0x64dd62, 0xebeb37, 0x5a97d9, 0xac55e5
    ];

    this.param = { restring: {}, clearance: {}, distance: {}, supply: {} };

    this.param.restring = {
        pads: { top: { min: 0, max: 0, size: 0 }, inner: { min: 0, max: 0, size: 0 }, bottom: { min: 0, max: 0, size: 0 }, useDiameter: false },
        vias: { outer: { min: 0, max: 0, size: 0 }, inner: { min: 0, max: 0, size: 0 }, useDiameter: false },
        microVias: { outer: { min: 0, max: 0, size: 0 }, inner: { min: 0, max: 0, size: 0 } }
    };

    this.param.clearance = { wire: { wire: 0, pad: 0, via: 0 }, pad: { pad: 0, via: 0 }, via: { via: 0, viaSameLayer: 0 }, smd: { smd: 0, pad: 0, via: 0 } };

    this.param.distance = { copperDimension: 0, drill: 0 };

    this.param.supply = { thermalIsolate: 0, thermalsForVias: false };

    var i, j, k, layerSetup;
    var param = this.boardXML.getElementsByTagName("param");
    for (i = 0; i < param.length; i++) {
        var p = param[i];
        var name = p.getAttribute("name");
        if (name == "useDiameter") {
            var n = parseInt(p.getAttribute("value"), 10);
            this.param.restring.pads.useDiameter = ((n & 0x02) !== 0);
            this.param.restring.vias.useDiameter = ((n & 0x10) !== 0);
        }
        if (name == "layerSetup") {
            layerSetup = p.getAttribute("value").slice(1, -1).split(/[\*\+]+/);
            for (i = 0; i < layerSetup.length; i++) layerSetup[i] = parseInt(layerSetup[i], 10);
        }

        if (!name.startsWith("r") && !name.startsWith("md") && !name.startsWith("sl")) continue; //we are only concenred about parameters start with rv, rl, sl and md
        var sVal = p.getAttribute("value");
        var v = sVal.includes("mil") ?
            parseFloat(sVal.replace("mil", "")) * 0.0254 :
            sVal.includes("mm") ?
            parseInt(sVal.replace("mm", ""), 10) :
            parseFloat(sVal);

        if (name == "rvPadTop") this.param.restring.pads.top.size = v;
        if (name == "rvPadInner") this.param.restring.pads.inner.size = v;
        if (name == "rvPadBottom") this.param.restring.pads.bottom.size = v;
        if (name == "rvViaOuter") this.param.restring.vias.outer.size = v;
        if (name == "rvViaInner") this.param.restring.vias.inner.size = v;
        if (name == "rvMicroViaOuter") this.param.restring.microVias.outer.size = v;
        if (name == "rvMicroViaInner") this.param.restring.microVias.inner.size = v;
        if (name == "rlMinPadTop") this.param.restring.pads.top.min = v;
        if (name == "rlMaxPadTop") this.param.restring.pads.top.max = v;
        if (name == "rlMinPadInner") this.param.restring.pads.inner.min = v;
        if (name == "rlMaxPadInner") this.param.restring.pads.inner.max = v;
        if (name == "rlMinPadBottom") this.param.restring.pads.bottom.min = v;
        if (name == "rlMaxPadBottom") this.param.restring.pads.bottom.max = v;
        if (name == "rlMinViaOuter") this.param.restring.vias.outer.min = v;
        if (name == "rlMaxViaOuter") this.param.restring.vias.outer.max = v;
        if (name == "rlMinViaInner") this.param.restring.vias.inner.min = v;
        if (name == "rlMaxViaInner") this.param.restring.vias.inner.max = v;
        if (name == "rlMinMicroViaOuter") this.param.restring.microVias.outer.min = v;
        if (name == "rlMaxMicroViaOuter") this.param.restring.microVias.outer.max = v;
        if (name == "rlMinMicroViaInner") this.param.restring.microVias.inner.min = v;
        if (name == "rlMaxMicroViaInner") this.param.restring.microVias.inner.max = v;

        if (name == "mdWireWire") this.param.clearance.wire.wire = v;
        if (name == "mdWirePad") this.param.clearance.wire.pad = v;
        if (name == "mdWireVia") this.param.clearance.wire.via = v;
        if (name == "mdPadPad") this.param.clearance.pad.pad = v;
        if (name == "mdPadVia") this.param.clearance.pad.via = v;
        if (name == "mdViaVia") this.param.clearance.via.via = v;
        if (name == "mdSmdPad") this.param.clearance.smd.pad = v;
        if (name == "mdSmdVia") this.param.clearance.smd.via = v;
        if (name == "mdSmdSmd") this.param.clearance.smd.smd = v;
        if (name == "mdViaViaSameLayer") this.param.clearance.via.viaSameLayer = v;
        if (name == "mdCopperDimension") this.param.distance.copperDimension = v;
        if (name == "mdDrill") this.param.distance.drill = v;

        if (name == "slThermalIsolate") this.param.supply.thermalIsolate = v;
        if (name == "slThermalsForVias") this.param.supply.thermalsForVias = v == 1;
    }

    console.group("Eagle Parse");
    var layers = this.boardXML.getElementsByTagName("layer");
    for (i = 0; i < layers.length; i++) {
        var layer = parseLayer(layers[i]);
        if (layer.active == "yes") {
            if (layer.signalLayer && layerSetup.indexOf(layer.key) == -1) continue;
            this.layers.push(layer);
            if (layer.signalLayer) this.signalLayersCount++;
        }
    }

    var netClasses = this.boardXML.getElementsByTagName("class");
    for (i = 0; i < netClasses.length; i++) {
        var netClass = parseClass(netClasses[i]);
        this.netClasses.push(netClass);
    }

    this.elementsByName = {};
    var elements = this.boardXML.getElementsByTagName("element");
    for (i = 0; i < elements.length; i++) {
        var elemDict = parseElement(elements[i]);
        this.elementsByName[elemDict.name] = elemDict;
    }

    var packages = this.boardXML.getElementsByTagName("package");
    for (j = 0; j < packages.length; j++) {
        var pkg = packages[j];
        var packageName = pkg.getAttribute("name");

        var packageSmds = [];
        var smds = pkg.getElementsByTagName("smd");
        for (i = 0; i < smds.length; i++) {
            var smd = smds[i];
            packageSmds.push(smd);
        }

        var packagePads = [];
        var pads = pkg.getElementsByTagName("pad");
        for (i = 0; i < pads.length; i++) {
            var pad = pads[i];
            packagePads.push(pad);
        }

        var packagePolygons = [];
        var pPolygons = pkg.getElementsByTagName("polygon");
        for (i = 0; i < pPolygons.length; i++) {
            var pPolygon = pPolygons[i];
            packagePolygons.push(parsePolygon(pPolygon));
        }

        var packageHoles = [];
        var holes = pkg.getElementsByTagName("hole");
        for (i = 0; i < holes.length; i++) {
            var holeDict = parseHole(holes[i], "package");
            packageHoles.push(holeDict);
        }

        var packageWires = [];
        var wires = pkg.getElementsByTagName("wire");
        for (i = 0; i < wires.length; i++) {
            var wire = parseWire(wires[i]);
            packageWires.push(wire);
        }

        var packageDict = {
            pads: packagePads,
            smds: packageSmds,
            holes: packageHoles,
            wires: packageWires,
            polygons: packagePolygons,
            name: packageName
        };
        this.packagesByName[packageName] = packageDict;
    }

    this.plainWires = {};
    this.plainCircles = {};
    var plains = this.boardXML.getElementsByTagName("plain"); //Usually only one
    for (j = 0; j < plains.length; j++) {
        var plain = plains[j],
            plainWires = plain.getElementsByTagName("wire");
        for (i = 0; i < plainWires.length; i++) {
            var plainWire = parseWire(plainWires[i]);
            //if(plainWire.layer == 41 || plainWire.layer == 42) continue;
            if (!this.plainWires[plainWire.layer]) this.plainWires[plainWire.layer] = [];
            this.plainWires[plainWire.layer].push(plainWire);
        }

        var polygons = plain.getElementsByTagName("polygon");
        for (i = 0; i < polygons.length; i++) {
            var polygon = parsePolygon(polygons[i], "plain");
            var polygonWires = convertPolygonVerticesToWires(polygon);
            for (k = 0; k < polygonWires.length; k++) {
                if (!this.plainWires[polygon.layer]) this.plainWires[polygon.layer] = [];
                this.plainWires[polygon.layer].push(polygonWires[k]);
            }
        }

        var rectangles = plain.getElementsByTagName("rectangle");
        for (i = 0; i < rectangles.length; i++) {
            var rectangle = parseRectangleAsPolygon(rectangles[i]);
            var rectangleWires = convertPolygonVerticesToWires(rectangle);
            for (k = 0; k < rectangleWires.length; k++) {
                if (!this.plainWires[rectangle.layer]) this.plainWires[rectangle.layer] = [];
                this.plainWires[rectangle.layer].push(rectangleWires[k]);
            }
        }

        var plainHoles = plain.getElementsByTagName("hole");
        for (i = 0; i < plainHoles.length; i++) {
            var hole = parseHole(plainHoles[i], "plain");
            this.holes.push(hole);
        }

        var circles = plain.getElementsByTagName("circle");
        for (i = 0; i < circles.length; i++) {
            var circle = parseCircle(circles[i]);
            var cl = circle.layer;
            if (!this.plainCircles[cl]) this.plainCircles[cl] = [];
            this.plainCircles[cl].push(circle);
        }
    }
    //this.buildDimensionClipper(this.plainWires, this.plainCircles, this.elementsByName);
    this.buildBoardZones(this.plainWires, this.plainCircles, this.elementsByName);

    var xmlSignals = this.boardXML.getElementsByTagName("signal");
    var signalKey = 0;
    var defaultClass = this.netClasses.find(byKey, 0);
    this.signals.push({
        key: 0,
        name: "NotConnected",
        netClassKey: 0,
        netClassName: defaultClass.name,
        clearance: Math.max(defaultClass.clearance, this.param.clearance.wire.wire)

    });
    Array.from(xmlSignals).forEach(function(xmlSignal) {
        var theSignal = parseSignal(xmlSignal, ++signalKey);
        var signalClass = this.netClasses.find(byKey, theSignal.netClassKey);

        theSignal.netClassName = signalClass.name;
        theSignal.clearance = Math.max(signalClass.clearance, this.param.clearance.wire.wire);
        this.signals.push(theSignal);
        var xmlWires = xmlSignal.getElementsByTagName("wire");
        Array.from(xmlWires).forEach(function(xmlWire) {
            var layerId = xmlWire.getAttribute("layer"),
                layer = this.layers.find(byKey, layerId),
                //wire = parseWires(xmlWire, signalKey, layer.Name);
                wire = parseWire(xmlWire);
            var signal = this.getSignal(layer, signalKey);
            if (signal.wires === undefined) signal.wires = [];
            signal.wires.push(wire);

        }, this);

        var xmlVias = xmlSignal.getElementsByTagName("via");
        Array.from(xmlVias).forEach(function(xmlVia) {
            var via = parseVia(xmlVia, this.param.restring.vias);
            this.holes.push({ x: via.x, y: via.y, drill: via.drill, type: "via" });
            var viaLayerKeys = [];
            //var layerRange = xmlVia.getAttribute("extent").split("-");
            //TODO: Research how vias are set in pro version of eagle
            this.layers.forEach(function(layer) {
                if (layer.signalLayer) {
                    viaLayerKeys.push(layer.key);
                    var signal = this.getSignal(layer, signalKey);
                    if (signal.vias === undefined) signal.vias = [];
                    if (layer.key == 1 || layer.key == 16) { via.diameter = via.diameterOuter; }
                    else { via.diameter = via.diameterInner; }
                    signal.vias.push(via);
                }
            }, this);
        }, this);

        var xmlContacts = xmlSignal.getElementsByTagName("contactref");
        Array.from(xmlContacts).forEach(function(xmlContact) {
            var elemName = xmlContact.getAttribute("element");
            var padName = xmlContact.getAttribute("pad");
            var elem = this.elementsByName[elemName];
            if (elem) {
                elem.padSignals[padName] = theSignal.name;
                //TODO: Check what the following notes mean?
                // check if @ sign in name cuz then
                // you have to create a redundant pad signal cuz this is one of
                // those special Eagle tricks that lets you connect multiple smd
                // pads to one signal
                if (padName.match(/@/)) {
                    padName.match(/(.+)@/);
                    var newPadName = RegExp.$1;
                    elem.padSignals[newPadName] = theSignal.name;
                }
            }
        }, this);

        var polygons = xmlSignal.getElementsByTagName("polygon");
        for (var polyIdx = 0; polyIdx < polygons.length; polyIdx++) {
            var polygon = parsePolygon(polygons[polyIdx]);
            polygon.isolate = Math.max(polygon.isolate, this.param.distance.copperDimension);
            polygon.thermalsClearance = this.param.supply.thermalIsolate;
            console.log("Thermals", polygon);
            var layer = this.layers.find(byKey, polygon.layer);
            var signal = this.getSignal(layer, signalKey);
            if (signal.polygons === undefined) signal.polygons = [];
            signal.polygons.push(polygon);
        }

    }, this);
    for (var elemKey in this.elementsByName) {
        var elem = this.elementsByName[elemKey];
        var elmPkg = this.packagesByName[elem.pkg];
        var signal;
        elmPkg.smds.forEach(function(xmlSmd) {
            var layerNumber = xmlSmd.getAttribute("layer");
            if (elem.mirror)
                layerNumber = 17 - parseInt(layerNumber, 10);
            var layer = this.layers.find(byKey, layerNumber);
            //var signal = this.getSignal(layer, signalKey);
            var smdPad = parseSmdPad(xmlSmd, elem);
            signal = this.getSignalByName(layer, elem.padSignals[smdPad.name]);
            if (signal.pads === undefined) signal.pads = [];
            signal.pads.push(smdPad);
        }, this);

        elmPkg.pads.forEach(function(xmlPad) {
            var pad = parsePad(xmlPad, elem, this.param.restring.pads);
            for (var l = 1; l <= 16; l++) {
                var layer = this.layers.find(byKey, l);
                if (layer) {
                    var signal = this.getSignal(layer, signalKey);
                    if (l == 1) { pad.sizeX = pad.sizeY = pad.diameterTop; }
                    else if (l == 16) { pad.sizeX = pad.sizeY = pad.diameterBottom; }
                    else { pad.sizeX = pad.sizeY = pad.diameterInner; }
                    signal = this.getSignalByName(layer, elem.padSignals[pad.name]);
                    if (signal.pads === undefined) signal.pads = [];
                    signal.pads.push(pad);
                }
            }
            this.holes.push({
                x: pad.x,
                y: pad.y,
                drill: pad.drill,
                type: "pad",
                packageX: elem.x,
                packageY: elem.y,
                packageMirror: elem.mirror,
                packageRotation: elem.rotation
            });
        }, this);

        elmPkg.holes.forEach(function(hole) {
            this.holes.push({
                x: hole.x,
                y: hole.y,
                drill: hole.drill,
                type: "package",
                packageX: elem.x,
                packageY: elem.y,
                packageMirror: elem.mirror,
                packageRotation: elem.rotation
            });
        }, this);
    }
    console.groupEnd();



    function parseLayer(layer) {
        var key = parseFloat(layer.getAttribute("number"));

        var isSignal = key <= 16;
        var isDimention = (key == 20 || key == 46);
        var isRestrict = (key == 41 || key == 42);
        var isSoldeMask = (key == 29 || key == 30);

        var layerType = isSignal ? "signal" : "other";
        if (!isSignal)
            switch (key) {
                case 20:
                    layerType = "dimension";
                    break;
                case 47:
                    layerType = "milling";
                    break;
                case 41:
                    layerType = "tRestrict";
                    break;
                case 42:
                    layerType = "bRestrict";
                    break;
                case 29:
                    layerType = "tSolderMask";
                    break;
                case 30:
                    layerType = "bSolderMask";
                    break;
            }
        return {
            key: key,
            name: layer.getAttribute("name"),
            active: layer.getAttribute("active"),
            color: layer.getAttribute("color"),
            type: layerType,
            signalLayer: isSignal,
            dimensionLayer: isDimention,
            restrictLayer: isRestrict,
            solderMaskLayer: isSoldeMask,
            canRender: isSignal || isDimention || isRestrict || isSoldeMask
        };
    }

    function parseClass(netClass) {
        var clearances = netClass.getElementsByTagName("clearance");
        console.log(clearances);
        var clearance = clearances.length === 0 ? 0 : clearances[0].getAttribute("value"); //TODO: Check which clearance value to use!
        return {
            key: parseInt(netClass.getAttribute("number"), 10),
            name: netClass.getAttribute("name"),
            width: parseFloat(netClass.getAttribute("width")),
            drill: parseFloat(netClass.getAttribute("drill")),
            clearance: parseFloat(clearance)
        };
    }

    function parseSignal(signal, key) {
        var classKey = parseInt(signal.getAttribute("class"), 10);
        if (isNaN(classKey)) classKey = 0;
        return {
            key: key,
            name: signal.getAttribute("name"),
            netClassKey: classKey,
            netClassName: "", //to be set later
            clearance: 0 //to be set later
        };
    }

    function parseWire(wire) {
        var width = parseFloat(wire.getAttribute("width"));
        var curve = parseFloat(wire.getAttribute("curve"));
        var layer = parseInt(wire.getAttribute("layer"), 10);
        var cap = wire.getAttribute("cap");
        if (!curve) curve = 0;
        this.millingLayerUsed = this.millingLayerUsed || (layer == 46);
        this.dimensionLayerUsed = this.dimensionLayerUsed || (layer == 20);
        return {
            x1: parseFloat(wire.getAttribute("x1")),
            y1: parseFloat(wire.getAttribute("y1")),
            x2: parseFloat(wire.getAttribute("x2")),
            y2: parseFloat(wire.getAttribute("y2")),
            width: width,
            layer: layer,
            curve: curve,
            cap: (cap) ? cap : "round"
        };
    }

    function parseCircle(circle) {
        var layer = parseInt(circle.getAttribute("layer"), 10);
        this.millingLayerUsed = this.millingLayerUsed || (layer == 46);
        this.dimensionLayerUsed = this.dimensionLayerUsed || (layer == 20);
        return {
            x: parseFloat(circle.getAttribute("x")),
            y: parseFloat(circle.getAttribute("y")),
            radius: parseFloat(circle.getAttribute("radius")),
            width: parseFloat(circle.getAttribute("width")),
            layer: layer
        };
    }

    function parseVia(via, v) {
        var drill = parseFloat(via.getAttribute("drill"));
        var diameter = parseFloat(via.getAttribute("diameter"));
        var diameterInner = drill + 2 * Math.min(Math.max(drill * v.inner.size, v.inner.min), v.inner.max);
        var diameterOuter = drill + 2 * Math.min(Math.max(drill * v.outer.size, v.outer.min), v.outer.max);
        if (diameter) {
            var size = diameter - drill; //width of copper ring predifined by user
            if (size > v.outer.size) diameterOuter = diameter;
            if (size > v.inner.size && v.useDiameter) diameterInner = diameter;

        }
        return {
            x: parseFloat(via.getAttribute("x")),
            y: parseFloat(via.getAttribute("y")),
            drill: drill,
            diameter: diameter,
            diameterInner: diameterInner,
            diameterOuter: diameterOuter,
            layers: via.getAttribute("extent"),
            shape: via.getAttribute("shape") || "circle"
        };
    }

    function parseElement(elem) {
        var elemRot = elem.getAttribute("rot") || "R0";
        var rotation = parseInt(elemRot.replace(/S|M|R/g, ""), 10) * Math.PI / 180;
        return {
            pkg: elem.getAttribute("package"),
            name: elem.getAttribute("name"),
            value: elem.getAttribute("value"),
            x: parseFloat(elem.getAttribute("x")),
            y: parseFloat(elem.getAttribute("y")),
            rotation: rotation,
            mirror: elemRot.indexOf("M") != -1,
            padSignals: {} //to be filled later
        };
    }

    function parsePad(pad, elm, p) {
        var drill = parseFloat(pad.getAttribute("drill"));
        var diameter = parseFloat(pad.getAttribute("diameter"));
        var diameterTop = drill + 2 * Math.min(Math.max(drill * p.top.size, p.top.min), p.top.max);
        var diameterInner = drill + 2 * Math.min(Math.max(drill * p.inner.size, p.inner.min), p.inner.max);
        var diameterBottom = drill + 2 * Math.min(Math.max(drill * p.bottom.size, p.bottom.min), p.bottom.max);
        if (diameter) {
            var size = diameter - drill; //width of copper ring predifined by user
            if (size > p.top.size) diameterTop = diameter;
            if (size > p.inner.size && p.useDiameter) diameterInner = diameter;
            if (size > p.bottom.size) diameterBottom = diameter;
        }
        var xm = parseFloat(elm.x);
        var ym = parseFloat(elm.y);
        var xp = parseFloat(pad.getAttribute("x"));
        var yp = parseFloat(pad.getAttribute("y"));
        var shape = pad.getAttribute("shape");
        var padRot = pad.getAttribute("rot") || "R0";
        var revolve = parseInt(padRot.replace(/M|R/g, ""), 10) * Math.PI / 180;
        return {
            x: xp,
            y: yp,
            revolve: revolve,
            rotation: elem.rotation,
            sizeX: diameter,
            sizeY: diameter,
            diameterTop: diameterTop,
            diameterInner: diameterInner,
            diameterBottom: diameterBottom,
            centerX: xm,
            centerY: ym,
            type: "thru_hole",
            shape: (shape === null) ? "circle" : shape,
            drill: drill,
            drillShape: "circle",
            roundness: 0,
            name: pad.getAttribute("name"),
            pkg: elm.pkg,
            mirror: elm.mirror
        };
    }

    function parseSmdPad(pad, elm) {
        var xm = parseFloat(elm.x);
        var ym = parseFloat(elm.y);
        var xp = parseFloat(pad.getAttribute("x"));
        var yp = parseFloat(pad.getAttribute("y"));
        var padRot = pad.getAttribute("rot") || "R0";
        var revolve = parseInt(padRot.replace(/M|R/g, ""), 10) * Math.PI / 180;

        return {
            x: xp,
            y: yp,
            revolve: revolve,
            rotation: elm.rotation,
            sizeX: parseFloat(pad.getAttribute("dx")),
            sizeY: parseFloat(pad.getAttribute("dy")),
            centerX: xm,
            centerY: ym,
            type: "smd",
            shape: "rect",
            drill: null,
            roundness: parseInt(pad.getAttribute("roundness") || 0, 10),
            name: pad.getAttribute("name"),
            pkg: elm.pkg,
            mirror: elm.mirror
        };
    }

    function parsePolygon(polygon) {
        var width = parseFloat(polygon.getAttribute("width"));
        var isolate = parseFloat(polygon.getAttribute("isolate") || 0);
        var thermals = polygon.getAttribute("thermals") || "yes";
        var vertices = [];
        var vertexElems = polygon.getElementsByTagName("vertex");
        for (var vertIdx = 0; vertIdx < vertexElems.length; vertIdx++) {
            var vertexElem = vertexElems[vertIdx];
            var curve = parseFloat(vertexElem.getAttribute("curve"));
            if (!curve) curve = 0;
            var vertex = {
                x: parseFloat(vertexElem.getAttribute("x")),
                y: parseFloat(vertexElem.getAttribute("y")),
                curve: curve
            };
            vertices.push(vertex);
        }
        return {
            width: width,
            layer: parseInt(polygon.getAttribute("layer"), 10),
            rank: parseInt(polygon.getAttribute("rank") || 1, 10),
            thermals: thermals == "yes",
            thermalsWidth: width,
            thermalsClearance: 0,
            pour: polygon.getAttribute("pour") || "solid",
            isolate: isolate,
            fuck: isolate,
            vertices: vertices
        };
    }

    function parseRectangleAsPolygon(rectangle) {
        var layer = parseInt(rectangle.getAttribute("layer"), 10),
            x1 = parseFloat(rectangle.getAttribute("x1")),
            y1 = parseFloat(rectangle.getAttribute("y1")),
            x2 = parseFloat(rectangle.getAttribute("x2")),
            y2 = parseFloat(rectangle.getAttribute("y2")),
            rot = rectangle.getAttribute("rot") || "R0",
            rotation = parseInt(rot.replace(/S|M|R/g, ""), 10) * Math.PI / 180,
            pt = [{ X: x1, Y: y1 }, { X: x1, Y: y2 }, { X: x2, Y: y2 }, { X: x2, Y: y1 }, ],
            vertices = [],
            i;
        if (rotation !== 0) {
            var cx = x1 + (x2 - x1) / 2,
                cy = y1 + (y2 - y1) / 2,
                rd = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
            for (i = 0; i < 4; i++) {
                var an = rotation + Math.atan2(pt[i].Y - cy, pt[i].X - cx);
                pt[i].X = cx + rd * Math.cos(an);
                pt[i].Y = cy + rd * Math.sin(an);
            }
        }
        for (i = 0; i < 4; i++) {
            var vertex = { x: pt[i].X, y: pt[i].Y, curve: 0 };
            vertices.push(vertex);
        }
        return {
            width: 0,
            layer: layer,
            rank: 0,
            thermals: "no",
            pour: "solid",
            vertices: vertices
        };
    }

    function parseHole(hole, type) {
        return {
            x: parseFloat(hole.getAttribute("x")),
            y: parseFloat(hole.getAttribute("y")),
            drill: parseFloat(hole.getAttribute("drill")),
            type: type
        };
    }

    function convertPolygonVerticesToWires(polygon) {
        var wires = [];
        for (var i = 0; i < polygon.vertices.length; i++) {
            j = (i == polygon.vertices.length - 1) ? 0 : i + 1;
            var va = polygon.vertices[i],
                vb = polygon.vertices[j];

            wires.push({
                x1: va.x,
                y1: va.y,
                x2: vb.x,
                y2: vb.y,
                width: polygon.width,
                layer: polygon.layer,
                curve: va.curve,
                cap: "round"
            });
        }
        return wires;
    }
};

Board.prototype.parseKiCad = function() {
    this.colorPalette = [0x840000, 0xc2c200, 0xc200c2, 0xc20000,
        0x008484, 0x008400, 0x000084, 0x848484,
        0x840084, 0xc2c2c2, 0x840084, 0x840000,
        0x848400, 0xc2c2c2, 0x000084, 0x008400
    ];

    function parseLayer(layer) {

        var key = parseFloat(layer.getAttribute("id"));
        var name = layer.getAttribute("name");
        var layerType = layer.getAttribute("type");
        var isSignal = layerType == "signal" || layerType == "power" || layerType == "mixed";
        var isDimention = name == "Edge.Cuts";
        var isRestrict = false;
        var isSoldeMask = false; //TODO: Add solder mask
        if (isDimention) layerType = "Dimension";
        return {
            key: key,
            name: name,
            color: key,
            type: layerType,
            signalLayer: isSignal,
            dimensionLayer: isDimention,
            restrictLayer: isRestrict,
            solderMaskLayer: isSoldeMask,
            canRender: isSignal || isDimention || isRestrict || isSoldeMask
        };
    }

    function parseSignal(signal) {
        return {
            key: parseFloat(signal.getAttribute("id")),
            name: signal.getAttribute("name"),
            netClassKey: 0, //to be set later
            netClassName: "", //to be set later
            clearance: 0 //to be set later
        };
    }

    function parseSegment(segment) {
        return {
            x1: parseFloat(segment.getAttribute("x1")),
            y1: -parseFloat(segment.getAttribute("y1")),
            x2: parseFloat(segment.getAttribute("x2")),
            y2: -parseFloat(segment.getAttribute("y2")),
            width: parseFloat(segment.getAttribute("width")),
            layerName: segment.getAttribute("layer"),
            signalKey: parseInt(segment.getAttribute("net"), 10),
            curve: 0, //TODO: Chech how KiCad handels curved wires
            cap: "round"
        };
    }

    function parseVia(via) {
        return {
            x: parseFloat(via.getAttribute("x")),
            y: -parseFloat(via.getAttribute("y")),
            diameter: parseFloat(via.getAttribute("size")),
            drill: 0.635 / 2, //TODO: Get via_drill from net_class or setup
            shape: "circle"
        };
    }

    function parsePad(pad) {
        var xm = parseFloat(pad.parentNode.getAttribute("x"));
        var ym = parseFloat(pad.parentNode.getAttribute("y"));
        var xp = parseFloat(pad.getAttribute("x"));
        var yp = parseFloat(pad.getAttribute("y"));
        var rotation = parseFloat(pad.parentNode.getAttribute("rotation")) * Math.PI / 180;
        var revolve = parseFloat(pad.getAttribute("rotation")) * Math.PI / 180;

        return {
            x: xp,
            y: -yp,
            revolve: revolve + rotation,
            rotation: rotation,
            sizeX: parseFloat(pad.getAttribute("sizex")),
            sizeY: parseFloat(pad.getAttribute("sizey")),
            centerX: xm,
            centerY: -ym,
            type: pad.getAttribute("type"),
            shape: pad.getAttribute("shape"),
            drill: parseFloat(pad.getAttribute("drill")),
            drillX: parseFloat(pad.getAttribute("drillx")),
            drillY: parseFloat(pad.getAttribute("drilly")),
            drillShape: pad.getAttribute("ds"),
            roundness: 0,
            name: ""
        };
    }

    function parseLine(line, layerKey) {
        var width = parseFloat(line.getAttribute("width"));
        var curve = 0;

        return {
            x1: parseFloat(line.getAttribute("x1")),
            y1: -parseFloat(line.getAttribute("y1")),
            x2: parseFloat(line.getAttribute("x2")),
            y2: -parseFloat(line.getAttribute("y2")),
            width: width,
            layer: layerKey,
            curve: curve
        };
    }

    function parseArc(arc, layerKey) {
        var width = parseFloat(arc.getAttribute("width"));
        var curve = parseFloat(arc.getAttribute("angle"));
        var xc = parseFloat(arc.getAttribute("x1")), // Center X
            yc = -parseFloat(arc.getAttribute("y1")), // Center Y
            x1 = parseFloat(arc.getAttribute("x2")), // Curve End Point X
            y1 = -parseFloat(arc.getAttribute("y2")), // Curve End Point X
            an = curve * Math.PI / 180 + Math.atan2(yc - y1, xc - x1), // Angle in radians
            rd = Math.sqrt((xc - x1) * (xc - x1) + (yc - y1) * (yc - y1)), //Radius
            x2 = xc + rd * Math.cos(an), // Curve Start Point X
            y2 = yc + rd * Math.sin(an); // Curve Start Point Y
        return {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            width: width,
            layer: layerKey,
            curve: -curve
        };
    }

    function parseClass(netClass, key) {
        var add_nets = netClass.getElementsByTagName("add_net");
        var nets = [];
        Array.from(add_nets).forEach(function(add_net) { nets.push(add_net.getAttribute("name")); });
        return {
            key: key,
            name: netClass.getAttribute("name"),
            clearance: parseFloat(netClass.getAttribute("clearance")),
            nets: nets
        };
    }

    console.group("KiCad Parse");
    var xmlLayers = this.boardXML.getElementsByTagName("layer");
    Array.from(xmlLayers).forEach(function(xmlLayer) {
        var layer = parseLayer(xmlLayer);
        this.layers.push(layer);
        if (layer.signalLayer) this.signalLayersCount++;
    }, this);

    this.plainWires = {};
    var xmlGrLines = this.boardXML.getElementsByTagName("gr_line");
    Array.from(xmlGrLines).forEach(function(xmlGrLine) {
        var layerName = xmlGrLine.getAttribute("layer");
        var layer = this.layers.find(byName, layerName);
        if (layer !== undefined && layer.canRender) {
            var wire = parseLine(xmlGrLine, layer.key);
            if (!this.plainWires[wire.layer]) this.plainWires[wire.layer] = [];
            this.plainWires[wire.layer].push(wire);
        }
    }, this);
    //this.buildDimensionClipper(this.plainWires, [], []);

    var xmlArcs = this.boardXML.getElementsByTagName("gr_arc");
    Array.from(xmlArcs).forEach(function(xmlArc) {
        var layerName = xmlArc.getAttribute("layer");
        var layer = this.layers.find(byName, layerName);
        if (layer !== undefined && layer.canRender) {
            var wire = parseArc(xmlArc, layer.key);
            if (!this.plainWires[wire.layer]) this.plainWires[wire.layer] = [];
            this.plainWires[wire.layer].push(wire);
        }
    }, this);
    //this.buildDimensionClipper(this.plainWires, [], []);
    this.buildBoardZones(this.plainWires, [], []);

    var xmlSignals = this.boardXML.getElementsByTagName("net");
    Array.from(xmlSignals).forEach(function(xmlSignal) {
        this.signals.push(parseSignal(xmlSignal));
    }, this);

    var xmlClasses = this.boardXML.getElementsByTagName("net_class");
    for (var i = 0; i < xmlClasses.length; i++) {
        var netClass = parseClass(xmlClasses[i], i);
        this.netClasses.push(netClass);
        netClass.nets.forEach(function(name) {
            var signal = this.signals.find(byName, name);
            if (signal !== undefined) {
                signal.netClassKey = i;
                signal.netClassName = netClass.name;
                signal.clearance = netClass.clearance;
            }
        }, this);
    }

    var xmlSegments = this.boardXML.getElementsByTagName("segment");
    Array.from(xmlSegments).forEach(function(xmlSegment) {
        var layerName = xmlSegment.getAttribute("layer"),
            layer = this.layers.find(byName, layerName);
        if (layer !== undefined && layer.canRender) {
            var wire = parseSegment(xmlSegment),
                signalKey = parseInt(xmlSegment.getAttribute("net"), 10);
            var signal = this.getSignal(layer, signalKey);
            if (signal.wires === undefined) signal.wires = [];
            signal.wires.push(wire);
        }
    }, this);

    var xmlVias = this.boardXML.getElementsByTagName("via");
    Array.from(xmlVias).forEach(function(xmlVia) {
        var via = parseVia(xmlVia);
        this.holes.push({ x: via.x, y: via.y, drill: via.drill });
        var signalKey = parseInt(xmlVia.getAttribute("net"), 10);
        var viaLayerKeys = [];
        xmlVia.getAttribute("viaLayers").split(/\s/).forEach(function(layerName) {
            viaLayerKeys.push(this.layers.find(byName, layerName).key);
        }, this);
        var sKey = viaLayerKeys[0];
        var eKey = viaLayerKeys[viaLayerKeys.length - 1];
        for (var key = sKey; key <= eKey; key++) {
            var layer = this.layers.find(byKey, key);
            if (layer === undefined) continue;
            var signal = this.getSignal(layer, signalKey);
            if (signal.vias === undefined) signal.vias = [];
            signal.vias.push(via);
        }
    }, this);

    var xmlPads = this.boardXML.getElementsByTagName("pad");

    Array.from(xmlPads).forEach(function(xmlPad) {
        var pad = parsePad(xmlPad);
        if (pad.type == "thru_hole")
            this.holes.push({
                x: pad.x,
                y: pad.y,
                type: "package",
                drill: pad.drill,
                drillX: pad.drillX,
                drillY: pad.drillY,
                drillShape: pad.drillShape,
                revolve: pad.revolve,
                packageX: pad.centerX,
                packageY: pad.centerY,
                packageMirror: false,
                packageRotation: pad.rotation
            });

        var padLayerKeys = [];
        xmlPad.getAttribute("padLayers").split(/\s/).forEach(function(layerName) {

            if (layerName == "*.Cu") {
                padLayerKeys.push(0);
                padLayerKeys.push(31);
            }
            else if (layerName == "*.Mask") {
                padLayerKeys.push(38);
                padLayerKeys.push(39);
            }
            else if (layerName == "*.SilkS") {
                padLayerKeys.push(36);
                padLayerKeys.push(37);
            }
            else if (layerName == "*.Adhes") {
                padLayerKeys.push(32);
                padLayerKeys.push(33);
            }
            else if (layerName == "*.Paste") {
                padLayerKeys.push(34);
                padLayerKeys.push(35);
            }
            else
                padLayerKeys.push(this.layers.find(byName, layerName).key);
        }, this);

        var signalKey = parseInt(xmlPad.getAttribute("net"), 10);
        if (isNaN(signalKey)) signalKey = 0;
        padLayerKeys.forEach(function(key) {
            var layer = this.layers.find(byKey, key);
            if (layer !== undefined) {
                var signal = this.getSignal(layer, signalKey);
                if (signal.pads === undefined) signal.pads = [];
                signal.pads.push(pad);

            }
        }, this);
    }, this);

    var xmlZones = this.boardXML.getElementsByTagName("zone");
    Array.from(xmlZones).forEach(function(xmlZone) {
        var xmlPolygons = xmlZone.getElementsByTagName("polygon"),
            layerName = xmlZone.getAttribute("layer"),
            layer = this.layers.find(byName, layerName),
            signalKey = parseInt(xmlZone.getAttribute("net"), 10);
        var signal = this.getSignal(layer, signalKey);
        if (signal.polygons === undefined) signal.polygons = [];
        Array.from(xmlPolygons).forEach(function(xmlPolygon) {
            var polygon = parsePolygon(xmlPolygon, xmlZone, layer);
            signal.polygons.push(polygon);
        }, this);
    }, this);
    console.groupEnd();

    function parsePolygon(polygon, zone, layer) {
        var vertices = [];
        var vertexElems = polygon.getElementsByTagName("xy");
        for (var vertIdx = 0; vertIdx < vertexElems.length; vertIdx++) {
            var vertexElem = vertexElems[vertIdx];
            var vertex = {
                x: parseFloat(vertexElem.getAttribute("x")),
                y: -parseFloat(vertexElem.getAttribute("y")),
                curve: 0
            };
            vertices.push(vertex);
        }
        var connectPads = zone.getElementsByTagName("connect_pads");
        var fill = zone.getElementsByTagName("fill");
        var isolate = 0;
        if (connectPads.length > 0)
            isolate = parseFloat(connectPads[0].getAttribute("clearance") || 0);
        return {
            width: 0,
            layer: layer.key,
            rank: parseInt(zone.getAttribute("priority") || 0, 10),
            thermals: true,
            thermalsWidth: parseFloat(fill[0].getAttribute("thermal_bridge_width")),
            thermalsClearance: parseFloat(fill[0].getAttribute("thermal_gap")),
            pour: "solid",
            isolate: isolate,
            vertices: vertices
        };
    }
};




/**
 * @Class to parse KiCad_pcb text file to XML format.
 */
function kiCadXmlParser() {
    var that = this;

    function getEndIndex(text, oIndex) {
        var i = oIndex + 1,
            l = text.length,
            bCount = 1,
            quotedText = false;
        while (i < l && bCount !== 0) {
            var c = text.charAt(i);
            if (c == "\"") {
                if (quotedText)
                    quotedText = false;
                else
                    quotedText = true;
            }
            else if (!quotedText) {
                if (c == "(") bCount++;
                if (c == ")") bCount--;
            }
            i++;
        }
        return i - 1;
    }

    function getStartIndex(text, oIndex) {
        var i = oIndex,
            l = text.length,
            match = false,
            quotedText = false;
        while (i < l && !match) {
            var c = text.charAt(i);
            if (c == "\"") {
                if (quotedText)
                    quotedText = false;
                else
                    quotedText = true;
            }
            else if (!quotedText) {
                if (c == "(") match = true;
            }
            i++;
        }
        return i - 1;
    }

    function getFirstChildIndex(text) {
        var l = text.length,
            singleQuoteCount = 0,
            doubleQuoteCount = 0;
        for (var i = 0; i < l; i++) {
            var c = text.charAt(i);
            if (c == "\"") doubleQuoteCount++;
            else if (c == "\'") singleQuoteCount++;
            else if (c == "(" && doubleQuoteCount % 2 === 0 && singleQuoteCount % 2 === 0) return i;
        }
        return 0;
    }

    function getAttributes(text) {
        var firstChildIndex = getFirstChildIndex(text),
            endIndex = firstChildIndex > 0 ? firstChildIndex : text.length,
            values = text.substring(0, endIndex).trim().match(/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g),
            name = values[0];
        return {
            name: name,
            values: values,
            hasChildren: firstChildIndex > 0
        };
    }

    function assigneAttributes(element, values) {
        var name = values[0];
        if (name == "net_class" || name == "module" || name == "model")
            element.setAttribute("name", values[1]);
        else if (name == "pad") {
            element.setAttribute("nets", values[1]);
            element.setAttribute("type", values[2]);
            element.setAttribute("shape", values[3]);
        }
        else if (name == "dimension")
            element.setAttribute("value", values[1]);
        else if (name == "fp_text") {
            element.setAttribute("type", values[1]);
            element.setAttribute("text", values[2]);
        }
        else if (name == "gt_text")
            element.setAttribute("text", values[1]);
    }

    function getDrawingElement() {
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

    function addChild(parent, element) {
        if (parent.nodeName != "drawing") {
            parent.appendChild(element);
            return;
        }
        var name = element.nodeName;
        if (name == "net_class")
            parent.getElementsByTagName("net_classes")[0].appendChild(element);
        else if (name == "module")
            parent.getElementsByTagName("modules")[0].appendChild(element);
        else if (name == "segment")
            parent.getElementsByTagName("segments")[0].appendChild(element);
        else if (name == "via")
            parent.getElementsByTagName("vias")[0].appendChild(element);
        else if (name.startsWith("gr_"))
            parent.getElementsByTagName("graphics")[0].appendChild(element);
        else
            parent.appendChild(element);
    }

    function parseText(text, parent) {
        var obi = 0, cbi = 0; // opening bracket index & closing bracket index
        text = text.trim();
        console.log("parent", parent);
        while (cbi < text.length - 1 && obi != -1 && cbi != -1) {
            //obi = text.indexOf("(", cbi);
            obi = getStartIndex(text, cbi);
            cbi = getEndIndex(text, obi);
            var innerText = text.substring(obi + 1, cbi).trim();
            var attributes = getAttributes(innerText);
            if (attributes.hasChildren) {
                var element;
                if (parent.nodeName == attributes.name) {
                    assigneAttributes(parent, attributes.values);
                    element = getDrawingElement();
                    parseText(innerText, element);
                    parent.appendChild(element);
                }
                else {
                    element = that.doc.createElement(attributes.name);
                    assigneAttributes(element, attributes.values);
                    parseText(innerText, element);
                    addChild(parent, element);
                    //parent.appendChild(element);
                }
            }
            else {
                var reqEx = new RegExp("(\".*?\"|[^\"\\s]+)+(?=\\s*|\\s*$)", "g");
                var vals = text.substring(obi + 1, cbi).match(reqEx);
                var param, layers, layer, i, net;
                if (parent.nodeName == "layers") {
                    layer = that.doc.createElement("layer");
                    layer.setAttribute("id", vals[0]);
                    layer.setAttribute("name", vals[1]);
                    layer.setAttribute("type", vals[2]);
                    parent.appendChild(layer);
                }
                else if (parent.nodeName == "setup") {
                    param = that.doc.createElement("param");
                    param.setAttribute("name", vals[0]);
                    param.setAttribute("value", vals[1]);
                    parent.appendChild(param);
                }
                else if (parent.nodeName == "pcbplotparams") {
                    param = that.doc.createElement("param");
                    param.setAttribute("name", vals[0]);
                    param.setAttribute("value", vals[1]);
                    parent.appendChild(param);
                }
                else if (parent.nodeName == "pts") {
                    var xy = that.doc.createElement("xy");
                    xy.setAttribute("x", vals[1]);
                    xy.setAttribute("y", vals[2]);
                    parent.appendChild(xy);
                }
                else if (parent.nodeName == "via" && vals[0] == "layers") {
                    layers = "";
                    for (i = 1; i < vals.length; i++) layers += vals[i] + " ";
                    parent.setAttribute("viaLayers", layers.trim());
                }
                else if (parent.nodeName == "pad" && vals[0] == "layers") {
                    layers = "";
                    for (i = 1; i < vals.length; i++) layers += vals[i] + " ";
                    parent.setAttribute("padLayers", layers.trim());
                }
                else if (parent.nodeName == "drawing" && vals[0] == "net") {
                    net = that.doc.createElement(vals[0]);
                    net.setAttribute("id", vals[1]);
                    net.setAttribute("name", vals[2]);
                    parent.getElementsByTagName("nets")[0].appendChild(net);
                }
                else if (parent.nodeName == "gr_text") {

                }
                else if (vals[0] == "add_net") {
                    net = that.doc.createElement(vals[0]);
                    net.setAttribute("name", vals[1]);
                    parent.appendChild(net);
                }
                else if (vals[0] == "area") {
                    var area = that.doc.createElement("area");
                    area.setAttribute("x1", vals[1]);
                    area.setAttribute("y1", vals[2]);
                    area.setAttribute("x2", vals[3]);
                    area.setAttribute("y2", vals[4]);
                    parent.appendChild(area);
                }
                else if (vals[0] == "xyz") {
                    parent.setAttribute("x", vals[1]);
                    parent.setAttribute("y", vals[2]);
                    parent.setAttribute("z", vals[3]);
                }
                else if (vals[0] == "start") {
                    parent.setAttribute("x1", vals[1]);
                    parent.setAttribute("y1", vals[2]);
                }
                else if (vals[0] == "end") {
                    parent.setAttribute("x2", vals[1]);
                    parent.setAttribute("y2", vals[2]);
                }
                else if (vals[0] == "at") {
                    parent.setAttribute("x", vals[1]);
                    parent.setAttribute("y", vals[2]);
                    if (vals.length == 4)
                        parent.setAttribute("rotation", vals[3]);
                    else
                        parent.setAttribute("rotation", "0");
                }
                else if (vals[0] == "drill") {
                    if (vals.length == 4) {
                        parent.setAttribute(vals[0], vals[2]);
                        parent.setAttribute("drillx", vals[2]);
                        parent.setAttribute("drilly", vals[3]);
                        parent.setAttribute("ds", vals[1]);
                    }
                    else {
                        parent.setAttribute(vals[0], vals[1]);
                        parent.setAttribute("ds", "circle");
                    }
                }
                else if (vals[0] == "size" && vals.length == 3) {
                    parent.setAttribute("sizex", vals[1]);
                    parent.setAttribute("sizey", vals[2]);
                }
                else if (vals[0] == "host") {
                    that.doc.documentElement.setAttribute(vals[0], vals[1] + " " + vals[2]);
                }
                else if (vals[0] == "version")
                    that.doc.documentElement.setAttribute(vals[0], vals[1]);
                else if (vals[0] == "page") {
                    var w, h;
                    if (vals[1] == "User") { w = vals[2];
                        h = vals[3]; }
                    else if (vals[1] == "A4") { w = 210;
                        h = 297; }
                    else if (vals[1] == "A3") { w = 297;
                        h = 420; }
                    else if (vals[1] == "A2") { w = 420;
                        h = 594; }
                    else if (vals[1] == "A1") { w = 584;
                        h = 841; }
                    else if (vals[1] == "A0") { w = 841;
                        h = 1189; }
                    else if (vals[1] == "A" || vals[1] == "USLetter") { w = 8.5 * 25.4;
                        h = 11 * 25.2; }
                    else if (vals[1] == "B" || vals[1] == "USLedger") { w = 11 * 25.4;
                        h = 17 * 25.2; }
                    else if (vals[1] == "C") { w = 17 * 25.4;
                        h = 22 * 25.2; }
                    else if (vals[1] == "D") { w = 22 * 25.4;
                        h = 34 * 25.2; }
                    else if (vals[1] == "E") { w = 34 * 25.4;
                        h = 44 * 25.2; }
                    else if (vals[1] == "USLegal") { w = 8.5 * 25.4;
                        h = 14 * 25.2; }
                    if (vals.length == 2) { //Landscape
                        parent.setAttribute("pagewidth", h);
                        parent.setAttribute("pageheight", w);
                    }
                    else { //Portrait or user size
                        parent.setAttribute("pagewidth", w);
                        parent.setAttribute("pageheight", h);
                    }
                }
                else {
                    if (vals.length == 3) {
                        parent.setAttribute(vals[0], vals[1] + "-" + vals[2]);
                    }
                    else
                        parent.setAttribute(vals[0], vals[1]);
                }
            }
        }
    }

    this.parse = function(text) {
        console.group("KiCad XML Parser");
        //this.text = text;
        var dt = document.implementation.createDocumentType("kicad_pcb", "", "http://kicad-pcb.org/help/file-formats/");
        this.doc = document.implementation.createDocument("", "kicad_pcb", dt);

        parseText(text, this.doc.documentElement);

        console.log("AmeenK", this.doc);
        console.groupEnd();

        return this.doc;
    };
}
