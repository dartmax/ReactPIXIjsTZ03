!function (a) {
  var b = function (b) {
    if (window.$ === a) throw"jQuery must be included to use cloudkid.UpdateChecker";
    b = b || 2;
    var c = localStorage.getItem("lastUpdateCheck") || 0;
    if (!(Date.now() - c <= 1e3 * b * 3600)) {
      this.repository = null, this.currentTag = null, this._destroyed = !1;
      var d = "package.json", e = this;
      $.getJSON(d, function (a) {
        if (!e._destroyed && a.repository && a.repository.url.search(/github\.com/) !== -1) {
          e.currentTag = a.version, e.repository = a.repository.url;
          var b = a.repository.url.replace("http:", "https:").replace("github.com", "api.github.com/repos") + "/releases";
          $.getJSON(b, e.onTagsLoaded)
        }
      }), this.onTagsLoaded = this.onTagsLoaded.bind(this)
    }
  }, c = b.prototype;
  c.onTagsLoaded = function (a) {
    if (!this._destroyed && (localStorage.setItem("lastUpdateCheck", Date.now()), a && Array.isArray(a) && 0 !== a.length)) {
      var b, c, d, e = require("semver"), f = a.length;
      for (b = 0; b < f; b++) if (c = a[b], d = c.tag_name, !c.prerelease && e.valid(d) && e.gt(d, this.currentTag)) {
        if (confirm("An update is available. Download now?")) {
          window.open(this.repository + "/releases/tag/" + d)
        }
        return
      }
    }
  }, c.destroy = function () {
    this._destroyed = !0
  }, namespace("cloudkid").UpdateChecker = b
}(), function (a) {
  var b, c = function () {
    if (b = this, window.$ === a) throw"jQuery must be included to use cloudkid.Browser";
    this.file = $('<input type="file" />').css("visibility", "hidden").change(function (a) {
      var c = $(this);
      c.removeAttr("accept");
      var d = c.val(), e = b._fileCallback;
      b._fileCallback = null, c.val(""), e(d)
    }), this.saveAs = $('<input type="file" nwsaveas />').css("visibility", "hidden").change(function (a) {
      var c = $(this);
      c.attr("nwsaveas", "");
      var d = c.val(), e = b._fileCallback;
      b._fileCallback = null, c.val(""), e(d)
    });
    var c = "webkitdirectory";
    this.folder = $('<input type="file" ' + c + " />").css("visibility", "hidden").change(function (a) {
      var c = $(this), d = c.val(), e = b._folderCallback;
      b._folderCallback = null, c.val(""), e(d)
    }), $("body").append(this.file, this.folder, this.saveAs), this._fileCallback = null, this._folderCallback = null
  }, d = c.prototype = {};
  c.init = function () {
    if (b) throw"Only once instance file created at once";
    return new c
  }, Object.defineProperty(c, "instance", {
    get: function () {
      return b
    }
  }), c.folder = function (a, c) {
    if (!b) throw"Call cloudkid.Browser.init() first";
    b.folder.removeAttr("nwworkingdir"), b._folderCallback = a, b.folder.trigger("click")
  }, c.file = function (a, c, d) {
    if (!b) throw"Call cloudkid.Browser.init() first";
    b.file.removeAttr("accept"), c && b.file.attr("accept", c), b._fileCallback = a, b.file.trigger("click")
  }, c.saveAs = function (a, c, d) {
    if (!b) throw"Call cloudkid.Browser.init() first";
    b.saveAs.attr("nwsaveas", c || ""), b._fileCallback = a, b.saveAs.trigger("click")
  }, c.destroy = function () {
    b && b.destroy()
  }, d.destroy = function () {
    this.file.off("change").remove(), this.folder.off("change").remove(), this.saveAs.off("change").remove(), this.file = null, this.folder = null, this.saveAs = null, b = null
  }, namespace("cloudkid").Browser = c
}(), function (a, b) {
  a.cloudkid = a.cloudkid || {};
  var c = function (b) {
    this.updater = null, this.browser = null, this.gui = null, this.main = null, this.resizable = !0, this.packageData = null;
    a.onerror = this._handleErrors.bind(this)
  }, d = c.prototype;
  d._handleErrors = function (a) {
    alert(a)
  }, d._onClose = function () {
    var a = this.main, b = this.gui, c = {x: a.x, y: a.y};
    this.resizable && (c.width = a.width, c.height = a.height), localStorage.setItem("windowSettings", JSON.stringify(c)), a.hide(), this.browser && (this.browser.destroy(), this.browser = null), this.updater && (this.updater.destroy(), this.updater = null), this.close(), b.App.closeAllWindows(), b.App.quit()
  }, d.close = function () {
  }, namespace("cloudkid").NodeWebkitApp = c
}(window), function ($) {
  var EventDispatcher = include("springroll.EventDispatcher"), EditorInterface = function (a) {
    EventDispatcher.call(this), this.spawnTypes = a;
    for (var b = ["alphaStart", "alphaEnd", "scaleStart", "scaleEnd", "minimumScaleMultiplier", "colorStart", "colorEnd", "speedStart", "speedEnd", "minimumSpeedMultiplier", "accelX", "accelY", "maxSpeed", "startRotationMin", "startRotationMax", "partNoRotation", "rotationSpeedMin", "rotationSpeedMax", "lifeMin", "lifeMax", "blendMode", "customEase", "subclass", "extraData", "emitFrequency", "emitLifetime", "emitMaxParticles", "emitSpawnPosX", "emitSpawnPosY", "emitAddAtBack", "emitSpawnType", "emitRectX", "emitRectY", "emitRectW", "emitRectH", "emitCircleX", "emitCircleY", "emitCircleR", "emitRingX", "emitRingY", "emitRingR", "emitRingMinR", "emitParticlesPerWave", "emitParticleSpacing", "emitAngleStart", "defaultConfigSelector", "defaultImageSelector", "configUpload", "configPaste", "imageUpload", "imageDialog", "imageList", "refresh", "loadConfig", "downloadConfig", "configDialog", "configConfirm", "imageConfirm", "addImage", "stageColor", "content", "renderer"], c = 0; c < b.length; c++) this[b[c]] = $("#" + b[c]);
    this.downloadConfig.click(this.download.bind(this)), this.init()
  }, p = extend(EditorInterface, EventDispatcher);
  p.changed = function () {
    this.trigger("change")
  }, p.init = function () {
    var a = this, b = (springroll.Application.instance, this.changed.bind(this));
    $("[data-toggle='tooltip']").tooltip({
      container: "body",
      animation: !1
    }), this.alphaStart.slider().data("slider").on("slide", b), this.alphaEnd.slider().data("slider").on("slide", b), $(".spinner").each(function () {
      $(this).TouchSpin({
        verticalbuttons: !0,
        min: void 0 !== $(this).attr("data-min") ? parseFloat($(this).attr("data-min")) : -1e6,
        max: void 0 !== $(this).attr("data-max") ? parseFloat($(this).attr("data-max")) : 1e6,
        step: parseFloat($(this).attr("data-step")) || 1,
        decimals: void 0 !== $(this).attr("data-decimals") ? parseFloat($(this).attr("data-decimals")) : 1,
        forcestepdivisibility: "none"
      })
    }), $(".bootstrap-touchspin-prefix, bootstrap-touchspin-postfix").remove(), $(".checkbox").change(b), $(".spinner").change(function () {
      $(this).val($(this).val().replace(/[^0-9.-]/g, "")), b()
    }), $(".colorPicker").each(function () {
      $(this).minicolors({
        control: "hue",
        defaultValue: "",
        inline: !1,
        letterCase: "lowercase",
        position: "top right",
        change: function (a, c) {
          a && b()
        },
        theme: "bootstrap"
      })
    }), this.configDialog.on("show.bs.modal", function () {
      a.defaultConfigSelector.find("option:contains('-Default Emitters-')").prop("selected", !0), a.configUpload.wrap("<form>").parent("form").trigger("reset"), a.configUpload.unwrap(), a.configPaste.val("")
    }), this.imageDialog.on("show.bs.modal", function () {
      a.defaultImageSelector.find("option:contains('-Default Images-')").prop("selected", !0), a.imageUpload.wrap("<form>").parent("form").trigger("reset"), a.imageUpload.unwrap()
    }), this.renderer.find("input").on("change", function () {
      a.trigger("renderer", this.value), b()
    }), this.blendMode.on("change", b), this.customEase.on("input", b), this.subclass.on("change", b), this.extraData.on("input", b);
    var c = this.spawnTypes;
    this.emitSpawnType.change(function (b) {
      for (var d = a.emitSpawnType.val(), e = 0; e < c.length; ++e) c[e] == d ? $(".settings-" + c[e]).show() : $(".settings-" + c[e]).hide()
    }), this.stageColor.change(function (b) {
      var c = a.stageColor.val(), d = c.replace(/[^abcdef0-9]/gi, "");
      d != c && a.stageColor.val(d), 6 == d.length && a.trigger("stageColor", d)
    })
  }, p.set = function (a) {
    this.alphaStart.data("slider").setValue(a.alpha ? a.alpha.start : 1), this.alphaEnd.data("slider").setValue(a.alpha ? a.alpha.end : 1), this.scaleStart.val(a.scale ? a.scale.start : 1), this.scaleEnd.val(a.scale ? a.scale.end : 1), this.minimumScaleMultiplier.val(a.scale ? a.scale.minimumScaleMultiplier || 1 : 1), this.colorStart.minicolors("value", a.color ? a.color.start : "FFFFFF"), this.colorEnd.minicolors("value", a.color ? a.color.end : "FFFFFF"), this.speedStart.val(a.speed ? a.speed.start : 0), this.speedEnd.val(a.speed ? a.speed.end : 0), this.minimumSpeedMultiplier.val(a.speed ? a.speed.minimumSpeedMultiplier || 1 : 1), this.accelX.val(a.acceleration ? a.acceleration.x : 0), this.accelY.val(a.acceleration ? a.acceleration.y : 0), this.maxSpeed.val(a.maxSpeed ? a.maxSpeed : 0), this.partNoRotation.val(!!a.noRotation), this.startRotationMin.val(a.startRotation ? a.startRotation.min : 0), this.startRotationMax.val(a.startRotation ? a.startRotation.max : 0), this.rotationSpeedMin.val(a.rotationSpeed ? a.rotationSpeed.min : 0), this.rotationSpeedMax.val(a.rotationSpeed ? a.rotationSpeed.max : 0), this.lifeMin.val(a.lifetime ? a.lifetime.min : 1), this.lifeMax.val(a.lifetime ? a.lifetime.max : 1), this.customEase.val(a.ease ? JSON.stringify(a.ease) : ""), this.extraData.val(a.extraData ? JSON.stringify(a.extraData, null, "\t") : "");
    var b;
    if (a.blendMode && PIXI.particles.ParticleUtils.getBlendMode(a.blendMode)) for (b = a.blendMode.toLowerCase(); b.indexOf(" ") >= 0;) b = b.replace("_"); else b = "normal";
    this.blendMode.find("option[value='" + b + "']").prop("selected", !0), this.subclass.find("option[value='default']").prop("selected", !0), this.emitFrequency.val(parseFloat(a.frequency) > 0 ? parseFloat(a.frequency) : .5), this.emitLifetime.val(a.emitterLifetime || -1), this.emitMaxParticles.val(a.maxParticles || 1e3), this.emitSpawnPosX.val(a.pos ? a.pos.x : 0), this.emitSpawnPosY.val(a.pos ? a.pos.y : 0), this.emitAddAtBack.prop("checked", !!a.addAtBack);
    var c = a.spawnType, d = this.spawnTypes;
    d.indexOf(c) == -1 && (c = d[0]), this.emitSpawnType.find("option[value='" + c + "']").prop("selected", !0);
    for (var e = 0; e < d.length; ++e) d[e] == c ? $(".settings-" + d[e]).show() : $(".settings-" + d[e]).hide();
    this.emitRectX.val(a.spawnRect ? a.spawnRect.x : 0), this.emitRectY.val(a.spawnRect ? a.spawnRect.y : 0), this.emitRectW.val(a.spawnRect ? a.spawnRect.w : 0), this.emitRectH.val(a.spawnRect ? a.spawnRect.h : 0), this.emitCircleX.val(a.spawnCircle ? a.spawnCircle.x : 0), this.emitCircleY.val(a.spawnCircle ? a.spawnCircle.y : 0), this.emitCircleR.val(a.spawnCircle ? a.spawnCircle.r : 0), this.emitRingX.val(a.spawnCircle ? a.spawnCircle.x : 0), this.emitRingY.val(a.spawnCircle ? a.spawnCircle.y : 0), this.emitRingR.val(a.spawnCircle ? a.spawnCircle.r : 0), this.emitRingMinR.val(a.spawnCircle ? a.spawnCircle.minR : 0), this.emitParticlesPerWave.val(a.particlesPerWave > 0 ? a.particlesPerWave : 1), this.emitParticleSpacing.val(a.particleSpacing ? a.particleSpacing : 0), this.emitAngleStart.val(a.angleStart ? a.angleStart : 0)
  }, p.get = function () {
    var output = {}, start = parseFloat(this.alphaStart.data("slider").getValue()),
      end = parseFloat(this.alphaEnd.data("slider").getValue());
    output.alpha = {
      start: start == start ? start : 1,
      end: end == end ? end : 1
    }, output.scale = {
      start: parseFloat(this.scaleStart.val()) || 1,
      end: parseFloat(this.scaleEnd.val()) || 1,
      minimumScaleMultiplier: parseFloat(this.minimumScaleMultiplier.val()) || 1
    }, output.color = {
      start: this.colorStart.val() || "#ffffff",
      end: this.colorEnd.val() || "#ffffff"
    }, output.speed = {
      start: parseFloat(this.speedStart.val()) || 0,
      end: parseFloat(this.speedEnd.val()) || 0,
      minimumSpeedMultiplier: parseFloat(this.minimumSpeedMultiplier.val()) || 1
    }, output.acceleration = {
      x: parseFloat(this.accelX.val() || 0),
      y: parseFloat(this.accelY.val() || 0)
    }, output.maxSpeed = parseFloat(this.maxSpeed.val()) || 0, output.startRotation = {
      min: parseFloat(this.startRotationMin.val()) || 0,
      max: parseFloat(this.startRotationMax.val()) || 0
    }, output.noRotation = this.partNoRotation.prop("checked"), output.rotationSpeed = {
      min: parseFloat(this.rotationSpeedMin.val()) || 0,
      max: parseFloat(this.rotationSpeedMax.val()) || 0
    }, output.lifetime = {
      min: parseFloat(this.lifeMin.val()) || 1,
      max: parseFloat(this.lifeMax.val()) || 1
    }, output.blendMode = this.blendMode.val();
    var val = this.customEase.val();
    if (val) try {
      eval("val = " + val + ";"), val && val instanceof Array && (output.ease = val)
    } catch (e) {
      Debug.error("Error evaluating easing data: " + e.message)
    }
    if (val = this.extraData.val()) try {
      eval("val = " + val + ";"), val && (output.extraData = val)
    } catch (e) {
    }
    var frequency = this.emitFrequency.val();
    output.frequency = parseFloat(frequency) > 0 ? parseFloat(frequency) : .5, output.emitterLifetime = parseFloat(this.emitLifetime.val()) || -1, output.maxParticles = parseInt(this.emitMaxParticles.val()) || 1e3, output.pos = {
      x: parseFloat(this.emitSpawnPosX.val() || 0),
      y: parseFloat(this.emitSpawnPosY.val() || 0)
    }, output.addAtBack = this.emitAddAtBack.prop("checked");
    var spawnType = output.spawnType = this.emitSpawnType.val();
    return "rect" == spawnType ? output.spawnRect = {
      x: parseFloat(this.emitRectX.val()) || 0,
      y: parseFloat(this.emitRectY.val()) || 0,
      w: parseFloat(this.emitRectW.val()) || 0,
      h: parseFloat(this.emitRectH.val()) || 0
    } : "circle" == spawnType ? output.spawnCircle = {
      x: parseFloat(this.emitCircleX.val()) || 0,
      y: parseFloat(this.emitCircleY.val()) || 0,
      r: parseFloat(this.emitCircleR.val()) || 0
    } : "ring" == spawnType ? output.spawnCircle = {
      x: parseFloat(this.emitRingX.val()) || 0,
      y: parseFloat(this.emitRingY.val()) || 0,
      r: parseFloat(this.emitRingR.val()) || 0,
      minR: parseFloat(this.emitRingMinR.val()) || 0
    } : "burst" == spawnType && (output.particlesPerWave = parseInt(this.emitParticlesPerWave.val()) || 1, output.particleSpacing = parseFloat(this.emitParticleSpacing.val()) || 0, output.angleStart = parseFloat(this.emitAngleStart.val()) || 0), output
  }, p.getParticleClass = function () {
    return this.subclass.val()
  }, p.download = function () {
    var a = JSON.stringify(this.get(), null, "\t"), b = "data:application/json;charset=utf-8", c = !1;
    try {
      c = !!new Blob
    } catch (d) {
    }
    c ? window.saveAs(new Blob([a], {type: b}), "emitter.json") : window.open(encodeURI(b + "," + a))
  }, namespace("pixiparticles").EditorInterface = EditorInterface
}(jQuery), function () {
  function init() {
    jqImageDiv = $(".particleImage"), jqImageDiv.remove(), particleCountDiv = document.getElementById("particleCount");
    var a = parseInt(SavedData.read("stageColor") || "999999", 16);
    backgroundSprite = new Sprite(Texture.fromImage("assets/images/bg.png")), backgroundSprite.tint = a, emitterContainer = new Container;
    var b = {clearView: !0, backgroundColor: a};
    this.webgl = this.addDisplay("webgl", PixiDisplay, b), this.webgl.isWebGL ? (b.forceContext = "canvas2d", this.canvas2d = this.addDisplay("canvas2d", PixiDisplay, b)) : (this.canvas2d = this.webgl, this.webgl = null, document.getElementById("webglRenderer").disabled = !0, document.getElementById("canvas2dRenderer").checked = !0), this.setRenderer(this.webgl ? "webgl" : "canvas2d"), backgroundSprite.scale.x = .1 * this.canvas2d.width, backgroundSprite.scale.y = .1 * this.canvas2d.height, this.on("resize", this.onResize)
  }

  var Texture = include("PIXI.Texture"), Sprite = include("PIXI.Sprite"), Container = include("PIXI.Container"),
    Point = include("PIXI.Point"), Graphics = include("PIXI.Graphics"), Emitter = include("PIXI.particles.Emitter"),
    PixiDisplay = include("springroll.PixiDisplay"), Application = include("springroll.Application"),
    SavedData = include("springroll.SavedData"), Browser = include("cloudkid.Browser"),
    EditorInterface = include("pixiparticles.EditorInterface"), Editor = function (a) {
      a.configPath = "assets/config/config.json", Application.call(this, a), this.onMouseIn = this.onMouseIn.bind(this), this.onMouseOut = this.onMouseOut.bind(this), this.onMouseMove = this.onMouseMove.bind(this), this.onMouseUp = this.onMouseUp.bind(this), this.loadFromUI = this.loadFromUI.bind(this), this.once("init", init.bind(this)), this.once("loaded", this.onInitialized.bind(this))
    }, p = extend(Editor, Application), stage, interaction, backgroundSprite, emitter, emitterContainer,
    emitterEnableTimer = 0, particleDefaults = {}, particleDefaultImages = {}, particleDefaultImageUrls = {},
    jqImageDiv = null, particleCountDiv = null;
  p.onResize = function (a, b) {
    backgroundSprite.scale.x = .1 * a, backgroundSprite.scale.y = .1 * b
  }, p.onInitialized = function () {
    $("body").removeClass("loading"), this.ui = new EditorInterface(this.config.spawnTypes), this.ui.refresh.click(this.loadFromUI), this.ui.configConfirm.on("click", this.loadConfig.bind(this)), this.ui.imageConfirm.on("click", this.loadImage.bind(this)), this.ui.stageColor.minicolors("value", SavedData.read("stageColor") || "999999"), this.ui.on({
      change: this.loadFromUI,
      renderer: this.setRenderer.bind(this),
      stageColor: this.stageColor.bind(this)
    });
    for (var a, b = [], c = [], d = 0; d < this.config.emitters.length; d++) a = this.config.emitters[d], b.push({
      id: a.id,
      src: a.config,
      complete: this.onConfigLoaded
    });
    for (var e in this.config.images) c.push(this.config.images[e]), b.push({
      id: e,
      type: "pixi",
      image: this.config.images[e],
      cache: !0
    });
    var f;
    try {
      f = SavedData.read("customImages")
    } catch (g) {
    }
    if (f) for (d = 0; d < f.length; d++) 0 !== f[d].indexOf("data:") && c.indexOf(f[d]) == -1 && (c.push(f[d]), b.push({
      id: f[d],
      type: "pixi",
      image: f[d],
      cache: !0
    }));
    this.load(b, this._onCompletedLoad.bind(this))
  }, p.onConfigLoaded = function (a, b) {
    particleDefaults[b.id] = a
  }, p._onCompletedLoad = function (a) {
    var b, c, d, e, f = this.config.images;
    for (e = 0; e < this.config.emitters.length; e++) {
      b = this.config.emitters[e], d = b.id, particleDefaultImageUrls[d] = [], particleDefaultImages[d] = [];
      for (var g = 0; g < b.images.length; g++) c = b.images[g], particleDefaultImageUrls[d].push(f[c]), particleDefaultImages[d].push(this.getCache(c))
    }
    emitter = new Emitter(emitterContainer), window.emitter = emitter;
    var h, i = window.location.hash.replace("#", "");
    try {
      h = SavedData.read("customConfig"), f = SavedData.read("customImages")
    } catch (j) {
    }
    if (i) this.loadDefault(i); else if (h && f) for (this.loadSettings(getTexturesFromUrls(f), h), this.setConfig(h), e = 0; e < f.length; ++e) this.addImage(f[e]); else this.loadDefault(this.config["default"]);
    this.on({resize: this._centerEmitter.bind(this), update: this.update.bind(this)})
  }, p.stageColor = function (a) {
    SavedData.write("stageColor", a), backgroundSprite.tint = parseInt(a, 16)
  }, p.setRenderer = function (a) {
    if ("webgl" != a || this.webgl) {
      var b = "webgl" == a ? this.canvas2d : this.webgl;
      b && (b.enabled = b.visible = !1);
      var c = this[a];
      interaction && (interaction.off("stageup", this.onMouseUp), interaction.off("stagein", this.onMouseIn), interaction.off("stageout", this.onMouseOut), interaction.off("stagemove", this.onMouseMove)), stage = c.stage, interaction = c.renderer.plugins.interaction, interaction.on("stageup", this.onMouseUp), interaction.on("stagein", this.onMouseIn), interaction.on("stageout", this.onMouseOut), c.enabled = c.visible = !0, backgroundSprite && stage.addChild(backgroundSprite), emitterContainer && stage.addChild(emitterContainer)
    }
  }, p.loadDefault = function (a) {
    a && particleDefaultImageUrls[a] || (a = trail), window.location.hash = "#" + a, this.ui.imageList.children().remove();
    for (var b = particleDefaultImageUrls[a], c = 0; c < b.length; ++c) this.addImage(b[c]);
    this.loadSettings(particleDefaultImages[a], particleDefaults[a]), this.setConfig(particleDefaults[a])
  }, p.setConfig = function (a) {
    this.ui.off("change"), this.ui.set(a), this.ui.on("change", this.loadFromUI)
  };
  var getTexturesFromUrls = function (a) {
    for (var b = [], c = 0; c < a.length; ++c) b[c] = Texture.fromImage(a[c]);
    return b
  };
  p.loadConfig = function (event) {
    var ui = this.ui, type, value, success = !1;
    if ("-Default Emitters-" != ui.defaultConfigSelector.val() ? type = "default" : ui.configPaste.val() ? type = "paste" : ui.configUpload[0].files.length > 0 && (type = "upload"), "default" == type) value = ui.defaultConfigSelector.val(), "-Default Emitters-" != value && (success = !0, this.loadDefault(value)); else if ("paste" == type) {
      value = ui.configPaste.val();
      try {
        eval("var obj = " + elem.val() + ";"), success = !0, this.setConfig(obj), this.loadFromUI()
      } catch (e) {
      }
    } else if ("upload" == type) {
      var files = ui.configUpload[0].files, scope = this, onloadend = function (readerObj) {
        try {
          eval("var obj = " + readerObj.result + ";"), scope.setConfig(obj), scope.loadFromUI()
        } catch (e) {
        }
      }, file = files[0], reader = new FileReader;
      reader.onloadend = onloadend.bind(this, reader), reader.readAsText(file), success = !0
    }
    success && ui.configDialog.modal("hide")
  }, p.loadImage = function (a) {
    var b, c, d = this.ui, e = !1;
    if ("-Default Images-" != d.defaultImageSelector.val() ? b = "select" : d.imageUpload[0].files.length > 0 && (b = "upload"), "select" == b) c = d.defaultImageSelector.val(), "-Default Images-" != c && (e = !0, this.addImage(c), this.loadFromUI()); else if ("upload" == b) {
      for (var f = function (a) {
        this.addImage(a.result), this.loadFromUI()
      }, g = d.imageUpload[0].files, h = 0; h < g.length; h++) {
        var i = g[h], j = new FileReader;
        j.onloadend = f.bind(this, j), j.readAsDataURL(i)
      }
      e = !0
    }
    e && d.imageDialog.modal("hide")
  }, p.addImage = function (a) {
    var b = jqImageDiv.clone();
    b.children("img").prop("src", a), this.ui.imageList.append(b), b.children(".remove").click(removeImage.bind(this)), b.children(".download").click(downloadImage)
  };
  var downloadImage = function (a) {
    var b = $(a.delegateTarget).siblings("img").prop("src");
    window.open(b)
  }, removeImage = function (a) {
    $(a.delegateTarget).parent().remove(), this.loadFromUI()
  };
  p.loadFromUI = function () {
    window.location.hash = "";
    var a = this.ui.get(), b = this.getTexturesFromImageList(), c = this.getParticleClass();
    SavedData.write("customConfig", a), this.loadSettings(b, a, c)
  }, p.getParticleClass = function () {
    var a = this.ui.getParticleClass();
    switch (a) {
      case"path":
        return PIXI.particles.PathParticle;
      case"anim":
        return PIXI.particles.AnimatedParticle;
      default:
        return PIXI.particles.Particle
    }
  }, p.getTexturesFromImageList = function () {
    var a = [], b = this.ui.imageList.find("img");
    if (0 === b.length) return null;
    return b.each(function () {
      a.push(this.src)
    }), SavedData.write("customImages", a), getTexturesFromUrls(a)
  }, p.loadSettings = function (a, b, c) {
    emitter && (emitter.init(a, b), c || (c = PIXI.particles.Particle), emitter.particleConstructor = c, this._centerEmitter(), emitterEnableTimer = 0)
  }, p.update = function (a) {
    emitter && (emitter.update(.001 * a), !emitter.emit && emitterEnableTimer <= 0 ? emitterEnableTimer = 1e3 + 1e3 * emitter.maxLifetime : emitterEnableTimer > 0 && (emitterEnableTimer -= a, emitterEnableTimer <= 0 && (emitter.emit = !0)), particleCountDiv.innerHTML = emitter.particleCount + " Particles")
  }, p.onMouseUp = function () {
    emitter && (emitter.resetPositionTracking(), emitter.emit = !0, emitterEnableTimer = 0)
  }, p.onMouseIn = function () {
    emitter && (interaction.on("stagemove", this.onMouseMove), emitter.resetPositionTracking())
  }, p._centerEmitter = function () {
    emitter && emitter.ownerPos && emitter.updateOwnerPos(this.display.canvas.width / 2, this.display.canvas.height / 2)
  }, p.onMouseOut = function () {
    emitter && (interaction.off("stagemove", this.onMouseMove), this._centerEmitter(), emitter.resetPositionTracking())
  }, p.onMouseMove = function (a) {
    if (emitter) {
      var b = a.data;
      emitter.updateOwnerPos(b.global.x, b.global.y)
    }
  }, namespace("pixiparticles").Editor = Editor
}(), function () {
  var a = include("cloudkid.NodeWebkitApp"), b = include("pixiparticles.Editor"),
    c = (include("pixiparticles.Menu", !1), include("cloudkid.Browser"), function () {
      a.apply(this), this.editor = new b({
        framerate: "framerate",
        fps: 60,
        raf: !0,
        debug: !1,
        resizeElement: "content",
        uniformResize: !1,
        responsive: !0
      }), !function (a, b, c, d, e, f, g) {
        a.GoogleAnalyticsObject = e, a[e] = a[e] || function () {
          (a[e].q = a[e].q || []).push(arguments)
        }, a[e].l = 1 * new Date, f = b.createElement(c), g = b.getElementsByTagName(c)[0], f.async = 1, f.src = d, g.parentNode.insertBefore(f, g)
      }(window, document, "script", "//www.google-analytics.com/analytics.js", "ga"), ga("create", "UA-54925270-1", "auto"), ga("send", "pageview")
    });
  extend(c, a), namespace("pixiparticles").App = c, window.app = new c
}();