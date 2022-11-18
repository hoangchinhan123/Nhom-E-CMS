/* ========================================================================
 * Bootstrap: affix.js v3.3.6
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.6'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = Math.max($(document).height(), $(document.body).height())

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.6
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.6'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.6
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.6'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget))
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger($.Event('shown.bs.dropdown', relatedTarget))
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.6
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options             = options
    this.$body               = $(document.body)
    this.$element            = $(element)
    this.$dialog             = this.$element.find('.modal-dialog')
    this.$backdrop           = null
    this.isShown             = null
    this.originalBodyPad     = null
    this.scrollbarWidth      = 0
    this.ignoreBackdropClick = false

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.6'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
      })
    })

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element.addClass('in')

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$dialog // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .off('click.dismiss.bs.modal')
      .off('mouseup.dismiss.bs.modal')

    this.$dialog.off('mousedown.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $(document.createElement('div'))
        .addClass('modal-backdrop ' + animate)
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false
          return
        }
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus()
          : this.hide()
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog()
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect()
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    this.originalBodyPad = document.body.style.paddingRight || ''
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad)
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.6
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.$element   = null
    this.inState    = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.6'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
    this.inState   = { click: false, hover: false, focus: false }

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in'
      return
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true
    }

    return false
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
    }

    if (self.isInStateTrue()) return

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
      this.$element.trigger('inserted.bs.' + this.type)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var viewportDim = this.getPosition(this.$viewport)

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  += marginTop
    offset.left += marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = $(this.$tip)
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element
        .removeAttr('aria-describedby')
        .trigger('hidden.bs.' + that.type)
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && $tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset()
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template)
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
      }
    }
    return this.$tip
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    if (e) {
      self.inState.click = !self.inState.click
      if (self.isInStateTrue()) self.enter(self)
      else self.leave(self)
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
      if (that.$tip) {
        that.$tip.detach()
      }
      that.$tip = null
      that.$arrow = null
      that.$viewport = null
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.6
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  Tab.VERSION = '3.3.6'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

(function() {
  var $, AbstractChosen, Chosen, SelectParser, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  SelectParser = (function() {
    function SelectParser() {
      this.options_index = 0;
      this.parsed = [];
    }

    SelectParser.prototype.add_node = function(child) {
      if (child.nodeName.toUpperCase() === "OPTGROUP") {
        return this.add_group(child);
      } else {
        return this.add_option(child);
      }
    };

    SelectParser.prototype.add_group = function(group) {
      var group_position, option, _i, _len, _ref, _results;
      group_position = this.parsed.length;
      this.parsed.push({
        array_index: group_position,
        group: true,
        label: this.escapeExpression(group.label),
        title: group.title ? group.title : void 0,
        children: 0,
        disabled: group.disabled,
        classes: group.className
      });
      _ref = group.childNodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        _results.push(this.add_option(option, group_position, group.disabled));
      }
      return _results;
    };

    SelectParser.prototype.add_option = function(option, group_position, group_disabled) {
      if (option.nodeName.toUpperCase() === "OPTION") {
        if (option.text !== "") {
          if (group_position != null) {
            this.parsed[group_position].children += 1;
          }
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            value: option.value,
            text: option.text,
            html: option.innerHTML,
            title: option.title ? option.title : void 0,
            selected: option.selected,
            disabled: group_disabled === true ? group_disabled : option.disabled,
            group_array_index: group_position,
            group_label: group_position != null ? this.parsed[group_position].label : null,
            classes: option.className,
            style: option.style.cssText
          });
        } else {
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            empty: true
          });
        }
        return this.options_index += 1;
      }
    };

    SelectParser.prototype.escapeExpression = function(text) {
      var map, unsafe_chars;
      if ((text == null) || text === false) {
        return "";
      }
      if (!/[\&\<\>\"\'\`]/.test(text)) {
        return text;
      }
      map = {
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "`": "&#x60;"
      };
      unsafe_chars = /&(?!\w+;)|[\<\>\"\'\`]/g;
      return text.replace(unsafe_chars, function(chr) {
        return map[chr] || "&amp;";
      });
    };

    return SelectParser;

  })();

  SelectParser.select_to_array = function(select) {
    var child, parser, _i, _len, _ref;
    parser = new SelectParser();
    _ref = select.childNodes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      parser.add_node(child);
    }
    return parser.parsed;
  };

  AbstractChosen = (function() {
    function AbstractChosen(form_field, options) {
      this.form_field = form_field;
      this.options = options != null ? options : {};
      if (!AbstractChosen.browser_is_supported()) {
        return;
      }
      this.is_multiple = this.form_field.multiple;
      this.set_default_text();
      this.set_default_values();
      this.setup();
      this.set_up_html();
      this.register_observers();
      this.on_ready();
    }

    AbstractChosen.prototype.set_default_values = function() {
      var _this = this;
      this.click_test_action = function(evt) {
        return _this.test_active_click(evt);
      };
      this.activate_action = function(evt) {
        return _this.activate_field(evt);
      };
      this.active_field = false;
      this.mouse_on_container = false;
      this.results_showing = false;
      this.result_highlighted = null;
      this.allow_single_deselect = (this.options.allow_single_deselect != null) && (this.form_field.options[0] != null) && this.form_field.options[0].text === "" ? this.options.allow_single_deselect : false;
      this.disable_search_threshold = this.options.disable_search_threshold || 0;
      this.disable_search = this.options.disable_search || false;
      this.enable_split_word_search = this.options.enable_split_word_search != null ? this.options.enable_split_word_search : true;
      this.group_search = this.options.group_search != null ? this.options.group_search : true;
      this.search_contains = this.options.search_contains || false;
      this.single_backstroke_delete = this.options.single_backstroke_delete != null ? this.options.single_backstroke_delete : true;
      this.max_selected_options = this.options.max_selected_options || Infinity;
      this.inherit_select_classes = this.options.inherit_select_classes || false;
      this.display_selected_options = this.options.display_selected_options != null ? this.options.display_selected_options : true;
      this.display_disabled_options = this.options.display_disabled_options != null ? this.options.display_disabled_options : true;
      this.include_group_label_in_selected = this.options.include_group_label_in_selected || false;
      return this.max_shown_results = this.options.max_shown_results || Number.POSITIVE_INFINITY;
    };

    AbstractChosen.prototype.set_default_text = function() {
      if (this.form_field.getAttribute("data-placeholder")) {
        this.default_text = this.form_field.getAttribute("data-placeholder");
      } else if (this.is_multiple) {
        this.default_text = this.options.placeholder_text_multiple || this.options.placeholder_text || AbstractChosen.default_multiple_text;
      } else {
        this.default_text = this.options.placeholder_text_single || this.options.placeholder_text || AbstractChosen.default_single_text;
      }
      return this.results_none_found = this.form_field.getAttribute("data-no_results_text") || this.options.no_results_text || AbstractChosen.default_no_result_text;
    };

    AbstractChosen.prototype.choice_label = function(item) {
      if (this.include_group_label_in_selected && (item.group_label != null)) {
        return "<b class='group-name'>" + item.group_label + "</b>" + item.html;
      } else {
        return item.html;
      }
    };

    AbstractChosen.prototype.mouse_enter = function() {
      return this.mouse_on_container = true;
    };

    AbstractChosen.prototype.mouse_leave = function() {
      return this.mouse_on_container = false;
    };

    AbstractChosen.prototype.input_focus = function(evt) {
      var _this = this;
      if (this.is_multiple) {
        if (!this.active_field) {
          return setTimeout((function() {
            return _this.container_mousedown();
          }), 50);
        }
      } else {
        if (!this.active_field) {
          return this.activate_field();
        }
      }
    };

    AbstractChosen.prototype.input_blur = function(evt) {
      var _this = this;
      if (!this.mouse_on_container) {
        this.active_field = false;
        return setTimeout((function() {
          return _this.blur_test();
        }), 100);
      }
    };

    AbstractChosen.prototype.results_option_build = function(options) {
      var content, data, data_content, shown_results, _i, _len, _ref;
      content = '';
      shown_results = 0;
      _ref = this.results_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        data = _ref[_i];
        data_content = '';
        if (data.group) {
          data_content = this.result_add_group(data);
        } else {
          data_content = this.result_add_option(data);
        }
        if (data_content !== '') {
          shown_results++;
          content += data_content;
        }
        if (options != null ? options.first : void 0) {
          if (data.selected && this.is_multiple) {
            this.choice_build(data);
          } else if (data.selected && !this.is_multiple) {
            this.single_set_selected_text(this.choice_label(data));
          }
        }
        if (shown_results >= this.max_shown_results) {
          break;
        }
      }
      return content;
    };

    AbstractChosen.prototype.result_add_option = function(option) {
      var classes, option_el;
      if (!option.search_match) {
        return '';
      }
      if (!this.include_option_in_results(option)) {
        return '';
      }
      classes = [];
      if (!option.disabled && !(option.selected && this.is_multiple)) {
        classes.push("active-result");
      }
      if (option.disabled && !(option.selected && this.is_multiple)) {
        classes.push("disabled-result");
      }
      if (option.selected) {
        classes.push("result-selected");
      }
      if (option.group_array_index != null) {
        classes.push("group-option");
      }
      if (option.classes !== "") {
        classes.push(option.classes);
      }
      option_el = document.createElement("li");
      option_el.className = classes.join(" ");
      option_el.style.cssText = option.style;
      option_el.setAttribute("data-option-array-index", option.array_index);
      option_el.innerHTML = option.search_text;
      if (option.title) {
        option_el.title = option.title;
      }
      return this.outerHTML(option_el);
    };

    AbstractChosen.prototype.result_add_group = function(group) {
      var classes, group_el;
      if (!(group.search_match || group.group_match)) {
        return '';
      }
      if (!(group.active_options > 0)) {
        return '';
      }
      classes = [];
      classes.push("group-result");
      if (group.classes) {
        classes.push(group.classes);
      }
      group_el = document.createElement("li");
      group_el.className = classes.join(" ");
      group_el.innerHTML = group.search_text;
      if (group.title) {
        group_el.title = group.title;
      }
      return this.outerHTML(group_el);
    };

    AbstractChosen.prototype.results_update_field = function() {
      this.set_default_text();
      if (!this.is_multiple) {
        this.results_reset_cleanup();
      }
      this.result_clear_highlight();
      this.results_build();
      if (this.results_showing) {
        return this.winnow_results();
      }
    };

    AbstractChosen.prototype.reset_single_select_options = function() {
      var result, _i, _len, _ref, _results;
      _ref = this.results_data;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        result = _ref[_i];
        if (result.selected) {
          _results.push(result.selected = false);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    AbstractChosen.prototype.results_toggle = function() {
      if (this.results_showing) {
        return this.results_hide();
      } else {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.results_search = function(evt) {
      if (this.results_showing) {
        return this.winnow_results();
      } else {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.winnow_results = function() {
      var escapedSearchText, option, regex, results, results_group, searchText, startpos, text, zregex, _i, _len, _ref;
      this.no_results_clear();
      results = 0;
      searchText = this.get_search_text();
      escapedSearchText = searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      zregex = new RegExp(escapedSearchText, 'i');
      regex = this.get_search_regex(escapedSearchText);
      _ref = this.results_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        option.search_match = false;
        results_group = null;
        if (this.include_option_in_results(option)) {
          if (option.group) {
            option.group_match = false;
            option.active_options = 0;
          }
          if ((option.group_array_index != null) && this.results_data[option.group_array_index]) {
            results_group = this.results_data[option.group_array_index];
            if (results_group.active_options === 0 && results_group.search_match) {
              results += 1;
            }
            results_group.active_options += 1;
          }
          option.search_text = option.group ? option.label : option.html;
          if (!(option.group && !this.group_search)) {
            option.search_match = this.search_string_match(option.search_text, regex);
            if (option.search_match && !option.group) {
              results += 1;
            }
            if (option.search_match) {
              if (searchText.length) {
                startpos = option.search_text.search(zregex);
                text = option.search_text.substr(0, startpos + searchText.length) + '</em>' + option.search_text.substr(startpos + searchText.length);
                option.search_text = text.substr(0, startpos) + '<em>' + text.substr(startpos);
              }
              if (results_group != null) {
                results_group.group_match = true;
              }
            } else if ((option.group_array_index != null) && this.results_data[option.group_array_index].search_match) {
              option.search_match = true;
            }
          }
        }
      }
      this.result_clear_highlight();
      if (results < 1 && searchText.length) {
        this.update_results_content("");
        return this.no_results(searchText);
      } else {
        this.update_results_content(this.results_option_build());
        return this.winnow_results_set_highlight();
      }
    };

    AbstractChosen.prototype.get_search_regex = function(escaped_search_string) {
      var regex_anchor;
      regex_anchor = this.search_contains ? "" : "^";
      return new RegExp(regex_anchor + escaped_search_string, 'i');
    };

    AbstractChosen.prototype.search_string_match = function(search_string, regex) {
      var part, parts, _i, _len;
      if (regex.test(search_string)) {
        return true;
      } else if (this.enable_split_word_search && (search_string.indexOf(" ") >= 0 || search_string.indexOf("[") === 0)) {
        parts = search_string.replace(/\[|\]/g, "").split(" ");
        if (parts.length) {
          for (_i = 0, _len = parts.length; _i < _len; _i++) {
            part = parts[_i];
            if (regex.test(part)) {
              return true;
            }
          }
        }
      }
    };

    AbstractChosen.prototype.choices_count = function() {
      var option, _i, _len, _ref;
      if (this.selected_option_count != null) {
        return this.selected_option_count;
      }
      this.selected_option_count = 0;
      _ref = this.form_field.options;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        if (option.selected) {
          this.selected_option_count += 1;
        }
      }
      return this.selected_option_count;
    };

    AbstractChosen.prototype.choices_click = function(evt) {
      evt.preventDefault();
      if (!(this.results_showing || this.is_disabled)) {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.keyup_checker = function(evt) {
      var stroke, _ref;
      stroke = (_ref = evt.which) != null ? _ref : evt.keyCode;
      this.search_field_scale();
      switch (stroke) {
        case 8:
          if (this.is_multiple && this.backstroke_length < 1 && this.choices_count() > 0) {
            return this.keydown_backstroke();
          } else if (!this.pending_backstroke) {
            this.result_clear_highlight();
            return this.results_search();
          }
          break;
        case 13:
          evt.preventDefault();
          if (this.results_showing) {
            return this.result_select(evt);
          }
          break;
        case 27:
          if (this.results_showing) {
            this.results_hide();
          }
          return true;
        case 9:
        case 38:
        case 40:
        case 16:
        case 91:
        case 17:
        case 18:
          break;
        default:
          return this.results_search();
      }
    };

    AbstractChosen.prototype.clipboard_event_checker = function(evt) {
      var _this = this;
      return setTimeout((function() {
        return _this.results_search();
      }), 50);
    };

    AbstractChosen.prototype.container_width = function() {
      if (this.options.width != null) {
        return this.options.width;
      } else {
        return "" + this.form_field.offsetWidth + "px";
      }
    };

    AbstractChosen.prototype.include_option_in_results = function(option) {
      if (this.is_multiple && (!this.display_selected_options && option.selected)) {
        return false;
      }
      if (!this.display_disabled_options && option.disabled) {
        return false;
      }
      if (option.empty) {
        return false;
      }
      return true;
    };

    AbstractChosen.prototype.search_results_touchstart = function(evt) {
      this.touch_started = true;
      return this.search_results_mouseover(evt);
    };

    AbstractChosen.prototype.search_results_touchmove = function(evt) {
      this.touch_started = false;
      return this.search_results_mouseout(evt);
    };

    AbstractChosen.prototype.search_results_touchend = function(evt) {
      if (this.touch_started) {
        return this.search_results_mouseup(evt);
      }
    };

    AbstractChosen.prototype.outerHTML = function(element) {
      var tmp;
      if (element.outerHTML) {
        return element.outerHTML;
      }
      tmp = document.createElement("div");
      tmp.appendChild(element);
      return tmp.innerHTML;
    };

    AbstractChosen.browser_is_supported = function() {
      if (/iP(od|hone)/i.test(window.navigator.userAgent)) {
        return false;
      }
      if (/Android/i.test(window.navigator.userAgent)) {
        if (/Mobile/i.test(window.navigator.userAgent)) {
          return false;
        }
      }
      if (/IEMobile/i.test(window.navigator.userAgent)) {
        return false;
      }
      if (/Windows Phone/i.test(window.navigator.userAgent)) {
        return false;
      }
      if (/BlackBerry/i.test(window.navigator.userAgent)) {
        return false;
      }
      if (/BB10/i.test(window.navigator.userAgent)) {
        return false;
      }
      if (window.navigator.appName === "Microsoft Internet Explorer") {
        return document.documentMode >= 8;
      }
      return true;
    };

    AbstractChosen.default_multiple_text = "Select Some Options";

    AbstractChosen.default_single_text = "Select an Option";

    AbstractChosen.default_no_result_text = "No results match";

    return AbstractChosen;

  })();

  $ = jQuery;

  $.fn.extend({
    chosen: function(options) {
      if (!AbstractChosen.browser_is_supported()) {
        return this;
      }
      return this.each(function(input_field) {
        var $this, chosen;
        $this = $(this);
        chosen = $this.data('chosen');
        if (options === 'destroy') {
          if (chosen instanceof Chosen) {
            chosen.destroy();
          }
          return;
        }
        if (!(chosen instanceof Chosen)) {
          $this.data('chosen', new Chosen(this, options));
        }
      });
    }
  });

  Chosen = (function(_super) {
    __extends(Chosen, _super);

    function Chosen() {
      _ref = Chosen.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Chosen.prototype.setup = function() {
      this.form_field_jq = $(this.form_field);
      this.current_selectedIndex = this.form_field.selectedIndex;
      return this.is_rtl = this.form_field_jq.hasClass("chosen-rtl");
    };

    Chosen.prototype.set_up_html = function() {
      var container_classes, container_props;
      container_classes = ["chosen-container"];
      container_classes.push("chosen-container-" + (this.is_multiple ? "multi" : "single"));
      if (this.inherit_select_classes && this.form_field.className) {
        container_classes.push(this.form_field.className);
      }
      if (this.is_rtl) {
        container_classes.push("chosen-rtl");
      }
      container_props = {
        'class': container_classes.join(' '),
        'style': "width: " + (this.container_width()) + ";",
        'title': this.form_field.title
      };
      if (this.form_field.id.length) {
        container_props.id = this.form_field.id.replace(/[^\w]/g, '_') + "_chosen";
      }
      this.container = $("<div />", container_props);
      if (this.is_multiple) {
        this.container.html('<ul class="chosen-choices"><li class="search-field"><input type="text" value="' + this.default_text + '" class="default" autocomplete="off" style="width:25px;" /></li></ul><div class="chosen-drop"><ul class="chosen-results"></ul></div>');
      } else {
        this.container.html('<a class="chosen-single chosen-default"><span>' + this.default_text + '</span><div><b></b></div></a><div class="chosen-drop"><div class="chosen-search"><input type="text" autocomplete="off" /></div><ul class="chosen-results"></ul></div>');
      }
      this.form_field_jq.hide().after(this.container);
      this.dropdown = this.container.find('div.chosen-drop').first();
      this.search_field = this.container.find('input').first();
      this.search_results = this.container.find('ul.chosen-results').first();
      this.search_field_scale();
      this.search_no_results = this.container.find('li.no-results').first();
      if (this.is_multiple) {
        this.search_choices = this.container.find('ul.chosen-choices').first();
        this.search_container = this.container.find('li.search-field').first();
      } else {
        this.search_container = this.container.find('div.chosen-search').first();
        this.selected_item = this.container.find('.chosen-single').first();
      }
      this.results_build();
      this.set_tab_index();
      return this.set_label_behavior();
    };

    Chosen.prototype.on_ready = function() {
      return this.form_field_jq.trigger("chosen:ready", {
        chosen: this
      });
    };

    Chosen.prototype.register_observers = function() {
      var _this = this;
      this.container.bind('touchstart.chosen', function(evt) {
        _this.container_mousedown(evt);
        return evt.preventDefault();
      });
      this.container.bind('touchend.chosen', function(evt) {
        _this.container_mouseup(evt);
        return evt.preventDefault();
      });
      this.container.bind('mousedown.chosen', function(evt) {
        _this.container_mousedown(evt);
      });
      this.container.bind('mouseup.chosen', function(evt) {
        _this.container_mouseup(evt);
      });
      this.container.bind('mouseenter.chosen', function(evt) {
        _this.mouse_enter(evt);
      });
      this.container.bind('mouseleave.chosen', function(evt) {
        _this.mouse_leave(evt);
      });
      this.search_results.bind('mouseup.chosen', function(evt) {
        _this.search_results_mouseup(evt);
      });
      this.search_results.bind('mouseover.chosen', function(evt) {
        _this.search_results_mouseover(evt);
      });
      this.search_results.bind('mouseout.chosen', function(evt) {
        _this.search_results_mouseout(evt);
      });
      this.search_results.bind('mousewheel.chosen DOMMouseScroll.chosen', function(evt) {
        _this.search_results_mousewheel(evt);
      });
      this.search_results.bind('touchstart.chosen', function(evt) {
        _this.search_results_touchstart(evt);
      });
      this.search_results.bind('touchmove.chosen', function(evt) {
        _this.search_results_touchmove(evt);
      });
      this.search_results.bind('touchend.chosen', function(evt) {
        _this.search_results_touchend(evt);
      });
      this.form_field_jq.bind("chosen:updated.chosen", function(evt) {
        _this.results_update_field(evt);
      });
      this.form_field_jq.bind("chosen:activate.chosen", function(evt) {
        _this.activate_field(evt);
      });
      this.form_field_jq.bind("chosen:open.chosen", function(evt) {
        _this.container_mousedown(evt);
      });
      this.form_field_jq.bind("chosen:close.chosen", function(evt) {
        _this.input_blur(evt);
      });
      this.search_field.bind('blur.chosen', function(evt) {
        _this.input_blur(evt);
      });
      this.search_field.bind('keyup.chosen', function(evt) {
        _this.keyup_checker(evt);
      });
      this.search_field.bind('keydown.chosen', function(evt) {
        _this.keydown_checker(evt);
      });
      this.search_field.bind('focus.chosen', function(evt) {
        _this.input_focus(evt);
      });
      this.search_field.bind('cut.chosen', function(evt) {
        _this.clipboard_event_checker(evt);
      });
      this.search_field.bind('paste.chosen', function(evt) {
        _this.clipboard_event_checker(evt);
      });
      if (this.is_multiple) {
        return this.search_choices.bind('click.chosen', function(evt) {
          _this.choices_click(evt);
        });
      } else {
        return this.container.bind('click.chosen', function(evt) {
          evt.preventDefault();
        });
      }
    };

    Chosen.prototype.destroy = function() {
      $(this.container[0].ownerDocument).unbind("click.chosen", this.click_test_action);
      if (this.search_field[0].tabIndex) {
        this.form_field_jq[0].tabIndex = this.search_field[0].tabIndex;
      }
      this.container.remove();
      this.form_field_jq.removeData('chosen');
      return this.form_field_jq.show();
    };

    Chosen.prototype.search_field_disabled = function() {
      this.is_disabled = this.form_field_jq[0].disabled;
      if (this.is_disabled) {
        this.container.addClass('chosen-disabled');
        this.search_field[0].disabled = true;
        if (!this.is_multiple) {
          this.selected_item.unbind("focus.chosen", this.activate_action);
        }
        return this.close_field();
      } else {
        this.container.removeClass('chosen-disabled');
        this.search_field[0].disabled = false;
        if (!this.is_multiple) {
          return this.selected_item.bind("focus.chosen", this.activate_action);
        }
      }
    };

    Chosen.prototype.container_mousedown = function(evt) {
      if (!this.is_disabled) {
        if (evt && evt.type === "mousedown" && !this.results_showing) {
          evt.preventDefault();
        }
        if (!((evt != null) && ($(evt.target)).hasClass("search-choice-close"))) {
          if (!this.active_field) {
            if (this.is_multiple) {
              this.search_field.val("");
            }
            $(this.container[0].ownerDocument).bind('click.chosen', this.click_test_action);
            this.results_show();
          } else if (!this.is_multiple && evt && (($(evt.target)[0] === this.selected_item[0]) || $(evt.target).parents("a.chosen-single").length)) {
            evt.preventDefault();
            this.results_toggle();
          }
          return this.activate_field();
        }
      }
    };

    Chosen.prototype.container_mouseup = function(evt) {
      if (evt.target.nodeName === "ABBR" && !this.is_disabled) {
        return this.results_reset(evt);
      }
    };

    Chosen.prototype.search_results_mousewheel = function(evt) {
      var delta;
      if (evt.originalEvent) {
        delta = evt.originalEvent.deltaY || -evt.originalEvent.wheelDelta || evt.originalEvent.detail;
      }
      if (delta != null) {
        evt.preventDefault();
        if (evt.type === 'DOMMouseScroll') {
          delta = delta * 40;
        }
        return this.search_results.scrollTop(delta + this.search_results.scrollTop());
      }
    };

    Chosen.prototype.blur_test = function(evt) {
      if (!this.active_field && this.container.hasClass("chosen-container-active")) {
        return this.close_field();
      }
    };

    Chosen.prototype.close_field = function() {
      $(this.container[0].ownerDocument).unbind("click.chosen", this.click_test_action);
      this.active_field = false;
      this.results_hide();
      this.container.removeClass("chosen-container-active");
      this.clear_backstroke();
      this.show_search_field_default();
      return this.search_field_scale();
    };

    Chosen.prototype.activate_field = function() {
      this.container.addClass("chosen-container-active");
      this.active_field = true;
      this.search_field.val(this.search_field.val());
      return this.search_field.focus();
    };

    Chosen.prototype.test_active_click = function(evt) {
      var active_container;
      active_container = $(evt.target).closest('.chosen-container');
      if (active_container.length && this.container[0] === active_container[0]) {
        return this.active_field = true;
      } else {
        return this.close_field();
      }
    };

    Chosen.prototype.results_build = function() {
      this.parsing = true;
      this.selected_option_count = null;
      this.results_data = SelectParser.select_to_array(this.form_field);
      if (this.is_multiple) {
        this.search_choices.find("li.search-choice").remove();
      } else if (!this.is_multiple) {
        this.single_set_selected_text();
        if (this.disable_search || this.form_field.options.length <= this.disable_search_threshold) {
          this.search_field[0].readOnly = true;
          this.container.addClass("chosen-container-single-nosearch");
        } else {
          this.search_field[0].readOnly = false;
          this.container.removeClass("chosen-container-single-nosearch");
        }
      }
      this.update_results_content(this.results_option_build({
        first: true
      }));
      this.search_field_disabled();
      this.show_search_field_default();
      this.search_field_scale();
      return this.parsing = false;
    };

    Chosen.prototype.result_do_highlight = function(el) {
      var high_bottom, high_top, maxHeight, visible_bottom, visible_top;
      if (el.length) {
        this.result_clear_highlight();
        this.result_highlight = el;
        this.result_highlight.addClass("highlighted");
        maxHeight = parseInt(this.search_results.css("maxHeight"), 10);
        visible_top = this.search_results.scrollTop();
        visible_bottom = maxHeight + visible_top;
        high_top = this.result_highlight.position().top + this.search_results.scrollTop();
        high_bottom = high_top + this.result_highlight.outerHeight();
        if (high_bottom >= visible_bottom) {
          return this.search_results.scrollTop((high_bottom - maxHeight) > 0 ? high_bottom - maxHeight : 0);
        } else if (high_top < visible_top) {
          return this.search_results.scrollTop(high_top);
        }
      }
    };

    Chosen.prototype.result_clear_highlight = function() {
      if (this.result_highlight) {
        this.result_highlight.removeClass("highlighted");
      }
      return this.result_highlight = null;
    };

    Chosen.prototype.results_show = function() {
      if (this.is_multiple && this.max_selected_options <= this.choices_count()) {
        this.form_field_jq.trigger("chosen:maxselected", {
          chosen: this
        });
        return false;
      }
      this.container.addClass("chosen-with-drop");
      this.results_showing = true;
      this.search_field.focus();
      this.search_field.val(this.search_field.val());
      this.winnow_results();
      return this.form_field_jq.trigger("chosen:showing_dropdown", {
        chosen: this
      });
    };

    Chosen.prototype.update_results_content = function(content) {
      return this.search_results.html(content);
    };

    Chosen.prototype.results_hide = function() {
      if (this.results_showing) {
        this.result_clear_highlight();
        this.container.removeClass("chosen-with-drop");
        this.form_field_jq.trigger("chosen:hiding_dropdown", {
          chosen: this
        });
      }
      return this.results_showing = false;
    };

    Chosen.prototype.set_tab_index = function(el) {
      var ti;
      if (this.form_field.tabIndex) {
        ti = this.form_field.tabIndex;
        this.form_field.tabIndex = -1;
        return this.search_field[0].tabIndex = ti;
      }
    };

    Chosen.prototype.set_label_behavior = function() {
      var _this = this;
      this.form_field_label = this.form_field_jq.parents("label");
      if (!this.form_field_label.length && this.form_field.id.length) {
        this.form_field_label = $("label[for='" + this.form_field.id + "']");
      }
      if (this.form_field_label.length > 0) {
        return this.form_field_label.bind('click.chosen', function(evt) {
          if (_this.is_multiple) {
            return _this.container_mousedown(evt);
          } else {
            return _this.activate_field();
          }
        });
      }
    };

    Chosen.prototype.show_search_field_default = function() {
      if (this.is_multiple && this.choices_count() < 1 && !this.active_field) {
        this.search_field.val(this.default_text);
        return this.search_field.addClass("default");
      } else {
        this.search_field.val("");
        return this.search_field.removeClass("default");
      }
    };

    Chosen.prototype.search_results_mouseup = function(evt) {
      var target;
      target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
      if (target.length) {
        this.result_highlight = target;
        this.result_select(evt);
        return this.search_field.focus();
      }
    };

    Chosen.prototype.search_results_mouseover = function(evt) {
      var target;
      target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
      if (target) {
        return this.result_do_highlight(target);
      }
    };

    Chosen.prototype.search_results_mouseout = function(evt) {
      if ($(evt.target).hasClass("active-result" || $(evt.target).parents('.active-result').first())) {
        return this.result_clear_highlight();
      }
    };

    Chosen.prototype.choice_build = function(item) {
      var choice, close_link,
        _this = this;
      choice = $('<li />', {
        "class": "search-choice"
      }).html("<span>" + (this.choice_label(item)) + "</span>");
      if (item.disabled) {
        choice.addClass('search-choice-disabled');
      } else {
        close_link = $('<a />', {
          "class": 'search-choice-close',
          'data-option-array-index': item.array_index
        });
        close_link.bind('click.chosen', function(evt) {
          return _this.choice_destroy_link_click(evt);
        });
        choice.append(close_link);
      }
      return this.search_container.before(choice);
    };

    Chosen.prototype.choice_destroy_link_click = function(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      if (!this.is_disabled) {
        return this.choice_destroy($(evt.target));
      }
    };

    Chosen.prototype.choice_destroy = function(link) {
      if (this.result_deselect(link[0].getAttribute("data-option-array-index"))) {
        this.show_search_field_default();
        if (this.is_multiple && this.choices_count() > 0 && this.search_field.val().length < 1) {
          this.results_hide();
        }
        link.parents('li').first().remove();
        return this.search_field_scale();
      }
    };

    Chosen.prototype.results_reset = function() {
      this.reset_single_select_options();
      this.form_field.options[0].selected = true;
      this.single_set_selected_text();
      this.show_search_field_default();
      this.results_reset_cleanup();
      this.form_field_jq.trigger("change");
      if (this.active_field) {
        return this.results_hide();
      }
    };

    Chosen.prototype.results_reset_cleanup = function() {
      this.current_selectedIndex = this.form_field.selectedIndex;
      return this.selected_item.find("abbr").remove();
    };

    Chosen.prototype.result_select = function(evt) {
      var high, item;
      if (this.result_highlight) {
        high = this.result_highlight;
        this.result_clear_highlight();
        if (this.is_multiple && this.max_selected_options <= this.choices_count()) {
          this.form_field_jq.trigger("chosen:maxselected", {
            chosen: this
          });
          return false;
        }
        if (this.is_multiple) {
          high.removeClass("active-result");
        } else {
          this.reset_single_select_options();
        }
        high.addClass("result-selected");
        item = this.results_data[high[0].getAttribute("data-option-array-index")];
        item.selected = true;
        this.form_field.options[item.options_index].selected = true;
        this.selected_option_count = null;
        if (this.is_multiple) {
          this.choice_build(item);
        } else {
          this.single_set_selected_text(this.choice_label(item));
        }
        if (!((evt.metaKey || evt.ctrlKey) && this.is_multiple)) {
          this.results_hide();
        }
        this.show_search_field_default();
        if (this.is_multiple || this.form_field.selectedIndex !== this.current_selectedIndex) {
          this.form_field_jq.trigger("change", {
            'selected': this.form_field.options[item.options_index].value
          });
        }
        this.current_selectedIndex = this.form_field.selectedIndex;
        evt.preventDefault();
        return this.search_field_scale();
      }
    };

    Chosen.prototype.single_set_selected_text = function(text) {
      if (text == null) {
        text = this.default_text;
      }
      if (text === this.default_text) {
        this.selected_item.addClass("chosen-default");
      } else {
        this.single_deselect_control_build();
        this.selected_item.removeClass("chosen-default");
      }
      return this.selected_item.find("span").html(text);
    };

    Chosen.prototype.result_deselect = function(pos) {
      var result_data;
      result_data = this.results_data[pos];
      if (!this.form_field.options[result_data.options_index].disabled) {
        result_data.selected = false;
        this.form_field.options[result_data.options_index].selected = false;
        this.selected_option_count = null;
        this.result_clear_highlight();
        if (this.results_showing) {
          this.winnow_results();
        }
        this.form_field_jq.trigger("change", {
          deselected: this.form_field.options[result_data.options_index].value
        });
        this.search_field_scale();
        return true;
      } else {
        return false;
      }
    };

    Chosen.prototype.single_deselect_control_build = function() {
      if (!this.allow_single_deselect) {
        return;
      }
      if (!this.selected_item.find("abbr").length) {
        this.selected_item.find("span").first().after("<abbr class=\"search-choice-close\"></abbr>");
      }
      return this.selected_item.addClass("chosen-single-with-deselect");
    };

    Chosen.prototype.get_search_text = function() {
      return $('<div/>').text($.trim(this.search_field.val())).html();
    };

    Chosen.prototype.winnow_results_set_highlight = function() {
      var do_high, selected_results;
      selected_results = !this.is_multiple ? this.search_results.find(".result-selected.active-result") : [];
      do_high = selected_results.length ? selected_results.first() : this.search_results.find(".active-result").first();
      if (do_high != null) {
        return this.result_do_highlight(do_high);
      }
    };

    Chosen.prototype.no_results = function(terms) {
      var no_results_html;
      no_results_html = $('<li class="no-results">' + this.results_none_found + ' "<span></span>"</li>');
      no_results_html.find("span").first().html(terms);
      this.search_results.append(no_results_html);
      return this.form_field_jq.trigger("chosen:no_results", {
        chosen: this
      });
    };

    Chosen.prototype.no_results_clear = function() {
      return this.search_results.find(".no-results").remove();
    };

    Chosen.prototype.keydown_arrow = function() {
      var next_sib;
      if (this.results_showing && this.result_highlight) {
        next_sib = this.result_highlight.nextAll("li.active-result").first();
        if (next_sib) {
          return this.result_do_highlight(next_sib);
        }
      } else {
        return this.results_show();
      }
    };

    Chosen.prototype.keyup_arrow = function() {
      var prev_sibs;
      if (!this.results_showing && !this.is_multiple) {
        return this.results_show();
      } else if (this.result_highlight) {
        prev_sibs = this.result_highlight.prevAll("li.active-result");
        if (prev_sibs.length) {
          return this.result_do_highlight(prev_sibs.first());
        } else {
          if (this.choices_count() > 0) {
            this.results_hide();
          }
          return this.result_clear_highlight();
        }
      }
    };

    Chosen.prototype.keydown_backstroke = function() {
      var next_available_destroy;
      if (this.pending_backstroke) {
        this.choice_destroy(this.pending_backstroke.find("a").first());
        return this.clear_backstroke();
      } else {
        next_available_destroy = this.search_container.siblings("li.search-choice").last();
        if (next_available_destroy.length && !next_available_destroy.hasClass("search-choice-disabled")) {
          this.pending_backstroke = next_available_destroy;
          if (this.single_backstroke_delete) {
            return this.keydown_backstroke();
          } else {
            return this.pending_backstroke.addClass("search-choice-focus");
          }
        }
      }
    };

    Chosen.prototype.clear_backstroke = function() {
      if (this.pending_backstroke) {
        this.pending_backstroke.removeClass("search-choice-focus");
      }
      return this.pending_backstroke = null;
    };

    Chosen.prototype.keydown_checker = function(evt) {
      var stroke, _ref1;
      stroke = (_ref1 = evt.which) != null ? _ref1 : evt.keyCode;
      this.search_field_scale();
      if (stroke !== 8 && this.pending_backstroke) {
        this.clear_backstroke();
      }
      switch (stroke) {
        case 8:
          this.backstroke_length = this.search_field.val().length;
          break;
        case 9:
          if (this.results_showing && !this.is_multiple) {
            this.result_select(evt);
          }
          this.mouse_on_container = false;
          break;
        case 13:
          if (this.results_showing) {
            evt.preventDefault();
          }
          break;
        case 32:
          if (this.disable_search) {
            evt.preventDefault();
          }
          break;
        case 38:
          evt.preventDefault();
          this.keyup_arrow();
          break;
        case 40:
          evt.preventDefault();
          this.keydown_arrow();
          break;
      }
    };

    Chosen.prototype.search_field_scale = function() {
      var div, f_width, h, style, style_block, styles, w, _i, _len;
      if (this.is_multiple) {
        h = 0;
        w = 0;
        style_block = "position:absolute; left: -1000px; top: -1000px; display:none;";
        styles = ['font-size', 'font-style', 'font-weight', 'font-family', 'line-height', 'text-transform', 'letter-spacing'];
        for (_i = 0, _len = styles.length; _i < _len; _i++) {
          style = styles[_i];
          style_block += style + ":" + this.search_field.css(style) + ";";
        }
        div = $('<div />', {
          'style': style_block
        });
        div.text(this.search_field.val());
        $('body').append(div);
        w = div.width() + 25;
        div.remove();
        f_width = this.container.outerWidth();
        if (w > f_width - 10) {
          w = f_width - 10;
        }
        return this.search_field.css({
          'width': w + 'px'
        });
      }
    };

    return Chosen;

  })(AbstractChosen);

}).call(this);

/*global jQuery */
/*jshint browser:true */
/*!
* FitVids 1.1
*
* Copyright 2013, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
* Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
*/

(function( $ ){

  "use strict";

  $.fn.fitVids = function( options ) {
    var settings = {
      customSelector: null
    };

    if(!document.getElementById('fit-vids-style')) {
      // appendStyles: https://github.com/toddmotto/fluidvids/blob/master/dist/fluidvids.js
      var head = document.head || document.getElementsByTagName('head')[0];
      var css = '.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}';
      var div = document.createElement('div');
      div.innerHTML = '<p>x</p><style id="fit-vids-style">' + css + '</style>';
      head.appendChild(div.childNodes[1]);
    }

    if ( options ) {
      $.extend( settings, options );
    }

    return this.each(function(){
      var selectors = [
        "iframe[src*='player.vimeo.com']",
        "iframe[src*='youtube.com']",
        "iframe[src*='youtube-nocookie.com']",
        "iframe[src*='kickstarter.com'][src*='video.html']",
        "object",
        "embed"
      ];

      if (settings.customSelector) {
        selectors.push(settings.customSelector);
      }

      var $allVideos = $(this).find(selectors.join(','));
      $allVideos = $allVideos.not("object object"); // SwfObj conflict patch

      $allVideos.each(function(){
        var $this = $(this);
        if (this.tagName.toLowerCase() === 'embed' && $this.parent('object').length || $this.parent('.fluid-width-video-wrapper').length) { return; }
        var height = ( this.tagName.toLowerCase() === 'object' || ($this.attr('height') && !isNaN(parseInt($this.attr('height'), 10))) ) ? parseInt($this.attr('height'), 10) : $this.height(),
            width = !isNaN(parseInt($this.attr('width'), 10)) ? parseInt($this.attr('width'), 10) : $this.width(),
            aspectRatio = height / width;
        if(!$this.attr('id')){
          var videoID = 'fitvid' + Math.floor(Math.random()*999999);
          $this.attr('id', videoID);
        }
        $this.wrap('<div class="fluid-width-video-wrapper"></div>').parent('.fluid-width-video-wrapper').css('padding-top', (aspectRatio * 100)+"%");
        $this.removeAttr('height').removeAttr('width');
      });
    });
  };
// Works with either jQuery or Zepto
})( window.jQuery || window.Zepto );

/* perfect-scrollbar v0.6.11 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var ps = require('../main');
var psInstances = require('../plugin/instances');

function mountJQuery(jQuery) {
  jQuery.fn.perfectScrollbar = function (settingOrCommand) {
    return this.each(function () {
      if (typeof settingOrCommand === 'object' ||
          typeof settingOrCommand === 'undefined') {
        // If it's an object or none, initialize.
        var settings = settingOrCommand;

        if (!psInstances.get(this)) {
          ps.initialize(this, settings);
        }
      } else {
        // Unless, it may be a command.
        var command = settingOrCommand;

        if (command === 'update') {
          ps.update(this);
        } else if (command === 'destroy') {
          ps.destroy(this);
        }
      }
    });
  };
}

if (typeof define === 'function' && define.amd) {
  // AMD. Register as an anonymous module.
  define(['jquery'], mountJQuery);
} else {
  var jq = window.jQuery ? window.jQuery : window.$;
  if (typeof jq !== 'undefined') {
    mountJQuery(jq);
  }
}

module.exports = mountJQuery;

},{"../main":7,"../plugin/instances":18}],2:[function(require,module,exports){
'use strict';

function oldAdd(element, className) {
  var classes = element.className.split(' ');
  if (classes.indexOf(className) < 0) {
    classes.push(className);
  }
  element.className = classes.join(' ');
}

function oldRemove(element, className) {
  var classes = element.className.split(' ');
  var idx = classes.indexOf(className);
  if (idx >= 0) {
    classes.splice(idx, 1);
  }
  element.className = classes.join(' ');
}

exports.add = function (element, className) {
  if (element.classList) {
    element.classList.add(className);
  } else {
    oldAdd(element, className);
  }
};

exports.remove = function (element, className) {
  if (element.classList) {
    element.classList.remove(className);
  } else {
    oldRemove(element, className);
  }
};

exports.list = function (element) {
  if (element.classList) {
    return Array.prototype.slice.apply(element.classList);
  } else {
    return element.className.split(' ');
  }
};

},{}],3:[function(require,module,exports){
'use strict';

var DOM = {};

DOM.e = function (tagName, className) {
  var element = document.createElement(tagName);
  element.className = className;
  return element;
};

DOM.appendTo = function (child, parent) {
  parent.appendChild(child);
  return child;
};

function cssGet(element, styleName) {
  return window.getComputedStyle(element)[styleName];
}

function cssSet(element, styleName, styleValue) {
  if (typeof styleValue === 'number') {
    styleValue = styleValue.toString() + 'px';
  }
  element.style[styleName] = styleValue;
  return element;
}

function cssMultiSet(element, obj) {
  for (var key in obj) {
    var val = obj[key];
    if (typeof val === 'number') {
      val = val.toString() + 'px';
    }
    element.style[key] = val;
  }
  return element;
}

DOM.css = function (element, styleNameOrObject, styleValue) {
  if (typeof styleNameOrObject === 'object') {
    // multiple set with object
    return cssMultiSet(element, styleNameOrObject);
  } else {
    if (typeof styleValue === 'undefined') {
      return cssGet(element, styleNameOrObject);
    } else {
      return cssSet(element, styleNameOrObject, styleValue);
    }
  }
};

DOM.matches = function (element, query) {
  if (typeof element.matches !== 'undefined') {
    return element.matches(query);
  } else {
    if (typeof element.matchesSelector !== 'undefined') {
      return element.matchesSelector(query);
    } else if (typeof element.webkitMatchesSelector !== 'undefined') {
      return element.webkitMatchesSelector(query);
    } else if (typeof element.mozMatchesSelector !== 'undefined') {
      return element.mozMatchesSelector(query);
    } else if (typeof element.msMatchesSelector !== 'undefined') {
      return element.msMatchesSelector(query);
    }
  }
};

DOM.remove = function (element) {
  if (typeof element.remove !== 'undefined') {
    element.remove();
  } else {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }
};

DOM.queryChildren = function (element, selector) {
  return Array.prototype.filter.call(element.childNodes, function (child) {
    return DOM.matches(child, selector);
  });
};

module.exports = DOM;

},{}],4:[function(require,module,exports){
'use strict';

var EventElement = function (element) {
  this.element = element;
  this.events = {};
};

EventElement.prototype.bind = function (eventName, handler) {
  if (typeof this.events[eventName] === 'undefined') {
    this.events[eventName] = [];
  }
  this.events[eventName].push(handler);
  this.element.addEventListener(eventName, handler, false);
};

EventElement.prototype.unbind = function (eventName, handler) {
  var isHandlerProvided = (typeof handler !== 'undefined');
  this.events[eventName] = this.events[eventName].filter(function (hdlr) {
    if (isHandlerProvided && hdlr !== handler) {
      return true;
    }
    this.element.removeEventListener(eventName, hdlr, false);
    return false;
  }, this);
};

EventElement.prototype.unbindAll = function () {
  for (var name in this.events) {
    this.unbind(name);
  }
};

var EventManager = function () {
  this.eventElements = [];
};

EventManager.prototype.eventElement = function (element) {
  var ee = this.eventElements.filter(function (eventElement) {
    return eventElement.element === element;
  })[0];
  if (typeof ee === 'undefined') {
    ee = new EventElement(element);
    this.eventElements.push(ee);
  }
  return ee;
};

EventManager.prototype.bind = function (element, eventName, handler) {
  this.eventElement(element).bind(eventName, handler);
};

EventManager.prototype.unbind = function (element, eventName, handler) {
  this.eventElement(element).unbind(eventName, handler);
};

EventManager.prototype.unbindAll = function () {
  for (var i = 0; i < this.eventElements.length; i++) {
    this.eventElements[i].unbindAll();
  }
};

EventManager.prototype.once = function (element, eventName, handler) {
  var ee = this.eventElement(element);
  var onceHandler = function (e) {
    ee.unbind(eventName, onceHandler);
    handler(e);
  };
  ee.bind(eventName, onceHandler);
};

module.exports = EventManager;

},{}],5:[function(require,module,exports){
'use strict';

module.exports = (function () {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return function () {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  };
})();

},{}],6:[function(require,module,exports){
'use strict';

var cls = require('./class');
var dom = require('./dom');

var toInt = exports.toInt = function (x) {
  return parseInt(x, 10) || 0;
};

var clone = exports.clone = function (obj) {
  if (obj === null) {
    return null;
  } else if (obj.constructor === Array) {
    return obj.map(clone);
  } else if (typeof obj === 'object') {
    var result = {};
    for (var key in obj) {
      result[key] = clone(obj[key]);
    }
    return result;
  } else {
    return obj;
  }
};

exports.extend = function (original, source) {
  var result = clone(original);
  for (var key in source) {
    result[key] = clone(source[key]);
  }
  return result;
};

exports.isEditable = function (el) {
  return dom.matches(el, "input,[contenteditable]") ||
         dom.matches(el, "select,[contenteditable]") ||
         dom.matches(el, "textarea,[contenteditable]") ||
         dom.matches(el, "button,[contenteditable]");
};

exports.removePsClasses = function (element) {
  var clsList = cls.list(element);
  for (var i = 0; i < clsList.length; i++) {
    var className = clsList[i];
    if (className.indexOf('ps-') === 0) {
      cls.remove(element, className);
    }
  }
};

exports.outerWidth = function (element) {
  return toInt(dom.css(element, 'width')) +
         toInt(dom.css(element, 'paddingLeft')) +
         toInt(dom.css(element, 'paddingRight')) +
         toInt(dom.css(element, 'borderLeftWidth')) +
         toInt(dom.css(element, 'borderRightWidth'));
};

exports.startScrolling = function (element, axis) {
  cls.add(element, 'ps-in-scrolling');
  if (typeof axis !== 'undefined') {
    cls.add(element, 'ps-' + axis);
  } else {
    cls.add(element, 'ps-x');
    cls.add(element, 'ps-y');
  }
};

exports.stopScrolling = function (element, axis) {
  cls.remove(element, 'ps-in-scrolling');
  if (typeof axis !== 'undefined') {
    cls.remove(element, 'ps-' + axis);
  } else {
    cls.remove(element, 'ps-x');
    cls.remove(element, 'ps-y');
  }
};

exports.env = {
  isWebKit: 'WebkitAppearance' in document.documentElement.style,
  supportsTouch: (('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch),
  supportsIePointer: window.navigator.msMaxTouchPoints !== null
};

},{"./class":2,"./dom":3}],7:[function(require,module,exports){
'use strict';

var destroy = require('./plugin/destroy');
var initialize = require('./plugin/initialize');
var update = require('./plugin/update');

module.exports = {
  initialize: initialize,
  update: update,
  destroy: destroy
};

},{"./plugin/destroy":9,"./plugin/initialize":17,"./plugin/update":21}],8:[function(require,module,exports){
'use strict';

module.exports = {
  handlers: ['click-rail', 'drag-scrollbar', 'keyboard', 'wheel', 'touch'],
  maxScrollbarLength: null,
  minScrollbarLength: null,
  scrollXMarginOffset: 0,
  scrollYMarginOffset: 0,
  stopPropagationOnClick: true,
  suppressScrollX: false,
  suppressScrollY: false,
  swipePropagation: true,
  useBothWheelAxes: false,
  wheelPropagation: false,
  wheelSpeed: 1,
  theme: 'default'
};

},{}],9:[function(require,module,exports){
'use strict';

var _ = require('../lib/helper');
var dom = require('../lib/dom');
var instances = require('./instances');

module.exports = function (element) {
  var i = instances.get(element);

  if (!i) {
    return;
  }

  i.event.unbindAll();
  dom.remove(i.scrollbarX);
  dom.remove(i.scrollbarY);
  dom.remove(i.scrollbarXRail);
  dom.remove(i.scrollbarYRail);
  _.removePsClasses(element);

  instances.remove(element);
};

},{"../lib/dom":3,"../lib/helper":6,"./instances":18}],10:[function(require,module,exports){
'use strict';

var _ = require('../../lib/helper');
var instances = require('../instances');
var updateGeometry = require('../update-geometry');
var updateScroll = require('../update-scroll');

function bindClickRailHandler(element, i) {
  function pageOffset(el) {
    return el.getBoundingClientRect();
  }
  var stopPropagation = function (e) { e.stopPropagation(); };

  if (i.settings.stopPropagationOnClick) {
    i.event.bind(i.scrollbarY, 'click', stopPropagation);
  }
  i.event.bind(i.scrollbarYRail, 'click', function (e) {
    var halfOfScrollbarLength = _.toInt(i.scrollbarYHeight / 2);
    var positionTop = i.railYRatio * (e.pageY - window.pageYOffset - pageOffset(i.scrollbarYRail).top - halfOfScrollbarLength);
    var maxPositionTop = i.railYRatio * (i.railYHeight - i.scrollbarYHeight);
    var positionRatio = positionTop / maxPositionTop;

    if (positionRatio < 0) {
      positionRatio = 0;
    } else if (positionRatio > 1) {
      positionRatio = 1;
    }

    updateScroll(element, 'top', (i.contentHeight - i.containerHeight) * positionRatio);
    updateGeometry(element);

    e.stopPropagation();
  });

  if (i.settings.stopPropagationOnClick) {
    i.event.bind(i.scrollbarX, 'click', stopPropagation);
  }
  i.event.bind(i.scrollbarXRail, 'click', function (e) {
    var halfOfScrollbarLength = _.toInt(i.scrollbarXWidth / 2);
    var positionLeft = i.railXRatio * (e.pageX - window.pageXOffset - pageOffset(i.scrollbarXRail).left - halfOfScrollbarLength);
    var maxPositionLeft = i.railXRatio * (i.railXWidth - i.scrollbarXWidth);
    var positionRatio = positionLeft / maxPositionLeft;

    if (positionRatio < 0) {
      positionRatio = 0;
    } else if (positionRatio > 1) {
      positionRatio = 1;
    }

    updateScroll(element, 'left', ((i.contentWidth - i.containerWidth) * positionRatio) - i.negativeScrollAdjustment);
    updateGeometry(element);

    e.stopPropagation();
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindClickRailHandler(element, i);
};

},{"../../lib/helper":6,"../instances":18,"../update-geometry":19,"../update-scroll":20}],11:[function(require,module,exports){
'use strict';

var _ = require('../../lib/helper');
var dom = require('../../lib/dom');
var instances = require('../instances');
var updateGeometry = require('../update-geometry');
var updateScroll = require('../update-scroll');

function bindMouseScrollXHandler(element, i) {
  var currentLeft = null;
  var currentPageX = null;

  function updateScrollLeft(deltaX) {
    var newLeft = currentLeft + (deltaX * i.railXRatio);
    var maxLeft = Math.max(0, i.scrollbarXRail.getBoundingClientRect().left) + (i.railXRatio * (i.railXWidth - i.scrollbarXWidth));

    if (newLeft < 0) {
      i.scrollbarXLeft = 0;
    } else if (newLeft > maxLeft) {
      i.scrollbarXLeft = maxLeft;
    } else {
      i.scrollbarXLeft = newLeft;
    }

    var scrollLeft = _.toInt(i.scrollbarXLeft * (i.contentWidth - i.containerWidth) / (i.containerWidth - (i.railXRatio * i.scrollbarXWidth))) - i.negativeScrollAdjustment;
    updateScroll(element, 'left', scrollLeft);
  }

  var mouseMoveHandler = function (e) {
    updateScrollLeft(e.pageX - currentPageX);
    updateGeometry(element);
    e.stopPropagation();
    e.preventDefault();
  };

  var mouseUpHandler = function () {
    _.stopScrolling(element, 'x');
    i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
  };

  i.event.bind(i.scrollbarX, 'mousedown', function (e) {
    currentPageX = e.pageX;
    currentLeft = _.toInt(dom.css(i.scrollbarX, 'left')) * i.railXRatio;
    _.startScrolling(element, 'x');

    i.event.bind(i.ownerDocument, 'mousemove', mouseMoveHandler);
    i.event.once(i.ownerDocument, 'mouseup', mouseUpHandler);

    e.stopPropagation();
    e.preventDefault();
  });
}

function bindMouseScrollYHandler(element, i) {
  var currentTop = null;
  var currentPageY = null;

  function updateScrollTop(deltaY) {
    var newTop = currentTop + (deltaY * i.railYRatio);
    var maxTop = Math.max(0, i.scrollbarYRail.getBoundingClientRect().top) + (i.railYRatio * (i.railYHeight - i.scrollbarYHeight));

    if (newTop < 0) {
      i.scrollbarYTop = 0;
    } else if (newTop > maxTop) {
      i.scrollbarYTop = maxTop;
    } else {
      i.scrollbarYTop = newTop;
    }

    var scrollTop = _.toInt(i.scrollbarYTop * (i.contentHeight - i.containerHeight) / (i.containerHeight - (i.railYRatio * i.scrollbarYHeight)));
    updateScroll(element, 'top', scrollTop);
  }

  var mouseMoveHandler = function (e) {
    updateScrollTop(e.pageY - currentPageY);
    updateGeometry(element);
    e.stopPropagation();
    e.preventDefault();
  };

  var mouseUpHandler = function () {
    _.stopScrolling(element, 'y');
    i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
  };

  i.event.bind(i.scrollbarY, 'mousedown', function (e) {
    currentPageY = e.pageY;
    currentTop = _.toInt(dom.css(i.scrollbarY, 'top')) * i.railYRatio;
    _.startScrolling(element, 'y');

    i.event.bind(i.ownerDocument, 'mousemove', mouseMoveHandler);
    i.event.once(i.ownerDocument, 'mouseup', mouseUpHandler);

    e.stopPropagation();
    e.preventDefault();
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindMouseScrollXHandler(element, i);
  bindMouseScrollYHandler(element, i);
};

},{"../../lib/dom":3,"../../lib/helper":6,"../instances":18,"../update-geometry":19,"../update-scroll":20}],12:[function(require,module,exports){
'use strict';

var _ = require('../../lib/helper');
var dom = require('../../lib/dom');
var instances = require('../instances');
var updateGeometry = require('../update-geometry');
var updateScroll = require('../update-scroll');

function bindKeyboardHandler(element, i) {
  var hovered = false;
  i.event.bind(element, 'mouseenter', function () {
    hovered = true;
  });
  i.event.bind(element, 'mouseleave', function () {
    hovered = false;
  });

  var shouldPrevent = false;
  function shouldPreventDefault(deltaX, deltaY) {
    var scrollTop = element.scrollTop;
    if (deltaX === 0) {
      if (!i.scrollbarYActive) {
        return false;
      }
      if ((scrollTop === 0 && deltaY > 0) || (scrollTop >= i.contentHeight - i.containerHeight && deltaY < 0)) {
        return !i.settings.wheelPropagation;
      }
    }

    var scrollLeft = element.scrollLeft;
    if (deltaY === 0) {
      if (!i.scrollbarXActive) {
        return false;
      }
      if ((scrollLeft === 0 && deltaX < 0) || (scrollLeft >= i.contentWidth - i.containerWidth && deltaX > 0)) {
        return !i.settings.wheelPropagation;
      }
    }
    return true;
  }

  i.event.bind(i.ownerDocument, 'keydown', function (e) {
    if (e.isDefaultPrevented && e.isDefaultPrevented()) {
      return;
    }

    var focused = dom.matches(i.scrollbarX, ':focus') ||
                  dom.matches(i.scrollbarY, ':focus');

    if (!hovered && !focused) {
      return;
    }

    var activeElement = document.activeElement ? document.activeElement : i.ownerDocument.activeElement;
    if (activeElement) {
      if (activeElement.tagName === 'IFRAME') {
        activeElement = activeElement.contentDocument.activeElement;
      } else {
        // go deeper if element is a webcomponent
        while (activeElement.shadowRoot) {
          activeElement = activeElement.shadowRoot.activeElement;
        }
      }
      if (_.isEditable(activeElement)) {
        return;
      }
    }

    var deltaX = 0;
    var deltaY = 0;

    switch (e.which) {
    case 37: // left
      deltaX = -30;
      break;
    case 38: // up
      deltaY = 30;
      break;
    case 39: // right
      deltaX = 30;
      break;
    case 40: // down
      deltaY = -30;
      break;
    case 33: // page up
      deltaY = 90;
      break;
    case 32: // space bar
      if (e.shiftKey) {
        deltaY = 90;
      } else {
        deltaY = -90;
      }
      break;
    case 34: // page down
      deltaY = -90;
      break;
    case 35: // end
      if (e.ctrlKey) {
        deltaY = -i.contentHeight;
      } else {
        deltaY = -i.containerHeight;
      }
      break;
    case 36: // home
      if (e.ctrlKey) {
        deltaY = element.scrollTop;
      } else {
        deltaY = i.containerHeight;
      }
      break;
    default:
      return;
    }

    updateScroll(element, 'top', element.scrollTop - deltaY);
    updateScroll(element, 'left', element.scrollLeft + deltaX);
    updateGeometry(element);

    shouldPrevent = shouldPreventDefault(deltaX, deltaY);
    if (shouldPrevent) {
      e.preventDefault();
    }
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindKeyboardHandler(element, i);
};

},{"../../lib/dom":3,"../../lib/helper":6,"../instances":18,"../update-geometry":19,"../update-scroll":20}],13:[function(require,module,exports){
'use strict';

var instances = require('../instances');
var updateGeometry = require('../update-geometry');
var updateScroll = require('../update-scroll');

function bindMouseWheelHandler(element, i) {
  var shouldPrevent = false;

  function shouldPreventDefault(deltaX, deltaY) {
    var scrollTop = element.scrollTop;
    if (deltaX === 0) {
      if (!i.scrollbarYActive) {
        return false;
      }
      if ((scrollTop === 0 && deltaY > 0) || (scrollTop >= i.contentHeight - i.containerHeight && deltaY < 0)) {
        return !i.settings.wheelPropagation;
      }
    }

    var scrollLeft = element.scrollLeft;
    if (deltaY === 0) {
      if (!i.scrollbarXActive) {
        return false;
      }
      if ((scrollLeft === 0 && deltaX < 0) || (scrollLeft >= i.contentWidth - i.containerWidth && deltaX > 0)) {
        return !i.settings.wheelPropagation;
      }
    }
    return true;
  }

  function getDeltaFromEvent(e) {
    var deltaX = e.deltaX;
    var deltaY = -1 * e.deltaY;

    if (typeof deltaX === "undefined" || typeof deltaY === "undefined") {
      // OS X Safari
      deltaX = -1 * e.wheelDeltaX / 6;
      deltaY = e.wheelDeltaY / 6;
    }

    if (e.deltaMode && e.deltaMode === 1) {
      // Firefox in deltaMode 1: Line scrolling
      deltaX *= 10;
      deltaY *= 10;
    }

    if (deltaX !== deltaX && deltaY !== deltaY/* NaN checks */) {
      // IE in some mouse drivers
      deltaX = 0;
      deltaY = e.wheelDelta;
    }

    return [deltaX, deltaY];
  }

  function shouldBeConsumedByChild(deltaX, deltaY) {
    var child = element.querySelector('textarea:hover, .ps-child:hover');
    if (child) {
      if (child.tagName !== 'TEXTAREA' && !window.getComputedStyle(child).overflow.match(/(scroll|auto)/)) {
        return false;
      }

      var maxScrollTop = child.scrollHeight - child.clientHeight;
      if (maxScrollTop > 0) {
        if (!(child.scrollTop === 0 && deltaY > 0) && !(child.scrollTop === maxScrollTop && deltaY < 0)) {
          return true;
        }
      }
      var maxScrollLeft = child.scrollLeft - child.clientWidth;
      if (maxScrollLeft > 0) {
        if (!(child.scrollLeft === 0 && deltaX < 0) && !(child.scrollLeft === maxScrollLeft && deltaX > 0)) {
          return true;
        }
      }
    }
    return false;
  }

  function mousewheelHandler(e) {
    var delta = getDeltaFromEvent(e);

    var deltaX = delta[0];
    var deltaY = delta[1];

    if (shouldBeConsumedByChild(deltaX, deltaY)) {
      return;
    }

    shouldPrevent = false;
    if (!i.settings.useBothWheelAxes) {
      // deltaX will only be used for horizontal scrolling and deltaY will
      // only be used for vertical scrolling - this is the default
      updateScroll(element, 'top', element.scrollTop - (deltaY * i.settings.wheelSpeed));
      updateScroll(element, 'left', element.scrollLeft + (deltaX * i.settings.wheelSpeed));
    } else if (i.scrollbarYActive && !i.scrollbarXActive) {
      // only vertical scrollbar is active and useBothWheelAxes option is
      // active, so let's scroll vertical bar using both mouse wheel axes
      if (deltaY) {
        updateScroll(element, 'top', element.scrollTop - (deltaY * i.settings.wheelSpeed));
      } else {
        updateScroll(element, 'top', element.scrollTop + (deltaX * i.settings.wheelSpeed));
      }
      shouldPrevent = true;
    } else if (i.scrollbarXActive && !i.scrollbarYActive) {
      // useBothWheelAxes and only horizontal bar is active, so use both
      // wheel axes for horizontal bar
      if (deltaX) {
        updateScroll(element, 'left', element.scrollLeft + (deltaX * i.settings.wheelSpeed));
      } else {
        updateScroll(element, 'left', element.scrollLeft - (deltaY * i.settings.wheelSpeed));
      }
      shouldPrevent = true;
    }

    updateGeometry(element);

    shouldPrevent = (shouldPrevent || shouldPreventDefault(deltaX, deltaY));
    if (shouldPrevent) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  if (typeof window.onwheel !== "undefined") {
    i.event.bind(element, 'wheel', mousewheelHandler);
  } else if (typeof window.onmousewheel !== "undefined") {
    i.event.bind(element, 'mousewheel', mousewheelHandler);
  }
}

module.exports = function (element) {
  var i = instances.get(element);
  bindMouseWheelHandler(element, i);
};

},{"../instances":18,"../update-geometry":19,"../update-scroll":20}],14:[function(require,module,exports){
'use strict';

var instances = require('../instances');
var updateGeometry = require('../update-geometry');

function bindNativeScrollHandler(element, i) {
  i.event.bind(element, 'scroll', function () {
    updateGeometry(element);
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindNativeScrollHandler(element, i);
};

},{"../instances":18,"../update-geometry":19}],15:[function(require,module,exports){
'use strict';

var _ = require('../../lib/helper');
var instances = require('../instances');
var updateGeometry = require('../update-geometry');
var updateScroll = require('../update-scroll');

function bindSelectionHandler(element, i) {
  function getRangeNode() {
    var selection = window.getSelection ? window.getSelection() :
                    document.getSelection ? document.getSelection() : '';
    if (selection.toString().length === 0) {
      return null;
    } else {
      return selection.getRangeAt(0).commonAncestorContainer;
    }
  }

  var scrollingLoop = null;
  var scrollDiff = {top: 0, left: 0};
  function startScrolling() {
    if (!scrollingLoop) {
      scrollingLoop = setInterval(function () {
        if (!instances.get(element)) {
          clearInterval(scrollingLoop);
          return;
        }

        updateScroll(element, 'top', element.scrollTop + scrollDiff.top);
        updateScroll(element, 'left', element.scrollLeft + scrollDiff.left);
        updateGeometry(element);
      }, 50); // every .1 sec
    }
  }
  function stopScrolling() {
    if (scrollingLoop) {
      clearInterval(scrollingLoop);
      scrollingLoop = null;
    }
    _.stopScrolling(element);
  }

  var isSelected = false;
  i.event.bind(i.ownerDocument, 'selectionchange', function () {
    if (element.contains(getRangeNode())) {
      isSelected = true;
    } else {
      isSelected = false;
      stopScrolling();
    }
  });
  i.event.bind(window, 'mouseup', function () {
    if (isSelected) {
      isSelected = false;
      stopScrolling();
    }
  });

  i.event.bind(window, 'mousemove', function (e) {
    if (isSelected) {
      var mousePosition = {x: e.pageX, y: e.pageY};
      var containerGeometry = {
        left: element.offsetLeft,
        right: element.offsetLeft + element.offsetWidth,
        top: element.offsetTop,
        bottom: element.offsetTop + element.offsetHeight
      };

      if (mousePosition.x < containerGeometry.left + 3) {
        scrollDiff.left = -5;
        _.startScrolling(element, 'x');
      } else if (mousePosition.x > containerGeometry.right - 3) {
        scrollDiff.left = 5;
        _.startScrolling(element, 'x');
      } else {
        scrollDiff.left = 0;
      }

      if (mousePosition.y < containerGeometry.top + 3) {
        if (containerGeometry.top + 3 - mousePosition.y < 5) {
          scrollDiff.top = -5;
        } else {
          scrollDiff.top = -20;
        }
        _.startScrolling(element, 'y');
      } else if (mousePosition.y > containerGeometry.bottom - 3) {
        if (mousePosition.y - containerGeometry.bottom + 3 < 5) {
          scrollDiff.top = 5;
        } else {
          scrollDiff.top = 20;
        }
        _.startScrolling(element, 'y');
      } else {
        scrollDiff.top = 0;
      }

      if (scrollDiff.top === 0 && scrollDiff.left === 0) {
        stopScrolling();
      } else {
        startScrolling();
      }
    }
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindSelectionHandler(element, i);
};

},{"../../lib/helper":6,"../instances":18,"../update-geometry":19,"../update-scroll":20}],16:[function(require,module,exports){
'use strict';

var _ = require('../../lib/helper');
var instances = require('../instances');
var updateGeometry = require('../update-geometry');
var updateScroll = require('../update-scroll');

function bindTouchHandler(element, i, supportsTouch, supportsIePointer) {
  function shouldPreventDefault(deltaX, deltaY) {
    var scrollTop = element.scrollTop;
    var scrollLeft = element.scrollLeft;
    var magnitudeX = Math.abs(deltaX);
    var magnitudeY = Math.abs(deltaY);

    if (magnitudeY > magnitudeX) {
      // user is perhaps trying to swipe up/down the page

      if (((deltaY < 0) && (scrollTop === i.contentHeight - i.containerHeight)) ||
          ((deltaY > 0) && (scrollTop === 0))) {
        return !i.settings.swipePropagation;
      }
    } else if (magnitudeX > magnitudeY) {
      // user is perhaps trying to swipe left/right across the page

      if (((deltaX < 0) && (scrollLeft === i.contentWidth - i.containerWidth)) ||
          ((deltaX > 0) && (scrollLeft === 0))) {
        return !i.settings.swipePropagation;
      }
    }

    return true;
  }

  function applyTouchMove(differenceX, differenceY) {
    updateScroll(element, 'top', element.scrollTop - differenceY);
    updateScroll(element, 'left', element.scrollLeft - differenceX);

    updateGeometry(element);
  }

  var startOffset = {};
  var startTime = 0;
  var speed = {};
  var easingLoop = null;
  var inGlobalTouch = false;
  var inLocalTouch = false;

  function globalTouchStart() {
    inGlobalTouch = true;
  }
  function globalTouchEnd() {
    inGlobalTouch = false;
  }

  function getTouch(e) {
    if (e.targetTouches) {
      return e.targetTouches[0];
    } else {
      // Maybe IE pointer
      return e;
    }
  }
  function shouldHandle(e) {
    if (e.targetTouches && e.targetTouches.length === 1) {
      return true;
    }
    if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== e.MSPOINTER_TYPE_MOUSE) {
      return true;
    }
    return false;
  }
  function touchStart(e) {
    if (shouldHandle(e)) {
      inLocalTouch = true;

      var touch = getTouch(e);

      startOffset.pageX = touch.pageX;
      startOffset.pageY = touch.pageY;

      startTime = (new Date()).getTime();

      if (easingLoop !== null) {
        clearInterval(easingLoop);
      }

      e.stopPropagation();
    }
  }
  function touchMove(e) {
    if (!inLocalTouch && i.settings.swipePropagation) {
      touchStart(e);
    }
    if (!inGlobalTouch && inLocalTouch && shouldHandle(e)) {
      var touch = getTouch(e);

      var currentOffset = {pageX: touch.pageX, pageY: touch.pageY};

      var differenceX = currentOffset.pageX - startOffset.pageX;
      var differenceY = currentOffset.pageY - startOffset.pageY;

      applyTouchMove(differenceX, differenceY);
      startOffset = currentOffset;

      var currentTime = (new Date()).getTime();

      var timeGap = currentTime - startTime;
      if (timeGap > 0) {
        speed.x = differenceX / timeGap;
        speed.y = differenceY / timeGap;
        startTime = currentTime;
      }

      if (shouldPreventDefault(differenceX, differenceY)) {
        e.stopPropagation();
        e.preventDefault();
      }
    }
  }
  function touchEnd() {
    if (!inGlobalTouch && inLocalTouch) {
      inLocalTouch = false;

      clearInterval(easingLoop);
      easingLoop = setInterval(function () {
        if (!instances.get(element)) {
          clearInterval(easingLoop);
          return;
        }

        if (Math.abs(speed.x) < 0.01 && Math.abs(speed.y) < 0.01) {
          clearInterval(easingLoop);
          return;
        }

        applyTouchMove(speed.x * 30, speed.y * 30);

        speed.x *= 0.8;
        speed.y *= 0.8;
      }, 10);
    }
  }

  if (supportsTouch) {
    i.event.bind(window, 'touchstart', globalTouchStart);
    i.event.bind(window, 'touchend', globalTouchEnd);
    i.event.bind(element, 'touchstart', touchStart);
    i.event.bind(element, 'touchmove', touchMove);
    i.event.bind(element, 'touchend', touchEnd);
  }

  if (supportsIePointer) {
    if (window.PointerEvent) {
      i.event.bind(window, 'pointerdown', globalTouchStart);
      i.event.bind(window, 'pointerup', globalTouchEnd);
      i.event.bind(element, 'pointerdown', touchStart);
      i.event.bind(element, 'pointermove', touchMove);
      i.event.bind(element, 'pointerup', touchEnd);
    } else if (window.MSPointerEvent) {
      i.event.bind(window, 'MSPointerDown', globalTouchStart);
      i.event.bind(window, 'MSPointerUp', globalTouchEnd);
      i.event.bind(element, 'MSPointerDown', touchStart);
      i.event.bind(element, 'MSPointerMove', touchMove);
      i.event.bind(element, 'MSPointerUp', touchEnd);
    }
  }
}

module.exports = function (element) {
  if (!_.env.supportsTouch && !_.env.supportsIePointer) {
    return;
  }

  var i = instances.get(element);
  bindTouchHandler(element, i, _.env.supportsTouch, _.env.supportsIePointer);
};

},{"../../lib/helper":6,"../instances":18,"../update-geometry":19,"../update-scroll":20}],17:[function(require,module,exports){
'use strict';

var _ = require('../lib/helper');
var cls = require('../lib/class');
var instances = require('./instances');
var updateGeometry = require('./update-geometry');

// Handlers
var handlers = {
  'click-rail': require('./handler/click-rail'),
  'drag-scrollbar': require('./handler/drag-scrollbar'),
  'keyboard': require('./handler/keyboard'),
  'wheel': require('./handler/mouse-wheel'),
  'touch': require('./handler/touch'),
  'selection': require('./handler/selection')
};
var nativeScrollHandler = require('./handler/native-scroll');

module.exports = function (element, userSettings) {
  userSettings = typeof userSettings === 'object' ? userSettings : {};

  cls.add(element, 'ps-container');

  // Create a plugin instance.
  var i = instances.add(element);

  i.settings = _.extend(i.settings, userSettings);
  cls.add(element, 'ps-theme-' + i.settings.theme);

  i.settings.handlers.forEach(function (handlerName) {
    handlers[handlerName](element);
  });

  nativeScrollHandler(element);

  updateGeometry(element);
};

},{"../lib/class":2,"../lib/helper":6,"./handler/click-rail":10,"./handler/drag-scrollbar":11,"./handler/keyboard":12,"./handler/mouse-wheel":13,"./handler/native-scroll":14,"./handler/selection":15,"./handler/touch":16,"./instances":18,"./update-geometry":19}],18:[function(require,module,exports){
'use strict';

var _ = require('../lib/helper');
var cls = require('../lib/class');
var defaultSettings = require('./default-setting');
var dom = require('../lib/dom');
var EventManager = require('../lib/event-manager');
var guid = require('../lib/guid');

var instances = {};

function Instance(element) {
  var i = this;

  i.settings = _.clone(defaultSettings);
  i.containerWidth = null;
  i.containerHeight = null;
  i.contentWidth = null;
  i.contentHeight = null;

  i.isRtl = dom.css(element, 'direction') === "rtl";
  i.isNegativeScroll = (function () {
    var originalScrollLeft = element.scrollLeft;
    var result = null;
    element.scrollLeft = -1;
    result = element.scrollLeft < 0;
    element.scrollLeft = originalScrollLeft;
    return result;
  })();
  i.negativeScrollAdjustment = i.isNegativeScroll ? element.scrollWidth - element.clientWidth : 0;
  i.event = new EventManager();
  i.ownerDocument = element.ownerDocument || document;

  function focus() {
    cls.add(element, 'ps-focus');
  }

  function blur() {
    cls.remove(element, 'ps-focus');
  }

  i.scrollbarXRail = dom.appendTo(dom.e('div', 'ps-scrollbar-x-rail'), element);
  i.scrollbarX = dom.appendTo(dom.e('div', 'ps-scrollbar-x'), i.scrollbarXRail);
  i.scrollbarX.setAttribute('tabindex', 0);
  i.event.bind(i.scrollbarX, 'focus', focus);
  i.event.bind(i.scrollbarX, 'blur', blur);
  i.scrollbarXActive = null;
  i.scrollbarXWidth = null;
  i.scrollbarXLeft = null;
  i.scrollbarXBottom = _.toInt(dom.css(i.scrollbarXRail, 'bottom'));
  i.isScrollbarXUsingBottom = i.scrollbarXBottom === i.scrollbarXBottom; // !isNaN
  i.scrollbarXTop = i.isScrollbarXUsingBottom ? null : _.toInt(dom.css(i.scrollbarXRail, 'top'));
  i.railBorderXWidth = _.toInt(dom.css(i.scrollbarXRail, 'borderLeftWidth')) + _.toInt(dom.css(i.scrollbarXRail, 'borderRightWidth'));
  // Set rail to display:block to calculate margins
  dom.css(i.scrollbarXRail, 'display', 'block');
  i.railXMarginWidth = _.toInt(dom.css(i.scrollbarXRail, 'marginLeft')) + _.toInt(dom.css(i.scrollbarXRail, 'marginRight'));
  dom.css(i.scrollbarXRail, 'display', '');
  i.railXWidth = null;
  i.railXRatio = null;

  i.scrollbarYRail = dom.appendTo(dom.e('div', 'ps-scrollbar-y-rail'), element);
  i.scrollbarY = dom.appendTo(dom.e('div', 'ps-scrollbar-y'), i.scrollbarYRail);
  i.scrollbarY.setAttribute('tabindex', 0);
  i.event.bind(i.scrollbarY, 'focus', focus);
  i.event.bind(i.scrollbarY, 'blur', blur);
  i.scrollbarYActive = null;
  i.scrollbarYHeight = null;
  i.scrollbarYTop = null;
  i.scrollbarYRight = _.toInt(dom.css(i.scrollbarYRail, 'right'));
  i.isScrollbarYUsingRight = i.scrollbarYRight === i.scrollbarYRight; // !isNaN
  i.scrollbarYLeft = i.isScrollbarYUsingRight ? null : _.toInt(dom.css(i.scrollbarYRail, 'left'));
  i.scrollbarYOuterWidth = i.isRtl ? _.outerWidth(i.scrollbarY) : null;
  i.railBorderYWidth = _.toInt(dom.css(i.scrollbarYRail, 'borderTopWidth')) + _.toInt(dom.css(i.scrollbarYRail, 'borderBottomWidth'));
  dom.css(i.scrollbarYRail, 'display', 'block');
  i.railYMarginHeight = _.toInt(dom.css(i.scrollbarYRail, 'marginTop')) + _.toInt(dom.css(i.scrollbarYRail, 'marginBottom'));
  dom.css(i.scrollbarYRail, 'display', '');
  i.railYHeight = null;
  i.railYRatio = null;
}

function getId(element) {
  return element.getAttribute('data-ps-id');
}

function setId(element, id) {
  element.setAttribute('data-ps-id', id);
}

function removeId(element) {
  element.removeAttribute('data-ps-id');
}

exports.add = function (element) {
  var newId = guid();
  setId(element, newId);
  instances[newId] = new Instance(element);
  return instances[newId];
};

exports.remove = function (element) {
  delete instances[getId(element)];
  removeId(element);
};

exports.get = function (element) {
  return instances[getId(element)];
};

},{"../lib/class":2,"../lib/dom":3,"../lib/event-manager":4,"../lib/guid":5,"../lib/helper":6,"./default-setting":8}],19:[function(require,module,exports){
'use strict';

var _ = require('../lib/helper');
var cls = require('../lib/class');
var dom = require('../lib/dom');
var instances = require('./instances');
var updateScroll = require('./update-scroll');

function getThumbSize(i, thumbSize) {
  if (i.settings.minScrollbarLength) {
    thumbSize = Math.max(thumbSize, i.settings.minScrollbarLength);
  }
  if (i.settings.maxScrollbarLength) {
    thumbSize = Math.min(thumbSize, i.settings.maxScrollbarLength);
  }
  return thumbSize;
}

function updateCss(element, i) {
  var xRailOffset = {width: i.railXWidth};
  if (i.isRtl) {
    xRailOffset.left = i.negativeScrollAdjustment + element.scrollLeft + i.containerWidth - i.contentWidth;
  } else {
    xRailOffset.left = element.scrollLeft;
  }
  if (i.isScrollbarXUsingBottom) {
    xRailOffset.bottom = i.scrollbarXBottom - element.scrollTop;
  } else {
    xRailOffset.top = i.scrollbarXTop + element.scrollTop;
  }
  dom.css(i.scrollbarXRail, xRailOffset);

  var yRailOffset = {top: element.scrollTop, height: i.railYHeight};
  if (i.isScrollbarYUsingRight) {
    if (i.isRtl) {
      yRailOffset.right = i.contentWidth - (i.negativeScrollAdjustment + element.scrollLeft) - i.scrollbarYRight - i.scrollbarYOuterWidth;
    } else {
      yRailOffset.right = i.scrollbarYRight - element.scrollLeft;
    }
  } else {
    if (i.isRtl) {
      yRailOffset.left = i.negativeScrollAdjustment + element.scrollLeft + i.containerWidth * 2 - i.contentWidth - i.scrollbarYLeft - i.scrollbarYOuterWidth;
    } else {
      yRailOffset.left = i.scrollbarYLeft + element.scrollLeft;
    }
  }
  dom.css(i.scrollbarYRail, yRailOffset);

  dom.css(i.scrollbarX, {left: i.scrollbarXLeft, width: i.scrollbarXWidth - i.railBorderXWidth});
  dom.css(i.scrollbarY, {top: i.scrollbarYTop, height: i.scrollbarYHeight - i.railBorderYWidth});
}

module.exports = function (element) {
  var i = instances.get(element);

  i.containerWidth = element.clientWidth;
  i.containerHeight = element.clientHeight;
  i.contentWidth = element.scrollWidth;
  i.contentHeight = element.scrollHeight;

  var existingRails;
  if (!element.contains(i.scrollbarXRail)) {
    existingRails = dom.queryChildren(element, '.ps-scrollbar-x-rail');
    if (existingRails.length > 0) {
      existingRails.forEach(function (rail) {
        dom.remove(rail);
      });
    }
    dom.appendTo(i.scrollbarXRail, element);
  }
  if (!element.contains(i.scrollbarYRail)) {
    existingRails = dom.queryChildren(element, '.ps-scrollbar-y-rail');
    if (existingRails.length > 0) {
      existingRails.forEach(function (rail) {
        dom.remove(rail);
      });
    }
    dom.appendTo(i.scrollbarYRail, element);
  }

  if (!i.settings.suppressScrollX && i.containerWidth + i.settings.scrollXMarginOffset < i.contentWidth) {
    i.scrollbarXActive = true;
    i.railXWidth = i.containerWidth - i.railXMarginWidth;
    i.railXRatio = i.containerWidth / i.railXWidth;
    i.scrollbarXWidth = getThumbSize(i, _.toInt(i.railXWidth * i.containerWidth / i.contentWidth));
    i.scrollbarXLeft = _.toInt((i.negativeScrollAdjustment + element.scrollLeft) * (i.railXWidth - i.scrollbarXWidth) / (i.contentWidth - i.containerWidth));
  } else {
    i.scrollbarXActive = false;
  }

  if (!i.settings.suppressScrollY && i.containerHeight + i.settings.scrollYMarginOffset < i.contentHeight) {
    i.scrollbarYActive = true;
    i.railYHeight = i.containerHeight - i.railYMarginHeight;
    i.railYRatio = i.containerHeight / i.railYHeight;
    i.scrollbarYHeight = getThumbSize(i, _.toInt(i.railYHeight * i.containerHeight / i.contentHeight));
    i.scrollbarYTop = _.toInt(element.scrollTop * (i.railYHeight - i.scrollbarYHeight) / (i.contentHeight - i.containerHeight));
  } else {
    i.scrollbarYActive = false;
  }

  if (i.scrollbarXLeft >= i.railXWidth - i.scrollbarXWidth) {
    i.scrollbarXLeft = i.railXWidth - i.scrollbarXWidth;
  }
  if (i.scrollbarYTop >= i.railYHeight - i.scrollbarYHeight) {
    i.scrollbarYTop = i.railYHeight - i.scrollbarYHeight;
  }

  updateCss(element, i);

  if (i.scrollbarXActive) {
    cls.add(element, 'ps-active-x');
  } else {
    cls.remove(element, 'ps-active-x');
    i.scrollbarXWidth = 0;
    i.scrollbarXLeft = 0;
    updateScroll(element, 'left', 0);
  }
  if (i.scrollbarYActive) {
    cls.add(element, 'ps-active-y');
  } else {
    cls.remove(element, 'ps-active-y');
    i.scrollbarYHeight = 0;
    i.scrollbarYTop = 0;
    updateScroll(element, 'top', 0);
  }
};

},{"../lib/class":2,"../lib/dom":3,"../lib/helper":6,"./instances":18,"./update-scroll":20}],20:[function(require,module,exports){
'use strict';

var instances = require('./instances');

var upEvent = document.createEvent('Event');
var downEvent = document.createEvent('Event');
var leftEvent = document.createEvent('Event');
var rightEvent = document.createEvent('Event');
var yEvent = document.createEvent('Event');
var xEvent = document.createEvent('Event');
var xStartEvent = document.createEvent('Event');
var xEndEvent = document.createEvent('Event');
var yStartEvent = document.createEvent('Event');
var yEndEvent = document.createEvent('Event');
var lastTop;
var lastLeft;

upEvent.initEvent('ps-scroll-up', true, true);
downEvent.initEvent('ps-scroll-down', true, true);
leftEvent.initEvent('ps-scroll-left', true, true);
rightEvent.initEvent('ps-scroll-right', true, true);
yEvent.initEvent('ps-scroll-y', true, true);
xEvent.initEvent('ps-scroll-x', true, true);
xStartEvent.initEvent('ps-x-reach-start', true, true);
xEndEvent.initEvent('ps-x-reach-end', true, true);
yStartEvent.initEvent('ps-y-reach-start', true, true);
yEndEvent.initEvent('ps-y-reach-end', true, true);

module.exports = function (element, axis, value) {
  if (typeof element === 'undefined') {
    throw 'You must provide an element to the update-scroll function';
  }

  if (typeof axis === 'undefined') {
    throw 'You must provide an axis to the update-scroll function';
  }

  if (typeof value === 'undefined') {
    throw 'You must provide a value to the update-scroll function';
  }

  if (axis === 'top' && value <= 0) {
    element.scrollTop = value = 0; // don't allow negative scroll
    element.dispatchEvent(yStartEvent);
  }

  if (axis === 'left' && value <= 0) {
    element.scrollLeft = value = 0; // don't allow negative scroll
    element.dispatchEvent(xStartEvent);
  }

  var i = instances.get(element);

  if (axis === 'top' && value >= i.contentHeight - i.containerHeight) {
    // don't allow scroll past container
    value = i.contentHeight - i.containerHeight;
    if (value - element.scrollTop <= 1) {
      // mitigates rounding errors on non-subpixel scroll values
      value = element.scrollTop;
    } else {
      element.scrollTop = value;
    }
    element.dispatchEvent(yEndEvent);
  }

  if (axis === 'left' && value >= i.contentWidth - i.containerWidth) {
    // don't allow scroll past container
    value = i.contentWidth - i.containerWidth;
    if (value - element.scrollLeft <= 1) {
      // mitigates rounding errors on non-subpixel scroll values
      value = element.scrollLeft;
    } else {
      element.scrollLeft = value;
    }
    element.dispatchEvent(xEndEvent);
  }

  if (!lastTop) {
    lastTop = element.scrollTop;
  }

  if (!lastLeft) {
    lastLeft = element.scrollLeft;
  }

  if (axis === 'top' && value < lastTop) {
    element.dispatchEvent(upEvent);
  }

  if (axis === 'top' && value > lastTop) {
    element.dispatchEvent(downEvent);
  }

  if (axis === 'left' && value < lastLeft) {
    element.dispatchEvent(leftEvent);
  }

  if (axis === 'left' && value > lastLeft) {
    element.dispatchEvent(rightEvent);
  }

  if (axis === 'top') {
    element.scrollTop = lastTop = value;
    element.dispatchEvent(yEvent);
  }

  if (axis === 'left') {
    element.scrollLeft = lastLeft = value;
    element.dispatchEvent(xEvent);
  }

};

},{"./instances":18}],21:[function(require,module,exports){
'use strict';

var _ = require('../lib/helper');
var dom = require('../lib/dom');
var instances = require('./instances');
var updateGeometry = require('./update-geometry');
var updateScroll = require('./update-scroll');

module.exports = function (element) {
  var i = instances.get(element);

  if (!i) {
    return;
  }

  // Recalcuate negative scrollLeft adjustment
  i.negativeScrollAdjustment = i.isNegativeScroll ? element.scrollWidth - element.clientWidth : 0;

  // Recalculate rail margins
  dom.css(i.scrollbarXRail, 'display', 'block');
  dom.css(i.scrollbarYRail, 'display', 'block');
  i.railXMarginWidth = _.toInt(dom.css(i.scrollbarXRail, 'marginLeft')) + _.toInt(dom.css(i.scrollbarXRail, 'marginRight'));
  i.railYMarginHeight = _.toInt(dom.css(i.scrollbarYRail, 'marginTop')) + _.toInt(dom.css(i.scrollbarYRail, 'marginBottom'));

  // Hide scrollbars not to affect scrollWidth and scrollHeight
  dom.css(i.scrollbarXRail, 'display', 'none');
  dom.css(i.scrollbarYRail, 'display', 'none');

  updateGeometry(element);

  // Update top/left scroll to trigger events
  updateScroll(element, 'top', element.scrollTop);
  updateScroll(element, 'left', element.scrollLeft);

  dom.css(i.scrollbarXRail, 'display', '');
  dom.css(i.scrollbarYRail, 'display', '');
};

},{"../lib/dom":3,"../lib/helper":6,"./instances":18,"./update-geometry":19,"./update-scroll":20}]},{},[1]);

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
  var CountTo = function (element, options) {
    this.$element = $(element);
    this.options  = $.extend({}, CountTo.DEFAULTS, this.dataOptions(), options);
    this.init();
  };

  CountTo.DEFAULTS = {
    from: 0,               // the number the element should start at
    to: 0,                 // the number the element should end at
    speed: 1000,           // how long it should take to count between the target numbers
    refreshInterval: 100,  // how often the element should be updated
    decimals: 0,           // the number of decimal places to show
    formatter: formatter,  // handler for formatting the value before rendering
    onUpdate: null,        // callback method for every time the element is updated
    onComplete: null       // callback method for when the element finishes updating
  };

  CountTo.prototype.init = function () {
    this.value     = this.options.from;
    this.loops     = Math.ceil(this.options.speed / this.options.refreshInterval);
    this.loopCount = 0;
    this.increment = (this.options.to - this.options.from) / this.loops;
  };

  CountTo.prototype.dataOptions = function () {
    var options = {
      from:            this.$element.data('from'),
      to:              this.$element.data('to'),
      speed:           this.$element.data('speed'),
      refreshInterval: this.$element.data('refresh-interval'),
      decimals:        this.$element.data('decimals')
    };

    var keys = Object.keys(options);

    for (var i in keys) {
      var key = keys[i];

      if (typeof(options[key]) === 'undefined') {
        delete options[key];
      }
    }

    return options;
  };

  CountTo.prototype.update = function () {
    this.value += this.increment;
    this.loopCount++;

    this.render();

    if (typeof(this.options.onUpdate) == 'function') {
      this.options.onUpdate.call(this.$element, this.value);
    }

    if (this.loopCount >= this.loops) {
      clearInterval(this.interval);
      this.value = this.options.to;

      if (typeof(this.options.onComplete) == 'function') {
        this.options.onComplete.call(this.$element, this.value);
      }
    }
  };

  CountTo.prototype.render = function () {
    var formattedValue = this.options.formatter.call(this.$element, this.value, this.options);
    this.$element.text(formattedValue);
  };

  CountTo.prototype.restart = function () {
    this.stop();
    this.init();
    this.start();
  };

  CountTo.prototype.start = function () {
    this.stop();
    this.render();
    this.interval = setInterval(this.update.bind(this), this.options.refreshInterval);
  };

  CountTo.prototype.stop = function () {
    if (this.interval) {
      clearInterval(this.interval);
    }
  };

  CountTo.prototype.toggle = function () {
    if (this.interval) {
      this.stop();
    } else {
      this.start();
    }
  };

  function formatter(value, options) {
    return value.toFixed(options.decimals);
  }

  $.fn.countTo = function (option) {
    return this.each(function () {
      var $this   = $(this);
      var data    = $this.data('countTo');
      var init    = !data || typeof(option) === 'object';
      var options = typeof(option) === 'object' ? option : {};
      var method  = typeof(option) === 'string' ? option : 'start';

      if (init) {
        if (data) data.stop();
        $this.data('countTo', data = new CountTo(this, options));
      }

      data[method].call(data);
    });
  };
}));

/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

 Version: 1.5.9
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues

 */
!function(a){"use strict";"function"==typeof define&&define.amd?define(["jquery"],a):"undefined"!=typeof exports?module.exports=a(require("jquery")):a(jQuery)}(function(a){"use strict";var b=window.Slick||{};b=function(){function c(c,d){var f,e=this;e.defaults={accessibility:!0,adaptiveHeight:!1,appendArrows:a(c),appendDots:a(c),arrows:!0,asNavFor:null,prevArrow:'<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>',nextArrow:'<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',autoplay:!1,autoplaySpeed:3e3,centerMode:!1,centerPadding:"50px",cssEase:"ease",customPaging:function(a,b){return'<button type="button" data-role="none" role="button" aria-required="false" tabindex="0">'+(b+1)+"</button>"},dots:!1,dotsClass:"slick-dots",draggable:!0,easing:"linear",edgeFriction:.35,fade:!1,focusOnSelect:!1,infinite:!0,initialSlide:0,lazyLoad:"ondemand",mobileFirst:!1,pauseOnHover:!0,pauseOnDotsHover:!1,respondTo:"window",responsive:null,rows:1,rtl:!1,slide:"",slidesPerRow:1,slidesToShow:1,slidesToScroll:1,speed:500,swipe:!0,swipeToSlide:!1,touchMove:!0,touchThreshold:5,useCSS:!0,useTransform:!1,variableWidth:!1,vertical:!1,verticalSwiping:!1,waitForAnimate:!0,zIndex:1e3},e.initials={animating:!1,dragging:!1,autoPlayTimer:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,$dots:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$prevArrow:null,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:!1,slideOffset:0,swipeLeft:null,$list:null,touchObject:{},transformsEnabled:!1,unslicked:!1},a.extend(e,e.initials),e.activeBreakpoint=null,e.animType=null,e.animProp=null,e.breakpoints=[],e.breakpointSettings=[],e.cssTransitions=!1,e.hidden="hidden",e.paused=!1,e.positionProp=null,e.respondTo=null,e.rowCount=1,e.shouldClick=!0,e.$slider=a(c),e.$slidesCache=null,e.transformType=null,e.transitionType=null,e.visibilityChange="visibilitychange",e.windowWidth=0,e.windowTimer=null,f=a(c).data("slick")||{},e.options=a.extend({},e.defaults,f,d),e.currentSlide=e.options.initialSlide,e.originalSettings=e.options,"undefined"!=typeof document.mozHidden?(e.hidden="mozHidden",e.visibilityChange="mozvisibilitychange"):"undefined"!=typeof document.webkitHidden&&(e.hidden="webkitHidden",e.visibilityChange="webkitvisibilitychange"),e.autoPlay=a.proxy(e.autoPlay,e),e.autoPlayClear=a.proxy(e.autoPlayClear,e),e.changeSlide=a.proxy(e.changeSlide,e),e.clickHandler=a.proxy(e.clickHandler,e),e.selectHandler=a.proxy(e.selectHandler,e),e.setPosition=a.proxy(e.setPosition,e),e.swipeHandler=a.proxy(e.swipeHandler,e),e.dragHandler=a.proxy(e.dragHandler,e),e.keyHandler=a.proxy(e.keyHandler,e),e.autoPlayIterator=a.proxy(e.autoPlayIterator,e),e.instanceUid=b++,e.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/,e.registerBreakpoints(),e.init(!0),e.checkResponsive(!0)}var b=0;return c}(),b.prototype.addSlide=b.prototype.slickAdd=function(b,c,d){var e=this;if("boolean"==typeof c)d=c,c=null;else if(0>c||c>=e.slideCount)return!1;e.unload(),"number"==typeof c?0===c&&0===e.$slides.length?a(b).appendTo(e.$slideTrack):d?a(b).insertBefore(e.$slides.eq(c)):a(b).insertAfter(e.$slides.eq(c)):d===!0?a(b).prependTo(e.$slideTrack):a(b).appendTo(e.$slideTrack),e.$slides=e.$slideTrack.children(this.options.slide),e.$slideTrack.children(this.options.slide).detach(),e.$slideTrack.append(e.$slides),e.$slides.each(function(b,c){a(c).attr("data-slick-index",b)}),e.$slidesCache=e.$slides,e.reinit()},b.prototype.animateHeight=function(){var a=this;if(1===a.options.slidesToShow&&a.options.adaptiveHeight===!0&&a.options.vertical===!1){var b=a.$slides.eq(a.currentSlide).outerHeight(!0);a.$list.animate({height:b},a.options.speed)}},b.prototype.animateSlide=function(b,c){var d={},e=this;e.animateHeight(),e.options.rtl===!0&&e.options.vertical===!1&&(b=-b),e.transformsEnabled===!1?e.options.vertical===!1?e.$slideTrack.animate({left:b},e.options.speed,e.options.easing,c):e.$slideTrack.animate({top:b},e.options.speed,e.options.easing,c):e.cssTransitions===!1?(e.options.rtl===!0&&(e.currentLeft=-e.currentLeft),a({animStart:e.currentLeft}).animate({animStart:b},{duration:e.options.speed,easing:e.options.easing,step:function(a){a=Math.ceil(a),e.options.vertical===!1?(d[e.animType]="translate("+a+"px, 0px)",e.$slideTrack.css(d)):(d[e.animType]="translate(0px,"+a+"px)",e.$slideTrack.css(d))},complete:function(){c&&c.call()}})):(e.applyTransition(),b=Math.ceil(b),e.options.vertical===!1?d[e.animType]="translate3d("+b+"px, 0px, 0px)":d[e.animType]="translate3d(0px,"+b+"px, 0px)",e.$slideTrack.css(d),c&&setTimeout(function(){e.disableTransition(),c.call()},e.options.speed))},b.prototype.asNavFor=function(b){var c=this,d=c.options.asNavFor;d&&null!==d&&(d=a(d).not(c.$slider)),null!==d&&"object"==typeof d&&d.each(function(){var c=a(this).slick("getSlick");c.unslicked||c.slideHandler(b,!0)})},b.prototype.applyTransition=function(a){var b=this,c={};b.options.fade===!1?c[b.transitionType]=b.transformType+" "+b.options.speed+"ms "+b.options.cssEase:c[b.transitionType]="opacity "+b.options.speed+"ms "+b.options.cssEase,b.options.fade===!1?b.$slideTrack.css(c):b.$slides.eq(a).css(c)},b.prototype.autoPlay=function(){var a=this;a.autoPlayTimer&&clearInterval(a.autoPlayTimer),a.slideCount>a.options.slidesToShow&&a.paused!==!0&&(a.autoPlayTimer=setInterval(a.autoPlayIterator,a.options.autoplaySpeed))},b.prototype.autoPlayClear=function(){var a=this;a.autoPlayTimer&&clearInterval(a.autoPlayTimer)},b.prototype.autoPlayIterator=function(){var a=this;a.options.infinite===!1?1===a.direction?(a.currentSlide+1===a.slideCount-1&&(a.direction=0),a.slideHandler(a.currentSlide+a.options.slidesToScroll)):(a.currentSlide-1===0&&(a.direction=1),a.slideHandler(a.currentSlide-a.options.slidesToScroll)):a.slideHandler(a.currentSlide+a.options.slidesToScroll)},b.prototype.buildArrows=function(){var b=this;b.options.arrows===!0&&(b.$prevArrow=a(b.options.prevArrow).addClass("slick-arrow"),b.$nextArrow=a(b.options.nextArrow).addClass("slick-arrow"),b.slideCount>b.options.slidesToShow?(b.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),b.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),b.htmlExpr.test(b.options.prevArrow)&&b.$prevArrow.prependTo(b.options.appendArrows),b.htmlExpr.test(b.options.nextArrow)&&b.$nextArrow.appendTo(b.options.appendArrows),b.options.infinite!==!0&&b.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true")):b.$prevArrow.add(b.$nextArrow).addClass("slick-hidden").attr({"aria-disabled":"true",tabindex:"-1"}))},b.prototype.buildDots=function(){var c,d,b=this;if(b.options.dots===!0&&b.slideCount>b.options.slidesToShow){for(d='<ul class="'+b.options.dotsClass+'">',c=0;c<=b.getDotCount();c+=1)d+="<li>"+b.options.customPaging.call(this,b,c)+"</li>";d+="</ul>",b.$dots=a(d).appendTo(b.options.appendDots),b.$dots.find("li").first().addClass("slick-active").attr("aria-hidden","false")}},b.prototype.buildOut=function(){var b=this;b.$slides=b.$slider.children(b.options.slide+":not(.slick-cloned)").addClass("slick-slide"),b.slideCount=b.$slides.length,b.$slides.each(function(b,c){a(c).attr("data-slick-index",b).data("originalStyling",a(c).attr("style")||"")}),b.$slider.addClass("slick-slider"),b.$slideTrack=0===b.slideCount?a('<div class="slick-track"/>').appendTo(b.$slider):b.$slides.wrapAll('<div class="slick-track"/>').parent(),b.$list=b.$slideTrack.wrap('<div aria-live="polite" class="slick-list"/>').parent(),b.$slideTrack.css("opacity",0),(b.options.centerMode===!0||b.options.swipeToSlide===!0)&&(b.options.slidesToScroll=1),a("img[data-lazy]",b.$slider).not("[src]").addClass("slick-loading"),b.setupInfinite(),b.buildArrows(),b.buildDots(),b.updateDots(),b.setSlideClasses("number"==typeof b.currentSlide?b.currentSlide:0),b.options.draggable===!0&&b.$list.addClass("draggable")},b.prototype.buildRows=function(){var b,c,d,e,f,g,h,a=this;if(e=document.createDocumentFragment(),g=a.$slider.children(),a.options.rows>1){for(h=a.options.slidesPerRow*a.options.rows,f=Math.ceil(g.length/h),b=0;f>b;b++){var i=document.createElement("div");for(c=0;c<a.options.rows;c++){var j=document.createElement("div");for(d=0;d<a.options.slidesPerRow;d++){var k=b*h+(c*a.options.slidesPerRow+d);g.get(k)&&j.appendChild(g.get(k))}i.appendChild(j)}e.appendChild(i)}a.$slider.html(e),a.$slider.children().children().children().css({width:100/a.options.slidesPerRow+"%",display:"inline-block"})}},b.prototype.checkResponsive=function(b,c){var e,f,g,d=this,h=!1,i=d.$slider.width(),j=window.innerWidth||a(window).width();if("window"===d.respondTo?g=j:"slider"===d.respondTo?g=i:"min"===d.respondTo&&(g=Math.min(j,i)),d.options.responsive&&d.options.responsive.length&&null!==d.options.responsive){f=null;for(e in d.breakpoints)d.breakpoints.hasOwnProperty(e)&&(d.originalSettings.mobileFirst===!1?g<d.breakpoints[e]&&(f=d.breakpoints[e]):g>d.breakpoints[e]&&(f=d.breakpoints[e]));null!==f?null!==d.activeBreakpoint?(f!==d.activeBreakpoint||c)&&(d.activeBreakpoint=f,"unslick"===d.breakpointSettings[f]?d.unslick(f):(d.options=a.extend({},d.originalSettings,d.breakpointSettings[f]),b===!0&&(d.currentSlide=d.options.initialSlide),d.refresh(b)),h=f):(d.activeBreakpoint=f,"unslick"===d.breakpointSettings[f]?d.unslick(f):(d.options=a.extend({},d.originalSettings,d.breakpointSettings[f]),b===!0&&(d.currentSlide=d.options.initialSlide),d.refresh(b)),h=f):null!==d.activeBreakpoint&&(d.activeBreakpoint=null,d.options=d.originalSettings,b===!0&&(d.currentSlide=d.options.initialSlide),d.refresh(b),h=f),b||h===!1||d.$slider.trigger("breakpoint",[d,h])}},b.prototype.changeSlide=function(b,c){var f,g,h,d=this,e=a(b.target);switch(e.is("a")&&b.preventDefault(),e.is("li")||(e=e.closest("li")),h=d.slideCount%d.options.slidesToScroll!==0,f=h?0:(d.slideCount-d.currentSlide)%d.options.slidesToScroll,b.data.message){case"previous":g=0===f?d.options.slidesToScroll:d.options.slidesToShow-f,d.slideCount>d.options.slidesToShow&&d.slideHandler(d.currentSlide-g,!1,c);break;case"next":g=0===f?d.options.slidesToScroll:f,d.slideCount>d.options.slidesToShow&&d.slideHandler(d.currentSlide+g,!1,c);break;case"index":var i=0===b.data.index?0:b.data.index||e.index()*d.options.slidesToScroll;d.slideHandler(d.checkNavigable(i),!1,c),e.children().trigger("focus");break;default:return}},b.prototype.checkNavigable=function(a){var c,d,b=this;if(c=b.getNavigableIndexes(),d=0,a>c[c.length-1])a=c[c.length-1];else for(var e in c){if(a<c[e]){a=d;break}d=c[e]}return a},b.prototype.cleanUpEvents=function(){var b=this;b.options.dots&&null!==b.$dots&&(a("li",b.$dots).off("click.slick",b.changeSlide),b.options.pauseOnDotsHover===!0&&b.options.autoplay===!0&&a("li",b.$dots).off("mouseenter.slick",a.proxy(b.setPaused,b,!0)).off("mouseleave.slick",a.proxy(b.setPaused,b,!1))),b.options.arrows===!0&&b.slideCount>b.options.slidesToShow&&(b.$prevArrow&&b.$prevArrow.off("click.slick",b.changeSlide),b.$nextArrow&&b.$nextArrow.off("click.slick",b.changeSlide)),b.$list.off("touchstart.slick mousedown.slick",b.swipeHandler),b.$list.off("touchmove.slick mousemove.slick",b.swipeHandler),b.$list.off("touchend.slick mouseup.slick",b.swipeHandler),b.$list.off("touchcancel.slick mouseleave.slick",b.swipeHandler),b.$list.off("click.slick",b.clickHandler),a(document).off(b.visibilityChange,b.visibility),b.$list.off("mouseenter.slick",a.proxy(b.setPaused,b,!0)),b.$list.off("mouseleave.slick",a.proxy(b.setPaused,b,!1)),b.options.accessibility===!0&&b.$list.off("keydown.slick",b.keyHandler),b.options.focusOnSelect===!0&&a(b.$slideTrack).children().off("click.slick",b.selectHandler),a(window).off("orientationchange.slick.slick-"+b.instanceUid,b.orientationChange),a(window).off("resize.slick.slick-"+b.instanceUid,b.resize),a("[draggable!=true]",b.$slideTrack).off("dragstart",b.preventDefault),a(window).off("load.slick.slick-"+b.instanceUid,b.setPosition),a(document).off("ready.slick.slick-"+b.instanceUid,b.setPosition)},b.prototype.cleanUpRows=function(){var b,a=this;a.options.rows>1&&(b=a.$slides.children().children(),b.removeAttr("style"),a.$slider.html(b))},b.prototype.clickHandler=function(a){var b=this;b.shouldClick===!1&&(a.stopImmediatePropagation(),a.stopPropagation(),a.preventDefault())},b.prototype.destroy=function(b){var c=this;c.autoPlayClear(),c.touchObject={},c.cleanUpEvents(),a(".slick-cloned",c.$slider).detach(),c.$dots&&c.$dots.remove(),c.$prevArrow&&c.$prevArrow.length&&(c.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),c.htmlExpr.test(c.options.prevArrow)&&c.$prevArrow.remove()),c.$nextArrow&&c.$nextArrow.length&&(c.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),c.htmlExpr.test(c.options.nextArrow)&&c.$nextArrow.remove()),c.$slides&&(c.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function(){a(this).attr("style",a(this).data("originalStyling"))}),c.$slideTrack.children(this.options.slide).detach(),c.$slideTrack.detach(),c.$list.detach(),c.$slider.append(c.$slides)),c.cleanUpRows(),c.$slider.removeClass("slick-slider"),c.$slider.removeClass("slick-initialized"),c.unslicked=!0,b||c.$slider.trigger("destroy",[c])},b.prototype.disableTransition=function(a){var b=this,c={};c[b.transitionType]="",b.options.fade===!1?b.$slideTrack.css(c):b.$slides.eq(a).css(c)},b.prototype.fadeSlide=function(a,b){var c=this;c.cssTransitions===!1?(c.$slides.eq(a).css({zIndex:c.options.zIndex}),c.$slides.eq(a).animate({opacity:1},c.options.speed,c.options.easing,b)):(c.applyTransition(a),c.$slides.eq(a).css({opacity:1,zIndex:c.options.zIndex}),b&&setTimeout(function(){c.disableTransition(a),b.call()},c.options.speed))},b.prototype.fadeSlideOut=function(a){var b=this;b.cssTransitions===!1?b.$slides.eq(a).animate({opacity:0,zIndex:b.options.zIndex-2},b.options.speed,b.options.easing):(b.applyTransition(a),b.$slides.eq(a).css({opacity:0,zIndex:b.options.zIndex-2}))},b.prototype.filterSlides=b.prototype.slickFilter=function(a){var b=this;null!==a&&(b.$slidesCache=b.$slides,b.unload(),b.$slideTrack.children(this.options.slide).detach(),b.$slidesCache.filter(a).appendTo(b.$slideTrack),b.reinit())},b.prototype.getCurrent=b.prototype.slickCurrentSlide=function(){var a=this;return a.currentSlide},b.prototype.getDotCount=function(){var a=this,b=0,c=0,d=0;if(a.options.infinite===!0)for(;b<a.slideCount;)++d,b=c+a.options.slidesToScroll,c+=a.options.slidesToScroll<=a.options.slidesToShow?a.options.slidesToScroll:a.options.slidesToShow;else if(a.options.centerMode===!0)d=a.slideCount;else for(;b<a.slideCount;)++d,b=c+a.options.slidesToScroll,c+=a.options.slidesToScroll<=a.options.slidesToShow?a.options.slidesToScroll:a.options.slidesToShow;return d-1},b.prototype.getLeft=function(a){var c,d,f,b=this,e=0;return b.slideOffset=0,d=b.$slides.first().outerHeight(!0),b.options.infinite===!0?(b.slideCount>b.options.slidesToShow&&(b.slideOffset=b.slideWidth*b.options.slidesToShow*-1,e=d*b.options.slidesToShow*-1),b.slideCount%b.options.slidesToScroll!==0&&a+b.options.slidesToScroll>b.slideCount&&b.slideCount>b.options.slidesToShow&&(a>b.slideCount?(b.slideOffset=(b.options.slidesToShow-(a-b.slideCount))*b.slideWidth*-1,e=(b.options.slidesToShow-(a-b.slideCount))*d*-1):(b.slideOffset=b.slideCount%b.options.slidesToScroll*b.slideWidth*-1,e=b.slideCount%b.options.slidesToScroll*d*-1))):a+b.options.slidesToShow>b.slideCount&&(b.slideOffset=(a+b.options.slidesToShow-b.slideCount)*b.slideWidth,e=(a+b.options.slidesToShow-b.slideCount)*d),b.slideCount<=b.options.slidesToShow&&(b.slideOffset=0,e=0),b.options.centerMode===!0&&b.options.infinite===!0?b.slideOffset+=b.slideWidth*Math.floor(b.options.slidesToShow/2)-b.slideWidth:b.options.centerMode===!0&&(b.slideOffset=0,b.slideOffset+=b.slideWidth*Math.floor(b.options.slidesToShow/2)),c=b.options.vertical===!1?a*b.slideWidth*-1+b.slideOffset:a*d*-1+e,b.options.variableWidth===!0&&(f=b.slideCount<=b.options.slidesToShow||b.options.infinite===!1?b.$slideTrack.children(".slick-slide").eq(a):b.$slideTrack.children(".slick-slide").eq(a+b.options.slidesToShow),c=b.options.rtl===!0?f[0]?-1*(b.$slideTrack.width()-f[0].offsetLeft-f.width()):0:f[0]?-1*f[0].offsetLeft:0,b.options.centerMode===!0&&(f=b.slideCount<=b.options.slidesToShow||b.options.infinite===!1?b.$slideTrack.children(".slick-slide").eq(a):b.$slideTrack.children(".slick-slide").eq(a+b.options.slidesToShow+1),c=b.options.rtl===!0?f[0]?-1*(b.$slideTrack.width()-f[0].offsetLeft-f.width()):0:f[0]?-1*f[0].offsetLeft:0,c+=(b.$list.width()-f.outerWidth())/2)),c},b.prototype.getOption=b.prototype.slickGetOption=function(a){var b=this;return b.options[a]},b.prototype.getNavigableIndexes=function(){var e,a=this,b=0,c=0,d=[];for(a.options.infinite===!1?e=a.slideCount:(b=-1*a.options.slidesToScroll,c=-1*a.options.slidesToScroll,e=2*a.slideCount);e>b;)d.push(b),b=c+a.options.slidesToScroll,c+=a.options.slidesToScroll<=a.options.slidesToShow?a.options.slidesToScroll:a.options.slidesToShow;return d},b.prototype.getSlick=function(){return this},b.prototype.getSlideCount=function(){var c,d,e,b=this;return e=b.options.centerMode===!0?b.slideWidth*Math.floor(b.options.slidesToShow/2):0,b.options.swipeToSlide===!0?(b.$slideTrack.find(".slick-slide").each(function(c,f){return f.offsetLeft-e+a(f).outerWidth()/2>-1*b.swipeLeft?(d=f,!1):void 0}),c=Math.abs(a(d).attr("data-slick-index")-b.currentSlide)||1):b.options.slidesToScroll},b.prototype.goTo=b.prototype.slickGoTo=function(a,b){var c=this;c.changeSlide({data:{message:"index",index:parseInt(a)}},b)},b.prototype.init=function(b){var c=this;a(c.$slider).hasClass("slick-initialized")||(a(c.$slider).addClass("slick-initialized"),c.buildRows(),c.buildOut(),c.setProps(),c.startLoad(),c.loadSlider(),c.initializeEvents(),c.updateArrows(),c.updateDots()),b&&c.$slider.trigger("init",[c]),c.options.accessibility===!0&&c.initADA()},b.prototype.initArrowEvents=function(){var a=this;a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.on("click.slick",{message:"previous"},a.changeSlide),a.$nextArrow.on("click.slick",{message:"next"},a.changeSlide))},b.prototype.initDotEvents=function(){var b=this;b.options.dots===!0&&b.slideCount>b.options.slidesToShow&&a("li",b.$dots).on("click.slick",{message:"index"},b.changeSlide),b.options.dots===!0&&b.options.pauseOnDotsHover===!0&&b.options.autoplay===!0&&a("li",b.$dots).on("mouseenter.slick",a.proxy(b.setPaused,b,!0)).on("mouseleave.slick",a.proxy(b.setPaused,b,!1))},b.prototype.initializeEvents=function(){var b=this;b.initArrowEvents(),b.initDotEvents(),b.$list.on("touchstart.slick mousedown.slick",{action:"start"},b.swipeHandler),b.$list.on("touchmove.slick mousemove.slick",{action:"move"},b.swipeHandler),b.$list.on("touchend.slick mouseup.slick",{action:"end"},b.swipeHandler),b.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},b.swipeHandler),b.$list.on("click.slick",b.clickHandler),a(document).on(b.visibilityChange,a.proxy(b.visibility,b)),b.$list.on("mouseenter.slick",a.proxy(b.setPaused,b,!0)),b.$list.on("mouseleave.slick",a.proxy(b.setPaused,b,!1)),b.options.accessibility===!0&&b.$list.on("keydown.slick",b.keyHandler),b.options.focusOnSelect===!0&&a(b.$slideTrack).children().on("click.slick",b.selectHandler),a(window).on("orientationchange.slick.slick-"+b.instanceUid,a.proxy(b.orientationChange,b)),a(window).on("resize.slick.slick-"+b.instanceUid,a.proxy(b.resize,b)),a("[draggable!=true]",b.$slideTrack).on("dragstart",b.preventDefault),a(window).on("load.slick.slick-"+b.instanceUid,b.setPosition),a(document).on("ready.slick.slick-"+b.instanceUid,b.setPosition)},b.prototype.initUI=function(){var a=this;a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.show(),a.$nextArrow.show()),a.options.dots===!0&&a.slideCount>a.options.slidesToShow&&a.$dots.show(),a.options.autoplay===!0&&a.autoPlay()},b.prototype.keyHandler=function(a){var b=this;a.target.tagName.match("TEXTAREA|INPUT|SELECT")||(37===a.keyCode&&b.options.accessibility===!0?b.changeSlide({data:{message:"previous"}}):39===a.keyCode&&b.options.accessibility===!0&&b.changeSlide({data:{message:"next"}}))},b.prototype.lazyLoad=function(){function g(b){a("img[data-lazy]",b).each(function(){var b=a(this),c=a(this).attr("data-lazy"),d=document.createElement("img");d.onload=function(){b.animate({opacity:0},100,function(){b.attr("src",c).animate({opacity:1},200,function(){b.removeAttr("data-lazy").removeClass("slick-loading")})})},d.src=c})}var c,d,e,f,b=this;b.options.centerMode===!0?b.options.infinite===!0?(e=b.currentSlide+(b.options.slidesToShow/2+1),f=e+b.options.slidesToShow+2):(e=Math.max(0,b.currentSlide-(b.options.slidesToShow/2+1)),f=2+(b.options.slidesToShow/2+1)+b.currentSlide):(e=b.options.infinite?b.options.slidesToShow+b.currentSlide:b.currentSlide,f=e+b.options.slidesToShow,b.options.fade===!0&&(e>0&&e--,f<=b.slideCount&&f++)),c=b.$slider.find(".slick-slide").slice(e,f),g(c),b.slideCount<=b.options.slidesToShow?(d=b.$slider.find(".slick-slide"),g(d)):b.currentSlide>=b.slideCount-b.options.slidesToShow?(d=b.$slider.find(".slick-cloned").slice(0,b.options.slidesToShow),g(d)):0===b.currentSlide&&(d=b.$slider.find(".slick-cloned").slice(-1*b.options.slidesToShow),g(d))},b.prototype.loadSlider=function(){var a=this;a.setPosition(),a.$slideTrack.css({opacity:1}),a.$slider.removeClass("slick-loading"),a.initUI(),"progressive"===a.options.lazyLoad&&a.progressiveLazyLoad()},b.prototype.next=b.prototype.slickNext=function(){var a=this;a.changeSlide({data:{message:"next"}})},b.prototype.orientationChange=function(){var a=this;a.checkResponsive(),a.setPosition()},b.prototype.pause=b.prototype.slickPause=function(){var a=this;a.autoPlayClear(),a.paused=!0},b.prototype.play=b.prototype.slickPlay=function(){var a=this;a.paused=!1,a.autoPlay()},b.prototype.postSlide=function(a){var b=this;b.$slider.trigger("afterChange",[b,a]),b.animating=!1,b.setPosition(),b.swipeLeft=null,b.options.autoplay===!0&&b.paused===!1&&b.autoPlay(),b.options.accessibility===!0&&b.initADA()},b.prototype.prev=b.prototype.slickPrev=function(){var a=this;a.changeSlide({data:{message:"previous"}})},b.prototype.preventDefault=function(a){a.preventDefault()},b.prototype.progressiveLazyLoad=function(){var c,d,b=this;c=a("img[data-lazy]",b.$slider).length,c>0&&(d=a("img[data-lazy]",b.$slider).first(),d.attr("src",null),d.attr("src",d.attr("data-lazy")).removeClass("slick-loading").load(function(){d.removeAttr("data-lazy"),b.progressiveLazyLoad(),b.options.adaptiveHeight===!0&&b.setPosition()}).error(function(){d.removeAttr("data-lazy"),b.progressiveLazyLoad()}))},b.prototype.refresh=function(b){var d,e,c=this;e=c.slideCount-c.options.slidesToShow,c.options.infinite||(c.slideCount<=c.options.slidesToShow?c.currentSlide=0:c.currentSlide>e&&(c.currentSlide=e)),d=c.currentSlide,c.destroy(!0),a.extend(c,c.initials,{currentSlide:d}),c.init(),b||c.changeSlide({data:{message:"index",index:d}},!1)},b.prototype.registerBreakpoints=function(){var c,d,e,b=this,f=b.options.responsive||null;if("array"===a.type(f)&&f.length){b.respondTo=b.options.respondTo||"window";for(c in f)if(e=b.breakpoints.length-1,d=f[c].breakpoint,f.hasOwnProperty(c)){for(;e>=0;)b.breakpoints[e]&&b.breakpoints[e]===d&&b.breakpoints.splice(e,1),e--;b.breakpoints.push(d),b.breakpointSettings[d]=f[c].settings}b.breakpoints.sort(function(a,c){return b.options.mobileFirst?a-c:c-a})}},b.prototype.reinit=function(){var b=this;b.$slides=b.$slideTrack.children(b.options.slide).addClass("slick-slide"),b.slideCount=b.$slides.length,b.currentSlide>=b.slideCount&&0!==b.currentSlide&&(b.currentSlide=b.currentSlide-b.options.slidesToScroll),b.slideCount<=b.options.slidesToShow&&(b.currentSlide=0),b.registerBreakpoints(),b.setProps(),b.setupInfinite(),b.buildArrows(),b.updateArrows(),b.initArrowEvents(),b.buildDots(),b.updateDots(),b.initDotEvents(),b.checkResponsive(!1,!0),b.options.focusOnSelect===!0&&a(b.$slideTrack).children().on("click.slick",b.selectHandler),b.setSlideClasses(0),b.setPosition(),b.$slider.trigger("reInit",[b]),b.options.autoplay===!0&&b.focusHandler()},b.prototype.resize=function(){var b=this;a(window).width()!==b.windowWidth&&(clearTimeout(b.windowDelay),b.windowDelay=window.setTimeout(function(){b.windowWidth=a(window).width(),b.checkResponsive(),b.unslicked||b.setPosition()},50))},b.prototype.removeSlide=b.prototype.slickRemove=function(a,b,c){var d=this;return"boolean"==typeof a?(b=a,a=b===!0?0:d.slideCount-1):a=b===!0?--a:a,d.slideCount<1||0>a||a>d.slideCount-1?!1:(d.unload(),c===!0?d.$slideTrack.children().remove():d.$slideTrack.children(this.options.slide).eq(a).remove(),d.$slides=d.$slideTrack.children(this.options.slide),d.$slideTrack.children(this.options.slide).detach(),d.$slideTrack.append(d.$slides),d.$slidesCache=d.$slides,void d.reinit())},b.prototype.setCSS=function(a){var d,e,b=this,c={};b.options.rtl===!0&&(a=-a),d="left"==b.positionProp?Math.ceil(a)+"px":"0px",e="top"==b.positionProp?Math.ceil(a)+"px":"0px",c[b.positionProp]=a,b.transformsEnabled===!1?b.$slideTrack.css(c):(c={},b.cssTransitions===!1?(c[b.animType]="translate("+d+", "+e+")",b.$slideTrack.css(c)):(c[b.animType]="translate3d("+d+", "+e+", 0px)",b.$slideTrack.css(c)))},b.prototype.setDimensions=function(){var a=this;a.options.vertical===!1?a.options.centerMode===!0&&a.$list.css({padding:"0px "+a.options.centerPadding}):(a.$list.height(a.$slides.first().outerHeight(!0)*a.options.slidesToShow),a.options.centerMode===!0&&a.$list.css({padding:a.options.centerPadding+" 0px"})),a.listWidth=a.$list.width(),a.listHeight=a.$list.height(),a.options.vertical===!1&&a.options.variableWidth===!1?(a.slideWidth=Math.ceil(a.listWidth/a.options.slidesToShow),a.$slideTrack.width(Math.ceil(a.slideWidth*a.$slideTrack.children(".slick-slide").length))):a.options.variableWidth===!0?a.$slideTrack.width(5e3*a.slideCount):(a.slideWidth=Math.ceil(a.listWidth),a.$slideTrack.height(Math.ceil(a.$slides.first().outerHeight(!0)*a.$slideTrack.children(".slick-slide").length)));var b=a.$slides.first().outerWidth(!0)-a.$slides.first().width();a.options.variableWidth===!1&&a.$slideTrack.children(".slick-slide").width(a.slideWidth-b)},b.prototype.setFade=function(){var c,b=this;b.$slides.each(function(d,e){c=b.slideWidth*d*-1,b.options.rtl===!0?a(e).css({position:"relative",right:c,top:0,zIndex:b.options.zIndex-2,opacity:0}):a(e).css({position:"relative",left:c,top:0,zIndex:b.options.zIndex-2,opacity:0})}),b.$slides.eq(b.currentSlide).css({zIndex:b.options.zIndex-1,opacity:1})},b.prototype.setHeight=function(){var a=this;if(1===a.options.slidesToShow&&a.options.adaptiveHeight===!0&&a.options.vertical===!1){var b=a.$slides.eq(a.currentSlide).outerHeight(!0);a.$list.css("height",b)}},b.prototype.setOption=b.prototype.slickSetOption=function(b,c,d){var f,g,e=this;if("responsive"===b&&"array"===a.type(c))for(g in c)if("array"!==a.type(e.options.responsive))e.options.responsive=[c[g]];else{for(f=e.options.responsive.length-1;f>=0;)e.options.responsive[f].breakpoint===c[g].breakpoint&&e.options.responsive.splice(f,1),f--;e.options.responsive.push(c[g])}else e.options[b]=c;d===!0&&(e.unload(),e.reinit())},b.prototype.setPosition=function(){var a=this;a.setDimensions(),a.setHeight(),a.options.fade===!1?a.setCSS(a.getLeft(a.currentSlide)):a.setFade(),a.$slider.trigger("setPosition",[a])},b.prototype.setProps=function(){var a=this,b=document.body.style;a.positionProp=a.options.vertical===!0?"top":"left","top"===a.positionProp?a.$slider.addClass("slick-vertical"):a.$slider.removeClass("slick-vertical"),(void 0!==b.WebkitTransition||void 0!==b.MozTransition||void 0!==b.msTransition)&&a.options.useCSS===!0&&(a.cssTransitions=!0),a.options.fade&&("number"==typeof a.options.zIndex?a.options.zIndex<3&&(a.options.zIndex=3):a.options.zIndex=a.defaults.zIndex),void 0!==b.OTransform&&(a.animType="OTransform",a.transformType="-o-transform",a.transitionType="OTransition",void 0===b.perspectiveProperty&&void 0===b.webkitPerspective&&(a.animType=!1)),void 0!==b.MozTransform&&(a.animType="MozTransform",a.transformType="-moz-transform",a.transitionType="MozTransition",void 0===b.perspectiveProperty&&void 0===b.MozPerspective&&(a.animType=!1)),void 0!==b.webkitTransform&&(a.animType="webkitTransform",a.transformType="-webkit-transform",a.transitionType="webkitTransition",void 0===b.perspectiveProperty&&void 0===b.webkitPerspective&&(a.animType=!1)),void 0!==b.msTransform&&(a.animType="msTransform",a.transformType="-ms-transform",a.transitionType="msTransition",void 0===b.msTransform&&(a.animType=!1)),void 0!==b.transform&&a.animType!==!1&&(a.animType="transform",a.transformType="transform",a.transitionType="transition"),a.transformsEnabled=a.options.useTransform&&null!==a.animType&&a.animType!==!1},b.prototype.setSlideClasses=function(a){var c,d,e,f,b=this;d=b.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden","true"),b.$slides.eq(a).addClass("slick-current"),b.options.centerMode===!0?(c=Math.floor(b.options.slidesToShow/2),b.options.infinite===!0&&(a>=c&&a<=b.slideCount-1-c?b.$slides.slice(a-c,a+c+1).addClass("slick-active").attr("aria-hidden","false"):(e=b.options.slidesToShow+a,d.slice(e-c+1,e+c+2).addClass("slick-active").attr("aria-hidden","false")),0===a?d.eq(d.length-1-b.options.slidesToShow).addClass("slick-center"):a===b.slideCount-1&&d.eq(b.options.slidesToShow).addClass("slick-center")),b.$slides.eq(a).addClass("slick-center")):a>=0&&a<=b.slideCount-b.options.slidesToShow?b.$slides.slice(a,a+b.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"):d.length<=b.options.slidesToShow?d.addClass("slick-active").attr("aria-hidden","false"):(f=b.slideCount%b.options.slidesToShow,e=b.options.infinite===!0?b.options.slidesToShow+a:a,b.options.slidesToShow==b.options.slidesToScroll&&b.slideCount-a<b.options.slidesToShow?d.slice(e-(b.options.slidesToShow-f),e+f).addClass("slick-active").attr("aria-hidden","false"):d.slice(e,e+b.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false")),"ondemand"===b.options.lazyLoad&&b.lazyLoad()},b.prototype.setupInfinite=function(){var c,d,e,b=this;if(b.options.fade===!0&&(b.options.centerMode=!1),b.options.infinite===!0&&b.options.fade===!1&&(d=null,b.slideCount>b.options.slidesToShow)){for(e=b.options.centerMode===!0?b.options.slidesToShow+1:b.options.slidesToShow,c=b.slideCount;c>b.slideCount-e;c-=1)d=c-1,a(b.$slides[d]).clone(!0).attr("id","").attr("data-slick-index",d-b.slideCount).prependTo(b.$slideTrack).addClass("slick-cloned");for(c=0;e>c;c+=1)d=c,a(b.$slides[d]).clone(!0).attr("id","").attr("data-slick-index",d+b.slideCount).appendTo(b.$slideTrack).addClass("slick-cloned");b.$slideTrack.find(".slick-cloned").find("[id]").each(function(){a(this).attr("id","")})}},b.prototype.setPaused=function(a){var b=this;b.options.autoplay===!0&&b.options.pauseOnHover===!0&&(b.paused=a,a?b.autoPlayClear():b.autoPlay())},b.prototype.selectHandler=function(b){var c=this,d=a(b.target).is(".slick-slide")?a(b.target):a(b.target).parents(".slick-slide"),e=parseInt(d.attr("data-slick-index"));return e||(e=0),c.slideCount<=c.options.slidesToShow?(c.setSlideClasses(e),void c.asNavFor(e)):void c.slideHandler(e)},b.prototype.slideHandler=function(a,b,c){var d,e,f,g,h=null,i=this;return b=b||!1,i.animating===!0&&i.options.waitForAnimate===!0||i.options.fade===!0&&i.currentSlide===a||i.slideCount<=i.options.slidesToShow?void 0:(b===!1&&i.asNavFor(a),d=a,h=i.getLeft(d),g=i.getLeft(i.currentSlide),i.currentLeft=null===i.swipeLeft?g:i.swipeLeft,i.options.infinite===!1&&i.options.centerMode===!1&&(0>a||a>i.getDotCount()*i.options.slidesToScroll)?void(i.options.fade===!1&&(d=i.currentSlide,c!==!0?i.animateSlide(g,function(){i.postSlide(d);
}):i.postSlide(d))):i.options.infinite===!1&&i.options.centerMode===!0&&(0>a||a>i.slideCount-i.options.slidesToScroll)?void(i.options.fade===!1&&(d=i.currentSlide,c!==!0?i.animateSlide(g,function(){i.postSlide(d)}):i.postSlide(d))):(i.options.autoplay===!0&&clearInterval(i.autoPlayTimer),e=0>d?i.slideCount%i.options.slidesToScroll!==0?i.slideCount-i.slideCount%i.options.slidesToScroll:i.slideCount+d:d>=i.slideCount?i.slideCount%i.options.slidesToScroll!==0?0:d-i.slideCount:d,i.animating=!0,i.$slider.trigger("beforeChange",[i,i.currentSlide,e]),f=i.currentSlide,i.currentSlide=e,i.setSlideClasses(i.currentSlide),i.updateDots(),i.updateArrows(),i.options.fade===!0?(c!==!0?(i.fadeSlideOut(f),i.fadeSlide(e,function(){i.postSlide(e)})):i.postSlide(e),void i.animateHeight()):void(c!==!0?i.animateSlide(h,function(){i.postSlide(e)}):i.postSlide(e))))},b.prototype.startLoad=function(){var a=this;a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.hide(),a.$nextArrow.hide()),a.options.dots===!0&&a.slideCount>a.options.slidesToShow&&a.$dots.hide(),a.$slider.addClass("slick-loading")},b.prototype.swipeDirection=function(){var a,b,c,d,e=this;return a=e.touchObject.startX-e.touchObject.curX,b=e.touchObject.startY-e.touchObject.curY,c=Math.atan2(b,a),d=Math.round(180*c/Math.PI),0>d&&(d=360-Math.abs(d)),45>=d&&d>=0?e.options.rtl===!1?"left":"right":360>=d&&d>=315?e.options.rtl===!1?"left":"right":d>=135&&225>=d?e.options.rtl===!1?"right":"left":e.options.verticalSwiping===!0?d>=35&&135>=d?"left":"right":"vertical"},b.prototype.swipeEnd=function(a){var c,b=this;if(b.dragging=!1,b.shouldClick=b.touchObject.swipeLength>10?!1:!0,void 0===b.touchObject.curX)return!1;if(b.touchObject.edgeHit===!0&&b.$slider.trigger("edge",[b,b.swipeDirection()]),b.touchObject.swipeLength>=b.touchObject.minSwipe)switch(b.swipeDirection()){case"left":c=b.options.swipeToSlide?b.checkNavigable(b.currentSlide+b.getSlideCount()):b.currentSlide+b.getSlideCount(),b.slideHandler(c),b.currentDirection=0,b.touchObject={},b.$slider.trigger("swipe",[b,"left"]);break;case"right":c=b.options.swipeToSlide?b.checkNavigable(b.currentSlide-b.getSlideCount()):b.currentSlide-b.getSlideCount(),b.slideHandler(c),b.currentDirection=1,b.touchObject={},b.$slider.trigger("swipe",[b,"right"])}else b.touchObject.startX!==b.touchObject.curX&&(b.slideHandler(b.currentSlide),b.touchObject={})},b.prototype.swipeHandler=function(a){var b=this;if(!(b.options.swipe===!1||"ontouchend"in document&&b.options.swipe===!1||b.options.draggable===!1&&-1!==a.type.indexOf("mouse")))switch(b.touchObject.fingerCount=a.originalEvent&&void 0!==a.originalEvent.touches?a.originalEvent.touches.length:1,b.touchObject.minSwipe=b.listWidth/b.options.touchThreshold,b.options.verticalSwiping===!0&&(b.touchObject.minSwipe=b.listHeight/b.options.touchThreshold),a.data.action){case"start":b.swipeStart(a);break;case"move":b.swipeMove(a);break;case"end":b.swipeEnd(a)}},b.prototype.swipeMove=function(a){var d,e,f,g,h,b=this;return h=void 0!==a.originalEvent?a.originalEvent.touches:null,!b.dragging||h&&1!==h.length?!1:(d=b.getLeft(b.currentSlide),b.touchObject.curX=void 0!==h?h[0].pageX:a.clientX,b.touchObject.curY=void 0!==h?h[0].pageY:a.clientY,b.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(b.touchObject.curX-b.touchObject.startX,2))),b.options.verticalSwiping===!0&&(b.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(b.touchObject.curY-b.touchObject.startY,2)))),e=b.swipeDirection(),"vertical"!==e?(void 0!==a.originalEvent&&b.touchObject.swipeLength>4&&a.preventDefault(),g=(b.options.rtl===!1?1:-1)*(b.touchObject.curX>b.touchObject.startX?1:-1),b.options.verticalSwiping===!0&&(g=b.touchObject.curY>b.touchObject.startY?1:-1),f=b.touchObject.swipeLength,b.touchObject.edgeHit=!1,b.options.infinite===!1&&(0===b.currentSlide&&"right"===e||b.currentSlide>=b.getDotCount()&&"left"===e)&&(f=b.touchObject.swipeLength*b.options.edgeFriction,b.touchObject.edgeHit=!0),b.options.vertical===!1?b.swipeLeft=d+f*g:b.swipeLeft=d+f*(b.$list.height()/b.listWidth)*g,b.options.verticalSwiping===!0&&(b.swipeLeft=d+f*g),b.options.fade===!0||b.options.touchMove===!1?!1:b.animating===!0?(b.swipeLeft=null,!1):void b.setCSS(b.swipeLeft)):void 0)},b.prototype.swipeStart=function(a){var c,b=this;return 1!==b.touchObject.fingerCount||b.slideCount<=b.options.slidesToShow?(b.touchObject={},!1):(void 0!==a.originalEvent&&void 0!==a.originalEvent.touches&&(c=a.originalEvent.touches[0]),b.touchObject.startX=b.touchObject.curX=void 0!==c?c.pageX:a.clientX,b.touchObject.startY=b.touchObject.curY=void 0!==c?c.pageY:a.clientY,void(b.dragging=!0))},b.prototype.unfilterSlides=b.prototype.slickUnfilter=function(){var a=this;null!==a.$slidesCache&&(a.unload(),a.$slideTrack.children(this.options.slide).detach(),a.$slidesCache.appendTo(a.$slideTrack),a.reinit())},b.prototype.unload=function(){var b=this;a(".slick-cloned",b.$slider).remove(),b.$dots&&b.$dots.remove(),b.$prevArrow&&b.htmlExpr.test(b.options.prevArrow)&&b.$prevArrow.remove(),b.$nextArrow&&b.htmlExpr.test(b.options.nextArrow)&&b.$nextArrow.remove(),b.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden","true").css("width","")},b.prototype.unslick=function(a){var b=this;b.$slider.trigger("unslick",[b,a]),b.destroy()},b.prototype.updateArrows=function(){var b,a=this;b=Math.floor(a.options.slidesToShow/2),a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&!a.options.infinite&&(a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false"),a.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false"),0===a.currentSlide?(a.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true"),a.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false")):a.currentSlide>=a.slideCount-a.options.slidesToShow&&a.options.centerMode===!1?(a.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")):a.currentSlide>=a.slideCount-1&&a.options.centerMode===!0&&(a.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")))},b.prototype.updateDots=function(){var a=this;null!==a.$dots&&(a.$dots.find("li").removeClass("slick-active").attr("aria-hidden","true"),a.$dots.find("li").eq(Math.floor(a.currentSlide/a.options.slidesToScroll)).addClass("slick-active").attr("aria-hidden","false"))},b.prototype.visibility=function(){var a=this;document[a.hidden]?(a.paused=!0,a.autoPlayClear()):a.options.autoplay===!0&&(a.paused=!1,a.autoPlay())},b.prototype.initADA=function(){var b=this;b.$slides.add(b.$slideTrack.find(".slick-cloned")).attr({"aria-hidden":"true",tabindex:"-1"}).find("a, input, button, select").attr({tabindex:"-1"}),b.$slideTrack.attr("role","listbox"),b.$slides.not(b.$slideTrack.find(".slick-cloned")).each(function(c){a(this).attr({role:"option","aria-describedby":"slick-slide"+b.instanceUid+c})}),null!==b.$dots&&b.$dots.attr("role","tablist").find("li").each(function(c){a(this).attr({role:"presentation","aria-selected":"false","aria-controls":"navigation"+b.instanceUid+c,id:"slick-slide"+b.instanceUid+c})}).first().attr("aria-selected","true").end().find("button").attr("role","button").end().closest("div").attr("role","toolbar"),b.activateADA()},b.prototype.activateADA=function(){var a=this;a.$slideTrack.find(".slick-active").attr({"aria-hidden":"false"}).find("a, input, button, select").attr({tabindex:"0"})},b.prototype.focusHandler=function(){var b=this;b.$slider.on("focus.slick blur.slick","*",function(c){c.stopImmediatePropagation();var d=a(this);setTimeout(function(){b.isPlay&&(d.is(":focus")?(b.autoPlayClear(),b.paused=!0):(b.paused=!1,b.autoPlay()))},0)})},a.fn.slick=function(){var f,g,a=this,c=arguments[0],d=Array.prototype.slice.call(arguments,1),e=a.length;for(f=0;e>f;f++)if("object"==typeof c||"undefined"==typeof c?a[f].slick=new b(a[f],c):g=a[f].slick[c].apply(a[f].slick,d),"undefined"!=typeof g)return g;return a}});
/**
 * Ion.CheckRadio
 * version 2.0.0 Build 42
 * © Denis Ineshin, 2015
 *
 * Project page:    http://ionden.com/a/plugins/ion.CheckRadio/en.html
 * GitHub page:     https://github.com/IonDen/ion.CheckRadio
 *
 * Released under MIT licence:
 * http://ionden.com/a/plugins/licence-en.html
 */

;(function ($, window) {
    "use strict";

    if ($.fn.ionCheckRadio) {
        return;
    }

    if (!String.prototype.trim) {
        (function() {
            var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
            String.prototype.trim = function() {
                return this.replace(rtrim, '');
            };
        })();
    }



    var collection = {},
        instances = {};

    var IonCheckRadio = function (group) {
        this.group = group.content;
        this.type = group.type;
        this.$group = $(this.group);
        this.old = null;
        this.observer = null;

        this.init();
    };

    IonCheckRadio.prototype = {
        init: function () {
            var ready = this.$group.eq(0).hasClass("icr-input");

            if (ready) {
                this.prepare();
            } else {
                this.createHTML();
            }
        },

        prepare: function () {
            var self = this,
                $item,
                $parent,
                i;

            for (i = 0; i < this.group.length; i++) {
                $item = $(this.group[i]);
                $parent = $item.parent().parent();
                $.data(this.group[i], "icr-parent", $parent);

                this.presetChecked(this.group[i]);
                this.presetDisabled(this.group[i]);
            }

            this.$group.on("change", function () {
                self.change(this);
            });

            this.$group.on("focus", function () {
                self.focus(this);
            });

            this.$group.on("blur", function () {
                self.blur(this);
            });

            // Trace input "disabled" attribute mutation
            // Only for modern browsers. IE11+
            // To add cross browser support, install this:
            // https://github.com/megawac/MutationObserver.js
            if (window.MutationObserver) {
                this.setUpObserver();
            }
        },

        setUpObserver: function () {
            var self = this,
                node,
                i;

            this.observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    node = mutation.target;

                    if (mutation.attributeName === "disabled") {
                        self.toggle(self.getParent(node), node.disabled, "disabled");
                    }
                });
            });

            for (i = 0; i < this.group.length; i++) {
                this.observer.observe(this.group[i], {
                    attributes: true
                });
            }
        },

        destroy: function () {
            this.$group.off();

            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
        },

        presetChecked: function (node) {
            if (node.checked) {
                this.toggle(this.getParent(node), true, "checked");

                if (this.type === "radio") {
                    this.old = node;
                }
            }
        },

        presetDisabled: function (node) {
            if (node.disabled) {
                this.toggle(this.getParent(node), true, "disabled");
            }
        },

        change: function (node) {
            this.toggle(this.getParent(node), node.checked, "checked");

            if (this.type === "radio" && this.old && this.old !== node) {
                this.toggle(this.getParent(this.old), this.old.checked, "checked");
            }

            this.old = node;
        },

        focus: function (node) {
            this.toggle(this.getParent(node), true, "focused");
        },

        blur: function (node) {
            this.toggle(this.getParent(node), false, "focused");
        },

        toggle: function ($node, state, class_name) {
            if (state) {
                $node.addClass(class_name);
            } else {
                $node.removeClass(class_name);
            }
        },

        getParent: function (node) {
            return $.data(node, "icr-parent");
        },

        // auto transform code to correct layout
        // VERY SLOW(!) for lazy developers
        // to avoid this, use recommended html layout
        createHTML: function () {
            var tpl =
                    '<label class="icr-label">' +
                    '   <span class="icr-item type_{type}"></span>' +
                    '   <span class="icr-hidden"><input class="icr-input {class_list}" type="{type}" name="{name}" value="{value}" {disabled} {checked} /></span>' +
                    '   <span class="icr-text">{text}</span>' +
                    '</label>',

                classes = [],
                types = [],
                names = [],
                values = [],
                texts = [],
                checked_list = [],
                disabled_list = [],
                nc = [],
                self = this;

            var getTextParent = function ($label) {
                var label = $label[0],
                    queue = [],
                    nodes = label.childNodes,
                    cur, text, html,
                    start, end, i;

                for (i = 0; i < nodes.length; i++) {
                    queue.push(nodes[i]);
                }

                while (queue.length) {
                    cur = queue[0];

                    if (cur.nodeType === 3) {
                        text = cur.nodeValue.trim();

                        if (text) {
                            break;
                        }
                    } else if (cur.nodeType === 1) {
                        nodes = cur.childNodes;

                        for (i = 0; i < nodes.length; i++) {
                            queue.push(nodes[i]);
                        }
                    }

                    Array.prototype.splice.call(queue, 0, 1);
                }

                html = cur.parentNode.innerHTML;

                if (html.indexOf('<input') >= 0) {
                    start = html.indexOf('<input');
                    html = html.slice(start);
                    end = html.indexOf('>');
                    html = html.slice(end + 1).trim();
                }

                return html;
            };

            var getHTML = function (i) {
                var tp = tpl.replace(/\{class_list\}/, classes[i]);
                tp = tp.replace(/\{type\}/g, types[i]);
                tp = tp.replace(/\{name\}/, names[i]);
                tp = tp.replace(/\{value\}/, values[i]);
                tp = tp.replace(/\{text\}/, texts[i]);

                if (disabled_list[i]) {
                    tp = tp.replace(/\{disabled\}/, "disabled");
                } else {
                    tp = tp.replace(/\{disabled\}/, "");
                }

                if (checked_list[i]) {
                    tp = tp.replace(/\{checked\}/, "checked");
                } else {
                    tp = tp.replace(/\{checked\}/, "");
                }

                return tp;
            };

            this.$group.each(function (i) {
                var $label,
                    $next,
                    $cur = $(this),
                    class_list = $cur.prop("className"),
                    type = $cur.prop("type"),
                    name = $cur.prop("name"),
                    val = $cur.prop("value"),
                    checked = $cur.prop("checked"),
                    disabled = $cur.prop("disabled"),
                    id = $cur.prop("id"),
                    html;

                classes.push(class_list);
                types.push(type);
                names.push(name);
                values.push(val);
                checked_list.push(checked);
                disabled_list.push(disabled);

                if (id) {
                    $label = $("label[for='" + id + "']");
                } else {
                    $label = $cur.closest("label");
                }

                texts.push(getTextParent($label));

                html = getHTML(i);
                $label.after(html);
                $next = $label.next();
                nc.push($next[0]);

                $cur.remove();
                $label.remove();
            });

            this.$group = $(nc).find("input");
            this.$group.each(function (i) {
                self.group[i] = this;
                collection[names[0]][i] = this;
            });

            this.prepare();
        }
    };

    $.fn.ionCheckRadio = function () {
        var i,
            local = [],
            input,
            name;

        var warn = function (text) {
            window.console && window.console.warn && window.console.warn(text);
        };

        for (i = 0; i < this.length; i++) {
            input = this[i];
            name = input.name;

            if (input.type !== "radio" && input.type !== "checkbox" || !name) {
                warn("Ion.CheckRadio: Some inputs have wrong type or absent name attribute!");
                continue;
            }

            collection[name] = {
                type: input.type,
                content: []
            };
            local.push(input);
        }

        for (i = 0; i < local.length; i++) {
            input = local[i];
            name = input.name;

            collection[name].content.push(input);
        }

        for (i in collection) {
            if (instances[i]) {
                instances[i].destroy();
                instances[i] = null;
            }

            instances[i] = new IonCheckRadio(collection[i]);
        }
    };

})(jQuery, window);

/**
 * JavaScript Client Detection
 * (C) viazenetti GmbH (Christian Ludwig)
 * http://jsfiddle.net/ChristianL/AVyND/
 */
$ = jQuery.noConflict();
(function (window) {
    {
        var unknown = '-';

        // screen
        var screenSize = '';
        if (screen.width) {
            width = (screen.width) ? screen.width : '';
            height = (screen.height) ? screen.height : '';
            screenSize += '' + width + " x " + height;
        }

        // browser
        var nVer = navigator.appVersion;
        var nAgt = navigator.userAgent;
        var browser = navigator.appName;
        var version = '' + parseFloat(navigator.appVersion);
        var majorVersion = parseInt(navigator.appVersion, 10);
        var nameOffset, verOffset, ix;

        // Opera
        if ((verOffset = nAgt.indexOf('Opera')) != -1) {
            browser = 'Opera';
            version = nAgt.substring(verOffset + 6);
            if ((verOffset = nAgt.indexOf('Version')) != -1) {
                version = nAgt.substring(verOffset + 8);
            }
        }
        // Opera Next
        if ((verOffset = nAgt.indexOf('OPR')) != -1) {
            browser = 'Opera';
            version = nAgt.substring(verOffset + 4);
        }
        // MSIE
        else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
            browser = 'Microsoft Internet Explorer';
            version = nAgt.substring(verOffset + 5);
        }
        // Chrome
        else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
            browser = 'Chrome';
            version = nAgt.substring(verOffset + 7);
        }
        // Safari
        else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
            browser = 'Safari';
            version = nAgt.substring(verOffset + 7);
            if ((verOffset = nAgt.indexOf('Version')) != -1) {
                version = nAgt.substring(verOffset + 8);
            }
        }
        // Firefox
        else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
            browser = 'Firefox';
            version = nAgt.substring(verOffset + 8);
        }
        // MSIE 11+
        else if (nAgt.indexOf('Trident/') != -1) {
            browser = 'Microsoft Internet Explorer';
            version = nAgt.substring(nAgt.indexOf('rv:') + 3);
        }
        // Other browsers
        else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
            browser = nAgt.substring(nameOffset, verOffset);
            version = nAgt.substring(verOffset + 1);
            if (browser.toLowerCase() == browser.toUpperCase()) {
                browser = navigator.appName;
            }
        }
        // trim the version string
        if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
        if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
        if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);

        majorVersion = parseInt('' + version, 10);
        if (isNaN(majorVersion)) {
            version = '' + parseFloat(navigator.appVersion);
            majorVersion = parseInt(navigator.appVersion, 10);
        }

        // mobile version
        var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

        // cookie
        var cookieEnabled = (navigator.cookieEnabled) ? true : false;

        if (typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled) {
            document.cookie = 'testcookie';
            cookieEnabled = (document.cookie.indexOf('testcookie') != -1) ? true : false;
        }

        // system
        var os = unknown;
        var clientStrings = [
            {s:'Windows 10', r:/(Windows 10.0|Windows NT 10.0)/},
            {s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/},
            {s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/},
            {s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/},
            {s:'Windows Vista', r:/Windows NT 6.0/},
            {s:'Windows Server 2003', r:/Windows NT 5.2/},
            {s:'Windows XP', r:/(Windows NT 5.1|Windows XP)/},
            {s:'Windows 2000', r:/(Windows NT 5.0|Windows 2000)/},
            {s:'Windows ME', r:/(Win 9x 4.90|Windows ME)/},
            {s:'Windows 98', r:/(Windows 98|Win98)/},
            {s:'Windows 95', r:/(Windows 95|Win95|Windows_95)/},
            {s:'Windows NT 4.0', r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
            {s:'Windows CE', r:/Windows CE/},
            {s:'Windows 3.11', r:/Win16/},
            {s:'Android', r:/Android/},
            {s:'Open BSD', r:/OpenBSD/},
            {s:'Sun OS', r:/SunOS/},
            {s:'Linux', r:/(Linux|X11)/},
            {s:'iOS', r:/(iPhone|iPad|iPod)/},
            {s:'Mac OS X', r:/Mac OS X/},
            {s:'Mac OS', r:/(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
            {s:'QNX', r:/QNX/},
            {s:'UNIX', r:/UNIX/},
            {s:'BeOS', r:/BeOS/},
            {s:'OS/2', r:/OS\/2/},
            {s:'Search Bot', r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
        ];
        for (var id in clientStrings) {
            var cs = clientStrings[id];
            if (cs.r.test(nAgt)) {
                os = cs.s;
                break;
            }
        }

        var osVersion = unknown;

        if (/Windows/.test(os)) {
            osVersion = /Windows (.*)/.exec(os)[1];
            os = 'Windows';
        }

        switch (os) {
            case 'Mac OS X':
                osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
                break;

            case 'Android':
                osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
                break;

            case 'iOS':
                osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
                osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
                break;
        }

        // flash (you'll need to include swfobject)
        /* script src="//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js" */
        var flashVersion = 'no check';
        if (typeof swfobject != 'undefined') {
            var fv = swfobject.getFlashPlayerVersion();
            if (fv.major > 0) {
                flashVersion = fv.major + '.' + fv.minor + ' r' + fv.release;
            }
            else  {
                flashVersion = unknown;
            }
        }
    }

    window.jscd = {
        screen: screenSize,
        browser: browser,
        browserVersion: version,
        browserMajorVersion: majorVersion,
        mobile: mobile,
        os: os,
        osVersion: osVersion,
        cookies: cookieEnabled,
        flashVersion: flashVersion
    };
}(this));
$('html').addClass('OS-'+ jscd.os +' OS-V'+ jscd.osVersion +' Browser-'+ jscd.browser +' Browser-V'+ jscd.browserMajorVersion +' Mobile-'+ jscd.mobile);

$ = jQuery.noConflict();

jQuery(document).ready(function(){
    jQuery(document.body).on('click', '#load_more_robojobs', function (event){
        var postOffset = jQuery('#load_more_robojobs').data('offset');
        var total_posts_count = jQuery('#load_more_robojobs').data('count');
        jQuery('.job-hidden').each(function(){
            jQuery(this).removeClass('job-hidden');
        });
        jQuery('.load_more_jobs').hide();
        jQuery( document ).ajaxComplete(function( evt,request, settings ) {
            var url = settings.url;
        });
    });
    jQuery(document.body).on('click', '.pagehead-button', function (event){
      jQuery('.application_details').show();
    });

});

/**
 * JavaScript Client Detection
 * (C) viazenetti GmbH (Christian Ludwig)
 * http://jsfiddle.net/ChristianL/AVyND/
 */
(function (window) {
    {
        var unknown = '-';

        // screen
        var screenSize = '';
        if (screen.width) {
            width = (screen.width) ? screen.width : '';
            height = (screen.height) ? screen.height : '';
            screenSize += '' + width + " x " + height;
        }

        // browser
        var nVer = navigator.appVersion;
        var nAgt = navigator.userAgent;
        var browser = navigator.appName;
        var version = '' + parseFloat(navigator.appVersion);
        var majorVersion = parseInt(navigator.appVersion, 10);
        var nameOffset, verOffset, ix;

        // Opera
        if ((verOffset = nAgt.indexOf('Opera')) != -1) {
            browser = 'Opera';
            version = nAgt.substring(verOffset + 6);
            if ((verOffset = nAgt.indexOf('Version')) != -1) {
                version = nAgt.substring(verOffset + 8);
            }
        }
        // Opera Next
        if ((verOffset = nAgt.indexOf('OPR')) != -1) {
            browser = 'Opera';
            version = nAgt.substring(verOffset + 4);
        }
        // MSIE
        else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
            browser = 'Microsoft Internet Explorer';
            version = nAgt.substring(verOffset + 5);
        }
        // Chrome
        else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
            browser = 'Chrome';
            version = nAgt.substring(verOffset + 7);
        }
        // Safari
        else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
            browser = 'Safari';
            version = nAgt.substring(verOffset + 7);
            if ((verOffset = nAgt.indexOf('Version')) != -1) {
                version = nAgt.substring(verOffset + 8);
            }
        }
        // Firefox
        else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
            browser = 'Firefox';
            version = nAgt.substring(verOffset + 8);
        }
        // MSIE 11+
        else if (nAgt.indexOf('Trident/') != -1) {
            browser = 'Microsoft Internet Explorer';
            version = nAgt.substring(nAgt.indexOf('rv:') + 3);
        }
        // Other browsers
        else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
            browser = nAgt.substring(nameOffset, verOffset);
            version = nAgt.substring(verOffset + 1);
            if (browser.toLowerCase() == browser.toUpperCase()) {
                browser = navigator.appName;
            }
        }
        // trim the version string
        if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
        if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
        if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);

        majorVersion = parseInt('' + version, 10);
        if (isNaN(majorVersion)) {
            version = '' + parseFloat(navigator.appVersion);
            majorVersion = parseInt(navigator.appVersion, 10);
        }

        // mobile version
        var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

        // cookie
        var cookieEnabled = (navigator.cookieEnabled) ? true : false;

        if (typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled) {
            document.cookie = 'testcookie';
            cookieEnabled = (document.cookie.indexOf('testcookie') != -1) ? true : false;
        }

        // system
        var os = unknown;
        var clientStrings = [
            {s:'Windows 10', r:/(Windows 10.0|Windows NT 10.0)/},
            {s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/},
            {s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/},
            {s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/},
            {s:'Windows Vista', r:/Windows NT 6.0/},
            {s:'Windows Server 2003', r:/Windows NT 5.2/},
            {s:'Windows XP', r:/(Windows NT 5.1|Windows XP)/},
            {s:'Windows 2000', r:/(Windows NT 5.0|Windows 2000)/},
            {s:'Windows ME', r:/(Win 9x 4.90|Windows ME)/},
            {s:'Windows 98', r:/(Windows 98|Win98)/},
            {s:'Windows 95', r:/(Windows 95|Win95|Windows_95)/},
            {s:'Windows NT 4.0', r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
            {s:'Windows CE', r:/Windows CE/},
            {s:'Windows 3.11', r:/Win16/},
            {s:'Android', r:/Android/},
            {s:'Open BSD', r:/OpenBSD/},
            {s:'Sun OS', r:/SunOS/},
            {s:'Linux', r:/(Linux|X11)/},
            {s:'iOS', r:/(iPhone|iPad|iPod)/},
            {s:'Mac OS X', r:/Mac OS X/},
            {s:'Mac OS', r:/(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
            {s:'QNX', r:/QNX/},
            {s:'UNIX', r:/UNIX/},
            {s:'BeOS', r:/BeOS/},
            {s:'OS/2', r:/OS\/2/},
            {s:'Search Bot', r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
        ];
        for (var id in clientStrings) {
            var cs = clientStrings[id];
            if (cs.r.test(nAgt)) {
                os = cs.s;
                break;
            }
        }

        var osVersion = unknown;

        if (/Windows/.test(os)) {
            osVersion = /Windows (.*)/.exec(os)[1];
            os = 'Windows';
        }

        switch (os) {
            case 'Mac OS X':
                osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
                break;

            case 'Android':
                osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
                break;

            case 'iOS':
                osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
                osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
                break;
        }

        // flash (you'll need to include swfobject)
        /* script src="//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js" */
        var flashVersion = 'no check';
        if (typeof swfobject != 'undefined') {
            var fv = swfobject.getFlashPlayerVersion();
            if (fv.major > 0) {
                flashVersion = fv.major + '.' + fv.minor + ' r' + fv.release;
            }
            else  {
                flashVersion = unknown;
            }
        }
    }

    window.jscd = {
        screen: screenSize,
        browser: browser,
        browserVersion: version,
        browserMajorVersion: majorVersion,
        mobile: mobile,
        os: os,
        osVersion: osVersion,
        cookies: cookieEnabled,
        flashVersion: flashVersion
    };
}(this));
$('html').addClass('OS-'+ jscd.os +' OS-V'+ jscd.osVersion +' Browser-'+ jscd.browser +' Browser-V'+ jscd.browserMajorVersion +' Mobile-'+ jscd.mobile);

jQuery('#loginformfrontend').validate({
    rules: {
        log: "required",
        pwd: "required"
    },
    // Specify the validation error messages
    messages: {
        log: "Please enter your Email or User Name",
        pwd: "Please enter your password",
    },
    submitHandler: function(form) {
      form.submit();
    }
});

// jquery form validation
jQuery("#registrationModel").validate({
    rules: {
        user_title: "required",
        new_user_emailnew_user_email: {
            required: true,
            email: true
        },
        user_password: {
            required: true,
            minlength: 4
        },
    },
    // Specify the validation error messages
    messages: {
        user_title: "Please enter your Role",
        new_user_email: "Please enter a valid email address",
        user_password: {
            required: "Please provide a password",
            minlength: "Your password must be at least 4 characters long"
        },
    },

    submitHandler: function(form) {
        form.submit();
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFmZml4LmpzIiwiYWxlcnQuanMiLCJkcm9wZG93bi5qcyIsIm1vZGFsLmpzIiwidG9vbHRpcC5qcyIsInRhYi5qcyIsImNob3Nlbi5qcXVlcnkuanMiLCJqcXVlcnkuZml0dmlkcy5qcyIsInBlcmZlY3Qtc2Nyb2xsYmFyLmpxdWVyeS5qcyIsImpxdWVyeS5jb3VudFRvLmpzIiwic2xpY2subWluLmpzIiwiaW9uLmNoZWNrUmFkaW8uanMiLCJjbGllbnQtZGV0ZWN0LmpzIiwibWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xnQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeHZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4aURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6InJvYm9qb2IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogYWZmaXguanMgdjMuMy42XG4gKiBodHRwOi8vZ2V0Ym9vdHN0cmFwLmNvbS9qYXZhc2NyaXB0LyNhZmZpeFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE1IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIEFGRklYIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBBZmZpeCA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoe30sIEFmZml4LkRFRkFVTFRTLCBvcHRpb25zKVxuXG4gICAgdGhpcy4kdGFyZ2V0ID0gJCh0aGlzLm9wdGlvbnMudGFyZ2V0KVxuICAgICAgLm9uKCdzY3JvbGwuYnMuYWZmaXguZGF0YS1hcGknLCAkLnByb3h5KHRoaXMuY2hlY2tQb3NpdGlvbiwgdGhpcykpXG4gICAgICAub24oJ2NsaWNrLmJzLmFmZml4LmRhdGEtYXBpJywgICQucHJveHkodGhpcy5jaGVja1Bvc2l0aW9uV2l0aEV2ZW50TG9vcCwgdGhpcykpXG5cbiAgICB0aGlzLiRlbGVtZW50ICAgICA9ICQoZWxlbWVudClcbiAgICB0aGlzLmFmZml4ZWQgICAgICA9IG51bGxcbiAgICB0aGlzLnVucGluICAgICAgICA9IG51bGxcbiAgICB0aGlzLnBpbm5lZE9mZnNldCA9IG51bGxcblxuICAgIHRoaXMuY2hlY2tQb3NpdGlvbigpXG4gIH1cblxuICBBZmZpeC5WRVJTSU9OICA9ICczLjMuNidcblxuICBBZmZpeC5SRVNFVCAgICA9ICdhZmZpeCBhZmZpeC10b3AgYWZmaXgtYm90dG9tJ1xuXG4gIEFmZml4LkRFRkFVTFRTID0ge1xuICAgIG9mZnNldDogMCxcbiAgICB0YXJnZXQ6IHdpbmRvd1xuICB9XG5cbiAgQWZmaXgucHJvdG90eXBlLmdldFN0YXRlID0gZnVuY3Rpb24gKHNjcm9sbEhlaWdodCwgaGVpZ2h0LCBvZmZzZXRUb3AsIG9mZnNldEJvdHRvbSkge1xuICAgIHZhciBzY3JvbGxUb3AgICAgPSB0aGlzLiR0YXJnZXQuc2Nyb2xsVG9wKClcbiAgICB2YXIgcG9zaXRpb24gICAgID0gdGhpcy4kZWxlbWVudC5vZmZzZXQoKVxuICAgIHZhciB0YXJnZXRIZWlnaHQgPSB0aGlzLiR0YXJnZXQuaGVpZ2h0KClcblxuICAgIGlmIChvZmZzZXRUb3AgIT0gbnVsbCAmJiB0aGlzLmFmZml4ZWQgPT0gJ3RvcCcpIHJldHVybiBzY3JvbGxUb3AgPCBvZmZzZXRUb3AgPyAndG9wJyA6IGZhbHNlXG5cbiAgICBpZiAodGhpcy5hZmZpeGVkID09ICdib3R0b20nKSB7XG4gICAgICBpZiAob2Zmc2V0VG9wICE9IG51bGwpIHJldHVybiAoc2Nyb2xsVG9wICsgdGhpcy51bnBpbiA8PSBwb3NpdGlvbi50b3ApID8gZmFsc2UgOiAnYm90dG9tJ1xuICAgICAgcmV0dXJuIChzY3JvbGxUb3AgKyB0YXJnZXRIZWlnaHQgPD0gc2Nyb2xsSGVpZ2h0IC0gb2Zmc2V0Qm90dG9tKSA/IGZhbHNlIDogJ2JvdHRvbSdcbiAgICB9XG5cbiAgICB2YXIgaW5pdGlhbGl6aW5nICAgPSB0aGlzLmFmZml4ZWQgPT0gbnVsbFxuICAgIHZhciBjb2xsaWRlclRvcCAgICA9IGluaXRpYWxpemluZyA/IHNjcm9sbFRvcCA6IHBvc2l0aW9uLnRvcFxuICAgIHZhciBjb2xsaWRlckhlaWdodCA9IGluaXRpYWxpemluZyA/IHRhcmdldEhlaWdodCA6IGhlaWdodFxuXG4gICAgaWYgKG9mZnNldFRvcCAhPSBudWxsICYmIHNjcm9sbFRvcCA8PSBvZmZzZXRUb3ApIHJldHVybiAndG9wJ1xuICAgIGlmIChvZmZzZXRCb3R0b20gIT0gbnVsbCAmJiAoY29sbGlkZXJUb3AgKyBjb2xsaWRlckhlaWdodCA+PSBzY3JvbGxIZWlnaHQgLSBvZmZzZXRCb3R0b20pKSByZXR1cm4gJ2JvdHRvbSdcblxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgQWZmaXgucHJvdG90eXBlLmdldFBpbm5lZE9mZnNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5waW5uZWRPZmZzZXQpIHJldHVybiB0aGlzLnBpbm5lZE9mZnNldFxuICAgIHRoaXMuJGVsZW1lbnQucmVtb3ZlQ2xhc3MoQWZmaXguUkVTRVQpLmFkZENsYXNzKCdhZmZpeCcpXG4gICAgdmFyIHNjcm9sbFRvcCA9IHRoaXMuJHRhcmdldC5zY3JvbGxUb3AoKVxuICAgIHZhciBwb3NpdGlvbiAgPSB0aGlzLiRlbGVtZW50Lm9mZnNldCgpXG4gICAgcmV0dXJuICh0aGlzLnBpbm5lZE9mZnNldCA9IHBvc2l0aW9uLnRvcCAtIHNjcm9sbFRvcClcbiAgfVxuXG4gIEFmZml4LnByb3RvdHlwZS5jaGVja1Bvc2l0aW9uV2l0aEV2ZW50TG9vcCA9IGZ1bmN0aW9uICgpIHtcbiAgICBzZXRUaW1lb3V0KCQucHJveHkodGhpcy5jaGVja1Bvc2l0aW9uLCB0aGlzKSwgMSlcbiAgfVxuXG4gIEFmZml4LnByb3RvdHlwZS5jaGVja1Bvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy4kZWxlbWVudC5pcygnOnZpc2libGUnKSkgcmV0dXJuXG5cbiAgICB2YXIgaGVpZ2h0ICAgICAgID0gdGhpcy4kZWxlbWVudC5oZWlnaHQoKVxuICAgIHZhciBvZmZzZXQgICAgICAgPSB0aGlzLm9wdGlvbnMub2Zmc2V0XG4gICAgdmFyIG9mZnNldFRvcCAgICA9IG9mZnNldC50b3BcbiAgICB2YXIgb2Zmc2V0Qm90dG9tID0gb2Zmc2V0LmJvdHRvbVxuICAgIHZhciBzY3JvbGxIZWlnaHQgPSBNYXRoLm1heCgkKGRvY3VtZW50KS5oZWlnaHQoKSwgJChkb2N1bWVudC5ib2R5KS5oZWlnaHQoKSlcblxuICAgIGlmICh0eXBlb2Ygb2Zmc2V0ICE9ICdvYmplY3QnKSAgICAgICAgIG9mZnNldEJvdHRvbSA9IG9mZnNldFRvcCA9IG9mZnNldFxuICAgIGlmICh0eXBlb2Ygb2Zmc2V0VG9wID09ICdmdW5jdGlvbicpICAgIG9mZnNldFRvcCAgICA9IG9mZnNldC50b3AodGhpcy4kZWxlbWVudClcbiAgICBpZiAodHlwZW9mIG9mZnNldEJvdHRvbSA9PSAnZnVuY3Rpb24nKSBvZmZzZXRCb3R0b20gPSBvZmZzZXQuYm90dG9tKHRoaXMuJGVsZW1lbnQpXG5cbiAgICB2YXIgYWZmaXggPSB0aGlzLmdldFN0YXRlKHNjcm9sbEhlaWdodCwgaGVpZ2h0LCBvZmZzZXRUb3AsIG9mZnNldEJvdHRvbSlcblxuICAgIGlmICh0aGlzLmFmZml4ZWQgIT0gYWZmaXgpIHtcbiAgICAgIGlmICh0aGlzLnVucGluICE9IG51bGwpIHRoaXMuJGVsZW1lbnQuY3NzKCd0b3AnLCAnJylcblxuICAgICAgdmFyIGFmZml4VHlwZSA9ICdhZmZpeCcgKyAoYWZmaXggPyAnLScgKyBhZmZpeCA6ICcnKVxuICAgICAgdmFyIGUgICAgICAgICA9ICQuRXZlbnQoYWZmaXhUeXBlICsgJy5icy5hZmZpeCcpXG5cbiAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihlKVxuXG4gICAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICAgIHRoaXMuYWZmaXhlZCA9IGFmZml4XG4gICAgICB0aGlzLnVucGluID0gYWZmaXggPT0gJ2JvdHRvbScgPyB0aGlzLmdldFBpbm5lZE9mZnNldCgpIDogbnVsbFxuXG4gICAgICB0aGlzLiRlbGVtZW50XG4gICAgICAgIC5yZW1vdmVDbGFzcyhBZmZpeC5SRVNFVClcbiAgICAgICAgLmFkZENsYXNzKGFmZml4VHlwZSlcbiAgICAgICAgLnRyaWdnZXIoYWZmaXhUeXBlLnJlcGxhY2UoJ2FmZml4JywgJ2FmZml4ZWQnKSArICcuYnMuYWZmaXgnKVxuICAgIH1cblxuICAgIGlmIChhZmZpeCA9PSAnYm90dG9tJykge1xuICAgICAgdGhpcy4kZWxlbWVudC5vZmZzZXQoe1xuICAgICAgICB0b3A6IHNjcm9sbEhlaWdodCAtIGhlaWdodCAtIG9mZnNldEJvdHRvbVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuXG4gIC8vIEFGRklYIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgICA9ICR0aGlzLmRhdGEoJ2JzLmFmZml4JylcbiAgICAgIHZhciBvcHRpb25zID0gdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb25cblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5hZmZpeCcsIChkYXRhID0gbmV3IEFmZml4KHRoaXMsIG9wdGlvbnMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0oKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5hZmZpeFxuXG4gICQuZm4uYWZmaXggICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi5hZmZpeC5Db25zdHJ1Y3RvciA9IEFmZml4XG5cblxuICAvLyBBRkZJWCBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PVxuXG4gICQuZm4uYWZmaXgubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLmFmZml4ID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gQUZGSVggREFUQS1BUElcbiAgLy8gPT09PT09PT09PT09PT1cblxuICAkKHdpbmRvdykub24oJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgJCgnW2RhdGEtc3B5PVwiYWZmaXhcIl0nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkc3B5ID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgPSAkc3B5LmRhdGEoKVxuXG4gICAgICBkYXRhLm9mZnNldCA9IGRhdGEub2Zmc2V0IHx8IHt9XG5cbiAgICAgIGlmIChkYXRhLm9mZnNldEJvdHRvbSAhPSBudWxsKSBkYXRhLm9mZnNldC5ib3R0b20gPSBkYXRhLm9mZnNldEJvdHRvbVxuICAgICAgaWYgKGRhdGEub2Zmc2V0VG9wICAgICE9IG51bGwpIGRhdGEub2Zmc2V0LnRvcCAgICA9IGRhdGEub2Zmc2V0VG9wXG5cbiAgICAgIFBsdWdpbi5jYWxsKCRzcHksIGRhdGEpXG4gICAgfSlcbiAgfSlcblxufShqUXVlcnkpO1xuIiwiLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IGFsZXJ0LmpzIHYzLjMuNlxuICogaHR0cDovL2dldGJvb3RzdHJhcC5jb20vamF2YXNjcmlwdC8jYWxlcnRzXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTUgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gQUxFUlQgQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIGRpc21pc3MgPSAnW2RhdGEtZGlzbWlzcz1cImFsZXJ0XCJdJ1xuICB2YXIgQWxlcnQgICA9IGZ1bmN0aW9uIChlbCkge1xuICAgICQoZWwpLm9uKCdjbGljaycsIGRpc21pc3MsIHRoaXMuY2xvc2UpXG4gIH1cblxuICBBbGVydC5WRVJTSU9OID0gJzMuMy42J1xuXG4gIEFsZXJ0LlRSQU5TSVRJT05fRFVSQVRJT04gPSAxNTBcblxuICBBbGVydC5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbiAoZSkge1xuICAgIHZhciAkdGhpcyAgICA9ICQodGhpcylcbiAgICB2YXIgc2VsZWN0b3IgPSAkdGhpcy5hdHRyKCdkYXRhLXRhcmdldCcpXG5cbiAgICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgICBzZWxlY3RvciA9ICR0aGlzLmF0dHIoJ2hyZWYnKVxuICAgICAgc2VsZWN0b3IgPSBzZWxlY3RvciAmJiBzZWxlY3Rvci5yZXBsYWNlKC8uKig/PSNbXlxcc10qJCkvLCAnJykgLy8gc3RyaXAgZm9yIGllN1xuICAgIH1cblxuICAgIHZhciAkcGFyZW50ID0gJChzZWxlY3RvcilcblxuICAgIGlmIChlKSBlLnByZXZlbnREZWZhdWx0KClcblxuICAgIGlmICghJHBhcmVudC5sZW5ndGgpIHtcbiAgICAgICRwYXJlbnQgPSAkdGhpcy5jbG9zZXN0KCcuYWxlcnQnKVxuICAgIH1cblxuICAgICRwYXJlbnQudHJpZ2dlcihlID0gJC5FdmVudCgnY2xvc2UuYnMuYWxlcnQnKSlcblxuICAgIGlmIChlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgICRwYXJlbnQucmVtb3ZlQ2xhc3MoJ2luJylcblxuICAgIGZ1bmN0aW9uIHJlbW92ZUVsZW1lbnQoKSB7XG4gICAgICAvLyBkZXRhY2ggZnJvbSBwYXJlbnQsIGZpcmUgZXZlbnQgdGhlbiBjbGVhbiB1cCBkYXRhXG4gICAgICAkcGFyZW50LmRldGFjaCgpLnRyaWdnZXIoJ2Nsb3NlZC5icy5hbGVydCcpLnJlbW92ZSgpXG4gICAgfVxuXG4gICAgJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgJHBhcmVudC5oYXNDbGFzcygnZmFkZScpID9cbiAgICAgICRwYXJlbnRcbiAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgcmVtb3ZlRWxlbWVudClcbiAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKEFsZXJ0LlRSQU5TSVRJT05fRFVSQVRJT04pIDpcbiAgICAgIHJlbW92ZUVsZW1lbnQoKVxuICB9XG5cblxuICAvLyBBTEVSVCBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICA9ICR0aGlzLmRhdGEoJ2JzLmFsZXJ0JylcblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5hbGVydCcsIChkYXRhID0gbmV3IEFsZXJ0KHRoaXMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0uY2FsbCgkdGhpcylcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4uYWxlcnRcblxuICAkLmZuLmFsZXJ0ICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4uYWxlcnQuQ29uc3RydWN0b3IgPSBBbGVydFxuXG5cbiAgLy8gQUxFUlQgTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT1cblxuICAkLmZuLmFsZXJ0Lm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5hbGVydCA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIEFMRVJUIERBVEEtQVBJXG4gIC8vID09PT09PT09PT09PT09XG5cbiAgJChkb2N1bWVudCkub24oJ2NsaWNrLmJzLmFsZXJ0LmRhdGEtYXBpJywgZGlzbWlzcywgQWxlcnQucHJvdG90eXBlLmNsb3NlKVxuXG59KGpRdWVyeSk7XG4iLCIvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogZHJvcGRvd24uanMgdjMuMy42XG4gKiBodHRwOi8vZ2V0Ym9vdHN0cmFwLmNvbS9qYXZhc2NyaXB0LyNkcm9wZG93bnNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxNSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBEUk9QRE9XTiBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgYmFja2Ryb3AgPSAnLmRyb3Bkb3duLWJhY2tkcm9wJ1xuICB2YXIgdG9nZ2xlICAgPSAnW2RhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIl0nXG4gIHZhciBEcm9wZG93biA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgJChlbGVtZW50KS5vbignY2xpY2suYnMuZHJvcGRvd24nLCB0aGlzLnRvZ2dsZSlcbiAgfVxuXG4gIERyb3Bkb3duLlZFUlNJT04gPSAnMy4zLjYnXG5cbiAgZnVuY3Rpb24gZ2V0UGFyZW50KCR0aGlzKSB7XG4gICAgdmFyIHNlbGVjdG9yID0gJHRoaXMuYXR0cignZGF0YS10YXJnZXQnKVxuXG4gICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgc2VsZWN0b3IgPSAkdGhpcy5hdHRyKCdocmVmJylcbiAgICAgIHNlbGVjdG9yID0gc2VsZWN0b3IgJiYgLyNbQS1aYS16XS8udGVzdChzZWxlY3RvcikgJiYgc2VsZWN0b3IucmVwbGFjZSgvLiooPz0jW15cXHNdKiQpLywgJycpIC8vIHN0cmlwIGZvciBpZTdcbiAgICB9XG5cbiAgICB2YXIgJHBhcmVudCA9IHNlbGVjdG9yICYmICQoc2VsZWN0b3IpXG5cbiAgICByZXR1cm4gJHBhcmVudCAmJiAkcGFyZW50Lmxlbmd0aCA/ICRwYXJlbnQgOiAkdGhpcy5wYXJlbnQoKVxuICB9XG5cbiAgZnVuY3Rpb24gY2xlYXJNZW51cyhlKSB7XG4gICAgaWYgKGUgJiYgZS53aGljaCA9PT0gMykgcmV0dXJuXG4gICAgJChiYWNrZHJvcCkucmVtb3ZlKClcbiAgICAkKHRvZ2dsZSkuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgICAgICAgICA9ICQodGhpcylcbiAgICAgIHZhciAkcGFyZW50ICAgICAgID0gZ2V0UGFyZW50KCR0aGlzKVxuICAgICAgdmFyIHJlbGF0ZWRUYXJnZXQgPSB7IHJlbGF0ZWRUYXJnZXQ6IHRoaXMgfVxuXG4gICAgICBpZiAoISRwYXJlbnQuaGFzQ2xhc3MoJ29wZW4nKSkgcmV0dXJuXG5cbiAgICAgIGlmIChlICYmIGUudHlwZSA9PSAnY2xpY2snICYmIC9pbnB1dHx0ZXh0YXJlYS9pLnRlc3QoZS50YXJnZXQudGFnTmFtZSkgJiYgJC5jb250YWlucygkcGFyZW50WzBdLCBlLnRhcmdldCkpIHJldHVyblxuXG4gICAgICAkcGFyZW50LnRyaWdnZXIoZSA9ICQuRXZlbnQoJ2hpZGUuYnMuZHJvcGRvd24nLCByZWxhdGVkVGFyZ2V0KSlcblxuICAgICAgaWYgKGUuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgICAkdGhpcy5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJylcbiAgICAgICRwYXJlbnQucmVtb3ZlQ2xhc3MoJ29wZW4nKS50cmlnZ2VyKCQuRXZlbnQoJ2hpZGRlbi5icy5kcm9wZG93bicsIHJlbGF0ZWRUYXJnZXQpKVxuICAgIH0pXG4gIH1cblxuICBEcm9wZG93bi5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgJHRoaXMgPSAkKHRoaXMpXG5cbiAgICBpZiAoJHRoaXMuaXMoJy5kaXNhYmxlZCwgOmRpc2FibGVkJykpIHJldHVyblxuXG4gICAgdmFyICRwYXJlbnQgID0gZ2V0UGFyZW50KCR0aGlzKVxuICAgIHZhciBpc0FjdGl2ZSA9ICRwYXJlbnQuaGFzQ2xhc3MoJ29wZW4nKVxuXG4gICAgY2xlYXJNZW51cygpXG5cbiAgICBpZiAoIWlzQWN0aXZlKSB7XG4gICAgICBpZiAoJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICYmICEkcGFyZW50LmNsb3Nlc3QoJy5uYXZiYXItbmF2JykubGVuZ3RoKSB7XG4gICAgICAgIC8vIGlmIG1vYmlsZSB3ZSB1c2UgYSBiYWNrZHJvcCBiZWNhdXNlIGNsaWNrIGV2ZW50cyBkb24ndCBkZWxlZ2F0ZVxuICAgICAgICAkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKVxuICAgICAgICAgIC5hZGRDbGFzcygnZHJvcGRvd24tYmFja2Ryb3AnKVxuICAgICAgICAgIC5pbnNlcnRBZnRlcigkKHRoaXMpKVxuICAgICAgICAgIC5vbignY2xpY2snLCBjbGVhck1lbnVzKVxuICAgICAgfVxuXG4gICAgICB2YXIgcmVsYXRlZFRhcmdldCA9IHsgcmVsYXRlZFRhcmdldDogdGhpcyB9XG4gICAgICAkcGFyZW50LnRyaWdnZXIoZSA9ICQuRXZlbnQoJ3Nob3cuYnMuZHJvcGRvd24nLCByZWxhdGVkVGFyZ2V0KSlcblxuICAgICAgaWYgKGUuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgICAkdGhpc1xuICAgICAgICAudHJpZ2dlcignZm9jdXMnKVxuICAgICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsICd0cnVlJylcblxuICAgICAgJHBhcmVudFxuICAgICAgICAudG9nZ2xlQ2xhc3MoJ29wZW4nKVxuICAgICAgICAudHJpZ2dlcigkLkV2ZW50KCdzaG93bi5icy5kcm9wZG93bicsIHJlbGF0ZWRUYXJnZXQpKVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgRHJvcGRvd24ucHJvdG90eXBlLmtleWRvd24gPSBmdW5jdGlvbiAoZSkge1xuICAgIGlmICghLygzOHw0MHwyN3wzMikvLnRlc3QoZS53aGljaCkgfHwgL2lucHV0fHRleHRhcmVhL2kudGVzdChlLnRhcmdldC50YWdOYW1lKSkgcmV0dXJuXG5cbiAgICB2YXIgJHRoaXMgPSAkKHRoaXMpXG5cbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG5cbiAgICBpZiAoJHRoaXMuaXMoJy5kaXNhYmxlZCwgOmRpc2FibGVkJykpIHJldHVyblxuXG4gICAgdmFyICRwYXJlbnQgID0gZ2V0UGFyZW50KCR0aGlzKVxuICAgIHZhciBpc0FjdGl2ZSA9ICRwYXJlbnQuaGFzQ2xhc3MoJ29wZW4nKVxuXG4gICAgaWYgKCFpc0FjdGl2ZSAmJiBlLndoaWNoICE9IDI3IHx8IGlzQWN0aXZlICYmIGUud2hpY2ggPT0gMjcpIHtcbiAgICAgIGlmIChlLndoaWNoID09IDI3KSAkcGFyZW50LmZpbmQodG9nZ2xlKS50cmlnZ2VyKCdmb2N1cycpXG4gICAgICByZXR1cm4gJHRoaXMudHJpZ2dlcignY2xpY2snKVxuICAgIH1cblxuICAgIHZhciBkZXNjID0gJyBsaTpub3QoLmRpc2FibGVkKTp2aXNpYmxlIGEnXG4gICAgdmFyICRpdGVtcyA9ICRwYXJlbnQuZmluZCgnLmRyb3Bkb3duLW1lbnUnICsgZGVzYylcblxuICAgIGlmICghJGl0ZW1zLmxlbmd0aCkgcmV0dXJuXG5cbiAgICB2YXIgaW5kZXggPSAkaXRlbXMuaW5kZXgoZS50YXJnZXQpXG5cbiAgICBpZiAoZS53aGljaCA9PSAzOCAmJiBpbmRleCA+IDApICAgICAgICAgICAgICAgICBpbmRleC0tICAgICAgICAgLy8gdXBcbiAgICBpZiAoZS53aGljaCA9PSA0MCAmJiBpbmRleCA8ICRpdGVtcy5sZW5ndGggLSAxKSBpbmRleCsrICAgICAgICAgLy8gZG93blxuICAgIGlmICghfmluZGV4KSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gMFxuXG4gICAgJGl0ZW1zLmVxKGluZGV4KS50cmlnZ2VyKCdmb2N1cycpXG4gIH1cblxuXG4gIC8vIERST1BET1dOIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgID0gJHRoaXMuZGF0YSgnYnMuZHJvcGRvd24nKVxuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLmRyb3Bkb3duJywgKGRhdGEgPSBuZXcgRHJvcGRvd24odGhpcykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXS5jYWxsKCR0aGlzKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5kcm9wZG93blxuXG4gICQuZm4uZHJvcGRvd24gICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi5kcm9wZG93bi5Db25zdHJ1Y3RvciA9IERyb3Bkb3duXG5cblxuICAvLyBEUk9QRE9XTiBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PT09PVxuXG4gICQuZm4uZHJvcGRvd24ubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLmRyb3Bkb3duID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gQVBQTFkgVE8gU1RBTkRBUkQgRFJPUERPV04gRUxFTUVOVFNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAkKGRvY3VtZW50KVxuICAgIC5vbignY2xpY2suYnMuZHJvcGRvd24uZGF0YS1hcGknLCBjbGVhck1lbnVzKVxuICAgIC5vbignY2xpY2suYnMuZHJvcGRvd24uZGF0YS1hcGknLCAnLmRyb3Bkb3duIGZvcm0nLCBmdW5jdGlvbiAoZSkgeyBlLnN0b3BQcm9wYWdhdGlvbigpIH0pXG4gICAgLm9uKCdjbGljay5icy5kcm9wZG93bi5kYXRhLWFwaScsIHRvZ2dsZSwgRHJvcGRvd24ucHJvdG90eXBlLnRvZ2dsZSlcbiAgICAub24oJ2tleWRvd24uYnMuZHJvcGRvd24uZGF0YS1hcGknLCB0b2dnbGUsIERyb3Bkb3duLnByb3RvdHlwZS5rZXlkb3duKVxuICAgIC5vbigna2V5ZG93bi5icy5kcm9wZG93bi5kYXRhLWFwaScsICcuZHJvcGRvd24tbWVudScsIERyb3Bkb3duLnByb3RvdHlwZS5rZXlkb3duKVxuXG59KGpRdWVyeSk7XG4iLCIvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogbW9kYWwuanMgdjMuMy42XG4gKiBodHRwOi8vZ2V0Ym9vdHN0cmFwLmNvbS9qYXZhc2NyaXB0LyNtb2RhbHNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxNSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBNT0RBTCBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgTW9kYWwgPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyAgICAgICAgICAgICA9IG9wdGlvbnNcbiAgICB0aGlzLiRib2R5ICAgICAgICAgICAgICAgPSAkKGRvY3VtZW50LmJvZHkpXG4gICAgdGhpcy4kZWxlbWVudCAgICAgICAgICAgID0gJChlbGVtZW50KVxuICAgIHRoaXMuJGRpYWxvZyAgICAgICAgICAgICA9IHRoaXMuJGVsZW1lbnQuZmluZCgnLm1vZGFsLWRpYWxvZycpXG4gICAgdGhpcy4kYmFja2Ryb3AgICAgICAgICAgID0gbnVsbFxuICAgIHRoaXMuaXNTaG93biAgICAgICAgICAgICA9IG51bGxcbiAgICB0aGlzLm9yaWdpbmFsQm9keVBhZCAgICAgPSBudWxsXG4gICAgdGhpcy5zY3JvbGxiYXJXaWR0aCAgICAgID0gMFxuICAgIHRoaXMuaWdub3JlQmFja2Ryb3BDbGljayA9IGZhbHNlXG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnJlbW90ZSkge1xuICAgICAgdGhpcy4kZWxlbWVudFxuICAgICAgICAuZmluZCgnLm1vZGFsLWNvbnRlbnQnKVxuICAgICAgICAubG9hZCh0aGlzLm9wdGlvbnMucmVtb3RlLCAkLnByb3h5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ2xvYWRlZC5icy5tb2RhbCcpXG4gICAgICAgIH0sIHRoaXMpKVxuICAgIH1cbiAgfVxuXG4gIE1vZGFsLlZFUlNJT04gID0gJzMuMy42J1xuXG4gIE1vZGFsLlRSQU5TSVRJT05fRFVSQVRJT04gPSAzMDBcbiAgTW9kYWwuQkFDS0RST1BfVFJBTlNJVElPTl9EVVJBVElPTiA9IDE1MFxuXG4gIE1vZGFsLkRFRkFVTFRTID0ge1xuICAgIGJhY2tkcm9wOiB0cnVlLFxuICAgIGtleWJvYXJkOiB0cnVlLFxuICAgIHNob3c6IHRydWVcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoX3JlbGF0ZWRUYXJnZXQpIHtcbiAgICByZXR1cm4gdGhpcy5pc1Nob3duID8gdGhpcy5oaWRlKCkgOiB0aGlzLnNob3coX3JlbGF0ZWRUYXJnZXQpXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uIChfcmVsYXRlZFRhcmdldCkge1xuICAgIHZhciB0aGF0ID0gdGhpc1xuICAgIHZhciBlICAgID0gJC5FdmVudCgnc2hvdy5icy5tb2RhbCcsIHsgcmVsYXRlZFRhcmdldDogX3JlbGF0ZWRUYXJnZXQgfSlcblxuICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihlKVxuXG4gICAgaWYgKHRoaXMuaXNTaG93biB8fCBlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgIHRoaXMuaXNTaG93biA9IHRydWVcblxuICAgIHRoaXMuY2hlY2tTY3JvbGxiYXIoKVxuICAgIHRoaXMuc2V0U2Nyb2xsYmFyKClcbiAgICB0aGlzLiRib2R5LmFkZENsYXNzKCdtb2RhbC1vcGVuJylcblxuICAgIHRoaXMuZXNjYXBlKClcbiAgICB0aGlzLnJlc2l6ZSgpXG5cbiAgICB0aGlzLiRlbGVtZW50Lm9uKCdjbGljay5kaXNtaXNzLmJzLm1vZGFsJywgJ1tkYXRhLWRpc21pc3M9XCJtb2RhbFwiXScsICQucHJveHkodGhpcy5oaWRlLCB0aGlzKSlcblxuICAgIHRoaXMuJGRpYWxvZy5vbignbW91c2Vkb3duLmRpc21pc3MuYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGF0LiRlbGVtZW50Lm9uZSgnbW91c2V1cC5kaXNtaXNzLmJzLm1vZGFsJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKCQoZS50YXJnZXQpLmlzKHRoYXQuJGVsZW1lbnQpKSB0aGF0Lmlnbm9yZUJhY2tkcm9wQ2xpY2sgPSB0cnVlXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICB0aGlzLmJhY2tkcm9wKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB0cmFuc2l0aW9uID0gJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgdGhhdC4kZWxlbWVudC5oYXNDbGFzcygnZmFkZScpXG5cbiAgICAgIGlmICghdGhhdC4kZWxlbWVudC5wYXJlbnQoKS5sZW5ndGgpIHtcbiAgICAgICAgdGhhdC4kZWxlbWVudC5hcHBlbmRUbyh0aGF0LiRib2R5KSAvLyBkb24ndCBtb3ZlIG1vZGFscyBkb20gcG9zaXRpb25cbiAgICAgIH1cblxuICAgICAgdGhhdC4kZWxlbWVudFxuICAgICAgICAuc2hvdygpXG4gICAgICAgIC5zY3JvbGxUb3AoMClcblxuICAgICAgdGhhdC5hZGp1c3REaWFsb2coKVxuXG4gICAgICBpZiAodHJhbnNpdGlvbikge1xuICAgICAgICB0aGF0LiRlbGVtZW50WzBdLm9mZnNldFdpZHRoIC8vIGZvcmNlIHJlZmxvd1xuICAgICAgfVxuXG4gICAgICB0aGF0LiRlbGVtZW50LmFkZENsYXNzKCdpbicpXG5cbiAgICAgIHRoYXQuZW5mb3JjZUZvY3VzKClcblxuICAgICAgdmFyIGUgPSAkLkV2ZW50KCdzaG93bi5icy5tb2RhbCcsIHsgcmVsYXRlZFRhcmdldDogX3JlbGF0ZWRUYXJnZXQgfSlcblxuICAgICAgdHJhbnNpdGlvbiA/XG4gICAgICAgIHRoYXQuJGRpYWxvZyAvLyB3YWl0IGZvciBtb2RhbCB0byBzbGlkZSBpblxuICAgICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoYXQuJGVsZW1lbnQudHJpZ2dlcignZm9jdXMnKS50cmlnZ2VyKGUpXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoTW9kYWwuVFJBTlNJVElPTl9EVVJBVElPTikgOlxuICAgICAgICB0aGF0LiRlbGVtZW50LnRyaWdnZXIoJ2ZvY3VzJykudHJpZ2dlcihlKVxuICAgIH0pXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKGUpIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgZSA9ICQuRXZlbnQoJ2hpZGUuYnMubW9kYWwnKVxuXG4gICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKGUpXG5cbiAgICBpZiAoIXRoaXMuaXNTaG93biB8fCBlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgIHRoaXMuaXNTaG93biA9IGZhbHNlXG5cbiAgICB0aGlzLmVzY2FwZSgpXG4gICAgdGhpcy5yZXNpemUoKVxuXG4gICAgJChkb2N1bWVudCkub2ZmKCdmb2N1c2luLmJzLm1vZGFsJylcblxuICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgIC5yZW1vdmVDbGFzcygnaW4nKVxuICAgICAgLm9mZignY2xpY2suZGlzbWlzcy5icy5tb2RhbCcpXG4gICAgICAub2ZmKCdtb3VzZXVwLmRpc21pc3MuYnMubW9kYWwnKVxuXG4gICAgdGhpcy4kZGlhbG9nLm9mZignbW91c2Vkb3duLmRpc21pc3MuYnMubW9kYWwnKVxuXG4gICAgJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnZmFkZScpID9cbiAgICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgJC5wcm94eSh0aGlzLmhpZGVNb2RhbCwgdGhpcykpXG4gICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChNb2RhbC5UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XG4gICAgICB0aGlzLmhpZGVNb2RhbCgpXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuZW5mb3JjZUZvY3VzID0gZnVuY3Rpb24gKCkge1xuICAgICQoZG9jdW1lbnQpXG4gICAgICAub2ZmKCdmb2N1c2luLmJzLm1vZGFsJykgLy8gZ3VhcmQgYWdhaW5zdCBpbmZpbml0ZSBmb2N1cyBsb29wXG4gICAgICAub24oJ2ZvY3VzaW4uYnMubW9kYWwnLCAkLnByb3h5KGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmICh0aGlzLiRlbGVtZW50WzBdICE9PSBlLnRhcmdldCAmJiAhdGhpcy4kZWxlbWVudC5oYXMoZS50YXJnZXQpLmxlbmd0aCkge1xuICAgICAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcignZm9jdXMnKVxuICAgICAgICB9XG4gICAgICB9LCB0aGlzKSlcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5lc2NhcGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuaXNTaG93biAmJiB0aGlzLm9wdGlvbnMua2V5Ym9hcmQpIHtcbiAgICAgIHRoaXMuJGVsZW1lbnQub24oJ2tleWRvd24uZGlzbWlzcy5icy5tb2RhbCcsICQucHJveHkoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS53aGljaCA9PSAyNyAmJiB0aGlzLmhpZGUoKVxuICAgICAgfSwgdGhpcykpXG4gICAgfSBlbHNlIGlmICghdGhpcy5pc1Nob3duKSB7XG4gICAgICB0aGlzLiRlbGVtZW50Lm9mZigna2V5ZG93bi5kaXNtaXNzLmJzLm1vZGFsJylcbiAgICB9XG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUucmVzaXplID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmlzU2hvd24pIHtcbiAgICAgICQod2luZG93KS5vbigncmVzaXplLmJzLm1vZGFsJywgJC5wcm94eSh0aGlzLmhhbmRsZVVwZGF0ZSwgdGhpcykpXG4gICAgfSBlbHNlIHtcbiAgICAgICQod2luZG93KS5vZmYoJ3Jlc2l6ZS5icy5tb2RhbCcpXG4gICAgfVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLmhpZGVNb2RhbCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICB0aGlzLiRlbGVtZW50LmhpZGUoKVxuICAgIHRoaXMuYmFja2Ryb3AoZnVuY3Rpb24gKCkge1xuICAgICAgdGhhdC4kYm9keS5yZW1vdmVDbGFzcygnbW9kYWwtb3BlbicpXG4gICAgICB0aGF0LnJlc2V0QWRqdXN0bWVudHMoKVxuICAgICAgdGhhdC5yZXNldFNjcm9sbGJhcigpXG4gICAgICB0aGF0LiRlbGVtZW50LnRyaWdnZXIoJ2hpZGRlbi5icy5tb2RhbCcpXG4gICAgfSlcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5yZW1vdmVCYWNrZHJvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLiRiYWNrZHJvcCAmJiB0aGlzLiRiYWNrZHJvcC5yZW1vdmUoKVxuICAgIHRoaXMuJGJhY2tkcm9wID0gbnVsbFxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLmJhY2tkcm9wID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgdmFyIGFuaW1hdGUgPSB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdmYWRlJykgPyAnZmFkZScgOiAnJ1xuXG4gICAgaWYgKHRoaXMuaXNTaG93biAmJiB0aGlzLm9wdGlvbnMuYmFja2Ryb3ApIHtcbiAgICAgIHZhciBkb0FuaW1hdGUgPSAkLnN1cHBvcnQudHJhbnNpdGlvbiAmJiBhbmltYXRlXG5cbiAgICAgIHRoaXMuJGJhY2tkcm9wID0gJChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSlcbiAgICAgICAgLmFkZENsYXNzKCdtb2RhbC1iYWNrZHJvcCAnICsgYW5pbWF0ZSlcbiAgICAgICAgLmFwcGVuZFRvKHRoaXMuJGJvZHkpXG5cbiAgICAgIHRoaXMuJGVsZW1lbnQub24oJ2NsaWNrLmRpc21pc3MuYnMubW9kYWwnLCAkLnByb3h5KGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmICh0aGlzLmlnbm9yZUJhY2tkcm9wQ2xpY2spIHtcbiAgICAgICAgICB0aGlzLmlnbm9yZUJhY2tkcm9wQ2xpY2sgPSBmYWxzZVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGlmIChlLnRhcmdldCAhPT0gZS5jdXJyZW50VGFyZ2V0KSByZXR1cm5cbiAgICAgICAgdGhpcy5vcHRpb25zLmJhY2tkcm9wID09ICdzdGF0aWMnXG4gICAgICAgICAgPyB0aGlzLiRlbGVtZW50WzBdLmZvY3VzKClcbiAgICAgICAgICA6IHRoaXMuaGlkZSgpXG4gICAgICB9LCB0aGlzKSlcblxuICAgICAgaWYgKGRvQW5pbWF0ZSkgdGhpcy4kYmFja2Ryb3BbMF0ub2Zmc2V0V2lkdGggLy8gZm9yY2UgcmVmbG93XG5cbiAgICAgIHRoaXMuJGJhY2tkcm9wLmFkZENsYXNzKCdpbicpXG5cbiAgICAgIGlmICghY2FsbGJhY2spIHJldHVyblxuXG4gICAgICBkb0FuaW1hdGUgP1xuICAgICAgICB0aGlzLiRiYWNrZHJvcFxuICAgICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIGNhbGxiYWNrKVxuICAgICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChNb2RhbC5CQUNLRFJPUF9UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XG4gICAgICAgIGNhbGxiYWNrKClcblxuICAgIH0gZWxzZSBpZiAoIXRoaXMuaXNTaG93biAmJiB0aGlzLiRiYWNrZHJvcCkge1xuICAgICAgdGhpcy4kYmFja2Ryb3AucmVtb3ZlQ2xhc3MoJ2luJylcblxuICAgICAgdmFyIGNhbGxiYWNrUmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGF0LnJlbW92ZUJhY2tkcm9wKClcbiAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKVxuICAgICAgfVxuICAgICAgJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnZmFkZScpID9cbiAgICAgICAgdGhpcy4kYmFja2Ryb3BcbiAgICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCBjYWxsYmFja1JlbW92ZSlcbiAgICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoTW9kYWwuQkFDS0RST1BfVFJBTlNJVElPTl9EVVJBVElPTikgOlxuICAgICAgICBjYWxsYmFja1JlbW92ZSgpXG5cbiAgICB9IGVsc2UgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjaygpXG4gICAgfVxuICB9XG5cbiAgLy8gdGhlc2UgZm9sbG93aW5nIG1ldGhvZHMgYXJlIHVzZWQgdG8gaGFuZGxlIG92ZXJmbG93aW5nIG1vZGFsc1xuXG4gIE1vZGFsLnByb3RvdHlwZS5oYW5kbGVVcGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5hZGp1c3REaWFsb2coKVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLmFkanVzdERpYWxvZyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbW9kYWxJc092ZXJmbG93aW5nID0gdGhpcy4kZWxlbWVudFswXS5zY3JvbGxIZWlnaHQgPiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0XG5cbiAgICB0aGlzLiRlbGVtZW50LmNzcyh7XG4gICAgICBwYWRkaW5nTGVmdDogICF0aGlzLmJvZHlJc092ZXJmbG93aW5nICYmIG1vZGFsSXNPdmVyZmxvd2luZyA/IHRoaXMuc2Nyb2xsYmFyV2lkdGggOiAnJyxcbiAgICAgIHBhZGRpbmdSaWdodDogdGhpcy5ib2R5SXNPdmVyZmxvd2luZyAmJiAhbW9kYWxJc092ZXJmbG93aW5nID8gdGhpcy5zY3JvbGxiYXJXaWR0aCA6ICcnXG4gICAgfSlcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5yZXNldEFkanVzdG1lbnRzID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuJGVsZW1lbnQuY3NzKHtcbiAgICAgIHBhZGRpbmdMZWZ0OiAnJyxcbiAgICAgIHBhZGRpbmdSaWdodDogJydcbiAgICB9KVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLmNoZWNrU2Nyb2xsYmFyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBmdWxsV2luZG93V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aFxuICAgIGlmICghZnVsbFdpbmRvd1dpZHRoKSB7IC8vIHdvcmthcm91bmQgZm9yIG1pc3Npbmcgd2luZG93LmlubmVyV2lkdGggaW4gSUU4XG4gICAgICB2YXIgZG9jdW1lbnRFbGVtZW50UmVjdCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgZnVsbFdpbmRvd1dpZHRoID0gZG9jdW1lbnRFbGVtZW50UmVjdC5yaWdodCAtIE1hdGguYWJzKGRvY3VtZW50RWxlbWVudFJlY3QubGVmdClcbiAgICB9XG4gICAgdGhpcy5ib2R5SXNPdmVyZmxvd2luZyA9IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGggPCBmdWxsV2luZG93V2lkdGhcbiAgICB0aGlzLnNjcm9sbGJhcldpZHRoID0gdGhpcy5tZWFzdXJlU2Nyb2xsYmFyKClcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5zZXRTY3JvbGxiYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGJvZHlQYWQgPSBwYXJzZUludCgodGhpcy4kYm9keS5jc3MoJ3BhZGRpbmctcmlnaHQnKSB8fCAwKSwgMTApXG4gICAgdGhpcy5vcmlnaW5hbEJvZHlQYWQgPSBkb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodCB8fCAnJ1xuICAgIGlmICh0aGlzLmJvZHlJc092ZXJmbG93aW5nKSB0aGlzLiRib2R5LmNzcygncGFkZGluZy1yaWdodCcsIGJvZHlQYWQgKyB0aGlzLnNjcm9sbGJhcldpZHRoKVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLnJlc2V0U2Nyb2xsYmFyID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuJGJvZHkuY3NzKCdwYWRkaW5nLXJpZ2h0JywgdGhpcy5vcmlnaW5hbEJvZHlQYWQpXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUubWVhc3VyZVNjcm9sbGJhciA9IGZ1bmN0aW9uICgpIHsgLy8gdGh4IHdhbHNoXG4gICAgdmFyIHNjcm9sbERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgc2Nyb2xsRGl2LmNsYXNzTmFtZSA9ICdtb2RhbC1zY3JvbGxiYXItbWVhc3VyZSdcbiAgICB0aGlzLiRib2R5LmFwcGVuZChzY3JvbGxEaXYpXG4gICAgdmFyIHNjcm9sbGJhcldpZHRoID0gc2Nyb2xsRGl2Lm9mZnNldFdpZHRoIC0gc2Nyb2xsRGl2LmNsaWVudFdpZHRoXG4gICAgdGhpcy4kYm9keVswXS5yZW1vdmVDaGlsZChzY3JvbGxEaXYpXG4gICAgcmV0dXJuIHNjcm9sbGJhcldpZHRoXG4gIH1cblxuXG4gIC8vIE1PREFMIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbiwgX3JlbGF0ZWRUYXJnZXQpIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgICAgPSAkdGhpcy5kYXRhKCdicy5tb2RhbCcpXG4gICAgICB2YXIgb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBNb2RhbC5ERUZBVUxUUywgJHRoaXMuZGF0YSgpLCB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvbilcblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5tb2RhbCcsIChkYXRhID0gbmV3IE1vZGFsKHRoaXMsIG9wdGlvbnMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0oX3JlbGF0ZWRUYXJnZXQpXG4gICAgICBlbHNlIGlmIChvcHRpb25zLnNob3cpIGRhdGEuc2hvdyhfcmVsYXRlZFRhcmdldClcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4ubW9kYWxcblxuICAkLmZuLm1vZGFsICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4ubW9kYWwuQ29uc3RydWN0b3IgPSBNb2RhbFxuXG5cbiAgLy8gTU9EQUwgTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT1cblxuICAkLmZuLm1vZGFsLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5tb2RhbCA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIE1PREFMIERBVEEtQVBJXG4gIC8vID09PT09PT09PT09PT09XG5cbiAgJChkb2N1bWVudCkub24oJ2NsaWNrLmJzLm1vZGFsLmRhdGEtYXBpJywgJ1tkYXRhLXRvZ2dsZT1cIm1vZGFsXCJdJywgZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcbiAgICB2YXIgaHJlZiAgICA9ICR0aGlzLmF0dHIoJ2hyZWYnKVxuICAgIHZhciAkdGFyZ2V0ID0gJCgkdGhpcy5hdHRyKCdkYXRhLXRhcmdldCcpIHx8IChocmVmICYmIGhyZWYucmVwbGFjZSgvLiooPz0jW15cXHNdKyQpLywgJycpKSkgLy8gc3RyaXAgZm9yIGllN1xuICAgIHZhciBvcHRpb24gID0gJHRhcmdldC5kYXRhKCdicy5tb2RhbCcpID8gJ3RvZ2dsZScgOiAkLmV4dGVuZCh7IHJlbW90ZTogIS8jLy50ZXN0KGhyZWYpICYmIGhyZWYgfSwgJHRhcmdldC5kYXRhKCksICR0aGlzLmRhdGEoKSlcblxuICAgIGlmICgkdGhpcy5pcygnYScpKSBlLnByZXZlbnREZWZhdWx0KClcblxuICAgICR0YXJnZXQub25lKCdzaG93LmJzLm1vZGFsJywgZnVuY3Rpb24gKHNob3dFdmVudCkge1xuICAgICAgaWYgKHNob3dFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuIC8vIG9ubHkgcmVnaXN0ZXIgZm9jdXMgcmVzdG9yZXIgaWYgbW9kYWwgd2lsbCBhY3R1YWxseSBnZXQgc2hvd25cbiAgICAgICR0YXJnZXQub25lKCdoaWRkZW4uYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICR0aGlzLmlzKCc6dmlzaWJsZScpICYmICR0aGlzLnRyaWdnZXIoJ2ZvY3VzJylcbiAgICAgIH0pXG4gICAgfSlcbiAgICBQbHVnaW4uY2FsbCgkdGFyZ2V0LCBvcHRpb24sIHRoaXMpXG4gIH0pXG5cbn0oalF1ZXJ5KTtcbiIsIi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiB0b29sdGlwLmpzIHYzLjMuNlxuICogaHR0cDovL2dldGJvb3RzdHJhcC5jb20vamF2YXNjcmlwdC8jdG9vbHRpcFxuICogSW5zcGlyZWQgYnkgdGhlIG9yaWdpbmFsIGpRdWVyeS50aXBzeSBieSBKYXNvbiBGcmFtZVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE1IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIFRPT0xUSVAgUFVCTElDIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBUb29sdGlwID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLnR5cGUgICAgICAgPSBudWxsXG4gICAgdGhpcy5vcHRpb25zICAgID0gbnVsbFxuICAgIHRoaXMuZW5hYmxlZCAgICA9IG51bGxcbiAgICB0aGlzLnRpbWVvdXQgICAgPSBudWxsXG4gICAgdGhpcy5ob3ZlclN0YXRlID0gbnVsbFxuICAgIHRoaXMuJGVsZW1lbnQgICA9IG51bGxcbiAgICB0aGlzLmluU3RhdGUgICAgPSBudWxsXG5cbiAgICB0aGlzLmluaXQoJ3Rvb2x0aXAnLCBlbGVtZW50LCBvcHRpb25zKVxuICB9XG5cbiAgVG9vbHRpcC5WRVJTSU9OICA9ICczLjMuNidcblxuICBUb29sdGlwLlRSQU5TSVRJT05fRFVSQVRJT04gPSAxNTBcblxuICBUb29sdGlwLkRFRkFVTFRTID0ge1xuICAgIGFuaW1hdGlvbjogdHJ1ZSxcbiAgICBwbGFjZW1lbnQ6ICd0b3AnLFxuICAgIHNlbGVjdG9yOiBmYWxzZSxcbiAgICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJ0b29sdGlwXCIgcm9sZT1cInRvb2x0aXBcIj48ZGl2IGNsYXNzPVwidG9vbHRpcC1hcnJvd1wiPjwvZGl2PjxkaXYgY2xhc3M9XCJ0b29sdGlwLWlubmVyXCI+PC9kaXY+PC9kaXY+JyxcbiAgICB0cmlnZ2VyOiAnaG92ZXIgZm9jdXMnLFxuICAgIHRpdGxlOiAnJyxcbiAgICBkZWxheTogMCxcbiAgICBodG1sOiBmYWxzZSxcbiAgICBjb250YWluZXI6IGZhbHNlLFxuICAgIHZpZXdwb3J0OiB7XG4gICAgICBzZWxlY3RvcjogJ2JvZHknLFxuICAgICAgcGFkZGluZzogMFxuICAgIH1cbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAodHlwZSwgZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuZW5hYmxlZCAgID0gdHJ1ZVxuICAgIHRoaXMudHlwZSAgICAgID0gdHlwZVxuICAgIHRoaXMuJGVsZW1lbnQgID0gJChlbGVtZW50KVxuICAgIHRoaXMub3B0aW9ucyAgID0gdGhpcy5nZXRPcHRpb25zKG9wdGlvbnMpXG4gICAgdGhpcy4kdmlld3BvcnQgPSB0aGlzLm9wdGlvbnMudmlld3BvcnQgJiYgJCgkLmlzRnVuY3Rpb24odGhpcy5vcHRpb25zLnZpZXdwb3J0KSA/IHRoaXMub3B0aW9ucy52aWV3cG9ydC5jYWxsKHRoaXMsIHRoaXMuJGVsZW1lbnQpIDogKHRoaXMub3B0aW9ucy52aWV3cG9ydC5zZWxlY3RvciB8fCB0aGlzLm9wdGlvbnMudmlld3BvcnQpKVxuICAgIHRoaXMuaW5TdGF0ZSAgID0geyBjbGljazogZmFsc2UsIGhvdmVyOiBmYWxzZSwgZm9jdXM6IGZhbHNlIH1cblxuICAgIGlmICh0aGlzLiRlbGVtZW50WzBdIGluc3RhbmNlb2YgZG9jdW1lbnQuY29uc3RydWN0b3IgJiYgIXRoaXMub3B0aW9ucy5zZWxlY3Rvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdgc2VsZWN0b3JgIG9wdGlvbiBtdXN0IGJlIHNwZWNpZmllZCB3aGVuIGluaXRpYWxpemluZyAnICsgdGhpcy50eXBlICsgJyBvbiB0aGUgd2luZG93LmRvY3VtZW50IG9iamVjdCEnKVxuICAgIH1cblxuICAgIHZhciB0cmlnZ2VycyA9IHRoaXMub3B0aW9ucy50cmlnZ2VyLnNwbGl0KCcgJylcblxuICAgIGZvciAodmFyIGkgPSB0cmlnZ2Vycy5sZW5ndGg7IGktLTspIHtcbiAgICAgIHZhciB0cmlnZ2VyID0gdHJpZ2dlcnNbaV1cblxuICAgICAgaWYgKHRyaWdnZXIgPT0gJ2NsaWNrJykge1xuICAgICAgICB0aGlzLiRlbGVtZW50Lm9uKCdjbGljay4nICsgdGhpcy50eXBlLCB0aGlzLm9wdGlvbnMuc2VsZWN0b3IsICQucHJveHkodGhpcy50b2dnbGUsIHRoaXMpKVxuICAgICAgfSBlbHNlIGlmICh0cmlnZ2VyICE9ICdtYW51YWwnKSB7XG4gICAgICAgIHZhciBldmVudEluICA9IHRyaWdnZXIgPT0gJ2hvdmVyJyA/ICdtb3VzZWVudGVyJyA6ICdmb2N1c2luJ1xuICAgICAgICB2YXIgZXZlbnRPdXQgPSB0cmlnZ2VyID09ICdob3ZlcicgPyAnbW91c2VsZWF2ZScgOiAnZm9jdXNvdXQnXG5cbiAgICAgICAgdGhpcy4kZWxlbWVudC5vbihldmVudEluICArICcuJyArIHRoaXMudHlwZSwgdGhpcy5vcHRpb25zLnNlbGVjdG9yLCAkLnByb3h5KHRoaXMuZW50ZXIsIHRoaXMpKVxuICAgICAgICB0aGlzLiRlbGVtZW50Lm9uKGV2ZW50T3V0ICsgJy4nICsgdGhpcy50eXBlLCB0aGlzLm9wdGlvbnMuc2VsZWN0b3IsICQucHJveHkodGhpcy5sZWF2ZSwgdGhpcykpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5vcHRpb25zLnNlbGVjdG9yID9cbiAgICAgICh0aGlzLl9vcHRpb25zID0gJC5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgeyB0cmlnZ2VyOiAnbWFudWFsJywgc2VsZWN0b3I6ICcnIH0pKSA6XG4gICAgICB0aGlzLmZpeFRpdGxlKClcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldERlZmF1bHRzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBUb29sdGlwLkRFRkFVTFRTXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXRPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gJC5leHRlbmQoe30sIHRoaXMuZ2V0RGVmYXVsdHMoKSwgdGhpcy4kZWxlbWVudC5kYXRhKCksIG9wdGlvbnMpXG5cbiAgICBpZiAob3B0aW9ucy5kZWxheSAmJiB0eXBlb2Ygb3B0aW9ucy5kZWxheSA9PSAnbnVtYmVyJykge1xuICAgICAgb3B0aW9ucy5kZWxheSA9IHtcbiAgICAgICAgc2hvdzogb3B0aW9ucy5kZWxheSxcbiAgICAgICAgaGlkZTogb3B0aW9ucy5kZWxheVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBvcHRpb25zXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXREZWxlZ2F0ZU9wdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG9wdGlvbnMgID0ge31cbiAgICB2YXIgZGVmYXVsdHMgPSB0aGlzLmdldERlZmF1bHRzKClcblxuICAgIHRoaXMuX29wdGlvbnMgJiYgJC5lYWNoKHRoaXMuX29wdGlvbnMsIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICBpZiAoZGVmYXVsdHNba2V5XSAhPSB2YWx1ZSkgb3B0aW9uc1trZXldID0gdmFsdWVcbiAgICB9KVxuXG4gICAgcmV0dXJuIG9wdGlvbnNcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmVudGVyID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHZhciBzZWxmID0gb2JqIGluc3RhbmNlb2YgdGhpcy5jb25zdHJ1Y3RvciA/XG4gICAgICBvYmogOiAkKG9iai5jdXJyZW50VGFyZ2V0KS5kYXRhKCdicy4nICsgdGhpcy50eXBlKVxuXG4gICAgaWYgKCFzZWxmKSB7XG4gICAgICBzZWxmID0gbmV3IHRoaXMuY29uc3RydWN0b3Iob2JqLmN1cnJlbnRUYXJnZXQsIHRoaXMuZ2V0RGVsZWdhdGVPcHRpb25zKCkpXG4gICAgICAkKG9iai5jdXJyZW50VGFyZ2V0KS5kYXRhKCdicy4nICsgdGhpcy50eXBlLCBzZWxmKVxuICAgIH1cblxuICAgIGlmIChvYmogaW5zdGFuY2VvZiAkLkV2ZW50KSB7XG4gICAgICBzZWxmLmluU3RhdGVbb2JqLnR5cGUgPT0gJ2ZvY3VzaW4nID8gJ2ZvY3VzJyA6ICdob3ZlciddID0gdHJ1ZVxuICAgIH1cblxuICAgIGlmIChzZWxmLnRpcCgpLmhhc0NsYXNzKCdpbicpIHx8IHNlbGYuaG92ZXJTdGF0ZSA9PSAnaW4nKSB7XG4gICAgICBzZWxmLmhvdmVyU3RhdGUgPSAnaW4nXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjbGVhclRpbWVvdXQoc2VsZi50aW1lb3V0KVxuXG4gICAgc2VsZi5ob3ZlclN0YXRlID0gJ2luJ1xuXG4gICAgaWYgKCFzZWxmLm9wdGlvbnMuZGVsYXkgfHwgIXNlbGYub3B0aW9ucy5kZWxheS5zaG93KSByZXR1cm4gc2VsZi5zaG93KClcblxuICAgIHNlbGYudGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHNlbGYuaG92ZXJTdGF0ZSA9PSAnaW4nKSBzZWxmLnNob3coKVxuICAgIH0sIHNlbGYub3B0aW9ucy5kZWxheS5zaG93KVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuaXNJblN0YXRlVHJ1ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5pblN0YXRlKSB7XG4gICAgICBpZiAodGhpcy5pblN0YXRlW2tleV0pIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5sZWF2ZSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICB2YXIgc2VsZiA9IG9iaiBpbnN0YW5jZW9mIHRoaXMuY29uc3RydWN0b3IgP1xuICAgICAgb2JqIDogJChvYmouY3VycmVudFRhcmdldCkuZGF0YSgnYnMuJyArIHRoaXMudHlwZSlcblxuICAgIGlmICghc2VsZikge1xuICAgICAgc2VsZiA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKG9iai5jdXJyZW50VGFyZ2V0LCB0aGlzLmdldERlbGVnYXRlT3B0aW9ucygpKVxuICAgICAgJChvYmouY3VycmVudFRhcmdldCkuZGF0YSgnYnMuJyArIHRoaXMudHlwZSwgc2VsZilcbiAgICB9XG5cbiAgICBpZiAob2JqIGluc3RhbmNlb2YgJC5FdmVudCkge1xuICAgICAgc2VsZi5pblN0YXRlW29iai50eXBlID09ICdmb2N1c291dCcgPyAnZm9jdXMnIDogJ2hvdmVyJ10gPSBmYWxzZVxuICAgIH1cblxuICAgIGlmIChzZWxmLmlzSW5TdGF0ZVRydWUoKSkgcmV0dXJuXG5cbiAgICBjbGVhclRpbWVvdXQoc2VsZi50aW1lb3V0KVxuXG4gICAgc2VsZi5ob3ZlclN0YXRlID0gJ291dCdcblxuICAgIGlmICghc2VsZi5vcHRpb25zLmRlbGF5IHx8ICFzZWxmLm9wdGlvbnMuZGVsYXkuaGlkZSkgcmV0dXJuIHNlbGYuaGlkZSgpXG5cbiAgICBzZWxmLnRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChzZWxmLmhvdmVyU3RhdGUgPT0gJ291dCcpIHNlbGYuaGlkZSgpXG4gICAgfSwgc2VsZi5vcHRpb25zLmRlbGF5LmhpZGUpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBlID0gJC5FdmVudCgnc2hvdy5icy4nICsgdGhpcy50eXBlKVxuXG4gICAgaWYgKHRoaXMuaGFzQ29udGVudCgpICYmIHRoaXMuZW5hYmxlZCkge1xuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKGUpXG5cbiAgICAgIHZhciBpbkRvbSA9ICQuY29udGFpbnModGhpcy4kZWxlbWVudFswXS5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgdGhpcy4kZWxlbWVudFswXSlcbiAgICAgIGlmIChlLmlzRGVmYXVsdFByZXZlbnRlZCgpIHx8ICFpbkRvbSkgcmV0dXJuXG4gICAgICB2YXIgdGhhdCA9IHRoaXNcblxuICAgICAgdmFyICR0aXAgPSB0aGlzLnRpcCgpXG5cbiAgICAgIHZhciB0aXBJZCA9IHRoaXMuZ2V0VUlEKHRoaXMudHlwZSlcblxuICAgICAgdGhpcy5zZXRDb250ZW50KClcbiAgICAgICR0aXAuYXR0cignaWQnLCB0aXBJZClcbiAgICAgIHRoaXMuJGVsZW1lbnQuYXR0cignYXJpYS1kZXNjcmliZWRieScsIHRpcElkKVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmFuaW1hdGlvbikgJHRpcC5hZGRDbGFzcygnZmFkZScpXG5cbiAgICAgIHZhciBwbGFjZW1lbnQgPSB0eXBlb2YgdGhpcy5vcHRpb25zLnBsYWNlbWVudCA9PSAnZnVuY3Rpb24nID9cbiAgICAgICAgdGhpcy5vcHRpb25zLnBsYWNlbWVudC5jYWxsKHRoaXMsICR0aXBbMF0sIHRoaXMuJGVsZW1lbnRbMF0pIDpcbiAgICAgICAgdGhpcy5vcHRpb25zLnBsYWNlbWVudFxuXG4gICAgICB2YXIgYXV0b1Rva2VuID0gL1xccz9hdXRvP1xccz8vaVxuICAgICAgdmFyIGF1dG9QbGFjZSA9IGF1dG9Ub2tlbi50ZXN0KHBsYWNlbWVudClcbiAgICAgIGlmIChhdXRvUGxhY2UpIHBsYWNlbWVudCA9IHBsYWNlbWVudC5yZXBsYWNlKGF1dG9Ub2tlbiwgJycpIHx8ICd0b3AnXG5cbiAgICAgICR0aXBcbiAgICAgICAgLmRldGFjaCgpXG4gICAgICAgIC5jc3MoeyB0b3A6IDAsIGxlZnQ6IDAsIGRpc3BsYXk6ICdibG9jaycgfSlcbiAgICAgICAgLmFkZENsYXNzKHBsYWNlbWVudClcbiAgICAgICAgLmRhdGEoJ2JzLicgKyB0aGlzLnR5cGUsIHRoaXMpXG5cbiAgICAgIHRoaXMub3B0aW9ucy5jb250YWluZXIgPyAkdGlwLmFwcGVuZFRvKHRoaXMub3B0aW9ucy5jb250YWluZXIpIDogJHRpcC5pbnNlcnRBZnRlcih0aGlzLiRlbGVtZW50KVxuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdpbnNlcnRlZC5icy4nICsgdGhpcy50eXBlKVxuXG4gICAgICB2YXIgcG9zICAgICAgICAgID0gdGhpcy5nZXRQb3NpdGlvbigpXG4gICAgICB2YXIgYWN0dWFsV2lkdGggID0gJHRpcFswXS5vZmZzZXRXaWR0aFxuICAgICAgdmFyIGFjdHVhbEhlaWdodCA9ICR0aXBbMF0ub2Zmc2V0SGVpZ2h0XG5cbiAgICAgIGlmIChhdXRvUGxhY2UpIHtcbiAgICAgICAgdmFyIG9yZ1BsYWNlbWVudCA9IHBsYWNlbWVudFxuICAgICAgICB2YXIgdmlld3BvcnREaW0gPSB0aGlzLmdldFBvc2l0aW9uKHRoaXMuJHZpZXdwb3J0KVxuXG4gICAgICAgIHBsYWNlbWVudCA9IHBsYWNlbWVudCA9PSAnYm90dG9tJyAmJiBwb3MuYm90dG9tICsgYWN0dWFsSGVpZ2h0ID4gdmlld3BvcnREaW0uYm90dG9tID8gJ3RvcCcgICAgOlxuICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnQgPT0gJ3RvcCcgICAgJiYgcG9zLnRvcCAgICAtIGFjdHVhbEhlaWdodCA8IHZpZXdwb3J0RGltLnRvcCAgICA/ICdib3R0b20nIDpcbiAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50ID09ICdyaWdodCcgICYmIHBvcy5yaWdodCAgKyBhY3R1YWxXaWR0aCAgPiB2aWV3cG9ydERpbS53aWR0aCAgPyAnbGVmdCcgICA6XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudCA9PSAnbGVmdCcgICAmJiBwb3MubGVmdCAgIC0gYWN0dWFsV2lkdGggIDwgdmlld3BvcnREaW0ubGVmdCAgID8gJ3JpZ2h0JyAgOlxuICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnRcblxuICAgICAgICAkdGlwXG4gICAgICAgICAgLnJlbW92ZUNsYXNzKG9yZ1BsYWNlbWVudClcbiAgICAgICAgICAuYWRkQ2xhc3MocGxhY2VtZW50KVxuICAgICAgfVxuXG4gICAgICB2YXIgY2FsY3VsYXRlZE9mZnNldCA9IHRoaXMuZ2V0Q2FsY3VsYXRlZE9mZnNldChwbGFjZW1lbnQsIHBvcywgYWN0dWFsV2lkdGgsIGFjdHVhbEhlaWdodClcblxuICAgICAgdGhpcy5hcHBseVBsYWNlbWVudChjYWxjdWxhdGVkT2Zmc2V0LCBwbGFjZW1lbnQpXG5cbiAgICAgIHZhciBjb21wbGV0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHByZXZIb3ZlclN0YXRlID0gdGhhdC5ob3ZlclN0YXRlXG4gICAgICAgIHRoYXQuJGVsZW1lbnQudHJpZ2dlcignc2hvd24uYnMuJyArIHRoYXQudHlwZSlcbiAgICAgICAgdGhhdC5ob3ZlclN0YXRlID0gbnVsbFxuXG4gICAgICAgIGlmIChwcmV2SG92ZXJTdGF0ZSA9PSAnb3V0JykgdGhhdC5sZWF2ZSh0aGF0KVxuICAgICAgfVxuXG4gICAgICAkLnN1cHBvcnQudHJhbnNpdGlvbiAmJiB0aGlzLiR0aXAuaGFzQ2xhc3MoJ2ZhZGUnKSA/XG4gICAgICAgICR0aXBcbiAgICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCBjb21wbGV0ZSlcbiAgICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoVG9vbHRpcC5UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XG4gICAgICAgIGNvbXBsZXRlKClcbiAgICB9XG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5hcHBseVBsYWNlbWVudCA9IGZ1bmN0aW9uIChvZmZzZXQsIHBsYWNlbWVudCkge1xuICAgIHZhciAkdGlwICAgPSB0aGlzLnRpcCgpXG4gICAgdmFyIHdpZHRoICA9ICR0aXBbMF0ub2Zmc2V0V2lkdGhcbiAgICB2YXIgaGVpZ2h0ID0gJHRpcFswXS5vZmZzZXRIZWlnaHRcblxuICAgIC8vIG1hbnVhbGx5IHJlYWQgbWFyZ2lucyBiZWNhdXNlIGdldEJvdW5kaW5nQ2xpZW50UmVjdCBpbmNsdWRlcyBkaWZmZXJlbmNlXG4gICAgdmFyIG1hcmdpblRvcCA9IHBhcnNlSW50KCR0aXAuY3NzKCdtYXJnaW4tdG9wJyksIDEwKVxuICAgIHZhciBtYXJnaW5MZWZ0ID0gcGFyc2VJbnQoJHRpcC5jc3MoJ21hcmdpbi1sZWZ0JyksIDEwKVxuXG4gICAgLy8gd2UgbXVzdCBjaGVjayBmb3IgTmFOIGZvciBpZSA4LzlcbiAgICBpZiAoaXNOYU4obWFyZ2luVG9wKSkgIG1hcmdpblRvcCAgPSAwXG4gICAgaWYgKGlzTmFOKG1hcmdpbkxlZnQpKSBtYXJnaW5MZWZ0ID0gMFxuXG4gICAgb2Zmc2V0LnRvcCAgKz0gbWFyZ2luVG9wXG4gICAgb2Zmc2V0LmxlZnQgKz0gbWFyZ2luTGVmdFxuXG4gICAgLy8gJC5mbi5vZmZzZXQgZG9lc24ndCByb3VuZCBwaXhlbCB2YWx1ZXNcbiAgICAvLyBzbyB3ZSB1c2Ugc2V0T2Zmc2V0IGRpcmVjdGx5IHdpdGggb3VyIG93biBmdW5jdGlvbiBCLTBcbiAgICAkLm9mZnNldC5zZXRPZmZzZXQoJHRpcFswXSwgJC5leHRlbmQoe1xuICAgICAgdXNpbmc6IGZ1bmN0aW9uIChwcm9wcykge1xuICAgICAgICAkdGlwLmNzcyh7XG4gICAgICAgICAgdG9wOiBNYXRoLnJvdW5kKHByb3BzLnRvcCksXG4gICAgICAgICAgbGVmdDogTWF0aC5yb3VuZChwcm9wcy5sZWZ0KVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0sIG9mZnNldCksIDApXG5cbiAgICAkdGlwLmFkZENsYXNzKCdpbicpXG5cbiAgICAvLyBjaGVjayB0byBzZWUgaWYgcGxhY2luZyB0aXAgaW4gbmV3IG9mZnNldCBjYXVzZWQgdGhlIHRpcCB0byByZXNpemUgaXRzZWxmXG4gICAgdmFyIGFjdHVhbFdpZHRoICA9ICR0aXBbMF0ub2Zmc2V0V2lkdGhcbiAgICB2YXIgYWN0dWFsSGVpZ2h0ID0gJHRpcFswXS5vZmZzZXRIZWlnaHRcblxuICAgIGlmIChwbGFjZW1lbnQgPT0gJ3RvcCcgJiYgYWN0dWFsSGVpZ2h0ICE9IGhlaWdodCkge1xuICAgICAgb2Zmc2V0LnRvcCA9IG9mZnNldC50b3AgKyBoZWlnaHQgLSBhY3R1YWxIZWlnaHRcbiAgICB9XG5cbiAgICB2YXIgZGVsdGEgPSB0aGlzLmdldFZpZXdwb3J0QWRqdXN0ZWREZWx0YShwbGFjZW1lbnQsIG9mZnNldCwgYWN0dWFsV2lkdGgsIGFjdHVhbEhlaWdodClcblxuICAgIGlmIChkZWx0YS5sZWZ0KSBvZmZzZXQubGVmdCArPSBkZWx0YS5sZWZ0XG4gICAgZWxzZSBvZmZzZXQudG9wICs9IGRlbHRhLnRvcFxuXG4gICAgdmFyIGlzVmVydGljYWwgICAgICAgICAgPSAvdG9wfGJvdHRvbS8udGVzdChwbGFjZW1lbnQpXG4gICAgdmFyIGFycm93RGVsdGEgICAgICAgICAgPSBpc1ZlcnRpY2FsID8gZGVsdGEubGVmdCAqIDIgLSB3aWR0aCArIGFjdHVhbFdpZHRoIDogZGVsdGEudG9wICogMiAtIGhlaWdodCArIGFjdHVhbEhlaWdodFxuICAgIHZhciBhcnJvd09mZnNldFBvc2l0aW9uID0gaXNWZXJ0aWNhbCA/ICdvZmZzZXRXaWR0aCcgOiAnb2Zmc2V0SGVpZ2h0J1xuXG4gICAgJHRpcC5vZmZzZXQob2Zmc2V0KVxuICAgIHRoaXMucmVwbGFjZUFycm93KGFycm93RGVsdGEsICR0aXBbMF1bYXJyb3dPZmZzZXRQb3NpdGlvbl0sIGlzVmVydGljYWwpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5yZXBsYWNlQXJyb3cgPSBmdW5jdGlvbiAoZGVsdGEsIGRpbWVuc2lvbiwgaXNWZXJ0aWNhbCkge1xuICAgIHRoaXMuYXJyb3coKVxuICAgICAgLmNzcyhpc1ZlcnRpY2FsID8gJ2xlZnQnIDogJ3RvcCcsIDUwICogKDEgLSBkZWx0YSAvIGRpbWVuc2lvbikgKyAnJScpXG4gICAgICAuY3NzKGlzVmVydGljYWwgPyAndG9wJyA6ICdsZWZ0JywgJycpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5zZXRDb250ZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkdGlwICA9IHRoaXMudGlwKClcbiAgICB2YXIgdGl0bGUgPSB0aGlzLmdldFRpdGxlKClcblxuICAgICR0aXAuZmluZCgnLnRvb2x0aXAtaW5uZXInKVt0aGlzLm9wdGlvbnMuaHRtbCA/ICdodG1sJyA6ICd0ZXh0J10odGl0bGUpXG4gICAgJHRpcC5yZW1vdmVDbGFzcygnZmFkZSBpbiB0b3AgYm90dG9tIGxlZnQgcmlnaHQnKVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgIHZhciB0aGF0ID0gdGhpc1xuICAgIHZhciAkdGlwID0gJCh0aGlzLiR0aXApXG4gICAgdmFyIGUgICAgPSAkLkV2ZW50KCdoaWRlLmJzLicgKyB0aGlzLnR5cGUpXG5cbiAgICBmdW5jdGlvbiBjb21wbGV0ZSgpIHtcbiAgICAgIGlmICh0aGF0LmhvdmVyU3RhdGUgIT0gJ2luJykgJHRpcC5kZXRhY2goKVxuICAgICAgdGhhdC4kZWxlbWVudFxuICAgICAgICAucmVtb3ZlQXR0cignYXJpYS1kZXNjcmliZWRieScpXG4gICAgICAgIC50cmlnZ2VyKCdoaWRkZW4uYnMuJyArIHRoYXQudHlwZSlcbiAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKClcbiAgICB9XG5cbiAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoZSlcblxuICAgIGlmIChlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgICR0aXAucmVtb3ZlQ2xhc3MoJ2luJylcblxuICAgICQuc3VwcG9ydC50cmFuc2l0aW9uICYmICR0aXAuaGFzQ2xhc3MoJ2ZhZGUnKSA/XG4gICAgICAkdGlwXG4gICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIGNvbXBsZXRlKVxuICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoVG9vbHRpcC5UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XG4gICAgICBjb21wbGV0ZSgpXG5cbiAgICB0aGlzLmhvdmVyU3RhdGUgPSBudWxsXG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZml4VGl0bGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICRlID0gdGhpcy4kZWxlbWVudFxuICAgIGlmICgkZS5hdHRyKCd0aXRsZScpIHx8IHR5cGVvZiAkZS5hdHRyKCdkYXRhLW9yaWdpbmFsLXRpdGxlJykgIT0gJ3N0cmluZycpIHtcbiAgICAgICRlLmF0dHIoJ2RhdGEtb3JpZ2luYWwtdGl0bGUnLCAkZS5hdHRyKCd0aXRsZScpIHx8ICcnKS5hdHRyKCd0aXRsZScsICcnKVxuICAgIH1cbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmhhc0NvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VGl0bGUoKVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZ2V0UG9zaXRpb24gPSBmdW5jdGlvbiAoJGVsZW1lbnQpIHtcbiAgICAkZWxlbWVudCAgID0gJGVsZW1lbnQgfHwgdGhpcy4kZWxlbWVudFxuXG4gICAgdmFyIGVsICAgICA9ICRlbGVtZW50WzBdXG4gICAgdmFyIGlzQm9keSA9IGVsLnRhZ05hbWUgPT0gJ0JPRFknXG5cbiAgICB2YXIgZWxSZWN0ICAgID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICBpZiAoZWxSZWN0LndpZHRoID09IG51bGwpIHtcbiAgICAgIC8vIHdpZHRoIGFuZCBoZWlnaHQgYXJlIG1pc3NpbmcgaW4gSUU4LCBzbyBjb21wdXRlIHRoZW0gbWFudWFsbHk7IHNlZSBodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvaXNzdWVzLzE0MDkzXG4gICAgICBlbFJlY3QgPSAkLmV4dGVuZCh7fSwgZWxSZWN0LCB7IHdpZHRoOiBlbFJlY3QucmlnaHQgLSBlbFJlY3QubGVmdCwgaGVpZ2h0OiBlbFJlY3QuYm90dG9tIC0gZWxSZWN0LnRvcCB9KVxuICAgIH1cbiAgICB2YXIgZWxPZmZzZXQgID0gaXNCb2R5ID8geyB0b3A6IDAsIGxlZnQ6IDAgfSA6ICRlbGVtZW50Lm9mZnNldCgpXG4gICAgdmFyIHNjcm9sbCAgICA9IHsgc2Nyb2xsOiBpc0JvZHkgPyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wIHx8IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wIDogJGVsZW1lbnQuc2Nyb2xsVG9wKCkgfVxuICAgIHZhciBvdXRlckRpbXMgPSBpc0JvZHkgPyB7IHdpZHRoOiAkKHdpbmRvdykud2lkdGgoKSwgaGVpZ2h0OiAkKHdpbmRvdykuaGVpZ2h0KCkgfSA6IG51bGxcblxuICAgIHJldHVybiAkLmV4dGVuZCh7fSwgZWxSZWN0LCBzY3JvbGwsIG91dGVyRGltcywgZWxPZmZzZXQpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXRDYWxjdWxhdGVkT2Zmc2V0ID0gZnVuY3Rpb24gKHBsYWNlbWVudCwgcG9zLCBhY3R1YWxXaWR0aCwgYWN0dWFsSGVpZ2h0KSB7XG4gICAgcmV0dXJuIHBsYWNlbWVudCA9PSAnYm90dG9tJyA/IHsgdG9wOiBwb3MudG9wICsgcG9zLmhlaWdodCwgICBsZWZ0OiBwb3MubGVmdCArIHBvcy53aWR0aCAvIDIgLSBhY3R1YWxXaWR0aCAvIDIgfSA6XG4gICAgICAgICAgIHBsYWNlbWVudCA9PSAndG9wJyAgICA/IHsgdG9wOiBwb3MudG9wIC0gYWN0dWFsSGVpZ2h0LCBsZWZ0OiBwb3MubGVmdCArIHBvcy53aWR0aCAvIDIgLSBhY3R1YWxXaWR0aCAvIDIgfSA6XG4gICAgICAgICAgIHBsYWNlbWVudCA9PSAnbGVmdCcgICA/IHsgdG9wOiBwb3MudG9wICsgcG9zLmhlaWdodCAvIDIgLSBhY3R1YWxIZWlnaHQgLyAyLCBsZWZ0OiBwb3MubGVmdCAtIGFjdHVhbFdpZHRoIH0gOlxuICAgICAgICAvKiBwbGFjZW1lbnQgPT0gJ3JpZ2h0JyAqLyB7IHRvcDogcG9zLnRvcCArIHBvcy5oZWlnaHQgLyAyIC0gYWN0dWFsSGVpZ2h0IC8gMiwgbGVmdDogcG9zLmxlZnQgKyBwb3Mud2lkdGggfVxuXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXRWaWV3cG9ydEFkanVzdGVkRGVsdGEgPSBmdW5jdGlvbiAocGxhY2VtZW50LCBwb3MsIGFjdHVhbFdpZHRoLCBhY3R1YWxIZWlnaHQpIHtcbiAgICB2YXIgZGVsdGEgPSB7IHRvcDogMCwgbGVmdDogMCB9XG4gICAgaWYgKCF0aGlzLiR2aWV3cG9ydCkgcmV0dXJuIGRlbHRhXG5cbiAgICB2YXIgdmlld3BvcnRQYWRkaW5nID0gdGhpcy5vcHRpb25zLnZpZXdwb3J0ICYmIHRoaXMub3B0aW9ucy52aWV3cG9ydC5wYWRkaW5nIHx8IDBcbiAgICB2YXIgdmlld3BvcnREaW1lbnNpb25zID0gdGhpcy5nZXRQb3NpdGlvbih0aGlzLiR2aWV3cG9ydClcblxuICAgIGlmICgvcmlnaHR8bGVmdC8udGVzdChwbGFjZW1lbnQpKSB7XG4gICAgICB2YXIgdG9wRWRnZU9mZnNldCAgICA9IHBvcy50b3AgLSB2aWV3cG9ydFBhZGRpbmcgLSB2aWV3cG9ydERpbWVuc2lvbnMuc2Nyb2xsXG4gICAgICB2YXIgYm90dG9tRWRnZU9mZnNldCA9IHBvcy50b3AgKyB2aWV3cG9ydFBhZGRpbmcgLSB2aWV3cG9ydERpbWVuc2lvbnMuc2Nyb2xsICsgYWN0dWFsSGVpZ2h0XG4gICAgICBpZiAodG9wRWRnZU9mZnNldCA8IHZpZXdwb3J0RGltZW5zaW9ucy50b3ApIHsgLy8gdG9wIG92ZXJmbG93XG4gICAgICAgIGRlbHRhLnRvcCA9IHZpZXdwb3J0RGltZW5zaW9ucy50b3AgLSB0b3BFZGdlT2Zmc2V0XG4gICAgICB9IGVsc2UgaWYgKGJvdHRvbUVkZ2VPZmZzZXQgPiB2aWV3cG9ydERpbWVuc2lvbnMudG9wICsgdmlld3BvcnREaW1lbnNpb25zLmhlaWdodCkgeyAvLyBib3R0b20gb3ZlcmZsb3dcbiAgICAgICAgZGVsdGEudG9wID0gdmlld3BvcnREaW1lbnNpb25zLnRvcCArIHZpZXdwb3J0RGltZW5zaW9ucy5oZWlnaHQgLSBib3R0b21FZGdlT2Zmc2V0XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBsZWZ0RWRnZU9mZnNldCAgPSBwb3MubGVmdCAtIHZpZXdwb3J0UGFkZGluZ1xuICAgICAgdmFyIHJpZ2h0RWRnZU9mZnNldCA9IHBvcy5sZWZ0ICsgdmlld3BvcnRQYWRkaW5nICsgYWN0dWFsV2lkdGhcbiAgICAgIGlmIChsZWZ0RWRnZU9mZnNldCA8IHZpZXdwb3J0RGltZW5zaW9ucy5sZWZ0KSB7IC8vIGxlZnQgb3ZlcmZsb3dcbiAgICAgICAgZGVsdGEubGVmdCA9IHZpZXdwb3J0RGltZW5zaW9ucy5sZWZ0IC0gbGVmdEVkZ2VPZmZzZXRcbiAgICAgIH0gZWxzZSBpZiAocmlnaHRFZGdlT2Zmc2V0ID4gdmlld3BvcnREaW1lbnNpb25zLnJpZ2h0KSB7IC8vIHJpZ2h0IG92ZXJmbG93XG4gICAgICAgIGRlbHRhLmxlZnQgPSB2aWV3cG9ydERpbWVuc2lvbnMubGVmdCArIHZpZXdwb3J0RGltZW5zaW9ucy53aWR0aCAtIHJpZ2h0RWRnZU9mZnNldFxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkZWx0YVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZ2V0VGl0bGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRpdGxlXG4gICAgdmFyICRlID0gdGhpcy4kZWxlbWVudFxuICAgIHZhciBvICA9IHRoaXMub3B0aW9uc1xuXG4gICAgdGl0bGUgPSAkZS5hdHRyKCdkYXRhLW9yaWdpbmFsLXRpdGxlJylcbiAgICAgIHx8ICh0eXBlb2Ygby50aXRsZSA9PSAnZnVuY3Rpb24nID8gby50aXRsZS5jYWxsKCRlWzBdKSA6ICBvLnRpdGxlKVxuXG4gICAgcmV0dXJuIHRpdGxlXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXRVSUQgPSBmdW5jdGlvbiAocHJlZml4KSB7XG4gICAgZG8gcHJlZml4ICs9IH5+KE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwKVxuICAgIHdoaWxlIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwcmVmaXgpKVxuICAgIHJldHVybiBwcmVmaXhcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLnRpcCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuJHRpcCkge1xuICAgICAgdGhpcy4kdGlwID0gJCh0aGlzLm9wdGlvbnMudGVtcGxhdGUpXG4gICAgICBpZiAodGhpcy4kdGlwLmxlbmd0aCAhPSAxKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcih0aGlzLnR5cGUgKyAnIGB0ZW1wbGF0ZWAgb3B0aW9uIG11c3QgY29uc2lzdCBvZiBleGFjdGx5IDEgdG9wLWxldmVsIGVsZW1lbnQhJylcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuJHRpcFxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuYXJyb3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICh0aGlzLiRhcnJvdyA9IHRoaXMuJGFycm93IHx8IHRoaXMudGlwKCkuZmluZCgnLnRvb2x0aXAtYXJyb3cnKSlcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmVuYWJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmVuYWJsZWQgPSB0cnVlXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5kaXNhYmxlID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZW5hYmxlZCA9IGZhbHNlXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS50b2dnbGVFbmFibGVkID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZW5hYmxlZCA9ICF0aGlzLmVuYWJsZWRcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgaWYgKGUpIHtcbiAgICAgIHNlbGYgPSAkKGUuY3VycmVudFRhcmdldCkuZGF0YSgnYnMuJyArIHRoaXMudHlwZSlcbiAgICAgIGlmICghc2VsZikge1xuICAgICAgICBzZWxmID0gbmV3IHRoaXMuY29uc3RydWN0b3IoZS5jdXJyZW50VGFyZ2V0LCB0aGlzLmdldERlbGVnYXRlT3B0aW9ucygpKVxuICAgICAgICAkKGUuY3VycmVudFRhcmdldCkuZGF0YSgnYnMuJyArIHRoaXMudHlwZSwgc2VsZilcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZSkge1xuICAgICAgc2VsZi5pblN0YXRlLmNsaWNrID0gIXNlbGYuaW5TdGF0ZS5jbGlja1xuICAgICAgaWYgKHNlbGYuaXNJblN0YXRlVHJ1ZSgpKSBzZWxmLmVudGVyKHNlbGYpXG4gICAgICBlbHNlIHNlbGYubGVhdmUoc2VsZilcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi50aXAoKS5oYXNDbGFzcygnaW4nKSA/IHNlbGYubGVhdmUoc2VsZikgOiBzZWxmLmVudGVyKHNlbGYpXG4gICAgfVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KVxuICAgIHRoaXMuaGlkZShmdW5jdGlvbiAoKSB7XG4gICAgICB0aGF0LiRlbGVtZW50Lm9mZignLicgKyB0aGF0LnR5cGUpLnJlbW92ZURhdGEoJ2JzLicgKyB0aGF0LnR5cGUpXG4gICAgICBpZiAodGhhdC4kdGlwKSB7XG4gICAgICAgIHRoYXQuJHRpcC5kZXRhY2goKVxuICAgICAgfVxuICAgICAgdGhhdC4kdGlwID0gbnVsbFxuICAgICAgdGhhdC4kYXJyb3cgPSBudWxsXG4gICAgICB0aGF0LiR2aWV3cG9ydCA9IG51bGxcbiAgICB9KVxuICB9XG5cblxuICAvLyBUT09MVElQIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICAgID0gJHRoaXMuZGF0YSgnYnMudG9vbHRpcCcpXG4gICAgICB2YXIgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uXG5cbiAgICAgIGlmICghZGF0YSAmJiAvZGVzdHJveXxoaWRlLy50ZXN0KG9wdGlvbikpIHJldHVyblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy50b29sdGlwJywgKGRhdGEgPSBuZXcgVG9vbHRpcCh0aGlzLCBvcHRpb25zKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dKClcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4udG9vbHRpcFxuXG4gICQuZm4udG9vbHRpcCAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLnRvb2x0aXAuQ29uc3RydWN0b3IgPSBUb29sdGlwXG5cblxuICAvLyBUT09MVElQIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09PT1cblxuICAkLmZuLnRvb2x0aXAubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLnRvb2x0aXAgPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbn0oalF1ZXJ5KTtcbiIsIi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiB0YWIuanMgdjMuMy42XG4gKiBodHRwOi8vZ2V0Ym9vdHN0cmFwLmNvbS9qYXZhc2NyaXB0LyN0YWJzXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTUgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gVEFCIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgVGFiID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAvLyBqc2NzOmRpc2FibGUgcmVxdWlyZURvbGxhckJlZm9yZWpRdWVyeUFzc2lnbm1lbnRcbiAgICB0aGlzLmVsZW1lbnQgPSAkKGVsZW1lbnQpXG4gICAgLy8ganNjczplbmFibGUgcmVxdWlyZURvbGxhckJlZm9yZWpRdWVyeUFzc2lnbm1lbnRcbiAgfVxuXG4gIFRhYi5WRVJTSU9OID0gJzMuMy42J1xuXG4gIFRhYi5UUkFOU0lUSU9OX0RVUkFUSU9OID0gMTUwXG5cbiAgVGFiLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkdGhpcyAgICA9IHRoaXMuZWxlbWVudFxuICAgIHZhciAkdWwgICAgICA9ICR0aGlzLmNsb3Nlc3QoJ3VsOm5vdCguZHJvcGRvd24tbWVudSknKVxuICAgIHZhciBzZWxlY3RvciA9ICR0aGlzLmRhdGEoJ3RhcmdldCcpXG5cbiAgICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgICBzZWxlY3RvciA9ICR0aGlzLmF0dHIoJ2hyZWYnKVxuICAgICAgc2VsZWN0b3IgPSBzZWxlY3RvciAmJiBzZWxlY3Rvci5yZXBsYWNlKC8uKig/PSNbXlxcc10qJCkvLCAnJykgLy8gc3RyaXAgZm9yIGllN1xuICAgIH1cblxuICAgIGlmICgkdGhpcy5wYXJlbnQoJ2xpJykuaGFzQ2xhc3MoJ2FjdGl2ZScpKSByZXR1cm5cblxuICAgIHZhciAkcHJldmlvdXMgPSAkdWwuZmluZCgnLmFjdGl2ZTpsYXN0IGEnKVxuICAgIHZhciBoaWRlRXZlbnQgPSAkLkV2ZW50KCdoaWRlLmJzLnRhYicsIHtcbiAgICAgIHJlbGF0ZWRUYXJnZXQ6ICR0aGlzWzBdXG4gICAgfSlcbiAgICB2YXIgc2hvd0V2ZW50ID0gJC5FdmVudCgnc2hvdy5icy50YWInLCB7XG4gICAgICByZWxhdGVkVGFyZ2V0OiAkcHJldmlvdXNbMF1cbiAgICB9KVxuXG4gICAgJHByZXZpb3VzLnRyaWdnZXIoaGlkZUV2ZW50KVxuICAgICR0aGlzLnRyaWdnZXIoc2hvd0V2ZW50KVxuXG4gICAgaWYgKHNob3dFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSB8fCBoaWRlRXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgdmFyICR0YXJnZXQgPSAkKHNlbGVjdG9yKVxuXG4gICAgdGhpcy5hY3RpdmF0ZSgkdGhpcy5jbG9zZXN0KCdsaScpLCAkdWwpXG4gICAgdGhpcy5hY3RpdmF0ZSgkdGFyZ2V0LCAkdGFyZ2V0LnBhcmVudCgpLCBmdW5jdGlvbiAoKSB7XG4gICAgICAkcHJldmlvdXMudHJpZ2dlcih7XG4gICAgICAgIHR5cGU6ICdoaWRkZW4uYnMudGFiJyxcbiAgICAgICAgcmVsYXRlZFRhcmdldDogJHRoaXNbMF1cbiAgICAgIH0pXG4gICAgICAkdGhpcy50cmlnZ2VyKHtcbiAgICAgICAgdHlwZTogJ3Nob3duLmJzLnRhYicsXG4gICAgICAgIHJlbGF0ZWRUYXJnZXQ6ICRwcmV2aW91c1swXVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgVGFiLnByb3RvdHlwZS5hY3RpdmF0ZSA9IGZ1bmN0aW9uIChlbGVtZW50LCBjb250YWluZXIsIGNhbGxiYWNrKSB7XG4gICAgdmFyICRhY3RpdmUgICAgPSBjb250YWluZXIuZmluZCgnPiAuYWN0aXZlJylcbiAgICB2YXIgdHJhbnNpdGlvbiA9IGNhbGxiYWNrXG4gICAgICAmJiAkLnN1cHBvcnQudHJhbnNpdGlvblxuICAgICAgJiYgKCRhY3RpdmUubGVuZ3RoICYmICRhY3RpdmUuaGFzQ2xhc3MoJ2ZhZGUnKSB8fCAhIWNvbnRhaW5lci5maW5kKCc+IC5mYWRlJykubGVuZ3RoKVxuXG4gICAgZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICRhY3RpdmVcbiAgICAgICAgLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgICAuZmluZCgnPiAuZHJvcGRvd24tbWVudSA+IC5hY3RpdmUnKVxuICAgICAgICAgIC5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgICAgICAgLmVuZCgpXG4gICAgICAgIC5maW5kKCdbZGF0YS10b2dnbGU9XCJ0YWJcIl0nKVxuICAgICAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpXG5cbiAgICAgIGVsZW1lbnRcbiAgICAgICAgLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgICAgICAuZmluZCgnW2RhdGEtdG9nZ2xlPVwidGFiXCJdJylcbiAgICAgICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIHRydWUpXG5cbiAgICAgIGlmICh0cmFuc2l0aW9uKSB7XG4gICAgICAgIGVsZW1lbnRbMF0ub2Zmc2V0V2lkdGggLy8gcmVmbG93IGZvciB0cmFuc2l0aW9uXG4gICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ2luJylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2ZhZGUnKVxuICAgICAgfVxuXG4gICAgICBpZiAoZWxlbWVudC5wYXJlbnQoJy5kcm9wZG93bi1tZW51JykubGVuZ3RoKSB7XG4gICAgICAgIGVsZW1lbnRcbiAgICAgICAgICAuY2xvc2VzdCgnbGkuZHJvcGRvd24nKVxuICAgICAgICAgICAgLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgICAgICAgIC5lbmQoKVxuICAgICAgICAgIC5maW5kKCdbZGF0YS10b2dnbGU9XCJ0YWJcIl0nKVxuICAgICAgICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKVxuICAgICAgfVxuXG4gICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpXG4gICAgfVxuXG4gICAgJGFjdGl2ZS5sZW5ndGggJiYgdHJhbnNpdGlvbiA/XG4gICAgICAkYWN0aXZlXG4gICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIG5leHQpXG4gICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChUYWIuVFJBTlNJVElPTl9EVVJBVElPTikgOlxuICAgICAgbmV4dCgpXG5cbiAgICAkYWN0aXZlLnJlbW92ZUNsYXNzKCdpbicpXG4gIH1cblxuXG4gIC8vIFRBQiBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgPSAkdGhpcy5kYXRhKCdicy50YWInKVxuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLnRhYicsIChkYXRhID0gbmV3IFRhYih0aGlzKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dKClcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4udGFiXG5cbiAgJC5mbi50YWIgICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi50YWIuQ29uc3RydWN0b3IgPSBUYWJcblxuXG4gIC8vIFRBQiBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT1cblxuICAkLmZuLnRhYi5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4udGFiID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gVEFCIERBVEEtQVBJXG4gIC8vID09PT09PT09PT09PVxuXG4gIHZhciBjbGlja0hhbmRsZXIgPSBmdW5jdGlvbiAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIFBsdWdpbi5jYWxsKCQodGhpcyksICdzaG93JylcbiAgfVxuXG4gICQoZG9jdW1lbnQpXG4gICAgLm9uKCdjbGljay5icy50YWIuZGF0YS1hcGknLCAnW2RhdGEtdG9nZ2xlPVwidGFiXCJdJywgY2xpY2tIYW5kbGVyKVxuICAgIC5vbignY2xpY2suYnMudGFiLmRhdGEtYXBpJywgJ1tkYXRhLXRvZ2dsZT1cInBpbGxcIl0nLCBjbGlja0hhbmRsZXIpXG5cbn0oalF1ZXJ5KTtcbiIsIihmdW5jdGlvbigpIHtcbiAgdmFyICQsIEFic3RyYWN0Q2hvc2VuLCBDaG9zZW4sIFNlbGVjdFBhcnNlciwgX3JlZixcbiAgICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfTtcblxuICBTZWxlY3RQYXJzZXIgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gU2VsZWN0UGFyc2VyKCkge1xuICAgICAgdGhpcy5vcHRpb25zX2luZGV4ID0gMDtcbiAgICAgIHRoaXMucGFyc2VkID0gW107XG4gICAgfVxuXG4gICAgU2VsZWN0UGFyc2VyLnByb3RvdHlwZS5hZGRfbm9kZSA9IGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICBpZiAoY2hpbGQubm9kZU5hbWUudG9VcHBlckNhc2UoKSA9PT0gXCJPUFRHUk9VUFwiKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZF9ncm91cChjaGlsZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGRfb3B0aW9uKGNoaWxkKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgU2VsZWN0UGFyc2VyLnByb3RvdHlwZS5hZGRfZ3JvdXAgPSBmdW5jdGlvbihncm91cCkge1xuICAgICAgdmFyIGdyb3VwX3Bvc2l0aW9uLCBvcHRpb24sIF9pLCBfbGVuLCBfcmVmLCBfcmVzdWx0cztcbiAgICAgIGdyb3VwX3Bvc2l0aW9uID0gdGhpcy5wYXJzZWQubGVuZ3RoO1xuICAgICAgdGhpcy5wYXJzZWQucHVzaCh7XG4gICAgICAgIGFycmF5X2luZGV4OiBncm91cF9wb3NpdGlvbixcbiAgICAgICAgZ3JvdXA6IHRydWUsXG4gICAgICAgIGxhYmVsOiB0aGlzLmVzY2FwZUV4cHJlc3Npb24oZ3JvdXAubGFiZWwpLFxuICAgICAgICB0aXRsZTogZ3JvdXAudGl0bGUgPyBncm91cC50aXRsZSA6IHZvaWQgMCxcbiAgICAgICAgY2hpbGRyZW46IDAsXG4gICAgICAgIGRpc2FibGVkOiBncm91cC5kaXNhYmxlZCxcbiAgICAgICAgY2xhc3NlczogZ3JvdXAuY2xhc3NOYW1lXG4gICAgICB9KTtcbiAgICAgIF9yZWYgPSBncm91cC5jaGlsZE5vZGVzO1xuICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBvcHRpb24gPSBfcmVmW19pXTtcbiAgICAgICAgX3Jlc3VsdHMucHVzaCh0aGlzLmFkZF9vcHRpb24ob3B0aW9uLCBncm91cF9wb3NpdGlvbiwgZ3JvdXAuZGlzYWJsZWQpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICB9O1xuXG4gICAgU2VsZWN0UGFyc2VyLnByb3RvdHlwZS5hZGRfb3B0aW9uID0gZnVuY3Rpb24ob3B0aW9uLCBncm91cF9wb3NpdGlvbiwgZ3JvdXBfZGlzYWJsZWQpIHtcbiAgICAgIGlmIChvcHRpb24ubm9kZU5hbWUudG9VcHBlckNhc2UoKSA9PT0gXCJPUFRJT05cIikge1xuICAgICAgICBpZiAob3B0aW9uLnRleHQgIT09IFwiXCIpIHtcbiAgICAgICAgICBpZiAoZ3JvdXBfcG9zaXRpb24gIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5wYXJzZWRbZ3JvdXBfcG9zaXRpb25dLmNoaWxkcmVuICs9IDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMucGFyc2VkLnB1c2goe1xuICAgICAgICAgICAgYXJyYXlfaW5kZXg6IHRoaXMucGFyc2VkLmxlbmd0aCxcbiAgICAgICAgICAgIG9wdGlvbnNfaW5kZXg6IHRoaXMub3B0aW9uc19pbmRleCxcbiAgICAgICAgICAgIHZhbHVlOiBvcHRpb24udmFsdWUsXG4gICAgICAgICAgICB0ZXh0OiBvcHRpb24udGV4dCxcbiAgICAgICAgICAgIGh0bWw6IG9wdGlvbi5pbm5lckhUTUwsXG4gICAgICAgICAgICB0aXRsZTogb3B0aW9uLnRpdGxlID8gb3B0aW9uLnRpdGxlIDogdm9pZCAwLFxuICAgICAgICAgICAgc2VsZWN0ZWQ6IG9wdGlvbi5zZWxlY3RlZCxcbiAgICAgICAgICAgIGRpc2FibGVkOiBncm91cF9kaXNhYmxlZCA9PT0gdHJ1ZSA/IGdyb3VwX2Rpc2FibGVkIDogb3B0aW9uLmRpc2FibGVkLFxuICAgICAgICAgICAgZ3JvdXBfYXJyYXlfaW5kZXg6IGdyb3VwX3Bvc2l0aW9uLFxuICAgICAgICAgICAgZ3JvdXBfbGFiZWw6IGdyb3VwX3Bvc2l0aW9uICE9IG51bGwgPyB0aGlzLnBhcnNlZFtncm91cF9wb3NpdGlvbl0ubGFiZWwgOiBudWxsLFxuICAgICAgICAgICAgY2xhc3Nlczogb3B0aW9uLmNsYXNzTmFtZSxcbiAgICAgICAgICAgIHN0eWxlOiBvcHRpb24uc3R5bGUuY3NzVGV4dFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucGFyc2VkLnB1c2goe1xuICAgICAgICAgICAgYXJyYXlfaW5kZXg6IHRoaXMucGFyc2VkLmxlbmd0aCxcbiAgICAgICAgICAgIG9wdGlvbnNfaW5kZXg6IHRoaXMub3B0aW9uc19pbmRleCxcbiAgICAgICAgICAgIGVtcHR5OiB0cnVlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9uc19pbmRleCArPSAxO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBTZWxlY3RQYXJzZXIucHJvdG90eXBlLmVzY2FwZUV4cHJlc3Npb24gPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICB2YXIgbWFwLCB1bnNhZmVfY2hhcnM7XG4gICAgICBpZiAoKHRleHQgPT0gbnVsbCkgfHwgdGV4dCA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICB9XG4gICAgICBpZiAoIS9bXFwmXFw8XFw+XFxcIlxcJ1xcYF0vLnRlc3QodGV4dCkpIHtcbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICB9XG4gICAgICBtYXAgPSB7XG4gICAgICAgIFwiPFwiOiBcIiZsdDtcIixcbiAgICAgICAgXCI+XCI6IFwiJmd0O1wiLFxuICAgICAgICAnXCInOiBcIiZxdW90O1wiLFxuICAgICAgICBcIidcIjogXCImI3gyNztcIixcbiAgICAgICAgXCJgXCI6IFwiJiN4NjA7XCJcbiAgICAgIH07XG4gICAgICB1bnNhZmVfY2hhcnMgPSAvJig/IVxcdys7KXxbXFw8XFw+XFxcIlxcJ1xcYF0vZztcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UodW5zYWZlX2NoYXJzLCBmdW5jdGlvbihjaHIpIHtcbiAgICAgICAgcmV0dXJuIG1hcFtjaHJdIHx8IFwiJmFtcDtcIjtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICByZXR1cm4gU2VsZWN0UGFyc2VyO1xuXG4gIH0pKCk7XG5cbiAgU2VsZWN0UGFyc2VyLnNlbGVjdF90b19hcnJheSA9IGZ1bmN0aW9uKHNlbGVjdCkge1xuICAgIHZhciBjaGlsZCwgcGFyc2VyLCBfaSwgX2xlbiwgX3JlZjtcbiAgICBwYXJzZXIgPSBuZXcgU2VsZWN0UGFyc2VyKCk7XG4gICAgX3JlZiA9IHNlbGVjdC5jaGlsZE5vZGVzO1xuICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgY2hpbGQgPSBfcmVmW19pXTtcbiAgICAgIHBhcnNlci5hZGRfbm9kZShjaGlsZCk7XG4gICAgfVxuICAgIHJldHVybiBwYXJzZXIucGFyc2VkO1xuICB9O1xuXG4gIEFic3RyYWN0Q2hvc2VuID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIEFic3RyYWN0Q2hvc2VuKGZvcm1fZmllbGQsIG9wdGlvbnMpIHtcbiAgICAgIHRoaXMuZm9ybV9maWVsZCA9IGZvcm1fZmllbGQ7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zICE9IG51bGwgPyBvcHRpb25zIDoge307XG4gICAgICBpZiAoIUFic3RyYWN0Q2hvc2VuLmJyb3dzZXJfaXNfc3VwcG9ydGVkKCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5pc19tdWx0aXBsZSA9IHRoaXMuZm9ybV9maWVsZC5tdWx0aXBsZTtcbiAgICAgIHRoaXMuc2V0X2RlZmF1bHRfdGV4dCgpO1xuICAgICAgdGhpcy5zZXRfZGVmYXVsdF92YWx1ZXMoKTtcbiAgICAgIHRoaXMuc2V0dXAoKTtcbiAgICAgIHRoaXMuc2V0X3VwX2h0bWwoKTtcbiAgICAgIHRoaXMucmVnaXN0ZXJfb2JzZXJ2ZXJzKCk7XG4gICAgICB0aGlzLm9uX3JlYWR5KCk7XG4gICAgfVxuXG4gICAgQWJzdHJhY3RDaG9zZW4ucHJvdG90eXBlLnNldF9kZWZhdWx0X3ZhbHVlcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgIHRoaXMuY2xpY2tfdGVzdF9hY3Rpb24gPSBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLnRlc3RfYWN0aXZlX2NsaWNrKGV2dCk7XG4gICAgICB9O1xuICAgICAgdGhpcy5hY3RpdmF0ZV9hY3Rpb24gPSBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLmFjdGl2YXRlX2ZpZWxkKGV2dCk7XG4gICAgICB9O1xuICAgICAgdGhpcy5hY3RpdmVfZmllbGQgPSBmYWxzZTtcbiAgICAgIHRoaXMubW91c2Vfb25fY29udGFpbmVyID0gZmFsc2U7XG4gICAgICB0aGlzLnJlc3VsdHNfc2hvd2luZyA9IGZhbHNlO1xuICAgICAgdGhpcy5yZXN1bHRfaGlnaGxpZ2h0ZWQgPSBudWxsO1xuICAgICAgdGhpcy5hbGxvd19zaW5nbGVfZGVzZWxlY3QgPSAodGhpcy5vcHRpb25zLmFsbG93X3NpbmdsZV9kZXNlbGVjdCAhPSBudWxsKSAmJiAodGhpcy5mb3JtX2ZpZWxkLm9wdGlvbnNbMF0gIT0gbnVsbCkgJiYgdGhpcy5mb3JtX2ZpZWxkLm9wdGlvbnNbMF0udGV4dCA9PT0gXCJcIiA/IHRoaXMub3B0aW9ucy5hbGxvd19zaW5nbGVfZGVzZWxlY3QgOiBmYWxzZTtcbiAgICAgIHRoaXMuZGlzYWJsZV9zZWFyY2hfdGhyZXNob2xkID0gdGhpcy5vcHRpb25zLmRpc2FibGVfc2VhcmNoX3RocmVzaG9sZCB8fCAwO1xuICAgICAgdGhpcy5kaXNhYmxlX3NlYXJjaCA9IHRoaXMub3B0aW9ucy5kaXNhYmxlX3NlYXJjaCB8fCBmYWxzZTtcbiAgICAgIHRoaXMuZW5hYmxlX3NwbGl0X3dvcmRfc2VhcmNoID0gdGhpcy5vcHRpb25zLmVuYWJsZV9zcGxpdF93b3JkX3NlYXJjaCAhPSBudWxsID8gdGhpcy5vcHRpb25zLmVuYWJsZV9zcGxpdF93b3JkX3NlYXJjaCA6IHRydWU7XG4gICAgICB0aGlzLmdyb3VwX3NlYXJjaCA9IHRoaXMub3B0aW9ucy5ncm91cF9zZWFyY2ggIT0gbnVsbCA/IHRoaXMub3B0aW9ucy5ncm91cF9zZWFyY2ggOiB0cnVlO1xuICAgICAgdGhpcy5zZWFyY2hfY29udGFpbnMgPSB0aGlzLm9wdGlvbnMuc2VhcmNoX2NvbnRhaW5zIHx8IGZhbHNlO1xuICAgICAgdGhpcy5zaW5nbGVfYmFja3N0cm9rZV9kZWxldGUgPSB0aGlzLm9wdGlvbnMuc2luZ2xlX2JhY2tzdHJva2VfZGVsZXRlICE9IG51bGwgPyB0aGlzLm9wdGlvbnMuc2luZ2xlX2JhY2tzdHJva2VfZGVsZXRlIDogdHJ1ZTtcbiAgICAgIHRoaXMubWF4X3NlbGVjdGVkX29wdGlvbnMgPSB0aGlzLm9wdGlvbnMubWF4X3NlbGVjdGVkX29wdGlvbnMgfHwgSW5maW5pdHk7XG4gICAgICB0aGlzLmluaGVyaXRfc2VsZWN0X2NsYXNzZXMgPSB0aGlzLm9wdGlvbnMuaW5oZXJpdF9zZWxlY3RfY2xhc3NlcyB8fCBmYWxzZTtcbiAgICAgIHRoaXMuZGlzcGxheV9zZWxlY3RlZF9vcHRpb25zID0gdGhpcy5vcHRpb25zLmRpc3BsYXlfc2VsZWN0ZWRfb3B0aW9ucyAhPSBudWxsID8gdGhpcy5vcHRpb25zLmRpc3BsYXlfc2VsZWN0ZWRfb3B0aW9ucyA6IHRydWU7XG4gICAgICB0aGlzLmRpc3BsYXlfZGlzYWJsZWRfb3B0aW9ucyA9IHRoaXMub3B0aW9ucy5kaXNwbGF5X2Rpc2FibGVkX29wdGlvbnMgIT0gbnVsbCA/IHRoaXMub3B0aW9ucy5kaXNwbGF5X2Rpc2FibGVkX29wdGlvbnMgOiB0cnVlO1xuICAgICAgdGhpcy5pbmNsdWRlX2dyb3VwX2xhYmVsX2luX3NlbGVjdGVkID0gdGhpcy5vcHRpb25zLmluY2x1ZGVfZ3JvdXBfbGFiZWxfaW5fc2VsZWN0ZWQgfHwgZmFsc2U7XG4gICAgICByZXR1cm4gdGhpcy5tYXhfc2hvd25fcmVzdWx0cyA9IHRoaXMub3B0aW9ucy5tYXhfc2hvd25fcmVzdWx0cyB8fCBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XG4gICAgfTtcblxuICAgIEFic3RyYWN0Q2hvc2VuLnByb3RvdHlwZS5zZXRfZGVmYXVsdF90ZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5mb3JtX2ZpZWxkLmdldEF0dHJpYnV0ZShcImRhdGEtcGxhY2Vob2xkZXJcIikpIHtcbiAgICAgICAgdGhpcy5kZWZhdWx0X3RleHQgPSB0aGlzLmZvcm1fZmllbGQuZ2V0QXR0cmlidXRlKFwiZGF0YS1wbGFjZWhvbGRlclwiKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc19tdWx0aXBsZSkge1xuICAgICAgICB0aGlzLmRlZmF1bHRfdGV4dCA9IHRoaXMub3B0aW9ucy5wbGFjZWhvbGRlcl90ZXh0X211bHRpcGxlIHx8IHRoaXMub3B0aW9ucy5wbGFjZWhvbGRlcl90ZXh0IHx8IEFic3RyYWN0Q2hvc2VuLmRlZmF1bHRfbXVsdGlwbGVfdGV4dDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZGVmYXVsdF90ZXh0ID0gdGhpcy5vcHRpb25zLnBsYWNlaG9sZGVyX3RleHRfc2luZ2xlIHx8IHRoaXMub3B0aW9ucy5wbGFjZWhvbGRlcl90ZXh0IHx8IEFic3RyYWN0Q2hvc2VuLmRlZmF1bHRfc2luZ2xlX3RleHQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5yZXN1bHRzX25vbmVfZm91bmQgPSB0aGlzLmZvcm1fZmllbGQuZ2V0QXR0cmlidXRlKFwiZGF0YS1ub19yZXN1bHRzX3RleHRcIikgfHwgdGhpcy5vcHRpb25zLm5vX3Jlc3VsdHNfdGV4dCB8fCBBYnN0cmFjdENob3Nlbi5kZWZhdWx0X25vX3Jlc3VsdF90ZXh0O1xuICAgIH07XG5cbiAgICBBYnN0cmFjdENob3Nlbi5wcm90b3R5cGUuY2hvaWNlX2xhYmVsID0gZnVuY3Rpb24oaXRlbSkge1xuICAgICAgaWYgKHRoaXMuaW5jbHVkZV9ncm91cF9sYWJlbF9pbl9zZWxlY3RlZCAmJiAoaXRlbS5ncm91cF9sYWJlbCAhPSBudWxsKSkge1xuICAgICAgICByZXR1cm4gXCI8YiBjbGFzcz0nZ3JvdXAtbmFtZSc+XCIgKyBpdGVtLmdyb3VwX2xhYmVsICsgXCI8L2I+XCIgKyBpdGVtLmh0bWw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaXRlbS5odG1sO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBBYnN0cmFjdENob3Nlbi5wcm90b3R5cGUubW91c2VfZW50ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLm1vdXNlX29uX2NvbnRhaW5lciA9IHRydWU7XG4gICAgfTtcblxuICAgIEFic3RyYWN0Q2hvc2VuLnByb3RvdHlwZS5tb3VzZV9sZWF2ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMubW91c2Vfb25fY29udGFpbmVyID0gZmFsc2U7XG4gICAgfTtcblxuICAgIEFic3RyYWN0Q2hvc2VuLnByb3RvdHlwZS5pbnB1dF9mb2N1cyA9IGZ1bmN0aW9uKGV2dCkge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgIGlmICh0aGlzLmlzX211bHRpcGxlKSB7XG4gICAgICAgIGlmICghdGhpcy5hY3RpdmVfZmllbGQpIHtcbiAgICAgICAgICByZXR1cm4gc2V0VGltZW91dCgoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMuY29udGFpbmVyX21vdXNlZG93bigpO1xuICAgICAgICAgIH0pLCA1MCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghdGhpcy5hY3RpdmVfZmllbGQpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5hY3RpdmF0ZV9maWVsZCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIEFic3RyYWN0Q2hvc2VuLnByb3RvdHlwZS5pbnB1dF9ibHVyID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgaWYgKCF0aGlzLm1vdXNlX29uX2NvbnRhaW5lcikge1xuICAgICAgICB0aGlzLmFjdGl2ZV9maWVsZCA9IGZhbHNlO1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dCgoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLmJsdXJfdGVzdCgpO1xuICAgICAgICB9KSwgMTAwKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgQWJzdHJhY3RDaG9zZW4ucHJvdG90eXBlLnJlc3VsdHNfb3B0aW9uX2J1aWxkID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgdmFyIGNvbnRlbnQsIGRhdGEsIGRhdGFfY29udGVudCwgc2hvd25fcmVzdWx0cywgX2ksIF9sZW4sIF9yZWY7XG4gICAgICBjb250ZW50ID0gJyc7XG4gICAgICBzaG93bl9yZXN1bHRzID0gMDtcbiAgICAgIF9yZWYgPSB0aGlzLnJlc3VsdHNfZGF0YTtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBkYXRhID0gX3JlZltfaV07XG4gICAgICAgIGRhdGFfY29udGVudCA9ICcnO1xuICAgICAgICBpZiAoZGF0YS5ncm91cCkge1xuICAgICAgICAgIGRhdGFfY29udGVudCA9IHRoaXMucmVzdWx0X2FkZF9ncm91cChkYXRhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkYXRhX2NvbnRlbnQgPSB0aGlzLnJlc3VsdF9hZGRfb3B0aW9uKGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhX2NvbnRlbnQgIT09ICcnKSB7XG4gICAgICAgICAgc2hvd25fcmVzdWx0cysrO1xuICAgICAgICAgIGNvbnRlbnQgKz0gZGF0YV9jb250ZW50O1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLmZpcnN0IDogdm9pZCAwKSB7XG4gICAgICAgICAgaWYgKGRhdGEuc2VsZWN0ZWQgJiYgdGhpcy5pc19tdWx0aXBsZSkge1xuICAgICAgICAgICAgdGhpcy5jaG9pY2VfYnVpbGQoZGF0YSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChkYXRhLnNlbGVjdGVkICYmICF0aGlzLmlzX211bHRpcGxlKSB7XG4gICAgICAgICAgICB0aGlzLnNpbmdsZV9zZXRfc2VsZWN0ZWRfdGV4dCh0aGlzLmNob2ljZV9sYWJlbChkYXRhKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChzaG93bl9yZXN1bHRzID49IHRoaXMubWF4X3Nob3duX3Jlc3VsdHMpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfTtcblxuICAgIEFic3RyYWN0Q2hvc2VuLnByb3RvdHlwZS5yZXN1bHRfYWRkX29wdGlvbiA9IGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgdmFyIGNsYXNzZXMsIG9wdGlvbl9lbDtcbiAgICAgIGlmICghb3B0aW9uLnNlYXJjaF9tYXRjaCkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuaW5jbHVkZV9vcHRpb25faW5fcmVzdWx0cyhvcHRpb24pKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH1cbiAgICAgIGNsYXNzZXMgPSBbXTtcbiAgICAgIGlmICghb3B0aW9uLmRpc2FibGVkICYmICEob3B0aW9uLnNlbGVjdGVkICYmIHRoaXMuaXNfbXVsdGlwbGUpKSB7XG4gICAgICAgIGNsYXNzZXMucHVzaChcImFjdGl2ZS1yZXN1bHRcIik7XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9uLmRpc2FibGVkICYmICEob3B0aW9uLnNlbGVjdGVkICYmIHRoaXMuaXNfbXVsdGlwbGUpKSB7XG4gICAgICAgIGNsYXNzZXMucHVzaChcImRpc2FibGVkLXJlc3VsdFwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChvcHRpb24uc2VsZWN0ZWQpIHtcbiAgICAgICAgY2xhc3Nlcy5wdXNoKFwicmVzdWx0LXNlbGVjdGVkXCIpO1xuICAgICAgfVxuICAgICAgaWYgKG9wdGlvbi5ncm91cF9hcnJheV9pbmRleCAhPSBudWxsKSB7XG4gICAgICAgIGNsYXNzZXMucHVzaChcImdyb3VwLW9wdGlvblwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChvcHRpb24uY2xhc3NlcyAhPT0gXCJcIikge1xuICAgICAgICBjbGFzc2VzLnB1c2gob3B0aW9uLmNsYXNzZXMpO1xuICAgICAgfVxuICAgICAgb3B0aW9uX2VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xuICAgICAgb3B0aW9uX2VsLmNsYXNzTmFtZSA9IGNsYXNzZXMuam9pbihcIiBcIik7XG4gICAgICBvcHRpb25fZWwuc3R5bGUuY3NzVGV4dCA9IG9wdGlvbi5zdHlsZTtcbiAgICAgIG9wdGlvbl9lbC5zZXRBdHRyaWJ1dGUoXCJkYXRhLW9wdGlvbi1hcnJheS1pbmRleFwiLCBvcHRpb24uYXJyYXlfaW5kZXgpO1xuICAgICAgb3B0aW9uX2VsLmlubmVySFRNTCA9IG9wdGlvbi5zZWFyY2hfdGV4dDtcbiAgICAgIGlmIChvcHRpb24udGl0bGUpIHtcbiAgICAgICAgb3B0aW9uX2VsLnRpdGxlID0gb3B0aW9uLnRpdGxlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMub3V0ZXJIVE1MKG9wdGlvbl9lbCk7XG4gICAgfTtcblxuICAgIEFic3RyYWN0Q2hvc2VuLnByb3RvdHlwZS5yZXN1bHRfYWRkX2dyb3VwID0gZnVuY3Rpb24oZ3JvdXApIHtcbiAgICAgIHZhciBjbGFzc2VzLCBncm91cF9lbDtcbiAgICAgIGlmICghKGdyb3VwLnNlYXJjaF9tYXRjaCB8fCBncm91cC5ncm91cF9tYXRjaCkpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuICAgICAgaWYgKCEoZ3JvdXAuYWN0aXZlX29wdGlvbnMgPiAwKSkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9XG4gICAgICBjbGFzc2VzID0gW107XG4gICAgICBjbGFzc2VzLnB1c2goXCJncm91cC1yZXN1bHRcIik7XG4gICAgICBpZiAoZ3JvdXAuY2xhc3Nlcykge1xuICAgICAgICBjbGFzc2VzLnB1c2goZ3JvdXAuY2xhc3Nlcyk7XG4gICAgICB9XG4gICAgICBncm91cF9lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcbiAgICAgIGdyb3VwX2VsLmNsYXNzTmFtZSA9IGNsYXNzZXMuam9pbihcIiBcIik7XG4gICAgICBncm91cF9lbC5pbm5lckhUTUwgPSBncm91cC5zZWFyY2hfdGV4dDtcbiAgICAgIGlmIChncm91cC50aXRsZSkge1xuICAgICAgICBncm91cF9lbC50aXRsZSA9IGdyb3VwLnRpdGxlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMub3V0ZXJIVE1MKGdyb3VwX2VsKTtcbiAgICB9O1xuXG4gICAgQWJzdHJhY3RDaG9zZW4ucHJvdG90eXBlLnJlc3VsdHNfdXBkYXRlX2ZpZWxkID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnNldF9kZWZhdWx0X3RleHQoKTtcbiAgICAgIGlmICghdGhpcy5pc19tdWx0aXBsZSkge1xuICAgICAgICB0aGlzLnJlc3VsdHNfcmVzZXRfY2xlYW51cCgpO1xuICAgICAgfVxuICAgICAgdGhpcy5yZXN1bHRfY2xlYXJfaGlnaGxpZ2h0KCk7XG4gICAgICB0aGlzLnJlc3VsdHNfYnVpbGQoKTtcbiAgICAgIGlmICh0aGlzLnJlc3VsdHNfc2hvd2luZykge1xuICAgICAgICByZXR1cm4gdGhpcy53aW5ub3dfcmVzdWx0cygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBBYnN0cmFjdENob3Nlbi5wcm90b3R5cGUucmVzZXRfc2luZ2xlX3NlbGVjdF9vcHRpb25zID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmVzdWx0LCBfaSwgX2xlbiwgX3JlZiwgX3Jlc3VsdHM7XG4gICAgICBfcmVmID0gdGhpcy5yZXN1bHRzX2RhdGE7XG4gICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIHJlc3VsdCA9IF9yZWZbX2ldO1xuICAgICAgICBpZiAocmVzdWx0LnNlbGVjdGVkKSB7XG4gICAgICAgICAgX3Jlc3VsdHMucHVzaChyZXN1bHQuc2VsZWN0ZWQgPSBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX3Jlc3VsdHMucHVzaCh2b2lkIDApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgfTtcblxuICAgIEFic3RyYWN0Q2hvc2VuLnByb3RvdHlwZS5yZXN1bHRzX3RvZ2dsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMucmVzdWx0c19zaG93aW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlc3VsdHNfaGlkZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzdWx0c19zaG93KCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIEFic3RyYWN0Q2hvc2VuLnByb3RvdHlwZS5yZXN1bHRzX3NlYXJjaCA9IGZ1bmN0aW9uKGV2dCkge1xuICAgICAgaWYgKHRoaXMucmVzdWx0c19zaG93aW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLndpbm5vd19yZXN1bHRzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXN1bHRzX3Nob3coKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgQWJzdHJhY3RDaG9zZW4ucHJvdG90eXBlLndpbm5vd19yZXN1bHRzID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZXNjYXBlZFNlYXJjaFRleHQsIG9wdGlvbiwgcmVnZXgsIHJlc3VsdHMsIHJlc3VsdHNfZ3JvdXAsIHNlYXJjaFRleHQsIHN0YXJ0cG9zLCB0ZXh0LCB6cmVnZXgsIF9pLCBfbGVuLCBfcmVmO1xuICAgICAgdGhpcy5ub19yZXN1bHRzX2NsZWFyKCk7XG4gICAgICByZXN1bHRzID0gMDtcbiAgICAgIHNlYXJjaFRleHQgPSB0aGlzLmdldF9zZWFyY2hfdGV4dCgpO1xuICAgICAgZXNjYXBlZFNlYXJjaFRleHQgPSBzZWFyY2hUZXh0LnJlcGxhY2UoL1stW1xcXXt9KCkqKz8uLFxcXFxeJHwjXFxzXS9nLCBcIlxcXFwkJlwiKTtcbiAgICAgIHpyZWdleCA9IG5ldyBSZWdFeHAoZXNjYXBlZFNlYXJjaFRleHQsICdpJyk7XG4gICAgICByZWdleCA9IHRoaXMuZ2V0X3NlYXJjaF9yZWdleChlc2NhcGVkU2VhcmNoVGV4dCk7XG4gICAgICBfcmVmID0gdGhpcy5yZXN1bHRzX2RhdGE7XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgb3B0aW9uID0gX3JlZltfaV07XG4gICAgICAgIG9wdGlvbi5zZWFyY2hfbWF0Y2ggPSBmYWxzZTtcbiAgICAgICAgcmVzdWx0c19ncm91cCA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLmluY2x1ZGVfb3B0aW9uX2luX3Jlc3VsdHMob3B0aW9uKSkge1xuICAgICAgICAgIGlmIChvcHRpb24uZ3JvdXApIHtcbiAgICAgICAgICAgIG9wdGlvbi5ncm91cF9tYXRjaCA9IGZhbHNlO1xuICAgICAgICAgICAgb3B0aW9uLmFjdGl2ZV9vcHRpb25zID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKChvcHRpb24uZ3JvdXBfYXJyYXlfaW5kZXggIT0gbnVsbCkgJiYgdGhpcy5yZXN1bHRzX2RhdGFbb3B0aW9uLmdyb3VwX2FycmF5X2luZGV4XSkge1xuICAgICAgICAgICAgcmVzdWx0c19ncm91cCA9IHRoaXMucmVzdWx0c19kYXRhW29wdGlvbi5ncm91cF9hcnJheV9pbmRleF07XG4gICAgICAgICAgICBpZiAocmVzdWx0c19ncm91cC5hY3RpdmVfb3B0aW9ucyA9PT0gMCAmJiByZXN1bHRzX2dyb3VwLnNlYXJjaF9tYXRjaCkge1xuICAgICAgICAgICAgICByZXN1bHRzICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXN1bHRzX2dyb3VwLmFjdGl2ZV9vcHRpb25zICs9IDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIG9wdGlvbi5zZWFyY2hfdGV4dCA9IG9wdGlvbi5ncm91cCA/IG9wdGlvbi5sYWJlbCA6IG9wdGlvbi5odG1sO1xuICAgICAgICAgIGlmICghKG9wdGlvbi5ncm91cCAmJiAhdGhpcy5ncm91cF9zZWFyY2gpKSB7XG4gICAgICAgICAgICBvcHRpb24uc2VhcmNoX21hdGNoID0gdGhpcy5zZWFyY2hfc3RyaW5nX21hdGNoKG9wdGlvbi5zZWFyY2hfdGV4dCwgcmVnZXgpO1xuICAgICAgICAgICAgaWYgKG9wdGlvbi5zZWFyY2hfbWF0Y2ggJiYgIW9wdGlvbi5ncm91cCkge1xuICAgICAgICAgICAgICByZXN1bHRzICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0aW9uLnNlYXJjaF9tYXRjaCkge1xuICAgICAgICAgICAgICBpZiAoc2VhcmNoVGV4dC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBzdGFydHBvcyA9IG9wdGlvbi5zZWFyY2hfdGV4dC5zZWFyY2goenJlZ2V4KTtcbiAgICAgICAgICAgICAgICB0ZXh0ID0gb3B0aW9uLnNlYXJjaF90ZXh0LnN1YnN0cigwLCBzdGFydHBvcyArIHNlYXJjaFRleHQubGVuZ3RoKSArICc8L2VtPicgKyBvcHRpb24uc2VhcmNoX3RleHQuc3Vic3RyKHN0YXJ0cG9zICsgc2VhcmNoVGV4dC5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIG9wdGlvbi5zZWFyY2hfdGV4dCA9IHRleHQuc3Vic3RyKDAsIHN0YXJ0cG9zKSArICc8ZW0+JyArIHRleHQuc3Vic3RyKHN0YXJ0cG9zKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAocmVzdWx0c19ncm91cCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0c19ncm91cC5ncm91cF9tYXRjaCA9IHRydWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoKG9wdGlvbi5ncm91cF9hcnJheV9pbmRleCAhPSBudWxsKSAmJiB0aGlzLnJlc3VsdHNfZGF0YVtvcHRpb24uZ3JvdXBfYXJyYXlfaW5kZXhdLnNlYXJjaF9tYXRjaCkge1xuICAgICAgICAgICAgICBvcHRpb24uc2VhcmNoX21hdGNoID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMucmVzdWx0X2NsZWFyX2hpZ2hsaWdodCgpO1xuICAgICAgaWYgKHJlc3VsdHMgPCAxICYmIHNlYXJjaFRleHQubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMudXBkYXRlX3Jlc3VsdHNfY29udGVudChcIlwiKTtcbiAgICAgICAgcmV0dXJuIHRoaXMubm9fcmVzdWx0cyhzZWFyY2hUZXh0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudXBkYXRlX3Jlc3VsdHNfY29udGVudCh0aGlzLnJlc3VsdHNfb3B0aW9uX2J1aWxkKCkpO1xuICAgICAgICByZXR1cm4gdGhpcy53aW5ub3dfcmVzdWx0c19zZXRfaGlnaGxpZ2h0KCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIEFic3RyYWN0Q2hvc2VuLnByb3RvdHlwZS5nZXRfc2VhcmNoX3JlZ2V4ID0gZnVuY3Rpb24oZXNjYXBlZF9zZWFyY2hfc3RyaW5nKSB7XG4gICAgICB2YXIgcmVnZXhfYW5jaG9yO1xuICAgICAgcmVnZXhfYW5jaG9yID0gdGhpcy5zZWFyY2hfY29udGFpbnMgPyBcIlwiIDogXCJeXCI7XG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cChyZWdleF9hbmNob3IgKyBlc2NhcGVkX3NlYXJjaF9zdHJpbmcsICdpJyk7XG4gICAgfTtcblxuICAgIEFic3RyYWN0Q2hvc2VuLnByb3RvdHlwZS5zZWFyY2hfc3RyaW5nX21hdGNoID0gZnVuY3Rpb24oc2VhcmNoX3N0cmluZywgcmVnZXgpIHtcbiAgICAgIHZhciBwYXJ0LCBwYXJ0cywgX2ksIF9sZW47XG4gICAgICBpZiAocmVnZXgudGVzdChzZWFyY2hfc3RyaW5nKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5lbmFibGVfc3BsaXRfd29yZF9zZWFyY2ggJiYgKHNlYXJjaF9zdHJpbmcuaW5kZXhPZihcIiBcIikgPj0gMCB8fCBzZWFyY2hfc3RyaW5nLmluZGV4T2YoXCJbXCIpID09PSAwKSkge1xuICAgICAgICBwYXJ0cyA9IHNlYXJjaF9zdHJpbmcucmVwbGFjZSgvXFxbfFxcXS9nLCBcIlwiKS5zcGxpdChcIiBcIik7XG4gICAgICAgIGlmIChwYXJ0cy5sZW5ndGgpIHtcbiAgICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IHBhcnRzLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgICBwYXJ0ID0gcGFydHNbX2ldO1xuICAgICAgICAgICAgaWYgKHJlZ2V4LnRlc3QocGFydCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIEFic3RyYWN0Q2hvc2VuLnByb3RvdHlwZS5jaG9pY2VzX2NvdW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb3B0aW9uLCBfaSwgX2xlbiwgX3JlZjtcbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkX29wdGlvbl9jb3VudCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkX29wdGlvbl9jb3VudDtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2VsZWN0ZWRfb3B0aW9uX2NvdW50ID0gMDtcbiAgICAgIF9yZWYgPSB0aGlzLmZvcm1fZmllbGQub3B0aW9ucztcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBvcHRpb24gPSBfcmVmW19pXTtcbiAgICAgICAgaWYgKG9wdGlvbi5zZWxlY3RlZCkge1xuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRfb3B0aW9uX2NvdW50ICs9IDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkX29wdGlvbl9jb3VudDtcbiAgICB9O1xuXG4gICAgQWJzdHJhY3RDaG9zZW4ucHJvdG90eXBlLmNob2ljZXNfY2xpY2sgPSBmdW5jdGlvbihldnQpIHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgaWYgKCEodGhpcy5yZXN1bHRzX3Nob3dpbmcgfHwgdGhpcy5pc19kaXNhYmxlZCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzdWx0c19zaG93KCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIEFic3RyYWN0Q2hvc2VuLnByb3RvdHlwZS5rZXl1cF9jaGVja2VyID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgICB2YXIgc3Ryb2tlLCBfcmVmO1xuICAgICAgc3Ryb2tlID0gKF9yZWYgPSBldnQud2hpY2gpICE9IG51bGwgPyBfcmVmIDogZXZ0LmtleUNvZGU7XG4gICAgICB0aGlzLnNlYXJjaF9maWVsZF9zY2FsZSgpO1xuICAgICAgc3dpdGNoIChzdHJva2UpIHtcbiAgICAgICAgY2FzZSA4OlxuICAgICAgICAgIGlmICh0aGlzLmlzX211bHRpcGxlICYmIHRoaXMuYmFja3N0cm9rZV9sZW5ndGggPCAxICYmIHRoaXMuY2hvaWNlc19jb3VudCgpID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMua2V5ZG93bl9iYWNrc3Ryb2tlKCk7XG4gICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5wZW5kaW5nX2JhY2tzdHJva2UpIHtcbiAgICAgICAgICAgIHRoaXMucmVzdWx0X2NsZWFyX2hpZ2hsaWdodCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzdWx0c19zZWFyY2goKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTM6XG4gICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgaWYgKHRoaXMucmVzdWx0c19zaG93aW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXN1bHRfc2VsZWN0KGV2dCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI3OlxuICAgICAgICAgIGlmICh0aGlzLnJlc3VsdHNfc2hvd2luZykge1xuICAgICAgICAgICAgdGhpcy5yZXN1bHRzX2hpZGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIGNhc2UgOTpcbiAgICAgICAgY2FzZSAzODpcbiAgICAgICAgY2FzZSA0MDpcbiAgICAgICAgY2FzZSAxNjpcbiAgICAgICAgY2FzZSA5MTpcbiAgICAgICAgY2FzZSAxNzpcbiAgICAgICAgY2FzZSAxODpcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gdGhpcy5yZXN1bHRzX3NlYXJjaCgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBBYnN0cmFjdENob3Nlbi5wcm90b3R5cGUuY2xpcGJvYXJkX2V2ZW50X2NoZWNrZXIgPSBmdW5jdGlvbihldnQpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICByZXR1cm4gc2V0VGltZW91dCgoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5yZXN1bHRzX3NlYXJjaCgpO1xuICAgICAgfSksIDUwKTtcbiAgICB9O1xuXG4gICAgQWJzdHJhY3RDaG9zZW4ucHJvdG90eXBlLmNvbnRhaW5lcl93aWR0aCA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy53aWR0aCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMud2lkdGg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gXCJcIiArIHRoaXMuZm9ybV9maWVsZC5vZmZzZXRXaWR0aCArIFwicHhcIjtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgQWJzdHJhY3RDaG9zZW4ucHJvdG90eXBlLmluY2x1ZGVfb3B0aW9uX2luX3Jlc3VsdHMgPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgIGlmICh0aGlzLmlzX211bHRpcGxlICYmICghdGhpcy5kaXNwbGF5X3NlbGVjdGVkX29wdGlvbnMgJiYgb3B0aW9uLnNlbGVjdGVkKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuZGlzcGxheV9kaXNhYmxlZF9vcHRpb25zICYmIG9wdGlvbi5kaXNhYmxlZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9uLmVtcHR5KSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG5cbiAgICBBYnN0cmFjdENob3Nlbi5wcm90b3R5cGUuc2VhcmNoX3Jlc3VsdHNfdG91Y2hzdGFydCA9IGZ1bmN0aW9uKGV2dCkge1xuICAgICAgdGhpcy50b3VjaF9zdGFydGVkID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0aGlzLnNlYXJjaF9yZXN1bHRzX21vdXNlb3ZlcihldnQpO1xuICAgIH07XG5cbiAgICBBYnN0cmFjdENob3Nlbi5wcm90b3R5cGUuc2VhcmNoX3Jlc3VsdHNfdG91Y2htb3ZlID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgICB0aGlzLnRvdWNoX3N0YXJ0ZWQgPSBmYWxzZTtcbiAgICAgIHJldHVybiB0aGlzLnNlYXJjaF9yZXN1bHRzX21vdXNlb3V0KGV2dCk7XG4gICAgfTtcblxuICAgIEFic3RyYWN0Q2hvc2VuLnByb3RvdHlwZS5zZWFyY2hfcmVzdWx0c190b3VjaGVuZCA9IGZ1bmN0aW9uKGV2dCkge1xuICAgICAgaWYgKHRoaXMudG91Y2hfc3RhcnRlZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZWFyY2hfcmVzdWx0c19tb3VzZXVwKGV2dCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIEFic3RyYWN0Q2hvc2VuLnByb3RvdHlwZS5vdXRlckhUTUwgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICB2YXIgdG1wO1xuICAgICAgaWYgKGVsZW1lbnQub3V0ZXJIVE1MKSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50Lm91dGVySFRNTDtcbiAgICAgIH1cbiAgICAgIHRtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICB0bXAuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gICAgICByZXR1cm4gdG1wLmlubmVySFRNTDtcbiAgICB9O1xuXG4gICAgQWJzdHJhY3RDaG9zZW4uYnJvd3Nlcl9pc19zdXBwb3J0ZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICgvaVAob2R8aG9uZSkvaS50ZXN0KHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoL0FuZHJvaWQvaS50ZXN0KHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KSkge1xuICAgICAgICBpZiAoL01vYmlsZS9pLnRlc3Qod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoL0lFTW9iaWxlL2kudGVzdCh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKC9XaW5kb3dzIFBob25lL2kudGVzdCh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKC9CbGFja0JlcnJ5L2kudGVzdCh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKC9CQjEwL2kudGVzdCh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKHdpbmRvdy5uYXZpZ2F0b3IuYXBwTmFtZSA9PT0gXCJNaWNyb3NvZnQgSW50ZXJuZXQgRXhwbG9yZXJcIikge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZG9jdW1lbnRNb2RlID49IDg7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuXG4gICAgQWJzdHJhY3RDaG9zZW4uZGVmYXVsdF9tdWx0aXBsZV90ZXh0ID0gXCJTZWxlY3QgU29tZSBPcHRpb25zXCI7XG5cbiAgICBBYnN0cmFjdENob3Nlbi5kZWZhdWx0X3NpbmdsZV90ZXh0ID0gXCJTZWxlY3QgYW4gT3B0aW9uXCI7XG5cbiAgICBBYnN0cmFjdENob3Nlbi5kZWZhdWx0X25vX3Jlc3VsdF90ZXh0ID0gXCJObyByZXN1bHRzIG1hdGNoXCI7XG5cbiAgICByZXR1cm4gQWJzdHJhY3RDaG9zZW47XG5cbiAgfSkoKTtcblxuICAkID0galF1ZXJ5O1xuXG4gICQuZm4uZXh0ZW5kKHtcbiAgICBjaG9zZW46IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIGlmICghQWJzdHJhY3RDaG9zZW4uYnJvd3Nlcl9pc19zdXBwb3J0ZWQoKSkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oaW5wdXRfZmllbGQpIHtcbiAgICAgICAgdmFyICR0aGlzLCBjaG9zZW47XG4gICAgICAgICR0aGlzID0gJCh0aGlzKTtcbiAgICAgICAgY2hvc2VuID0gJHRoaXMuZGF0YSgnY2hvc2VuJyk7XG4gICAgICAgIGlmIChvcHRpb25zID09PSAnZGVzdHJveScpIHtcbiAgICAgICAgICBpZiAoY2hvc2VuIGluc3RhbmNlb2YgQ2hvc2VuKSB7XG4gICAgICAgICAgICBjaG9zZW4uZGVzdHJveSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEoY2hvc2VuIGluc3RhbmNlb2YgQ2hvc2VuKSkge1xuICAgICAgICAgICR0aGlzLmRhdGEoJ2Nob3NlbicsIG5ldyBDaG9zZW4odGhpcywgb3B0aW9ucykpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIENob3NlbiA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoQ2hvc2VuLCBfc3VwZXIpO1xuXG4gICAgZnVuY3Rpb24gQ2hvc2VuKCkge1xuICAgICAgX3JlZiA9IENob3Nlbi5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHJldHVybiBfcmVmO1xuICAgIH1cblxuICAgIENob3Nlbi5wcm90b3R5cGUuc2V0dXAgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuZm9ybV9maWVsZF9qcSA9ICQodGhpcy5mb3JtX2ZpZWxkKTtcbiAgICAgIHRoaXMuY3VycmVudF9zZWxlY3RlZEluZGV4ID0gdGhpcy5mb3JtX2ZpZWxkLnNlbGVjdGVkSW5kZXg7XG4gICAgICByZXR1cm4gdGhpcy5pc19ydGwgPSB0aGlzLmZvcm1fZmllbGRfanEuaGFzQ2xhc3MoXCJjaG9zZW4tcnRsXCIpO1xuICAgIH07XG5cbiAgICBDaG9zZW4ucHJvdG90eXBlLnNldF91cF9odG1sID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY29udGFpbmVyX2NsYXNzZXMsIGNvbnRhaW5lcl9wcm9wcztcbiAgICAgIGNvbnRhaW5lcl9jbGFzc2VzID0gW1wiY2hvc2VuLWNvbnRhaW5lclwiXTtcbiAgICAgIGNvbnRhaW5lcl9jbGFzc2VzLnB1c2goXCJjaG9zZW4tY29udGFpbmVyLVwiICsgKHRoaXMuaXNfbXVsdGlwbGUgPyBcIm11bHRpXCIgOiBcInNpbmdsZVwiKSk7XG4gICAgICBpZiAodGhpcy5pbmhlcml0X3NlbGVjdF9jbGFzc2VzICYmIHRoaXMuZm9ybV9maWVsZC5jbGFzc05hbWUpIHtcbiAgICAgICAgY29udGFpbmVyX2NsYXNzZXMucHVzaCh0aGlzLmZvcm1fZmllbGQuY2xhc3NOYW1lKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmlzX3J0bCkge1xuICAgICAgICBjb250YWluZXJfY2xhc3Nlcy5wdXNoKFwiY2hvc2VuLXJ0bFwiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRhaW5lcl9wcm9wcyA9IHtcbiAgICAgICAgJ2NsYXNzJzogY29udGFpbmVyX2NsYXNzZXMuam9pbignICcpLFxuICAgICAgICAnc3R5bGUnOiBcIndpZHRoOiBcIiArICh0aGlzLmNvbnRhaW5lcl93aWR0aCgpKSArIFwiO1wiLFxuICAgICAgICAndGl0bGUnOiB0aGlzLmZvcm1fZmllbGQudGl0bGVcbiAgICAgIH07XG4gICAgICBpZiAodGhpcy5mb3JtX2ZpZWxkLmlkLmxlbmd0aCkge1xuICAgICAgICBjb250YWluZXJfcHJvcHMuaWQgPSB0aGlzLmZvcm1fZmllbGQuaWQucmVwbGFjZSgvW15cXHddL2csICdfJykgKyBcIl9jaG9zZW5cIjtcbiAgICAgIH1cbiAgICAgIHRoaXMuY29udGFpbmVyID0gJChcIjxkaXYgLz5cIiwgY29udGFpbmVyX3Byb3BzKTtcbiAgICAgIGlmICh0aGlzLmlzX211bHRpcGxlKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLmh0bWwoJzx1bCBjbGFzcz1cImNob3Nlbi1jaG9pY2VzXCI+PGxpIGNsYXNzPVwic2VhcmNoLWZpZWxkXCI+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgdmFsdWU9XCInICsgdGhpcy5kZWZhdWx0X3RleHQgKyAnXCIgY2xhc3M9XCJkZWZhdWx0XCIgYXV0b2NvbXBsZXRlPVwib2ZmXCIgc3R5bGU9XCJ3aWR0aDoyNXB4O1wiIC8+PC9saT48L3VsPjxkaXYgY2xhc3M9XCJjaG9zZW4tZHJvcFwiPjx1bCBjbGFzcz1cImNob3Nlbi1yZXN1bHRzXCI+PC91bD48L2Rpdj4nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLmh0bWwoJzxhIGNsYXNzPVwiY2hvc2VuLXNpbmdsZSBjaG9zZW4tZGVmYXVsdFwiPjxzcGFuPicgKyB0aGlzLmRlZmF1bHRfdGV4dCArICc8L3NwYW4+PGRpdj48Yj48L2I+PC9kaXY+PC9hPjxkaXYgY2xhc3M9XCJjaG9zZW4tZHJvcFwiPjxkaXYgY2xhc3M9XCJjaG9zZW4tc2VhcmNoXCI+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgYXV0b2NvbXBsZXRlPVwib2ZmXCIgLz48L2Rpdj48dWwgY2xhc3M9XCJjaG9zZW4tcmVzdWx0c1wiPjwvdWw+PC9kaXY+Jyk7XG4gICAgICB9XG4gICAgICB0aGlzLmZvcm1fZmllbGRfanEuaGlkZSgpLmFmdGVyKHRoaXMuY29udGFpbmVyKTtcbiAgICAgIHRoaXMuZHJvcGRvd24gPSB0aGlzLmNvbnRhaW5lci5maW5kKCdkaXYuY2hvc2VuLWRyb3AnKS5maXJzdCgpO1xuICAgICAgdGhpcy5zZWFyY2hfZmllbGQgPSB0aGlzLmNvbnRhaW5lci5maW5kKCdpbnB1dCcpLmZpcnN0KCk7XG4gICAgICB0aGlzLnNlYXJjaF9yZXN1bHRzID0gdGhpcy5jb250YWluZXIuZmluZCgndWwuY2hvc2VuLXJlc3VsdHMnKS5maXJzdCgpO1xuICAgICAgdGhpcy5zZWFyY2hfZmllbGRfc2NhbGUoKTtcbiAgICAgIHRoaXMuc2VhcmNoX25vX3Jlc3VsdHMgPSB0aGlzLmNvbnRhaW5lci5maW5kKCdsaS5uby1yZXN1bHRzJykuZmlyc3QoKTtcbiAgICAgIGlmICh0aGlzLmlzX211bHRpcGxlKSB7XG4gICAgICAgIHRoaXMuc2VhcmNoX2Nob2ljZXMgPSB0aGlzLmNvbnRhaW5lci5maW5kKCd1bC5jaG9zZW4tY2hvaWNlcycpLmZpcnN0KCk7XG4gICAgICAgIHRoaXMuc2VhcmNoX2NvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyLmZpbmQoJ2xpLnNlYXJjaC1maWVsZCcpLmZpcnN0KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNlYXJjaF9jb250YWluZXIgPSB0aGlzLmNvbnRhaW5lci5maW5kKCdkaXYuY2hvc2VuLXNlYXJjaCcpLmZpcnN0KCk7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRfaXRlbSA9IHRoaXMuY29udGFpbmVyLmZpbmQoJy5jaG9zZW4tc2luZ2xlJykuZmlyc3QoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucmVzdWx0c19idWlsZCgpO1xuICAgICAgdGhpcy5zZXRfdGFiX2luZGV4KCk7XG4gICAgICByZXR1cm4gdGhpcy5zZXRfbGFiZWxfYmVoYXZpb3IoKTtcbiAgICB9O1xuXG4gICAgQ2hvc2VuLnByb3RvdHlwZS5vbl9yZWFkeSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZm9ybV9maWVsZF9qcS50cmlnZ2VyKFwiY2hvc2VuOnJlYWR5XCIsIHtcbiAgICAgICAgY2hvc2VuOiB0aGlzXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgQ2hvc2VuLnByb3RvdHlwZS5yZWdpc3Rlcl9vYnNlcnZlcnMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICB0aGlzLmNvbnRhaW5lci5iaW5kKCd0b3VjaHN0YXJ0LmNob3NlbicsIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICBfdGhpcy5jb250YWluZXJfbW91c2Vkb3duKGV2dCk7XG4gICAgICAgIHJldHVybiBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5jb250YWluZXIuYmluZCgndG91Y2hlbmQuY2hvc2VuJywgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgIF90aGlzLmNvbnRhaW5lcl9tb3VzZXVwKGV2dCk7XG4gICAgICAgIHJldHVybiBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5jb250YWluZXIuYmluZCgnbW91c2Vkb3duLmNob3NlbicsIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICBfdGhpcy5jb250YWluZXJfbW91c2Vkb3duKGV2dCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuY29udGFpbmVyLmJpbmQoJ21vdXNldXAuY2hvc2VuJywgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgIF90aGlzLmNvbnRhaW5lcl9tb3VzZXVwKGV2dCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuY29udGFpbmVyLmJpbmQoJ21vdXNlZW50ZXIuY2hvc2VuJywgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgIF90aGlzLm1vdXNlX2VudGVyKGV2dCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuY29udGFpbmVyLmJpbmQoJ21vdXNlbGVhdmUuY2hvc2VuJywgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgIF90aGlzLm1vdXNlX2xlYXZlKGV2dCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuc2VhcmNoX3Jlc3VsdHMuYmluZCgnbW91c2V1cC5jaG9zZW4nLCBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgX3RoaXMuc2VhcmNoX3Jlc3VsdHNfbW91c2V1cChldnQpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLnNlYXJjaF9yZXN1bHRzLmJpbmQoJ21vdXNlb3Zlci5jaG9zZW4nLCBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgX3RoaXMuc2VhcmNoX3Jlc3VsdHNfbW91c2VvdmVyKGV2dCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuc2VhcmNoX3Jlc3VsdHMuYmluZCgnbW91c2VvdXQuY2hvc2VuJywgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgIF90aGlzLnNlYXJjaF9yZXN1bHRzX21vdXNlb3V0KGV2dCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuc2VhcmNoX3Jlc3VsdHMuYmluZCgnbW91c2V3aGVlbC5jaG9zZW4gRE9NTW91c2VTY3JvbGwuY2hvc2VuJywgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgIF90aGlzLnNlYXJjaF9yZXN1bHRzX21vdXNld2hlZWwoZXZ0KTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5zZWFyY2hfcmVzdWx0cy5iaW5kKCd0b3VjaHN0YXJ0LmNob3NlbicsIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICBfdGhpcy5zZWFyY2hfcmVzdWx0c190b3VjaHN0YXJ0KGV2dCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuc2VhcmNoX3Jlc3VsdHMuYmluZCgndG91Y2htb3ZlLmNob3NlbicsIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICBfdGhpcy5zZWFyY2hfcmVzdWx0c190b3VjaG1vdmUoZXZ0KTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5zZWFyY2hfcmVzdWx0cy5iaW5kKCd0b3VjaGVuZC5jaG9zZW4nLCBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgX3RoaXMuc2VhcmNoX3Jlc3VsdHNfdG91Y2hlbmQoZXZ0KTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5mb3JtX2ZpZWxkX2pxLmJpbmQoXCJjaG9zZW46dXBkYXRlZC5jaG9zZW5cIiwgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgIF90aGlzLnJlc3VsdHNfdXBkYXRlX2ZpZWxkKGV2dCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuZm9ybV9maWVsZF9qcS5iaW5kKFwiY2hvc2VuOmFjdGl2YXRlLmNob3NlblwiLCBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgX3RoaXMuYWN0aXZhdGVfZmllbGQoZXZ0KTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5mb3JtX2ZpZWxkX2pxLmJpbmQoXCJjaG9zZW46b3Blbi5jaG9zZW5cIiwgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgIF90aGlzLmNvbnRhaW5lcl9tb3VzZWRvd24oZXZ0KTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5mb3JtX2ZpZWxkX2pxLmJpbmQoXCJjaG9zZW46Y2xvc2UuY2hvc2VuXCIsIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICBfdGhpcy5pbnB1dF9ibHVyKGV2dCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuc2VhcmNoX2ZpZWxkLmJpbmQoJ2JsdXIuY2hvc2VuJywgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgIF90aGlzLmlucHV0X2JsdXIoZXZ0KTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5zZWFyY2hfZmllbGQuYmluZCgna2V5dXAuY2hvc2VuJywgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgIF90aGlzLmtleXVwX2NoZWNrZXIoZXZ0KTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5zZWFyY2hfZmllbGQuYmluZCgna2V5ZG93bi5jaG9zZW4nLCBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgX3RoaXMua2V5ZG93bl9jaGVja2VyKGV2dCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuc2VhcmNoX2ZpZWxkLmJpbmQoJ2ZvY3VzLmNob3NlbicsIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICBfdGhpcy5pbnB1dF9mb2N1cyhldnQpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLnNlYXJjaF9maWVsZC5iaW5kKCdjdXQuY2hvc2VuJywgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgIF90aGlzLmNsaXBib2FyZF9ldmVudF9jaGVja2VyKGV2dCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuc2VhcmNoX2ZpZWxkLmJpbmQoJ3Bhc3RlLmNob3NlbicsIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICBfdGhpcy5jbGlwYm9hcmRfZXZlbnRfY2hlY2tlcihldnQpO1xuICAgICAgfSk7XG4gICAgICBpZiAodGhpcy5pc19tdWx0aXBsZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZWFyY2hfY2hvaWNlcy5iaW5kKCdjbGljay5jaG9zZW4nLCBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgICBfdGhpcy5jaG9pY2VzX2NsaWNrKGV2dCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGFpbmVyLmJpbmQoJ2NsaWNrLmNob3NlbicsIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgQ2hvc2VuLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gICAgICAkKHRoaXMuY29udGFpbmVyWzBdLm93bmVyRG9jdW1lbnQpLnVuYmluZChcImNsaWNrLmNob3NlblwiLCB0aGlzLmNsaWNrX3Rlc3RfYWN0aW9uKTtcbiAgICAgIGlmICh0aGlzLnNlYXJjaF9maWVsZFswXS50YWJJbmRleCkge1xuICAgICAgICB0aGlzLmZvcm1fZmllbGRfanFbMF0udGFiSW5kZXggPSB0aGlzLnNlYXJjaF9maWVsZFswXS50YWJJbmRleDtcbiAgICAgIH1cbiAgICAgIHRoaXMuY29udGFpbmVyLnJlbW92ZSgpO1xuICAgICAgdGhpcy5mb3JtX2ZpZWxkX2pxLnJlbW92ZURhdGEoJ2Nob3NlbicpO1xuICAgICAgcmV0dXJuIHRoaXMuZm9ybV9maWVsZF9qcS5zaG93KCk7XG4gICAgfTtcblxuICAgIENob3Nlbi5wcm90b3R5cGUuc2VhcmNoX2ZpZWxkX2Rpc2FibGVkID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmlzX2Rpc2FibGVkID0gdGhpcy5mb3JtX2ZpZWxkX2pxWzBdLmRpc2FibGVkO1xuICAgICAgaWYgKHRoaXMuaXNfZGlzYWJsZWQpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXIuYWRkQ2xhc3MoJ2Nob3Nlbi1kaXNhYmxlZCcpO1xuICAgICAgICB0aGlzLnNlYXJjaF9maWVsZFswXS5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgIGlmICghdGhpcy5pc19tdWx0aXBsZSkge1xuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRfaXRlbS51bmJpbmQoXCJmb2N1cy5jaG9zZW5cIiwgdGhpcy5hY3RpdmF0ZV9hY3Rpb24pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmNsb3NlX2ZpZWxkKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5yZW1vdmVDbGFzcygnY2hvc2VuLWRpc2FibGVkJyk7XG4gICAgICAgIHRoaXMuc2VhcmNoX2ZpZWxkWzBdLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIGlmICghdGhpcy5pc19tdWx0aXBsZSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkX2l0ZW0uYmluZChcImZvY3VzLmNob3NlblwiLCB0aGlzLmFjdGl2YXRlX2FjdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgQ2hvc2VuLnByb3RvdHlwZS5jb250YWluZXJfbW91c2Vkb3duID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgICBpZiAoIXRoaXMuaXNfZGlzYWJsZWQpIHtcbiAgICAgICAgaWYgKGV2dCAmJiBldnQudHlwZSA9PT0gXCJtb3VzZWRvd25cIiAmJiAhdGhpcy5yZXN1bHRzX3Nob3dpbmcpIHtcbiAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoISgoZXZ0ICE9IG51bGwpICYmICgkKGV2dC50YXJnZXQpKS5oYXNDbGFzcyhcInNlYXJjaC1jaG9pY2UtY2xvc2VcIikpKSB7XG4gICAgICAgICAgaWYgKCF0aGlzLmFjdGl2ZV9maWVsZCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNfbXVsdGlwbGUpIHtcbiAgICAgICAgICAgICAgdGhpcy5zZWFyY2hfZmllbGQudmFsKFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJCh0aGlzLmNvbnRhaW5lclswXS5vd25lckRvY3VtZW50KS5iaW5kKCdjbGljay5jaG9zZW4nLCB0aGlzLmNsaWNrX3Rlc3RfYWN0aW9uKTtcbiAgICAgICAgICAgIHRoaXMucmVzdWx0c19zaG93KCk7XG4gICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5pc19tdWx0aXBsZSAmJiBldnQgJiYgKCgkKGV2dC50YXJnZXQpWzBdID09PSB0aGlzLnNlbGVjdGVkX2l0ZW1bMF0pIHx8ICQoZXZ0LnRhcmdldCkucGFyZW50cyhcImEuY2hvc2VuLXNpbmdsZVwiKS5sZW5ndGgpKSB7XG4gICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMucmVzdWx0c190b2dnbGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRoaXMuYWN0aXZhdGVfZmllbGQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBDaG9zZW4ucHJvdG90eXBlLmNvbnRhaW5lcl9tb3VzZXVwID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgICBpZiAoZXZ0LnRhcmdldC5ub2RlTmFtZSA9PT0gXCJBQkJSXCIgJiYgIXRoaXMuaXNfZGlzYWJsZWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzdWx0c19yZXNldChldnQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBDaG9zZW4ucHJvdG90eXBlLnNlYXJjaF9yZXN1bHRzX21vdXNld2hlZWwgPSBmdW5jdGlvbihldnQpIHtcbiAgICAgIHZhciBkZWx0YTtcbiAgICAgIGlmIChldnQub3JpZ2luYWxFdmVudCkge1xuICAgICAgICBkZWx0YSA9IGV2dC5vcmlnaW5hbEV2ZW50LmRlbHRhWSB8fCAtZXZ0Lm9yaWdpbmFsRXZlbnQud2hlZWxEZWx0YSB8fCBldnQub3JpZ2luYWxFdmVudC5kZXRhaWw7XG4gICAgICB9XG4gICAgICBpZiAoZGVsdGEgIT0gbnVsbCkge1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKGV2dC50eXBlID09PSAnRE9NTW91c2VTY3JvbGwnKSB7XG4gICAgICAgICAgZGVsdGEgPSBkZWx0YSAqIDQwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnNlYXJjaF9yZXN1bHRzLnNjcm9sbFRvcChkZWx0YSArIHRoaXMuc2VhcmNoX3Jlc3VsdHMuc2Nyb2xsVG9wKCkpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBDaG9zZW4ucHJvdG90eXBlLmJsdXJfdGVzdCA9IGZ1bmN0aW9uKGV2dCkge1xuICAgICAgaWYgKCF0aGlzLmFjdGl2ZV9maWVsZCAmJiB0aGlzLmNvbnRhaW5lci5oYXNDbGFzcyhcImNob3Nlbi1jb250YWluZXItYWN0aXZlXCIpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsb3NlX2ZpZWxkKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIENob3Nlbi5wcm90b3R5cGUuY2xvc2VfZmllbGQgPSBmdW5jdGlvbigpIHtcbiAgICAgICQodGhpcy5jb250YWluZXJbMF0ub3duZXJEb2N1bWVudCkudW5iaW5kKFwiY2xpY2suY2hvc2VuXCIsIHRoaXMuY2xpY2tfdGVzdF9hY3Rpb24pO1xuICAgICAgdGhpcy5hY3RpdmVfZmllbGQgPSBmYWxzZTtcbiAgICAgIHRoaXMucmVzdWx0c19oaWRlKCk7XG4gICAgICB0aGlzLmNvbnRhaW5lci5yZW1vdmVDbGFzcyhcImNob3Nlbi1jb250YWluZXItYWN0aXZlXCIpO1xuICAgICAgdGhpcy5jbGVhcl9iYWNrc3Ryb2tlKCk7XG4gICAgICB0aGlzLnNob3dfc2VhcmNoX2ZpZWxkX2RlZmF1bHQoKTtcbiAgICAgIHJldHVybiB0aGlzLnNlYXJjaF9maWVsZF9zY2FsZSgpO1xuICAgIH07XG5cbiAgICBDaG9zZW4ucHJvdG90eXBlLmFjdGl2YXRlX2ZpZWxkID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmNvbnRhaW5lci5hZGRDbGFzcyhcImNob3Nlbi1jb250YWluZXItYWN0aXZlXCIpO1xuICAgICAgdGhpcy5hY3RpdmVfZmllbGQgPSB0cnVlO1xuICAgICAgdGhpcy5zZWFyY2hfZmllbGQudmFsKHRoaXMuc2VhcmNoX2ZpZWxkLnZhbCgpKTtcbiAgICAgIHJldHVybiB0aGlzLnNlYXJjaF9maWVsZC5mb2N1cygpO1xuICAgIH07XG5cbiAgICBDaG9zZW4ucHJvdG90eXBlLnRlc3RfYWN0aXZlX2NsaWNrID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgICB2YXIgYWN0aXZlX2NvbnRhaW5lcjtcbiAgICAgIGFjdGl2ZV9jb250YWluZXIgPSAkKGV2dC50YXJnZXQpLmNsb3Nlc3QoJy5jaG9zZW4tY29udGFpbmVyJyk7XG4gICAgICBpZiAoYWN0aXZlX2NvbnRhaW5lci5sZW5ndGggJiYgdGhpcy5jb250YWluZXJbMF0gPT09IGFjdGl2ZV9jb250YWluZXJbMF0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWN0aXZlX2ZpZWxkID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsb3NlX2ZpZWxkKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIENob3Nlbi5wcm90b3R5cGUucmVzdWx0c19idWlsZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5wYXJzaW5nID0gdHJ1ZTtcbiAgICAgIHRoaXMuc2VsZWN0ZWRfb3B0aW9uX2NvdW50ID0gbnVsbDtcbiAgICAgIHRoaXMucmVzdWx0c19kYXRhID0gU2VsZWN0UGFyc2VyLnNlbGVjdF90b19hcnJheSh0aGlzLmZvcm1fZmllbGQpO1xuICAgICAgaWYgKHRoaXMuaXNfbXVsdGlwbGUpIHtcbiAgICAgICAgdGhpcy5zZWFyY2hfY2hvaWNlcy5maW5kKFwibGkuc2VhcmNoLWNob2ljZVwiKS5yZW1vdmUoKTtcbiAgICAgIH0gZWxzZSBpZiAoIXRoaXMuaXNfbXVsdGlwbGUpIHtcbiAgICAgICAgdGhpcy5zaW5nbGVfc2V0X3NlbGVjdGVkX3RleHQoKTtcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZV9zZWFyY2ggfHwgdGhpcy5mb3JtX2ZpZWxkLm9wdGlvbnMubGVuZ3RoIDw9IHRoaXMuZGlzYWJsZV9zZWFyY2hfdGhyZXNob2xkKSB7XG4gICAgICAgICAgdGhpcy5zZWFyY2hfZmllbGRbMF0ucmVhZE9ubHkgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFkZENsYXNzKFwiY2hvc2VuLWNvbnRhaW5lci1zaW5nbGUtbm9zZWFyY2hcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZWFyY2hfZmllbGRbMF0ucmVhZE9ubHkgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLmNvbnRhaW5lci5yZW1vdmVDbGFzcyhcImNob3Nlbi1jb250YWluZXItc2luZ2xlLW5vc2VhcmNoXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLnVwZGF0ZV9yZXN1bHRzX2NvbnRlbnQodGhpcy5yZXN1bHRzX29wdGlvbl9idWlsZCh7XG4gICAgICAgIGZpcnN0OiB0cnVlXG4gICAgICB9KSk7XG4gICAgICB0aGlzLnNlYXJjaF9maWVsZF9kaXNhYmxlZCgpO1xuICAgICAgdGhpcy5zaG93X3NlYXJjaF9maWVsZF9kZWZhdWx0KCk7XG4gICAgICB0aGlzLnNlYXJjaF9maWVsZF9zY2FsZSgpO1xuICAgICAgcmV0dXJuIHRoaXMucGFyc2luZyA9IGZhbHNlO1xuICAgIH07XG5cbiAgICBDaG9zZW4ucHJvdG90eXBlLnJlc3VsdF9kb19oaWdobGlnaHQgPSBmdW5jdGlvbihlbCkge1xuICAgICAgdmFyIGhpZ2hfYm90dG9tLCBoaWdoX3RvcCwgbWF4SGVpZ2h0LCB2aXNpYmxlX2JvdHRvbSwgdmlzaWJsZV90b3A7XG4gICAgICBpZiAoZWwubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMucmVzdWx0X2NsZWFyX2hpZ2hsaWdodCgpO1xuICAgICAgICB0aGlzLnJlc3VsdF9oaWdobGlnaHQgPSBlbDtcbiAgICAgICAgdGhpcy5yZXN1bHRfaGlnaGxpZ2h0LmFkZENsYXNzKFwiaGlnaGxpZ2h0ZWRcIik7XG4gICAgICAgIG1heEhlaWdodCA9IHBhcnNlSW50KHRoaXMuc2VhcmNoX3Jlc3VsdHMuY3NzKFwibWF4SGVpZ2h0XCIpLCAxMCk7XG4gICAgICAgIHZpc2libGVfdG9wID0gdGhpcy5zZWFyY2hfcmVzdWx0cy5zY3JvbGxUb3AoKTtcbiAgICAgICAgdmlzaWJsZV9ib3R0b20gPSBtYXhIZWlnaHQgKyB2aXNpYmxlX3RvcDtcbiAgICAgICAgaGlnaF90b3AgPSB0aGlzLnJlc3VsdF9oaWdobGlnaHQucG9zaXRpb24oKS50b3AgKyB0aGlzLnNlYXJjaF9yZXN1bHRzLnNjcm9sbFRvcCgpO1xuICAgICAgICBoaWdoX2JvdHRvbSA9IGhpZ2hfdG9wICsgdGhpcy5yZXN1bHRfaGlnaGxpZ2h0Lm91dGVySGVpZ2h0KCk7XG4gICAgICAgIGlmIChoaWdoX2JvdHRvbSA+PSB2aXNpYmxlX2JvdHRvbSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnNlYXJjaF9yZXN1bHRzLnNjcm9sbFRvcCgoaGlnaF9ib3R0b20gLSBtYXhIZWlnaHQpID4gMCA/IGhpZ2hfYm90dG9tIC0gbWF4SGVpZ2h0IDogMCk7XG4gICAgICAgIH0gZWxzZSBpZiAoaGlnaF90b3AgPCB2aXNpYmxlX3RvcCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnNlYXJjaF9yZXN1bHRzLnNjcm9sbFRvcChoaWdoX3RvcCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgQ2hvc2VuLnByb3RvdHlwZS5yZXN1bHRfY2xlYXJfaGlnaGxpZ2h0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5yZXN1bHRfaGlnaGxpZ2h0KSB7XG4gICAgICAgIHRoaXMucmVzdWx0X2hpZ2hsaWdodC5yZW1vdmVDbGFzcyhcImhpZ2hsaWdodGVkXCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMucmVzdWx0X2hpZ2hsaWdodCA9IG51bGw7XG4gICAgfTtcblxuICAgIENob3Nlbi5wcm90b3R5cGUucmVzdWx0c19zaG93ID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5pc19tdWx0aXBsZSAmJiB0aGlzLm1heF9zZWxlY3RlZF9vcHRpb25zIDw9IHRoaXMuY2hvaWNlc19jb3VudCgpKSB7XG4gICAgICAgIHRoaXMuZm9ybV9maWVsZF9qcS50cmlnZ2VyKFwiY2hvc2VuOm1heHNlbGVjdGVkXCIsIHtcbiAgICAgICAgICBjaG9zZW46IHRoaXNcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY29udGFpbmVyLmFkZENsYXNzKFwiY2hvc2VuLXdpdGgtZHJvcFwiKTtcbiAgICAgIHRoaXMucmVzdWx0c19zaG93aW5nID0gdHJ1ZTtcbiAgICAgIHRoaXMuc2VhcmNoX2ZpZWxkLmZvY3VzKCk7XG4gICAgICB0aGlzLnNlYXJjaF9maWVsZC52YWwodGhpcy5zZWFyY2hfZmllbGQudmFsKCkpO1xuICAgICAgdGhpcy53aW5ub3dfcmVzdWx0cygpO1xuICAgICAgcmV0dXJuIHRoaXMuZm9ybV9maWVsZF9qcS50cmlnZ2VyKFwiY2hvc2VuOnNob3dpbmdfZHJvcGRvd25cIiwge1xuICAgICAgICBjaG9zZW46IHRoaXNcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBDaG9zZW4ucHJvdG90eXBlLnVwZGF0ZV9yZXN1bHRzX2NvbnRlbnQgPSBmdW5jdGlvbihjb250ZW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5zZWFyY2hfcmVzdWx0cy5odG1sKGNvbnRlbnQpO1xuICAgIH07XG5cbiAgICBDaG9zZW4ucHJvdG90eXBlLnJlc3VsdHNfaGlkZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMucmVzdWx0c19zaG93aW5nKSB7XG4gICAgICAgIHRoaXMucmVzdWx0X2NsZWFyX2hpZ2hsaWdodCgpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5yZW1vdmVDbGFzcyhcImNob3Nlbi13aXRoLWRyb3BcIik7XG4gICAgICAgIHRoaXMuZm9ybV9maWVsZF9qcS50cmlnZ2VyKFwiY2hvc2VuOmhpZGluZ19kcm9wZG93blwiLCB7XG4gICAgICAgICAgY2hvc2VuOiB0aGlzXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMucmVzdWx0c19zaG93aW5nID0gZmFsc2U7XG4gICAgfTtcblxuICAgIENob3Nlbi5wcm90b3R5cGUuc2V0X3RhYl9pbmRleCA9IGZ1bmN0aW9uKGVsKSB7XG4gICAgICB2YXIgdGk7XG4gICAgICBpZiAodGhpcy5mb3JtX2ZpZWxkLnRhYkluZGV4KSB7XG4gICAgICAgIHRpID0gdGhpcy5mb3JtX2ZpZWxkLnRhYkluZGV4O1xuICAgICAgICB0aGlzLmZvcm1fZmllbGQudGFiSW5kZXggPSAtMTtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VhcmNoX2ZpZWxkWzBdLnRhYkluZGV4ID0gdGk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIENob3Nlbi5wcm90b3R5cGUuc2V0X2xhYmVsX2JlaGF2aW9yID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgdGhpcy5mb3JtX2ZpZWxkX2xhYmVsID0gdGhpcy5mb3JtX2ZpZWxkX2pxLnBhcmVudHMoXCJsYWJlbFwiKTtcbiAgICAgIGlmICghdGhpcy5mb3JtX2ZpZWxkX2xhYmVsLmxlbmd0aCAmJiB0aGlzLmZvcm1fZmllbGQuaWQubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuZm9ybV9maWVsZF9sYWJlbCA9ICQoXCJsYWJlbFtmb3I9J1wiICsgdGhpcy5mb3JtX2ZpZWxkLmlkICsgXCInXVwiKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmZvcm1fZmllbGRfbGFiZWwubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gdGhpcy5mb3JtX2ZpZWxkX2xhYmVsLmJpbmQoJ2NsaWNrLmNob3NlbicsIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICAgIGlmIChfdGhpcy5pc19tdWx0aXBsZSkge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLmNvbnRhaW5lcl9tb3VzZWRvd24oZXZ0KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLmFjdGl2YXRlX2ZpZWxkKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgQ2hvc2VuLnByb3RvdHlwZS5zaG93X3NlYXJjaF9maWVsZF9kZWZhdWx0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5pc19tdWx0aXBsZSAmJiB0aGlzLmNob2ljZXNfY291bnQoKSA8IDEgJiYgIXRoaXMuYWN0aXZlX2ZpZWxkKSB7XG4gICAgICAgIHRoaXMuc2VhcmNoX2ZpZWxkLnZhbCh0aGlzLmRlZmF1bHRfdGV4dCk7XG4gICAgICAgIHJldHVybiB0aGlzLnNlYXJjaF9maWVsZC5hZGRDbGFzcyhcImRlZmF1bHRcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNlYXJjaF9maWVsZC52YWwoXCJcIik7XG4gICAgICAgIHJldHVybiB0aGlzLnNlYXJjaF9maWVsZC5yZW1vdmVDbGFzcyhcImRlZmF1bHRcIik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIENob3Nlbi5wcm90b3R5cGUuc2VhcmNoX3Jlc3VsdHNfbW91c2V1cCA9IGZ1bmN0aW9uKGV2dCkge1xuICAgICAgdmFyIHRhcmdldDtcbiAgICAgIHRhcmdldCA9ICQoZXZ0LnRhcmdldCkuaGFzQ2xhc3MoXCJhY3RpdmUtcmVzdWx0XCIpID8gJChldnQudGFyZ2V0KSA6ICQoZXZ0LnRhcmdldCkucGFyZW50cyhcIi5hY3RpdmUtcmVzdWx0XCIpLmZpcnN0KCk7XG4gICAgICBpZiAodGFyZ2V0Lmxlbmd0aCkge1xuICAgICAgICB0aGlzLnJlc3VsdF9oaWdobGlnaHQgPSB0YXJnZXQ7XG4gICAgICAgIHRoaXMucmVzdWx0X3NlbGVjdChldnQpO1xuICAgICAgICByZXR1cm4gdGhpcy5zZWFyY2hfZmllbGQuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgQ2hvc2VuLnByb3RvdHlwZS5zZWFyY2hfcmVzdWx0c19tb3VzZW92ZXIgPSBmdW5jdGlvbihldnQpIHtcbiAgICAgIHZhciB0YXJnZXQ7XG4gICAgICB0YXJnZXQgPSAkKGV2dC50YXJnZXQpLmhhc0NsYXNzKFwiYWN0aXZlLXJlc3VsdFwiKSA/ICQoZXZ0LnRhcmdldCkgOiAkKGV2dC50YXJnZXQpLnBhcmVudHMoXCIuYWN0aXZlLXJlc3VsdFwiKS5maXJzdCgpO1xuICAgICAgaWYgKHRhcmdldCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXN1bHRfZG9faGlnaGxpZ2h0KHRhcmdldCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIENob3Nlbi5wcm90b3R5cGUuc2VhcmNoX3Jlc3VsdHNfbW91c2VvdXQgPSBmdW5jdGlvbihldnQpIHtcbiAgICAgIGlmICgkKGV2dC50YXJnZXQpLmhhc0NsYXNzKFwiYWN0aXZlLXJlc3VsdFwiIHx8ICQoZXZ0LnRhcmdldCkucGFyZW50cygnLmFjdGl2ZS1yZXN1bHQnKS5maXJzdCgpKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXN1bHRfY2xlYXJfaGlnaGxpZ2h0KCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIENob3Nlbi5wcm90b3R5cGUuY2hvaWNlX2J1aWxkID0gZnVuY3Rpb24oaXRlbSkge1xuICAgICAgdmFyIGNob2ljZSwgY2xvc2VfbGluayxcbiAgICAgICAgX3RoaXMgPSB0aGlzO1xuICAgICAgY2hvaWNlID0gJCgnPGxpIC8+Jywge1xuICAgICAgICBcImNsYXNzXCI6IFwic2VhcmNoLWNob2ljZVwiXG4gICAgICB9KS5odG1sKFwiPHNwYW4+XCIgKyAodGhpcy5jaG9pY2VfbGFiZWwoaXRlbSkpICsgXCI8L3NwYW4+XCIpO1xuICAgICAgaWYgKGl0ZW0uZGlzYWJsZWQpIHtcbiAgICAgICAgY2hvaWNlLmFkZENsYXNzKCdzZWFyY2gtY2hvaWNlLWRpc2FibGVkJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjbG9zZV9saW5rID0gJCgnPGEgLz4nLCB7XG4gICAgICAgICAgXCJjbGFzc1wiOiAnc2VhcmNoLWNob2ljZS1jbG9zZScsXG4gICAgICAgICAgJ2RhdGEtb3B0aW9uLWFycmF5LWluZGV4JzogaXRlbS5hcnJheV9pbmRleFxuICAgICAgICB9KTtcbiAgICAgICAgY2xvc2VfbGluay5iaW5kKCdjbGljay5jaG9zZW4nLCBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMuY2hvaWNlX2Rlc3Ryb3lfbGlua19jbGljayhldnQpO1xuICAgICAgICB9KTtcbiAgICAgICAgY2hvaWNlLmFwcGVuZChjbG9zZV9saW5rKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnNlYXJjaF9jb250YWluZXIuYmVmb3JlKGNob2ljZSk7XG4gICAgfTtcblxuICAgIENob3Nlbi5wcm90b3R5cGUuY2hvaWNlX2Rlc3Ryb3lfbGlua19jbGljayA9IGZ1bmN0aW9uKGV2dCkge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBpZiAoIXRoaXMuaXNfZGlzYWJsZWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hvaWNlX2Rlc3Ryb3koJChldnQudGFyZ2V0KSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIENob3Nlbi5wcm90b3R5cGUuY2hvaWNlX2Rlc3Ryb3kgPSBmdW5jdGlvbihsaW5rKSB7XG4gICAgICBpZiAodGhpcy5yZXN1bHRfZGVzZWxlY3QobGlua1swXS5nZXRBdHRyaWJ1dGUoXCJkYXRhLW9wdGlvbi1hcnJheS1pbmRleFwiKSkpIHtcbiAgICAgICAgdGhpcy5zaG93X3NlYXJjaF9maWVsZF9kZWZhdWx0KCk7XG4gICAgICAgIGlmICh0aGlzLmlzX211bHRpcGxlICYmIHRoaXMuY2hvaWNlc19jb3VudCgpID4gMCAmJiB0aGlzLnNlYXJjaF9maWVsZC52YWwoKS5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgdGhpcy5yZXN1bHRzX2hpZGUoKTtcbiAgICAgICAgfVxuICAgICAgICBsaW5rLnBhcmVudHMoJ2xpJykuZmlyc3QoKS5yZW1vdmUoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VhcmNoX2ZpZWxkX3NjYWxlKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIENob3Nlbi5wcm90b3R5cGUucmVzdWx0c19yZXNldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5yZXNldF9zaW5nbGVfc2VsZWN0X29wdGlvbnMoKTtcbiAgICAgIHRoaXMuZm9ybV9maWVsZC5vcHRpb25zWzBdLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuc2luZ2xlX3NldF9zZWxlY3RlZF90ZXh0KCk7XG4gICAgICB0aGlzLnNob3dfc2VhcmNoX2ZpZWxkX2RlZmF1bHQoKTtcbiAgICAgIHRoaXMucmVzdWx0c19yZXNldF9jbGVhbnVwKCk7XG4gICAgICB0aGlzLmZvcm1fZmllbGRfanEudHJpZ2dlcihcImNoYW5nZVwiKTtcbiAgICAgIGlmICh0aGlzLmFjdGl2ZV9maWVsZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXN1bHRzX2hpZGUoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgQ2hvc2VuLnByb3RvdHlwZS5yZXN1bHRzX3Jlc2V0X2NsZWFudXAgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuY3VycmVudF9zZWxlY3RlZEluZGV4ID0gdGhpcy5mb3JtX2ZpZWxkLnNlbGVjdGVkSW5kZXg7XG4gICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZF9pdGVtLmZpbmQoXCJhYmJyXCIpLnJlbW92ZSgpO1xuICAgIH07XG5cbiAgICBDaG9zZW4ucHJvdG90eXBlLnJlc3VsdF9zZWxlY3QgPSBmdW5jdGlvbihldnQpIHtcbiAgICAgIHZhciBoaWdoLCBpdGVtO1xuICAgICAgaWYgKHRoaXMucmVzdWx0X2hpZ2hsaWdodCkge1xuICAgICAgICBoaWdoID0gdGhpcy5yZXN1bHRfaGlnaGxpZ2h0O1xuICAgICAgICB0aGlzLnJlc3VsdF9jbGVhcl9oaWdobGlnaHQoKTtcbiAgICAgICAgaWYgKHRoaXMuaXNfbXVsdGlwbGUgJiYgdGhpcy5tYXhfc2VsZWN0ZWRfb3B0aW9ucyA8PSB0aGlzLmNob2ljZXNfY291bnQoKSkge1xuICAgICAgICAgIHRoaXMuZm9ybV9maWVsZF9qcS50cmlnZ2VyKFwiY2hvc2VuOm1heHNlbGVjdGVkXCIsIHtcbiAgICAgICAgICAgIGNob3NlbjogdGhpc1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5pc19tdWx0aXBsZSkge1xuICAgICAgICAgIGhpZ2gucmVtb3ZlQ2xhc3MoXCJhY3RpdmUtcmVzdWx0XCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucmVzZXRfc2luZ2xlX3NlbGVjdF9vcHRpb25zKCk7XG4gICAgICAgIH1cbiAgICAgICAgaGlnaC5hZGRDbGFzcyhcInJlc3VsdC1zZWxlY3RlZFwiKTtcbiAgICAgICAgaXRlbSA9IHRoaXMucmVzdWx0c19kYXRhW2hpZ2hbMF0uZ2V0QXR0cmlidXRlKFwiZGF0YS1vcHRpb24tYXJyYXktaW5kZXhcIildO1xuICAgICAgICBpdGVtLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5mb3JtX2ZpZWxkLm9wdGlvbnNbaXRlbS5vcHRpb25zX2luZGV4XS5zZWxlY3RlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRfb3B0aW9uX2NvdW50ID0gbnVsbDtcbiAgICAgICAgaWYgKHRoaXMuaXNfbXVsdGlwbGUpIHtcbiAgICAgICAgICB0aGlzLmNob2ljZV9idWlsZChpdGVtKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNpbmdsZV9zZXRfc2VsZWN0ZWRfdGV4dCh0aGlzLmNob2ljZV9sYWJlbChpdGVtKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEoKGV2dC5tZXRhS2V5IHx8IGV2dC5jdHJsS2V5KSAmJiB0aGlzLmlzX211bHRpcGxlKSkge1xuICAgICAgICAgIHRoaXMucmVzdWx0c19oaWRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zaG93X3NlYXJjaF9maWVsZF9kZWZhdWx0KCk7XG4gICAgICAgIGlmICh0aGlzLmlzX211bHRpcGxlIHx8IHRoaXMuZm9ybV9maWVsZC5zZWxlY3RlZEluZGV4ICE9PSB0aGlzLmN1cnJlbnRfc2VsZWN0ZWRJbmRleCkge1xuICAgICAgICAgIHRoaXMuZm9ybV9maWVsZF9qcS50cmlnZ2VyKFwiY2hhbmdlXCIsIHtcbiAgICAgICAgICAgICdzZWxlY3RlZCc6IHRoaXMuZm9ybV9maWVsZC5vcHRpb25zW2l0ZW0ub3B0aW9uc19pbmRleF0udmFsdWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN1cnJlbnRfc2VsZWN0ZWRJbmRleCA9IHRoaXMuZm9ybV9maWVsZC5zZWxlY3RlZEluZGV4O1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VhcmNoX2ZpZWxkX3NjYWxlKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIENob3Nlbi5wcm90b3R5cGUuc2luZ2xlX3NldF9zZWxlY3RlZF90ZXh0ID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgaWYgKHRleHQgPT0gbnVsbCkge1xuICAgICAgICB0ZXh0ID0gdGhpcy5kZWZhdWx0X3RleHQ7XG4gICAgICB9XG4gICAgICBpZiAodGV4dCA9PT0gdGhpcy5kZWZhdWx0X3RleHQpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZF9pdGVtLmFkZENsYXNzKFwiY2hvc2VuLWRlZmF1bHRcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNpbmdsZV9kZXNlbGVjdF9jb250cm9sX2J1aWxkKCk7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRfaXRlbS5yZW1vdmVDbGFzcyhcImNob3Nlbi1kZWZhdWx0XCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRfaXRlbS5maW5kKFwic3BhblwiKS5odG1sKHRleHQpO1xuICAgIH07XG5cbiAgICBDaG9zZW4ucHJvdG90eXBlLnJlc3VsdF9kZXNlbGVjdCA9IGZ1bmN0aW9uKHBvcykge1xuICAgICAgdmFyIHJlc3VsdF9kYXRhO1xuICAgICAgcmVzdWx0X2RhdGEgPSB0aGlzLnJlc3VsdHNfZGF0YVtwb3NdO1xuICAgICAgaWYgKCF0aGlzLmZvcm1fZmllbGQub3B0aW9uc1tyZXN1bHRfZGF0YS5vcHRpb25zX2luZGV4XS5kaXNhYmxlZCkge1xuICAgICAgICByZXN1bHRfZGF0YS5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmZvcm1fZmllbGQub3B0aW9uc1tyZXN1bHRfZGF0YS5vcHRpb25zX2luZGV4XS5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNlbGVjdGVkX29wdGlvbl9jb3VudCA9IG51bGw7XG4gICAgICAgIHRoaXMucmVzdWx0X2NsZWFyX2hpZ2hsaWdodCgpO1xuICAgICAgICBpZiAodGhpcy5yZXN1bHRzX3Nob3dpbmcpIHtcbiAgICAgICAgICB0aGlzLndpbm5vd19yZXN1bHRzKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5mb3JtX2ZpZWxkX2pxLnRyaWdnZXIoXCJjaGFuZ2VcIiwge1xuICAgICAgICAgIGRlc2VsZWN0ZWQ6IHRoaXMuZm9ybV9maWVsZC5vcHRpb25zW3Jlc3VsdF9kYXRhLm9wdGlvbnNfaW5kZXhdLnZhbHVlXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnNlYXJjaF9maWVsZF9zY2FsZSgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgQ2hvc2VuLnByb3RvdHlwZS5zaW5nbGVfZGVzZWxlY3RfY29udHJvbF9idWlsZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCF0aGlzLmFsbG93X3NpbmdsZV9kZXNlbGVjdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuc2VsZWN0ZWRfaXRlbS5maW5kKFwiYWJiclwiKS5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZF9pdGVtLmZpbmQoXCJzcGFuXCIpLmZpcnN0KCkuYWZ0ZXIoXCI8YWJiciBjbGFzcz1cXFwic2VhcmNoLWNob2ljZS1jbG9zZVxcXCI+PC9hYmJyPlwiKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkX2l0ZW0uYWRkQ2xhc3MoXCJjaG9zZW4tc2luZ2xlLXdpdGgtZGVzZWxlY3RcIik7XG4gICAgfTtcblxuICAgIENob3Nlbi5wcm90b3R5cGUuZ2V0X3NlYXJjaF90ZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJCgnPGRpdi8+JykudGV4dCgkLnRyaW0odGhpcy5zZWFyY2hfZmllbGQudmFsKCkpKS5odG1sKCk7XG4gICAgfTtcblxuICAgIENob3Nlbi5wcm90b3R5cGUud2lubm93X3Jlc3VsdHNfc2V0X2hpZ2hsaWdodCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGRvX2hpZ2gsIHNlbGVjdGVkX3Jlc3VsdHM7XG4gICAgICBzZWxlY3RlZF9yZXN1bHRzID0gIXRoaXMuaXNfbXVsdGlwbGUgPyB0aGlzLnNlYXJjaF9yZXN1bHRzLmZpbmQoXCIucmVzdWx0LXNlbGVjdGVkLmFjdGl2ZS1yZXN1bHRcIikgOiBbXTtcbiAgICAgIGRvX2hpZ2ggPSBzZWxlY3RlZF9yZXN1bHRzLmxlbmd0aCA/IHNlbGVjdGVkX3Jlc3VsdHMuZmlyc3QoKSA6IHRoaXMuc2VhcmNoX3Jlc3VsdHMuZmluZChcIi5hY3RpdmUtcmVzdWx0XCIpLmZpcnN0KCk7XG4gICAgICBpZiAoZG9faGlnaCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlc3VsdF9kb19oaWdobGlnaHQoZG9faGlnaCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIENob3Nlbi5wcm90b3R5cGUubm9fcmVzdWx0cyA9IGZ1bmN0aW9uKHRlcm1zKSB7XG4gICAgICB2YXIgbm9fcmVzdWx0c19odG1sO1xuICAgICAgbm9fcmVzdWx0c19odG1sID0gJCgnPGxpIGNsYXNzPVwibm8tcmVzdWx0c1wiPicgKyB0aGlzLnJlc3VsdHNfbm9uZV9mb3VuZCArICcgXCI8c3Bhbj48L3NwYW4+XCI8L2xpPicpO1xuICAgICAgbm9fcmVzdWx0c19odG1sLmZpbmQoXCJzcGFuXCIpLmZpcnN0KCkuaHRtbCh0ZXJtcyk7XG4gICAgICB0aGlzLnNlYXJjaF9yZXN1bHRzLmFwcGVuZChub19yZXN1bHRzX2h0bWwpO1xuICAgICAgcmV0dXJuIHRoaXMuZm9ybV9maWVsZF9qcS50cmlnZ2VyKFwiY2hvc2VuOm5vX3Jlc3VsdHNcIiwge1xuICAgICAgICBjaG9zZW46IHRoaXNcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBDaG9zZW4ucHJvdG90eXBlLm5vX3Jlc3VsdHNfY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnNlYXJjaF9yZXN1bHRzLmZpbmQoXCIubm8tcmVzdWx0c1wiKS5yZW1vdmUoKTtcbiAgICB9O1xuXG4gICAgQ2hvc2VuLnByb3RvdHlwZS5rZXlkb3duX2Fycm93ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbmV4dF9zaWI7XG4gICAgICBpZiAodGhpcy5yZXN1bHRzX3Nob3dpbmcgJiYgdGhpcy5yZXN1bHRfaGlnaGxpZ2h0KSB7XG4gICAgICAgIG5leHRfc2liID0gdGhpcy5yZXN1bHRfaGlnaGxpZ2h0Lm5leHRBbGwoXCJsaS5hY3RpdmUtcmVzdWx0XCIpLmZpcnN0KCk7XG4gICAgICAgIGlmIChuZXh0X3NpYikge1xuICAgICAgICAgIHJldHVybiB0aGlzLnJlc3VsdF9kb19oaWdobGlnaHQobmV4dF9zaWIpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXN1bHRzX3Nob3coKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgQ2hvc2VuLnByb3RvdHlwZS5rZXl1cF9hcnJvdyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHByZXZfc2licztcbiAgICAgIGlmICghdGhpcy5yZXN1bHRzX3Nob3dpbmcgJiYgIXRoaXMuaXNfbXVsdGlwbGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzdWx0c19zaG93KCk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMucmVzdWx0X2hpZ2hsaWdodCkge1xuICAgICAgICBwcmV2X3NpYnMgPSB0aGlzLnJlc3VsdF9oaWdobGlnaHQucHJldkFsbChcImxpLmFjdGl2ZS1yZXN1bHRcIik7XG4gICAgICAgIGlmIChwcmV2X3NpYnMubGVuZ3RoKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucmVzdWx0X2RvX2hpZ2hsaWdodChwcmV2X3NpYnMuZmlyc3QoKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHRoaXMuY2hvaWNlc19jb3VudCgpID4gMCkge1xuICAgICAgICAgICAgdGhpcy5yZXN1bHRzX2hpZGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRoaXMucmVzdWx0X2NsZWFyX2hpZ2hsaWdodCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIENob3Nlbi5wcm90b3R5cGUua2V5ZG93bl9iYWNrc3Ryb2tlID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbmV4dF9hdmFpbGFibGVfZGVzdHJveTtcbiAgICAgIGlmICh0aGlzLnBlbmRpbmdfYmFja3N0cm9rZSkge1xuICAgICAgICB0aGlzLmNob2ljZV9kZXN0cm95KHRoaXMucGVuZGluZ19iYWNrc3Ryb2tlLmZpbmQoXCJhXCIpLmZpcnN0KCkpO1xuICAgICAgICByZXR1cm4gdGhpcy5jbGVhcl9iYWNrc3Ryb2tlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXh0X2F2YWlsYWJsZV9kZXN0cm95ID0gdGhpcy5zZWFyY2hfY29udGFpbmVyLnNpYmxpbmdzKFwibGkuc2VhcmNoLWNob2ljZVwiKS5sYXN0KCk7XG4gICAgICAgIGlmIChuZXh0X2F2YWlsYWJsZV9kZXN0cm95Lmxlbmd0aCAmJiAhbmV4dF9hdmFpbGFibGVfZGVzdHJveS5oYXNDbGFzcyhcInNlYXJjaC1jaG9pY2UtZGlzYWJsZWRcIikpIHtcbiAgICAgICAgICB0aGlzLnBlbmRpbmdfYmFja3N0cm9rZSA9IG5leHRfYXZhaWxhYmxlX2Rlc3Ryb3k7XG4gICAgICAgICAgaWYgKHRoaXMuc2luZ2xlX2JhY2tzdHJva2VfZGVsZXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5rZXlkb3duX2JhY2tzdHJva2UoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGVuZGluZ19iYWNrc3Ryb2tlLmFkZENsYXNzKFwic2VhcmNoLWNob2ljZS1mb2N1c1wiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgQ2hvc2VuLnByb3RvdHlwZS5jbGVhcl9iYWNrc3Ryb2tlID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5wZW5kaW5nX2JhY2tzdHJva2UpIHtcbiAgICAgICAgdGhpcy5wZW5kaW5nX2JhY2tzdHJva2UucmVtb3ZlQ2xhc3MoXCJzZWFyY2gtY2hvaWNlLWZvY3VzXCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMucGVuZGluZ19iYWNrc3Ryb2tlID0gbnVsbDtcbiAgICB9O1xuXG4gICAgQ2hvc2VuLnByb3RvdHlwZS5rZXlkb3duX2NoZWNrZXIgPSBmdW5jdGlvbihldnQpIHtcbiAgICAgIHZhciBzdHJva2UsIF9yZWYxO1xuICAgICAgc3Ryb2tlID0gKF9yZWYxID0gZXZ0LndoaWNoKSAhPSBudWxsID8gX3JlZjEgOiBldnQua2V5Q29kZTtcbiAgICAgIHRoaXMuc2VhcmNoX2ZpZWxkX3NjYWxlKCk7XG4gICAgICBpZiAoc3Ryb2tlICE9PSA4ICYmIHRoaXMucGVuZGluZ19iYWNrc3Ryb2tlKSB7XG4gICAgICAgIHRoaXMuY2xlYXJfYmFja3N0cm9rZSgpO1xuICAgICAgfVxuICAgICAgc3dpdGNoIChzdHJva2UpIHtcbiAgICAgICAgY2FzZSA4OlxuICAgICAgICAgIHRoaXMuYmFja3N0cm9rZV9sZW5ndGggPSB0aGlzLnNlYXJjaF9maWVsZC52YWwoKS5sZW5ndGg7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgOTpcbiAgICAgICAgICBpZiAodGhpcy5yZXN1bHRzX3Nob3dpbmcgJiYgIXRoaXMuaXNfbXVsdGlwbGUpIHtcbiAgICAgICAgICAgIHRoaXMucmVzdWx0X3NlbGVjdChldnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLm1vdXNlX29uX2NvbnRhaW5lciA9IGZhbHNlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDEzOlxuICAgICAgICAgIGlmICh0aGlzLnJlc3VsdHNfc2hvd2luZykge1xuICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDMyOlxuICAgICAgICAgIGlmICh0aGlzLmRpc2FibGVfc2VhcmNoKSB7XG4gICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzg6XG4gICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgdGhpcy5rZXl1cF9hcnJvdygpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDQwOlxuICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHRoaXMua2V5ZG93bl9hcnJvdygpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBDaG9zZW4ucHJvdG90eXBlLnNlYXJjaF9maWVsZF9zY2FsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGRpdiwgZl93aWR0aCwgaCwgc3R5bGUsIHN0eWxlX2Jsb2NrLCBzdHlsZXMsIHcsIF9pLCBfbGVuO1xuICAgICAgaWYgKHRoaXMuaXNfbXVsdGlwbGUpIHtcbiAgICAgICAgaCA9IDA7XG4gICAgICAgIHcgPSAwO1xuICAgICAgICBzdHlsZV9ibG9jayA9IFwicG9zaXRpb246YWJzb2x1dGU7IGxlZnQ6IC0xMDAwcHg7IHRvcDogLTEwMDBweDsgZGlzcGxheTpub25lO1wiO1xuICAgICAgICBzdHlsZXMgPSBbJ2ZvbnQtc2l6ZScsICdmb250LXN0eWxlJywgJ2ZvbnQtd2VpZ2h0JywgJ2ZvbnQtZmFtaWx5JywgJ2xpbmUtaGVpZ2h0JywgJ3RleHQtdHJhbnNmb3JtJywgJ2xldHRlci1zcGFjaW5nJ107XG4gICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gc3R5bGVzLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgc3R5bGUgPSBzdHlsZXNbX2ldO1xuICAgICAgICAgIHN0eWxlX2Jsb2NrICs9IHN0eWxlICsgXCI6XCIgKyB0aGlzLnNlYXJjaF9maWVsZC5jc3Moc3R5bGUpICsgXCI7XCI7XG4gICAgICAgIH1cbiAgICAgICAgZGl2ID0gJCgnPGRpdiAvPicsIHtcbiAgICAgICAgICAnc3R5bGUnOiBzdHlsZV9ibG9ja1xuICAgICAgICB9KTtcbiAgICAgICAgZGl2LnRleHQodGhpcy5zZWFyY2hfZmllbGQudmFsKCkpO1xuICAgICAgICAkKCdib2R5JykuYXBwZW5kKGRpdik7XG4gICAgICAgIHcgPSBkaXYud2lkdGgoKSArIDI1O1xuICAgICAgICBkaXYucmVtb3ZlKCk7XG4gICAgICAgIGZfd2lkdGggPSB0aGlzLmNvbnRhaW5lci5vdXRlcldpZHRoKCk7XG4gICAgICAgIGlmICh3ID4gZl93aWR0aCAtIDEwKSB7XG4gICAgICAgICAgdyA9IGZfd2lkdGggLSAxMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5zZWFyY2hfZmllbGQuY3NzKHtcbiAgICAgICAgICAnd2lkdGgnOiB3ICsgJ3B4J1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIENob3NlbjtcblxuICB9KShBYnN0cmFjdENob3Nlbik7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCIvKmdsb2JhbCBqUXVlcnkgKi9cbi8qanNoaW50IGJyb3dzZXI6dHJ1ZSAqL1xuLyohXG4qIEZpdFZpZHMgMS4xXG4qXG4qIENvcHlyaWdodCAyMDEzLCBDaHJpcyBDb3lpZXIgLSBodHRwOi8vY3NzLXRyaWNrcy5jb20gKyBEYXZlIFJ1cGVydCAtIGh0dHA6Ly9kYXZlcnVwZXJ0LmNvbVxuKiBDcmVkaXQgdG8gVGhpZXJyeSBLb2JsZW50eiAtIGh0dHA6Ly93d3cuYWxpc3RhcGFydC5jb20vYXJ0aWNsZXMvY3JlYXRpbmctaW50cmluc2ljLXJhdGlvcy1mb3ItdmlkZW8vXG4qIFJlbGVhc2VkIHVuZGVyIHRoZSBXVEZQTCBsaWNlbnNlIC0gaHR0cDovL3NhbS56b3kub3JnL3d0ZnBsL1xuKlxuKi9cblxuKGZ1bmN0aW9uKCAkICl7XG5cbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgJC5mbi5maXRWaWRzID0gZnVuY3Rpb24oIG9wdGlvbnMgKSB7XG4gICAgdmFyIHNldHRpbmdzID0ge1xuICAgICAgY3VzdG9tU2VsZWN0b3I6IG51bGxcbiAgICB9O1xuXG4gICAgaWYoIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaXQtdmlkcy1zdHlsZScpKSB7XG4gICAgICAvLyBhcHBlbmRTdHlsZXM6IGh0dHBzOi8vZ2l0aHViLmNvbS90b2RkbW90dG8vZmx1aWR2aWRzL2Jsb2IvbWFzdGVyL2Rpc3QvZmx1aWR2aWRzLmpzXG4gICAgICB2YXIgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgICAgIHZhciBjc3MgPSAnLmZsdWlkLXdpZHRoLXZpZGVvLXdyYXBwZXJ7d2lkdGg6MTAwJTtwb3NpdGlvbjpyZWxhdGl2ZTtwYWRkaW5nOjA7fS5mbHVpZC13aWR0aC12aWRlby13cmFwcGVyIGlmcmFtZSwuZmx1aWQtd2lkdGgtdmlkZW8td3JhcHBlciBvYmplY3QsLmZsdWlkLXdpZHRoLXZpZGVvLXdyYXBwZXIgZW1iZWQge3Bvc2l0aW9uOmFic29sdXRlO3RvcDowO2xlZnQ6MDt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO30nO1xuICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZGl2LmlubmVySFRNTCA9ICc8cD54PC9wPjxzdHlsZSBpZD1cImZpdC12aWRzLXN0eWxlXCI+JyArIGNzcyArICc8L3N0eWxlPic7XG4gICAgICBoZWFkLmFwcGVuZENoaWxkKGRpdi5jaGlsZE5vZGVzWzFdKTtcbiAgICB9XG5cbiAgICBpZiAoIG9wdGlvbnMgKSB7XG4gICAgICAkLmV4dGVuZCggc2V0dGluZ3MsIG9wdGlvbnMgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgc2VsZWN0b3JzID0gW1xuICAgICAgICBcImlmcmFtZVtzcmMqPSdwbGF5ZXIudmltZW8uY29tJ11cIixcbiAgICAgICAgXCJpZnJhbWVbc3JjKj0neW91dHViZS5jb20nXVwiLFxuICAgICAgICBcImlmcmFtZVtzcmMqPSd5b3V0dWJlLW5vY29va2llLmNvbSddXCIsXG4gICAgICAgIFwiaWZyYW1lW3NyYyo9J2tpY2tzdGFydGVyLmNvbSddW3NyYyo9J3ZpZGVvLmh0bWwnXVwiLFxuICAgICAgICBcIm9iamVjdFwiLFxuICAgICAgICBcImVtYmVkXCJcbiAgICAgIF07XG5cbiAgICAgIGlmIChzZXR0aW5ncy5jdXN0b21TZWxlY3Rvcikge1xuICAgICAgICBzZWxlY3RvcnMucHVzaChzZXR0aW5ncy5jdXN0b21TZWxlY3Rvcik7XG4gICAgICB9XG5cbiAgICAgIHZhciAkYWxsVmlkZW9zID0gJCh0aGlzKS5maW5kKHNlbGVjdG9ycy5qb2luKCcsJykpO1xuICAgICAgJGFsbFZpZGVvcyA9ICRhbGxWaWRlb3Mubm90KFwib2JqZWN0IG9iamVjdFwiKTsgLy8gU3dmT2JqIGNvbmZsaWN0IHBhdGNoXG5cbiAgICAgICRhbGxWaWRlb3MuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuICAgICAgICBpZiAodGhpcy50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdlbWJlZCcgJiYgJHRoaXMucGFyZW50KCdvYmplY3QnKS5sZW5ndGggfHwgJHRoaXMucGFyZW50KCcuZmx1aWQtd2lkdGgtdmlkZW8td3JhcHBlcicpLmxlbmd0aCkgeyByZXR1cm47IH1cbiAgICAgICAgdmFyIGhlaWdodCA9ICggdGhpcy50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdvYmplY3QnIHx8ICgkdGhpcy5hdHRyKCdoZWlnaHQnKSAmJiAhaXNOYU4ocGFyc2VJbnQoJHRoaXMuYXR0cignaGVpZ2h0JyksIDEwKSkpICkgPyBwYXJzZUludCgkdGhpcy5hdHRyKCdoZWlnaHQnKSwgMTApIDogJHRoaXMuaGVpZ2h0KCksXG4gICAgICAgICAgICB3aWR0aCA9ICFpc05hTihwYXJzZUludCgkdGhpcy5hdHRyKCd3aWR0aCcpLCAxMCkpID8gcGFyc2VJbnQoJHRoaXMuYXR0cignd2lkdGgnKSwgMTApIDogJHRoaXMud2lkdGgoKSxcbiAgICAgICAgICAgIGFzcGVjdFJhdGlvID0gaGVpZ2h0IC8gd2lkdGg7XG4gICAgICAgIGlmKCEkdGhpcy5hdHRyKCdpZCcpKXtcbiAgICAgICAgICB2YXIgdmlkZW9JRCA9ICdmaXR2aWQnICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjk5OTk5OSk7XG4gICAgICAgICAgJHRoaXMuYXR0cignaWQnLCB2aWRlb0lEKTtcbiAgICAgICAgfVxuICAgICAgICAkdGhpcy53cmFwKCc8ZGl2IGNsYXNzPVwiZmx1aWQtd2lkdGgtdmlkZW8td3JhcHBlclwiPjwvZGl2PicpLnBhcmVudCgnLmZsdWlkLXdpZHRoLXZpZGVvLXdyYXBwZXInKS5jc3MoJ3BhZGRpbmctdG9wJywgKGFzcGVjdFJhdGlvICogMTAwKStcIiVcIik7XG4gICAgICAgICR0aGlzLnJlbW92ZUF0dHIoJ2hlaWdodCcpLnJlbW92ZUF0dHIoJ3dpZHRoJyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcbi8vIFdvcmtzIHdpdGggZWl0aGVyIGpRdWVyeSBvciBaZXB0b1xufSkoIHdpbmRvdy5qUXVlcnkgfHwgd2luZG93LlplcHRvICk7XG4iLCIvKiBwZXJmZWN0LXNjcm9sbGJhciB2MC42LjExICovXG4oZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSh7MTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBwcyA9IHJlcXVpcmUoJy4uL21haW4nKTtcbnZhciBwc0luc3RhbmNlcyA9IHJlcXVpcmUoJy4uL3BsdWdpbi9pbnN0YW5jZXMnKTtcblxuZnVuY3Rpb24gbW91bnRKUXVlcnkoalF1ZXJ5KSB7XG4gIGpRdWVyeS5mbi5wZXJmZWN0U2Nyb2xsYmFyID0gZnVuY3Rpb24gKHNldHRpbmdPckNvbW1hbmQpIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0eXBlb2Ygc2V0dGluZ09yQ29tbWFuZCA9PT0gJ29iamVjdCcgfHxcbiAgICAgICAgICB0eXBlb2Ygc2V0dGluZ09yQ29tbWFuZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy8gSWYgaXQncyBhbiBvYmplY3Qgb3Igbm9uZSwgaW5pdGlhbGl6ZS5cbiAgICAgICAgdmFyIHNldHRpbmdzID0gc2V0dGluZ09yQ29tbWFuZDtcblxuICAgICAgICBpZiAoIXBzSW5zdGFuY2VzLmdldCh0aGlzKSkge1xuICAgICAgICAgIHBzLmluaXRpYWxpemUodGhpcywgc2V0dGluZ3MpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBVbmxlc3MsIGl0IG1heSBiZSBhIGNvbW1hbmQuXG4gICAgICAgIHZhciBjb21tYW5kID0gc2V0dGluZ09yQ29tbWFuZDtcblxuICAgICAgICBpZiAoY29tbWFuZCA9PT0gJ3VwZGF0ZScpIHtcbiAgICAgICAgICBwcy51cGRhdGUodGhpcyk7XG4gICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZCA9PT0gJ2Rlc3Ryb3knKSB7XG4gICAgICAgICAgcHMuZGVzdHJveSh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufVxuXG5pZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgZGVmaW5lKFsnanF1ZXJ5J10sIG1vdW50SlF1ZXJ5KTtcbn0gZWxzZSB7XG4gIHZhciBqcSA9IHdpbmRvdy5qUXVlcnkgPyB3aW5kb3cualF1ZXJ5IDogd2luZG93LiQ7XG4gIGlmICh0eXBlb2YganEgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbW91bnRKUXVlcnkoanEpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbW91bnRKUXVlcnk7XG5cbn0se1wiLi4vbWFpblwiOjcsXCIuLi9wbHVnaW4vaW5zdGFuY2VzXCI6MTh9XSwyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gb2xkQWRkKGVsZW1lbnQsIGNsYXNzTmFtZSkge1xuICB2YXIgY2xhc3NlcyA9IGVsZW1lbnQuY2xhc3NOYW1lLnNwbGl0KCcgJyk7XG4gIGlmIChjbGFzc2VzLmluZGV4T2YoY2xhc3NOYW1lKSA8IDApIHtcbiAgICBjbGFzc2VzLnB1c2goY2xhc3NOYW1lKTtcbiAgfVxuICBlbGVtZW50LmNsYXNzTmFtZSA9IGNsYXNzZXMuam9pbignICcpO1xufVxuXG5mdW5jdGlvbiBvbGRSZW1vdmUoZWxlbWVudCwgY2xhc3NOYW1lKSB7XG4gIHZhciBjbGFzc2VzID0gZWxlbWVudC5jbGFzc05hbWUuc3BsaXQoJyAnKTtcbiAgdmFyIGlkeCA9IGNsYXNzZXMuaW5kZXhPZihjbGFzc05hbWUpO1xuICBpZiAoaWR4ID49IDApIHtcbiAgICBjbGFzc2VzLnNwbGljZShpZHgsIDEpO1xuICB9XG4gIGVsZW1lbnQuY2xhc3NOYW1lID0gY2xhc3Nlcy5qb2luKCcgJyk7XG59XG5cbmV4cG9ydHMuYWRkID0gZnVuY3Rpb24gKGVsZW1lbnQsIGNsYXNzTmFtZSkge1xuICBpZiAoZWxlbWVudC5jbGFzc0xpc3QpIHtcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgfSBlbHNlIHtcbiAgICBvbGRBZGQoZWxlbWVudCwgY2xhc3NOYW1lKTtcbiAgfVxufTtcblxuZXhwb3J0cy5yZW1vdmUgPSBmdW5jdGlvbiAoZWxlbWVudCwgY2xhc3NOYW1lKSB7XG4gIGlmIChlbGVtZW50LmNsYXNzTGlzdCkge1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICB9IGVsc2Uge1xuICAgIG9sZFJlbW92ZShlbGVtZW50LCBjbGFzc05hbWUpO1xuICB9XG59O1xuXG5leHBvcnRzLmxpc3QgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICBpZiAoZWxlbWVudC5jbGFzc0xpc3QpIHtcbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGVsZW1lbnQuY2xhc3NMaXN0KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZWxlbWVudC5jbGFzc05hbWUuc3BsaXQoJyAnKTtcbiAgfVxufTtcblxufSx7fV0sMzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBET00gPSB7fTtcblxuRE9NLmUgPSBmdW5jdGlvbiAodGFnTmFtZSwgY2xhc3NOYW1lKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWdOYW1lKTtcbiAgZWxlbWVudC5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG4gIHJldHVybiBlbGVtZW50O1xufTtcblxuRE9NLmFwcGVuZFRvID0gZnVuY3Rpb24gKGNoaWxkLCBwYXJlbnQpIHtcbiAgcGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgcmV0dXJuIGNoaWxkO1xufTtcblxuZnVuY3Rpb24gY3NzR2V0KGVsZW1lbnQsIHN0eWxlTmFtZSkge1xuICByZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudClbc3R5bGVOYW1lXTtcbn1cblxuZnVuY3Rpb24gY3NzU2V0KGVsZW1lbnQsIHN0eWxlTmFtZSwgc3R5bGVWYWx1ZSkge1xuICBpZiAodHlwZW9mIHN0eWxlVmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgc3R5bGVWYWx1ZSA9IHN0eWxlVmFsdWUudG9TdHJpbmcoKSArICdweCc7XG4gIH1cbiAgZWxlbWVudC5zdHlsZVtzdHlsZU5hbWVdID0gc3R5bGVWYWx1ZTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIGNzc011bHRpU2V0KGVsZW1lbnQsIG9iaikge1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgdmFyIHZhbCA9IG9ialtrZXldO1xuICAgIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgICAgdmFsID0gdmFsLnRvU3RyaW5nKCkgKyAncHgnO1xuICAgIH1cbiAgICBlbGVtZW50LnN0eWxlW2tleV0gPSB2YWw7XG4gIH1cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbkRPTS5jc3MgPSBmdW5jdGlvbiAoZWxlbWVudCwgc3R5bGVOYW1lT3JPYmplY3QsIHN0eWxlVmFsdWUpIHtcbiAgaWYgKHR5cGVvZiBzdHlsZU5hbWVPck9iamVjdCA9PT0gJ29iamVjdCcpIHtcbiAgICAvLyBtdWx0aXBsZSBzZXQgd2l0aCBvYmplY3RcbiAgICByZXR1cm4gY3NzTXVsdGlTZXQoZWxlbWVudCwgc3R5bGVOYW1lT3JPYmplY3QpO1xuICB9IGVsc2Uge1xuICAgIGlmICh0eXBlb2Ygc3R5bGVWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiBjc3NHZXQoZWxlbWVudCwgc3R5bGVOYW1lT3JPYmplY3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY3NzU2V0KGVsZW1lbnQsIHN0eWxlTmFtZU9yT2JqZWN0LCBzdHlsZVZhbHVlKTtcbiAgICB9XG4gIH1cbn07XG5cbkRPTS5tYXRjaGVzID0gZnVuY3Rpb24gKGVsZW1lbnQsIHF1ZXJ5KSB7XG4gIGlmICh0eXBlb2YgZWxlbWVudC5tYXRjaGVzICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBlbGVtZW50Lm1hdGNoZXMocXVlcnkpO1xuICB9IGVsc2Uge1xuICAgIGlmICh0eXBlb2YgZWxlbWVudC5tYXRjaGVzU2VsZWN0b3IgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gZWxlbWVudC5tYXRjaGVzU2VsZWN0b3IocXVlcnkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGVsZW1lbnQud2Via2l0TWF0Y2hlc1NlbGVjdG9yICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuIGVsZW1lbnQud2Via2l0TWF0Y2hlc1NlbGVjdG9yKHF1ZXJ5KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBlbGVtZW50Lm1vek1hdGNoZXNTZWxlY3RvciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiBlbGVtZW50Lm1vek1hdGNoZXNTZWxlY3RvcihxdWVyeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZWxlbWVudC5tc01hdGNoZXNTZWxlY3RvciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiBlbGVtZW50Lm1zTWF0Y2hlc1NlbGVjdG9yKHF1ZXJ5KTtcbiAgICB9XG4gIH1cbn07XG5cbkRPTS5yZW1vdmUgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICBpZiAodHlwZW9mIGVsZW1lbnQucmVtb3ZlICE9PSAndW5kZWZpbmVkJykge1xuICAgIGVsZW1lbnQucmVtb3ZlKCk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKGVsZW1lbnQucGFyZW50Tm9kZSkge1xuICAgICAgZWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xuICAgIH1cbiAgfVxufTtcblxuRE9NLnF1ZXJ5Q2hpbGRyZW4gPSBmdW5jdGlvbiAoZWxlbWVudCwgc2VsZWN0b3IpIHtcbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5maWx0ZXIuY2FsbChlbGVtZW50LmNoaWxkTm9kZXMsIGZ1bmN0aW9uIChjaGlsZCkge1xuICAgIHJldHVybiBET00ubWF0Y2hlcyhjaGlsZCwgc2VsZWN0b3IpO1xuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRE9NO1xuXG59LHt9XSw0OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxudmFyIEV2ZW50RWxlbWVudCA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gIHRoaXMuZXZlbnRzID0ge307XG59O1xuXG5FdmVudEVsZW1lbnQucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoZXZlbnROYW1lLCBoYW5kbGVyKSB7XG4gIGlmICh0eXBlb2YgdGhpcy5ldmVudHNbZXZlbnROYW1lXSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdID0gW107XG4gIH1cbiAgdGhpcy5ldmVudHNbZXZlbnROYW1lXS5wdXNoKGhhbmRsZXIpO1xuICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGhhbmRsZXIsIGZhbHNlKTtcbn07XG5cbkV2ZW50RWxlbWVudC5wcm90b3R5cGUudW5iaW5kID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgaGFuZGxlcikge1xuICB2YXIgaXNIYW5kbGVyUHJvdmlkZWQgPSAodHlwZW9mIGhhbmRsZXIgIT09ICd1bmRlZmluZWQnKTtcbiAgdGhpcy5ldmVudHNbZXZlbnROYW1lXSA9IHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0uZmlsdGVyKGZ1bmN0aW9uIChoZGxyKSB7XG4gICAgaWYgKGlzSGFuZGxlclByb3ZpZGVkICYmIGhkbHIgIT09IGhhbmRsZXIpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGhkbHIsIGZhbHNlKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sIHRoaXMpO1xufTtcblxuRXZlbnRFbGVtZW50LnByb3RvdHlwZS51bmJpbmRBbGwgPSBmdW5jdGlvbiAoKSB7XG4gIGZvciAodmFyIG5hbWUgaW4gdGhpcy5ldmVudHMpIHtcbiAgICB0aGlzLnVuYmluZChuYW1lKTtcbiAgfVxufTtcblxudmFyIEV2ZW50TWFuYWdlciA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5ldmVudEVsZW1lbnRzID0gW107XG59O1xuXG5FdmVudE1hbmFnZXIucHJvdG90eXBlLmV2ZW50RWxlbWVudCA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gIHZhciBlZSA9IHRoaXMuZXZlbnRFbGVtZW50cy5maWx0ZXIoZnVuY3Rpb24gKGV2ZW50RWxlbWVudCkge1xuICAgIHJldHVybiBldmVudEVsZW1lbnQuZWxlbWVudCA9PT0gZWxlbWVudDtcbiAgfSlbMF07XG4gIGlmICh0eXBlb2YgZWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgZWUgPSBuZXcgRXZlbnRFbGVtZW50KGVsZW1lbnQpO1xuICAgIHRoaXMuZXZlbnRFbGVtZW50cy5wdXNoKGVlKTtcbiAgfVxuICByZXR1cm4gZWU7XG59O1xuXG5FdmVudE1hbmFnZXIucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoZWxlbWVudCwgZXZlbnROYW1lLCBoYW5kbGVyKSB7XG4gIHRoaXMuZXZlbnRFbGVtZW50KGVsZW1lbnQpLmJpbmQoZXZlbnROYW1lLCBoYW5kbGVyKTtcbn07XG5cbkV2ZW50TWFuYWdlci5wcm90b3R5cGUudW5iaW5kID0gZnVuY3Rpb24gKGVsZW1lbnQsIGV2ZW50TmFtZSwgaGFuZGxlcikge1xuICB0aGlzLmV2ZW50RWxlbWVudChlbGVtZW50KS51bmJpbmQoZXZlbnROYW1lLCBoYW5kbGVyKTtcbn07XG5cbkV2ZW50TWFuYWdlci5wcm90b3R5cGUudW5iaW5kQWxsID0gZnVuY3Rpb24gKCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZXZlbnRFbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIHRoaXMuZXZlbnRFbGVtZW50c1tpXS51bmJpbmRBbGwoKTtcbiAgfVxufTtcblxuRXZlbnRNYW5hZ2VyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24gKGVsZW1lbnQsIGV2ZW50TmFtZSwgaGFuZGxlcikge1xuICB2YXIgZWUgPSB0aGlzLmV2ZW50RWxlbWVudChlbGVtZW50KTtcbiAgdmFyIG9uY2VIYW5kbGVyID0gZnVuY3Rpb24gKGUpIHtcbiAgICBlZS51bmJpbmQoZXZlbnROYW1lLCBvbmNlSGFuZGxlcik7XG4gICAgaGFuZGxlcihlKTtcbiAgfTtcbiAgZWUuYmluZChldmVudE5hbWUsIG9uY2VIYW5kbGVyKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRNYW5hZ2VyO1xuXG59LHt9XSw1OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBzNCgpIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcigoMSArIE1hdGgucmFuZG9tKCkpICogMHgxMDAwMClcbiAgICAgICAgICAgICAgIC50b1N0cmluZygxNilcbiAgICAgICAgICAgICAgIC5zdWJzdHJpbmcoMSk7XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gczQoKSArIHM0KCkgKyAnLScgKyBzNCgpICsgJy0nICsgczQoKSArICctJyArXG4gICAgICAgICAgIHM0KCkgKyAnLScgKyBzNCgpICsgczQoKSArIHM0KCk7XG4gIH07XG59KSgpO1xuXG59LHt9XSw2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxudmFyIGNscyA9IHJlcXVpcmUoJy4vY2xhc3MnKTtcbnZhciBkb20gPSByZXF1aXJlKCcuL2RvbScpO1xuXG52YXIgdG9JbnQgPSBleHBvcnRzLnRvSW50ID0gZnVuY3Rpb24gKHgpIHtcbiAgcmV0dXJuIHBhcnNlSW50KHgsIDEwKSB8fCAwO1xufTtcblxudmFyIGNsb25lID0gZXhwb3J0cy5jbG9uZSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgaWYgKG9iaiA9PT0gbnVsbCkge1xuICAgIHJldHVybiBudWxsO1xuICB9IGVsc2UgaWYgKG9iai5jb25zdHJ1Y3RvciA9PT0gQXJyYXkpIHtcbiAgICByZXR1cm4gb2JqLm1hcChjbG9uZSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcpIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgcmVzdWx0W2tleV0gPSBjbG9uZShvYmpba2V5XSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG9iajtcbiAgfVxufTtcblxuZXhwb3J0cy5leHRlbmQgPSBmdW5jdGlvbiAob3JpZ2luYWwsIHNvdXJjZSkge1xuICB2YXIgcmVzdWx0ID0gY2xvbmUob3JpZ2luYWwpO1xuICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgcmVzdWx0W2tleV0gPSBjbG9uZShzb3VyY2Vba2V5XSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmV4cG9ydHMuaXNFZGl0YWJsZSA9IGZ1bmN0aW9uIChlbCkge1xuICByZXR1cm4gZG9tLm1hdGNoZXMoZWwsIFwiaW5wdXQsW2NvbnRlbnRlZGl0YWJsZV1cIikgfHxcbiAgICAgICAgIGRvbS5tYXRjaGVzKGVsLCBcInNlbGVjdCxbY29udGVudGVkaXRhYmxlXVwiKSB8fFxuICAgICAgICAgZG9tLm1hdGNoZXMoZWwsIFwidGV4dGFyZWEsW2NvbnRlbnRlZGl0YWJsZV1cIikgfHxcbiAgICAgICAgIGRvbS5tYXRjaGVzKGVsLCBcImJ1dHRvbixbY29udGVudGVkaXRhYmxlXVwiKTtcbn07XG5cbmV4cG9ydHMucmVtb3ZlUHNDbGFzc2VzID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgdmFyIGNsc0xpc3QgPSBjbHMubGlzdChlbGVtZW50KTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjbHNMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGNsYXNzTmFtZSA9IGNsc0xpc3RbaV07XG4gICAgaWYgKGNsYXNzTmFtZS5pbmRleE9mKCdwcy0nKSA9PT0gMCkge1xuICAgICAgY2xzLnJlbW92ZShlbGVtZW50LCBjbGFzc05hbWUpO1xuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0cy5vdXRlcldpZHRoID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgcmV0dXJuIHRvSW50KGRvbS5jc3MoZWxlbWVudCwgJ3dpZHRoJykpICtcbiAgICAgICAgIHRvSW50KGRvbS5jc3MoZWxlbWVudCwgJ3BhZGRpbmdMZWZ0JykpICtcbiAgICAgICAgIHRvSW50KGRvbS5jc3MoZWxlbWVudCwgJ3BhZGRpbmdSaWdodCcpKSArXG4gICAgICAgICB0b0ludChkb20uY3NzKGVsZW1lbnQsICdib3JkZXJMZWZ0V2lkdGgnKSkgK1xuICAgICAgICAgdG9JbnQoZG9tLmNzcyhlbGVtZW50LCAnYm9yZGVyUmlnaHRXaWR0aCcpKTtcbn07XG5cbmV4cG9ydHMuc3RhcnRTY3JvbGxpbmcgPSBmdW5jdGlvbiAoZWxlbWVudCwgYXhpcykge1xuICBjbHMuYWRkKGVsZW1lbnQsICdwcy1pbi1zY3JvbGxpbmcnKTtcbiAgaWYgKHR5cGVvZiBheGlzICE9PSAndW5kZWZpbmVkJykge1xuICAgIGNscy5hZGQoZWxlbWVudCwgJ3BzLScgKyBheGlzKTtcbiAgfSBlbHNlIHtcbiAgICBjbHMuYWRkKGVsZW1lbnQsICdwcy14Jyk7XG4gICAgY2xzLmFkZChlbGVtZW50LCAncHMteScpO1xuICB9XG59O1xuXG5leHBvcnRzLnN0b3BTY3JvbGxpbmcgPSBmdW5jdGlvbiAoZWxlbWVudCwgYXhpcykge1xuICBjbHMucmVtb3ZlKGVsZW1lbnQsICdwcy1pbi1zY3JvbGxpbmcnKTtcbiAgaWYgKHR5cGVvZiBheGlzICE9PSAndW5kZWZpbmVkJykge1xuICAgIGNscy5yZW1vdmUoZWxlbWVudCwgJ3BzLScgKyBheGlzKTtcbiAgfSBlbHNlIHtcbiAgICBjbHMucmVtb3ZlKGVsZW1lbnQsICdwcy14Jyk7XG4gICAgY2xzLnJlbW92ZShlbGVtZW50LCAncHMteScpO1xuICB9XG59O1xuXG5leHBvcnRzLmVudiA9IHtcbiAgaXNXZWJLaXQ6ICdXZWJraXRBcHBlYXJhbmNlJyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUsXG4gIHN1cHBvcnRzVG91Y2g6ICgoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KSB8fCB3aW5kb3cuRG9jdW1lbnRUb3VjaCAmJiBkb2N1bWVudCBpbnN0YW5jZW9mIHdpbmRvdy5Eb2N1bWVudFRvdWNoKSxcbiAgc3VwcG9ydHNJZVBvaW50ZXI6IHdpbmRvdy5uYXZpZ2F0b3IubXNNYXhUb3VjaFBvaW50cyAhPT0gbnVsbFxufTtcblxufSx7XCIuL2NsYXNzXCI6MixcIi4vZG9tXCI6M31dLDc6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZGVzdHJveSA9IHJlcXVpcmUoJy4vcGx1Z2luL2Rlc3Ryb3knKTtcbnZhciBpbml0aWFsaXplID0gcmVxdWlyZSgnLi9wbHVnaW4vaW5pdGlhbGl6ZScpO1xudmFyIHVwZGF0ZSA9IHJlcXVpcmUoJy4vcGx1Z2luL3VwZGF0ZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaW5pdGlhbGl6ZTogaW5pdGlhbGl6ZSxcbiAgdXBkYXRlOiB1cGRhdGUsXG4gIGRlc3Ryb3k6IGRlc3Ryb3lcbn07XG5cbn0se1wiLi9wbHVnaW4vZGVzdHJveVwiOjksXCIuL3BsdWdpbi9pbml0aWFsaXplXCI6MTcsXCIuL3BsdWdpbi91cGRhdGVcIjoyMX1dLDg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaGFuZGxlcnM6IFsnY2xpY2stcmFpbCcsICdkcmFnLXNjcm9sbGJhcicsICdrZXlib2FyZCcsICd3aGVlbCcsICd0b3VjaCddLFxuICBtYXhTY3JvbGxiYXJMZW5ndGg6IG51bGwsXG4gIG1pblNjcm9sbGJhckxlbmd0aDogbnVsbCxcbiAgc2Nyb2xsWE1hcmdpbk9mZnNldDogMCxcbiAgc2Nyb2xsWU1hcmdpbk9mZnNldDogMCxcbiAgc3RvcFByb3BhZ2F0aW9uT25DbGljazogdHJ1ZSxcbiAgc3VwcHJlc3NTY3JvbGxYOiBmYWxzZSxcbiAgc3VwcHJlc3NTY3JvbGxZOiBmYWxzZSxcbiAgc3dpcGVQcm9wYWdhdGlvbjogdHJ1ZSxcbiAgdXNlQm90aFdoZWVsQXhlczogZmFsc2UsXG4gIHdoZWVsUHJvcGFnYXRpb246IGZhbHNlLFxuICB3aGVlbFNwZWVkOiAxLFxuICB0aGVtZTogJ2RlZmF1bHQnXG59O1xuXG59LHt9XSw5OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxudmFyIF8gPSByZXF1aXJlKCcuLi9saWIvaGVscGVyJyk7XG52YXIgZG9tID0gcmVxdWlyZSgnLi4vbGliL2RvbScpO1xudmFyIGluc3RhbmNlcyA9IHJlcXVpcmUoJy4vaW5zdGFuY2VzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgdmFyIGkgPSBpbnN0YW5jZXMuZ2V0KGVsZW1lbnQpO1xuXG4gIGlmICghaSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGkuZXZlbnQudW5iaW5kQWxsKCk7XG4gIGRvbS5yZW1vdmUoaS5zY3JvbGxiYXJYKTtcbiAgZG9tLnJlbW92ZShpLnNjcm9sbGJhclkpO1xuICBkb20ucmVtb3ZlKGkuc2Nyb2xsYmFyWFJhaWwpO1xuICBkb20ucmVtb3ZlKGkuc2Nyb2xsYmFyWVJhaWwpO1xuICBfLnJlbW92ZVBzQ2xhc3NlcyhlbGVtZW50KTtcblxuICBpbnN0YW5jZXMucmVtb3ZlKGVsZW1lbnQpO1xufTtcblxufSx7XCIuLi9saWIvZG9tXCI6MyxcIi4uL2xpYi9oZWxwZXJcIjo2LFwiLi9pbnN0YW5jZXNcIjoxOH1dLDEwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxudmFyIF8gPSByZXF1aXJlKCcuLi8uLi9saWIvaGVscGVyJyk7XG52YXIgaW5zdGFuY2VzID0gcmVxdWlyZSgnLi4vaW5zdGFuY2VzJyk7XG52YXIgdXBkYXRlR2VvbWV0cnkgPSByZXF1aXJlKCcuLi91cGRhdGUtZ2VvbWV0cnknKTtcbnZhciB1cGRhdGVTY3JvbGwgPSByZXF1aXJlKCcuLi91cGRhdGUtc2Nyb2xsJyk7XG5cbmZ1bmN0aW9uIGJpbmRDbGlja1JhaWxIYW5kbGVyKGVsZW1lbnQsIGkpIHtcbiAgZnVuY3Rpb24gcGFnZU9mZnNldChlbCkge1xuICAgIHJldHVybiBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgfVxuICB2YXIgc3RvcFByb3BhZ2F0aW9uID0gZnVuY3Rpb24gKGUpIHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgfTtcblxuICBpZiAoaS5zZXR0aW5ncy5zdG9wUHJvcGFnYXRpb25PbkNsaWNrKSB7XG4gICAgaS5ldmVudC5iaW5kKGkuc2Nyb2xsYmFyWSwgJ2NsaWNrJywgc3RvcFByb3BhZ2F0aW9uKTtcbiAgfVxuICBpLmV2ZW50LmJpbmQoaS5zY3JvbGxiYXJZUmFpbCwgJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgaGFsZk9mU2Nyb2xsYmFyTGVuZ3RoID0gXy50b0ludChpLnNjcm9sbGJhcllIZWlnaHQgLyAyKTtcbiAgICB2YXIgcG9zaXRpb25Ub3AgPSBpLnJhaWxZUmF0aW8gKiAoZS5wYWdlWSAtIHdpbmRvdy5wYWdlWU9mZnNldCAtIHBhZ2VPZmZzZXQoaS5zY3JvbGxiYXJZUmFpbCkudG9wIC0gaGFsZk9mU2Nyb2xsYmFyTGVuZ3RoKTtcbiAgICB2YXIgbWF4UG9zaXRpb25Ub3AgPSBpLnJhaWxZUmF0aW8gKiAoaS5yYWlsWUhlaWdodCAtIGkuc2Nyb2xsYmFyWUhlaWdodCk7XG4gICAgdmFyIHBvc2l0aW9uUmF0aW8gPSBwb3NpdGlvblRvcCAvIG1heFBvc2l0aW9uVG9wO1xuXG4gICAgaWYgKHBvc2l0aW9uUmF0aW8gPCAwKSB7XG4gICAgICBwb3NpdGlvblJhdGlvID0gMDtcbiAgICB9IGVsc2UgaWYgKHBvc2l0aW9uUmF0aW8gPiAxKSB7XG4gICAgICBwb3NpdGlvblJhdGlvID0gMTtcbiAgICB9XG5cbiAgICB1cGRhdGVTY3JvbGwoZWxlbWVudCwgJ3RvcCcsIChpLmNvbnRlbnRIZWlnaHQgLSBpLmNvbnRhaW5lckhlaWdodCkgKiBwb3NpdGlvblJhdGlvKTtcbiAgICB1cGRhdGVHZW9tZXRyeShlbGVtZW50KTtcblxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIH0pO1xuXG4gIGlmIChpLnNldHRpbmdzLnN0b3BQcm9wYWdhdGlvbk9uQ2xpY2spIHtcbiAgICBpLmV2ZW50LmJpbmQoaS5zY3JvbGxiYXJYLCAnY2xpY2snLCBzdG9wUHJvcGFnYXRpb24pO1xuICB9XG4gIGkuZXZlbnQuYmluZChpLnNjcm9sbGJhclhSYWlsLCAnY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBoYWxmT2ZTY3JvbGxiYXJMZW5ndGggPSBfLnRvSW50KGkuc2Nyb2xsYmFyWFdpZHRoIC8gMik7XG4gICAgdmFyIHBvc2l0aW9uTGVmdCA9IGkucmFpbFhSYXRpbyAqIChlLnBhZ2VYIC0gd2luZG93LnBhZ2VYT2Zmc2V0IC0gcGFnZU9mZnNldChpLnNjcm9sbGJhclhSYWlsKS5sZWZ0IC0gaGFsZk9mU2Nyb2xsYmFyTGVuZ3RoKTtcbiAgICB2YXIgbWF4UG9zaXRpb25MZWZ0ID0gaS5yYWlsWFJhdGlvICogKGkucmFpbFhXaWR0aCAtIGkuc2Nyb2xsYmFyWFdpZHRoKTtcbiAgICB2YXIgcG9zaXRpb25SYXRpbyA9IHBvc2l0aW9uTGVmdCAvIG1heFBvc2l0aW9uTGVmdDtcblxuICAgIGlmIChwb3NpdGlvblJhdGlvIDwgMCkge1xuICAgICAgcG9zaXRpb25SYXRpbyA9IDA7XG4gICAgfSBlbHNlIGlmIChwb3NpdGlvblJhdGlvID4gMSkge1xuICAgICAgcG9zaXRpb25SYXRpbyA9IDE7XG4gICAgfVxuXG4gICAgdXBkYXRlU2Nyb2xsKGVsZW1lbnQsICdsZWZ0JywgKChpLmNvbnRlbnRXaWR0aCAtIGkuY29udGFpbmVyV2lkdGgpICogcG9zaXRpb25SYXRpbykgLSBpLm5lZ2F0aXZlU2Nyb2xsQWRqdXN0bWVudCk7XG4gICAgdXBkYXRlR2VvbWV0cnkoZWxlbWVudCk7XG5cbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICB2YXIgaSA9IGluc3RhbmNlcy5nZXQoZWxlbWVudCk7XG4gIGJpbmRDbGlja1JhaWxIYW5kbGVyKGVsZW1lbnQsIGkpO1xufTtcblxufSx7XCIuLi8uLi9saWIvaGVscGVyXCI6NixcIi4uL2luc3RhbmNlc1wiOjE4LFwiLi4vdXBkYXRlLWdlb21ldHJ5XCI6MTksXCIuLi91cGRhdGUtc2Nyb2xsXCI6MjB9XSwxMTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBfID0gcmVxdWlyZSgnLi4vLi4vbGliL2hlbHBlcicpO1xudmFyIGRvbSA9IHJlcXVpcmUoJy4uLy4uL2xpYi9kb20nKTtcbnZhciBpbnN0YW5jZXMgPSByZXF1aXJlKCcuLi9pbnN0YW5jZXMnKTtcbnZhciB1cGRhdGVHZW9tZXRyeSA9IHJlcXVpcmUoJy4uL3VwZGF0ZS1nZW9tZXRyeScpO1xudmFyIHVwZGF0ZVNjcm9sbCA9IHJlcXVpcmUoJy4uL3VwZGF0ZS1zY3JvbGwnKTtcblxuZnVuY3Rpb24gYmluZE1vdXNlU2Nyb2xsWEhhbmRsZXIoZWxlbWVudCwgaSkge1xuICB2YXIgY3VycmVudExlZnQgPSBudWxsO1xuICB2YXIgY3VycmVudFBhZ2VYID0gbnVsbDtcblxuICBmdW5jdGlvbiB1cGRhdGVTY3JvbGxMZWZ0KGRlbHRhWCkge1xuICAgIHZhciBuZXdMZWZ0ID0gY3VycmVudExlZnQgKyAoZGVsdGFYICogaS5yYWlsWFJhdGlvKTtcbiAgICB2YXIgbWF4TGVmdCA9IE1hdGgubWF4KDAsIGkuc2Nyb2xsYmFyWFJhaWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCkgKyAoaS5yYWlsWFJhdGlvICogKGkucmFpbFhXaWR0aCAtIGkuc2Nyb2xsYmFyWFdpZHRoKSk7XG5cbiAgICBpZiAobmV3TGVmdCA8IDApIHtcbiAgICAgIGkuc2Nyb2xsYmFyWExlZnQgPSAwO1xuICAgIH0gZWxzZSBpZiAobmV3TGVmdCA+IG1heExlZnQpIHtcbiAgICAgIGkuc2Nyb2xsYmFyWExlZnQgPSBtYXhMZWZ0O1xuICAgIH0gZWxzZSB7XG4gICAgICBpLnNjcm9sbGJhclhMZWZ0ID0gbmV3TGVmdDtcbiAgICB9XG5cbiAgICB2YXIgc2Nyb2xsTGVmdCA9IF8udG9JbnQoaS5zY3JvbGxiYXJYTGVmdCAqIChpLmNvbnRlbnRXaWR0aCAtIGkuY29udGFpbmVyV2lkdGgpIC8gKGkuY29udGFpbmVyV2lkdGggLSAoaS5yYWlsWFJhdGlvICogaS5zY3JvbGxiYXJYV2lkdGgpKSkgLSBpLm5lZ2F0aXZlU2Nyb2xsQWRqdXN0bWVudDtcbiAgICB1cGRhdGVTY3JvbGwoZWxlbWVudCwgJ2xlZnQnLCBzY3JvbGxMZWZ0KTtcbiAgfVxuXG4gIHZhciBtb3VzZU1vdmVIYW5kbGVyID0gZnVuY3Rpb24gKGUpIHtcbiAgICB1cGRhdGVTY3JvbGxMZWZ0KGUucGFnZVggLSBjdXJyZW50UGFnZVgpO1xuICAgIHVwZGF0ZUdlb21ldHJ5KGVsZW1lbnQpO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9O1xuXG4gIHZhciBtb3VzZVVwSGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICBfLnN0b3BTY3JvbGxpbmcoZWxlbWVudCwgJ3gnKTtcbiAgICBpLmV2ZW50LnVuYmluZChpLm93bmVyRG9jdW1lbnQsICdtb3VzZW1vdmUnLCBtb3VzZU1vdmVIYW5kbGVyKTtcbiAgfTtcblxuICBpLmV2ZW50LmJpbmQoaS5zY3JvbGxiYXJYLCAnbW91c2Vkb3duJywgZnVuY3Rpb24gKGUpIHtcbiAgICBjdXJyZW50UGFnZVggPSBlLnBhZ2VYO1xuICAgIGN1cnJlbnRMZWZ0ID0gXy50b0ludChkb20uY3NzKGkuc2Nyb2xsYmFyWCwgJ2xlZnQnKSkgKiBpLnJhaWxYUmF0aW87XG4gICAgXy5zdGFydFNjcm9sbGluZyhlbGVtZW50LCAneCcpO1xuXG4gICAgaS5ldmVudC5iaW5kKGkub3duZXJEb2N1bWVudCwgJ21vdXNlbW92ZScsIG1vdXNlTW92ZUhhbmRsZXIpO1xuICAgIGkuZXZlbnQub25jZShpLm93bmVyRG9jdW1lbnQsICdtb3VzZXVwJywgbW91c2VVcEhhbmRsZXIpO1xuXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBiaW5kTW91c2VTY3JvbGxZSGFuZGxlcihlbGVtZW50LCBpKSB7XG4gIHZhciBjdXJyZW50VG9wID0gbnVsbDtcbiAgdmFyIGN1cnJlbnRQYWdlWSA9IG51bGw7XG5cbiAgZnVuY3Rpb24gdXBkYXRlU2Nyb2xsVG9wKGRlbHRhWSkge1xuICAgIHZhciBuZXdUb3AgPSBjdXJyZW50VG9wICsgKGRlbHRhWSAqIGkucmFpbFlSYXRpbyk7XG4gICAgdmFyIG1heFRvcCA9IE1hdGgubWF4KDAsIGkuc2Nyb2xsYmFyWVJhaWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wKSArIChpLnJhaWxZUmF0aW8gKiAoaS5yYWlsWUhlaWdodCAtIGkuc2Nyb2xsYmFyWUhlaWdodCkpO1xuXG4gICAgaWYgKG5ld1RvcCA8IDApIHtcbiAgICAgIGkuc2Nyb2xsYmFyWVRvcCA9IDA7XG4gICAgfSBlbHNlIGlmIChuZXdUb3AgPiBtYXhUb3ApIHtcbiAgICAgIGkuc2Nyb2xsYmFyWVRvcCA9IG1heFRvcDtcbiAgICB9IGVsc2Uge1xuICAgICAgaS5zY3JvbGxiYXJZVG9wID0gbmV3VG9wO1xuICAgIH1cblxuICAgIHZhciBzY3JvbGxUb3AgPSBfLnRvSW50KGkuc2Nyb2xsYmFyWVRvcCAqIChpLmNvbnRlbnRIZWlnaHQgLSBpLmNvbnRhaW5lckhlaWdodCkgLyAoaS5jb250YWluZXJIZWlnaHQgLSAoaS5yYWlsWVJhdGlvICogaS5zY3JvbGxiYXJZSGVpZ2h0KSkpO1xuICAgIHVwZGF0ZVNjcm9sbChlbGVtZW50LCAndG9wJywgc2Nyb2xsVG9wKTtcbiAgfVxuXG4gIHZhciBtb3VzZU1vdmVIYW5kbGVyID0gZnVuY3Rpb24gKGUpIHtcbiAgICB1cGRhdGVTY3JvbGxUb3AoZS5wYWdlWSAtIGN1cnJlbnRQYWdlWSk7XG4gICAgdXBkYXRlR2VvbWV0cnkoZWxlbWVudCk7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIH07XG5cbiAgdmFyIG1vdXNlVXBIYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICAgIF8uc3RvcFNjcm9sbGluZyhlbGVtZW50LCAneScpO1xuICAgIGkuZXZlbnQudW5iaW5kKGkub3duZXJEb2N1bWVudCwgJ21vdXNlbW92ZScsIG1vdXNlTW92ZUhhbmRsZXIpO1xuICB9O1xuXG4gIGkuZXZlbnQuYmluZChpLnNjcm9sbGJhclksICdtb3VzZWRvd24nLCBmdW5jdGlvbiAoZSkge1xuICAgIGN1cnJlbnRQYWdlWSA9IGUucGFnZVk7XG4gICAgY3VycmVudFRvcCA9IF8udG9JbnQoZG9tLmNzcyhpLnNjcm9sbGJhclksICd0b3AnKSkgKiBpLnJhaWxZUmF0aW87XG4gICAgXy5zdGFydFNjcm9sbGluZyhlbGVtZW50LCAneScpO1xuXG4gICAgaS5ldmVudC5iaW5kKGkub3duZXJEb2N1bWVudCwgJ21vdXNlbW92ZScsIG1vdXNlTW92ZUhhbmRsZXIpO1xuICAgIGkuZXZlbnQub25jZShpLm93bmVyRG9jdW1lbnQsICdtb3VzZXVwJywgbW91c2VVcEhhbmRsZXIpO1xuXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gIHZhciBpID0gaW5zdGFuY2VzLmdldChlbGVtZW50KTtcbiAgYmluZE1vdXNlU2Nyb2xsWEhhbmRsZXIoZWxlbWVudCwgaSk7XG4gIGJpbmRNb3VzZVNjcm9sbFlIYW5kbGVyKGVsZW1lbnQsIGkpO1xufTtcblxufSx7XCIuLi8uLi9saWIvZG9tXCI6MyxcIi4uLy4uL2xpYi9oZWxwZXJcIjo2LFwiLi4vaW5zdGFuY2VzXCI6MTgsXCIuLi91cGRhdGUtZ2VvbWV0cnlcIjoxOSxcIi4uL3VwZGF0ZS1zY3JvbGxcIjoyMH1dLDEyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxudmFyIF8gPSByZXF1aXJlKCcuLi8uLi9saWIvaGVscGVyJyk7XG52YXIgZG9tID0gcmVxdWlyZSgnLi4vLi4vbGliL2RvbScpO1xudmFyIGluc3RhbmNlcyA9IHJlcXVpcmUoJy4uL2luc3RhbmNlcycpO1xudmFyIHVwZGF0ZUdlb21ldHJ5ID0gcmVxdWlyZSgnLi4vdXBkYXRlLWdlb21ldHJ5Jyk7XG52YXIgdXBkYXRlU2Nyb2xsID0gcmVxdWlyZSgnLi4vdXBkYXRlLXNjcm9sbCcpO1xuXG5mdW5jdGlvbiBiaW5kS2V5Ym9hcmRIYW5kbGVyKGVsZW1lbnQsIGkpIHtcbiAgdmFyIGhvdmVyZWQgPSBmYWxzZTtcbiAgaS5ldmVudC5iaW5kKGVsZW1lbnQsICdtb3VzZWVudGVyJywgZnVuY3Rpb24gKCkge1xuICAgIGhvdmVyZWQgPSB0cnVlO1xuICB9KTtcbiAgaS5ldmVudC5iaW5kKGVsZW1lbnQsICdtb3VzZWxlYXZlJywgZnVuY3Rpb24gKCkge1xuICAgIGhvdmVyZWQgPSBmYWxzZTtcbiAgfSk7XG5cbiAgdmFyIHNob3VsZFByZXZlbnQgPSBmYWxzZTtcbiAgZnVuY3Rpb24gc2hvdWxkUHJldmVudERlZmF1bHQoZGVsdGFYLCBkZWx0YVkpIHtcbiAgICB2YXIgc2Nyb2xsVG9wID0gZWxlbWVudC5zY3JvbGxUb3A7XG4gICAgaWYgKGRlbHRhWCA9PT0gMCkge1xuICAgICAgaWYgKCFpLnNjcm9sbGJhcllBY3RpdmUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKChzY3JvbGxUb3AgPT09IDAgJiYgZGVsdGFZID4gMCkgfHwgKHNjcm9sbFRvcCA+PSBpLmNvbnRlbnRIZWlnaHQgLSBpLmNvbnRhaW5lckhlaWdodCAmJiBkZWx0YVkgPCAwKSkge1xuICAgICAgICByZXR1cm4gIWkuc2V0dGluZ3Mud2hlZWxQcm9wYWdhdGlvbjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgc2Nyb2xsTGVmdCA9IGVsZW1lbnQuc2Nyb2xsTGVmdDtcbiAgICBpZiAoZGVsdGFZID09PSAwKSB7XG4gICAgICBpZiAoIWkuc2Nyb2xsYmFyWEFjdGl2ZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoKHNjcm9sbExlZnQgPT09IDAgJiYgZGVsdGFYIDwgMCkgfHwgKHNjcm9sbExlZnQgPj0gaS5jb250ZW50V2lkdGggLSBpLmNvbnRhaW5lcldpZHRoICYmIGRlbHRhWCA+IDApKSB7XG4gICAgICAgIHJldHVybiAhaS5zZXR0aW5ncy53aGVlbFByb3BhZ2F0aW9uO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGkuZXZlbnQuYmluZChpLm93bmVyRG9jdW1lbnQsICdrZXlkb3duJywgZnVuY3Rpb24gKGUpIHtcbiAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQgJiYgZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBmb2N1c2VkID0gZG9tLm1hdGNoZXMoaS5zY3JvbGxiYXJYLCAnOmZvY3VzJykgfHxcbiAgICAgICAgICAgICAgICAgIGRvbS5tYXRjaGVzKGkuc2Nyb2xsYmFyWSwgJzpmb2N1cycpO1xuXG4gICAgaWYgKCFob3ZlcmVkICYmICFmb2N1c2VkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGFjdGl2ZUVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID8gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA6IGkub3duZXJEb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgIGlmIChhY3RpdmVFbGVtZW50KSB7XG4gICAgICBpZiAoYWN0aXZlRWxlbWVudC50YWdOYW1lID09PSAnSUZSQU1FJykge1xuICAgICAgICBhY3RpdmVFbGVtZW50ID0gYWN0aXZlRWxlbWVudC5jb250ZW50RG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGdvIGRlZXBlciBpZiBlbGVtZW50IGlzIGEgd2ViY29tcG9uZW50XG4gICAgICAgIHdoaWxlIChhY3RpdmVFbGVtZW50LnNoYWRvd1Jvb3QpIHtcbiAgICAgICAgICBhY3RpdmVFbGVtZW50ID0gYWN0aXZlRWxlbWVudC5zaGFkb3dSb290LmFjdGl2ZUVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChfLmlzRWRpdGFibGUoYWN0aXZlRWxlbWVudCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBkZWx0YVggPSAwO1xuICAgIHZhciBkZWx0YVkgPSAwO1xuXG4gICAgc3dpdGNoIChlLndoaWNoKSB7XG4gICAgY2FzZSAzNzogLy8gbGVmdFxuICAgICAgZGVsdGFYID0gLTMwO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAzODogLy8gdXBcbiAgICAgIGRlbHRhWSA9IDMwO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAzOTogLy8gcmlnaHRcbiAgICAgIGRlbHRhWCA9IDMwO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSA0MDogLy8gZG93blxuICAgICAgZGVsdGFZID0gLTMwO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAzMzogLy8gcGFnZSB1cFxuICAgICAgZGVsdGFZID0gOTA7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDMyOiAvLyBzcGFjZSBiYXJcbiAgICAgIGlmIChlLnNoaWZ0S2V5KSB7XG4gICAgICAgIGRlbHRhWSA9IDkwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVsdGFZID0gLTkwO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAzNDogLy8gcGFnZSBkb3duXG4gICAgICBkZWx0YVkgPSAtOTA7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDM1OiAvLyBlbmRcbiAgICAgIGlmIChlLmN0cmxLZXkpIHtcbiAgICAgICAgZGVsdGFZID0gLWkuY29udGVudEhlaWdodDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlbHRhWSA9IC1pLmNvbnRhaW5lckhlaWdodDtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMzY6IC8vIGhvbWVcbiAgICAgIGlmIChlLmN0cmxLZXkpIHtcbiAgICAgICAgZGVsdGFZID0gZWxlbWVudC5zY3JvbGxUb3A7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZWx0YVkgPSBpLmNvbnRhaW5lckhlaWdodDtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdXBkYXRlU2Nyb2xsKGVsZW1lbnQsICd0b3AnLCBlbGVtZW50LnNjcm9sbFRvcCAtIGRlbHRhWSk7XG4gICAgdXBkYXRlU2Nyb2xsKGVsZW1lbnQsICdsZWZ0JywgZWxlbWVudC5zY3JvbGxMZWZ0ICsgZGVsdGFYKTtcbiAgICB1cGRhdGVHZW9tZXRyeShlbGVtZW50KTtcblxuICAgIHNob3VsZFByZXZlbnQgPSBzaG91bGRQcmV2ZW50RGVmYXVsdChkZWx0YVgsIGRlbHRhWSk7XG4gICAgaWYgKHNob3VsZFByZXZlbnQpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gIHZhciBpID0gaW5zdGFuY2VzLmdldChlbGVtZW50KTtcbiAgYmluZEtleWJvYXJkSGFuZGxlcihlbGVtZW50LCBpKTtcbn07XG5cbn0se1wiLi4vLi4vbGliL2RvbVwiOjMsXCIuLi8uLi9saWIvaGVscGVyXCI6NixcIi4uL2luc3RhbmNlc1wiOjE4LFwiLi4vdXBkYXRlLWdlb21ldHJ5XCI6MTksXCIuLi91cGRhdGUtc2Nyb2xsXCI6MjB9XSwxMzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBpbnN0YW5jZXMgPSByZXF1aXJlKCcuLi9pbnN0YW5jZXMnKTtcbnZhciB1cGRhdGVHZW9tZXRyeSA9IHJlcXVpcmUoJy4uL3VwZGF0ZS1nZW9tZXRyeScpO1xudmFyIHVwZGF0ZVNjcm9sbCA9IHJlcXVpcmUoJy4uL3VwZGF0ZS1zY3JvbGwnKTtcblxuZnVuY3Rpb24gYmluZE1vdXNlV2hlZWxIYW5kbGVyKGVsZW1lbnQsIGkpIHtcbiAgdmFyIHNob3VsZFByZXZlbnQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBzaG91bGRQcmV2ZW50RGVmYXVsdChkZWx0YVgsIGRlbHRhWSkge1xuICAgIHZhciBzY3JvbGxUb3AgPSBlbGVtZW50LnNjcm9sbFRvcDtcbiAgICBpZiAoZGVsdGFYID09PSAwKSB7XG4gICAgICBpZiAoIWkuc2Nyb2xsYmFyWUFjdGl2ZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoKHNjcm9sbFRvcCA9PT0gMCAmJiBkZWx0YVkgPiAwKSB8fCAoc2Nyb2xsVG9wID49IGkuY29udGVudEhlaWdodCAtIGkuY29udGFpbmVySGVpZ2h0ICYmIGRlbHRhWSA8IDApKSB7XG4gICAgICAgIHJldHVybiAhaS5zZXR0aW5ncy53aGVlbFByb3BhZ2F0aW9uO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBzY3JvbGxMZWZ0ID0gZWxlbWVudC5zY3JvbGxMZWZ0O1xuICAgIGlmIChkZWx0YVkgPT09IDApIHtcbiAgICAgIGlmICghaS5zY3JvbGxiYXJYQWN0aXZlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICgoc2Nyb2xsTGVmdCA9PT0gMCAmJiBkZWx0YVggPCAwKSB8fCAoc2Nyb2xsTGVmdCA+PSBpLmNvbnRlbnRXaWR0aCAtIGkuY29udGFpbmVyV2lkdGggJiYgZGVsdGFYID4gMCkpIHtcbiAgICAgICAgcmV0dXJuICFpLnNldHRpbmdzLndoZWVsUHJvcGFnYXRpb247XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0RGVsdGFGcm9tRXZlbnQoZSkge1xuICAgIHZhciBkZWx0YVggPSBlLmRlbHRhWDtcbiAgICB2YXIgZGVsdGFZID0gLTEgKiBlLmRlbHRhWTtcblxuICAgIGlmICh0eXBlb2YgZGVsdGFYID09PSBcInVuZGVmaW5lZFwiIHx8IHR5cGVvZiBkZWx0YVkgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIC8vIE9TIFggU2FmYXJpXG4gICAgICBkZWx0YVggPSAtMSAqIGUud2hlZWxEZWx0YVggLyA2O1xuICAgICAgZGVsdGFZID0gZS53aGVlbERlbHRhWSAvIDY7XG4gICAgfVxuXG4gICAgaWYgKGUuZGVsdGFNb2RlICYmIGUuZGVsdGFNb2RlID09PSAxKSB7XG4gICAgICAvLyBGaXJlZm94IGluIGRlbHRhTW9kZSAxOiBMaW5lIHNjcm9sbGluZ1xuICAgICAgZGVsdGFYICo9IDEwO1xuICAgICAgZGVsdGFZICo9IDEwO1xuICAgIH1cblxuICAgIGlmIChkZWx0YVggIT09IGRlbHRhWCAmJiBkZWx0YVkgIT09IGRlbHRhWS8qIE5hTiBjaGVja3MgKi8pIHtcbiAgICAgIC8vIElFIGluIHNvbWUgbW91c2UgZHJpdmVyc1xuICAgICAgZGVsdGFYID0gMDtcbiAgICAgIGRlbHRhWSA9IGUud2hlZWxEZWx0YTtcbiAgICB9XG5cbiAgICByZXR1cm4gW2RlbHRhWCwgZGVsdGFZXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3VsZEJlQ29uc3VtZWRCeUNoaWxkKGRlbHRhWCwgZGVsdGFZKSB7XG4gICAgdmFyIGNoaWxkID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCd0ZXh0YXJlYTpob3ZlciwgLnBzLWNoaWxkOmhvdmVyJyk7XG4gICAgaWYgKGNoaWxkKSB7XG4gICAgICBpZiAoY2hpbGQudGFnTmFtZSAhPT0gJ1RFWFRBUkVBJyAmJiAhd2luZG93LmdldENvbXB1dGVkU3R5bGUoY2hpbGQpLm92ZXJmbG93Lm1hdGNoKC8oc2Nyb2xsfGF1dG8pLykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICB2YXIgbWF4U2Nyb2xsVG9wID0gY2hpbGQuc2Nyb2xsSGVpZ2h0IC0gY2hpbGQuY2xpZW50SGVpZ2h0O1xuICAgICAgaWYgKG1heFNjcm9sbFRvcCA+IDApIHtcbiAgICAgICAgaWYgKCEoY2hpbGQuc2Nyb2xsVG9wID09PSAwICYmIGRlbHRhWSA+IDApICYmICEoY2hpbGQuc2Nyb2xsVG9wID09PSBtYXhTY3JvbGxUb3AgJiYgZGVsdGFZIDwgMCkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmFyIG1heFNjcm9sbExlZnQgPSBjaGlsZC5zY3JvbGxMZWZ0IC0gY2hpbGQuY2xpZW50V2lkdGg7XG4gICAgICBpZiAobWF4U2Nyb2xsTGVmdCA+IDApIHtcbiAgICAgICAgaWYgKCEoY2hpbGQuc2Nyb2xsTGVmdCA9PT0gMCAmJiBkZWx0YVggPCAwKSAmJiAhKGNoaWxkLnNjcm9sbExlZnQgPT09IG1heFNjcm9sbExlZnQgJiYgZGVsdGFYID4gMCkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiBtb3VzZXdoZWVsSGFuZGxlcihlKSB7XG4gICAgdmFyIGRlbHRhID0gZ2V0RGVsdGFGcm9tRXZlbnQoZSk7XG5cbiAgICB2YXIgZGVsdGFYID0gZGVsdGFbMF07XG4gICAgdmFyIGRlbHRhWSA9IGRlbHRhWzFdO1xuXG4gICAgaWYgKHNob3VsZEJlQ29uc3VtZWRCeUNoaWxkKGRlbHRhWCwgZGVsdGFZKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHNob3VsZFByZXZlbnQgPSBmYWxzZTtcbiAgICBpZiAoIWkuc2V0dGluZ3MudXNlQm90aFdoZWVsQXhlcykge1xuICAgICAgLy8gZGVsdGFYIHdpbGwgb25seSBiZSB1c2VkIGZvciBob3Jpem9udGFsIHNjcm9sbGluZyBhbmQgZGVsdGFZIHdpbGxcbiAgICAgIC8vIG9ubHkgYmUgdXNlZCBmb3IgdmVydGljYWwgc2Nyb2xsaW5nIC0gdGhpcyBpcyB0aGUgZGVmYXVsdFxuICAgICAgdXBkYXRlU2Nyb2xsKGVsZW1lbnQsICd0b3AnLCBlbGVtZW50LnNjcm9sbFRvcCAtIChkZWx0YVkgKiBpLnNldHRpbmdzLndoZWVsU3BlZWQpKTtcbiAgICAgIHVwZGF0ZVNjcm9sbChlbGVtZW50LCAnbGVmdCcsIGVsZW1lbnQuc2Nyb2xsTGVmdCArIChkZWx0YVggKiBpLnNldHRpbmdzLndoZWVsU3BlZWQpKTtcbiAgICB9IGVsc2UgaWYgKGkuc2Nyb2xsYmFyWUFjdGl2ZSAmJiAhaS5zY3JvbGxiYXJYQWN0aXZlKSB7XG4gICAgICAvLyBvbmx5IHZlcnRpY2FsIHNjcm9sbGJhciBpcyBhY3RpdmUgYW5kIHVzZUJvdGhXaGVlbEF4ZXMgb3B0aW9uIGlzXG4gICAgICAvLyBhY3RpdmUsIHNvIGxldCdzIHNjcm9sbCB2ZXJ0aWNhbCBiYXIgdXNpbmcgYm90aCBtb3VzZSB3aGVlbCBheGVzXG4gICAgICBpZiAoZGVsdGFZKSB7XG4gICAgICAgIHVwZGF0ZVNjcm9sbChlbGVtZW50LCAndG9wJywgZWxlbWVudC5zY3JvbGxUb3AgLSAoZGVsdGFZICogaS5zZXR0aW5ncy53aGVlbFNwZWVkKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB1cGRhdGVTY3JvbGwoZWxlbWVudCwgJ3RvcCcsIGVsZW1lbnQuc2Nyb2xsVG9wICsgKGRlbHRhWCAqIGkuc2V0dGluZ3Mud2hlZWxTcGVlZCkpO1xuICAgICAgfVxuICAgICAgc2hvdWxkUHJldmVudCA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChpLnNjcm9sbGJhclhBY3RpdmUgJiYgIWkuc2Nyb2xsYmFyWUFjdGl2ZSkge1xuICAgICAgLy8gdXNlQm90aFdoZWVsQXhlcyBhbmQgb25seSBob3Jpem9udGFsIGJhciBpcyBhY3RpdmUsIHNvIHVzZSBib3RoXG4gICAgICAvLyB3aGVlbCBheGVzIGZvciBob3Jpem9udGFsIGJhclxuICAgICAgaWYgKGRlbHRhWCkge1xuICAgICAgICB1cGRhdGVTY3JvbGwoZWxlbWVudCwgJ2xlZnQnLCBlbGVtZW50LnNjcm9sbExlZnQgKyAoZGVsdGFYICogaS5zZXR0aW5ncy53aGVlbFNwZWVkKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB1cGRhdGVTY3JvbGwoZWxlbWVudCwgJ2xlZnQnLCBlbGVtZW50LnNjcm9sbExlZnQgLSAoZGVsdGFZICogaS5zZXR0aW5ncy53aGVlbFNwZWVkKSk7XG4gICAgICB9XG4gICAgICBzaG91bGRQcmV2ZW50ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICB1cGRhdGVHZW9tZXRyeShlbGVtZW50KTtcblxuICAgIHNob3VsZFByZXZlbnQgPSAoc2hvdWxkUHJldmVudCB8fCBzaG91bGRQcmV2ZW50RGVmYXVsdChkZWx0YVgsIGRlbHRhWSkpO1xuICAgIGlmIChzaG91bGRQcmV2ZW50KSB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0eXBlb2Ygd2luZG93Lm9ud2hlZWwgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBpLmV2ZW50LmJpbmQoZWxlbWVudCwgJ3doZWVsJywgbW91c2V3aGVlbEhhbmRsZXIpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiB3aW5kb3cub25tb3VzZXdoZWVsICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgaS5ldmVudC5iaW5kKGVsZW1lbnQsICdtb3VzZXdoZWVsJywgbW91c2V3aGVlbEhhbmRsZXIpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgdmFyIGkgPSBpbnN0YW5jZXMuZ2V0KGVsZW1lbnQpO1xuICBiaW5kTW91c2VXaGVlbEhhbmRsZXIoZWxlbWVudCwgaSk7XG59O1xuXG59LHtcIi4uL2luc3RhbmNlc1wiOjE4LFwiLi4vdXBkYXRlLWdlb21ldHJ5XCI6MTksXCIuLi91cGRhdGUtc2Nyb2xsXCI6MjB9XSwxNDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBpbnN0YW5jZXMgPSByZXF1aXJlKCcuLi9pbnN0YW5jZXMnKTtcbnZhciB1cGRhdGVHZW9tZXRyeSA9IHJlcXVpcmUoJy4uL3VwZGF0ZS1nZW9tZXRyeScpO1xuXG5mdW5jdGlvbiBiaW5kTmF0aXZlU2Nyb2xsSGFuZGxlcihlbGVtZW50LCBpKSB7XG4gIGkuZXZlbnQuYmluZChlbGVtZW50LCAnc2Nyb2xsJywgZnVuY3Rpb24gKCkge1xuICAgIHVwZGF0ZUdlb21ldHJ5KGVsZW1lbnQpO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICB2YXIgaSA9IGluc3RhbmNlcy5nZXQoZWxlbWVudCk7XG4gIGJpbmROYXRpdmVTY3JvbGxIYW5kbGVyKGVsZW1lbnQsIGkpO1xufTtcblxufSx7XCIuLi9pbnN0YW5jZXNcIjoxOCxcIi4uL3VwZGF0ZS1nZW9tZXRyeVwiOjE5fV0sMTU6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgXyA9IHJlcXVpcmUoJy4uLy4uL2xpYi9oZWxwZXInKTtcbnZhciBpbnN0YW5jZXMgPSByZXF1aXJlKCcuLi9pbnN0YW5jZXMnKTtcbnZhciB1cGRhdGVHZW9tZXRyeSA9IHJlcXVpcmUoJy4uL3VwZGF0ZS1nZW9tZXRyeScpO1xudmFyIHVwZGF0ZVNjcm9sbCA9IHJlcXVpcmUoJy4uL3VwZGF0ZS1zY3JvbGwnKTtcblxuZnVuY3Rpb24gYmluZFNlbGVjdGlvbkhhbmRsZXIoZWxlbWVudCwgaSkge1xuICBmdW5jdGlvbiBnZXRSYW5nZU5vZGUoKSB7XG4gICAgdmFyIHNlbGVjdGlvbiA9IHdpbmRvdy5nZXRTZWxlY3Rpb24gPyB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkgOlxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRTZWxlY3Rpb24gPyBkb2N1bWVudC5nZXRTZWxlY3Rpb24oKSA6ICcnO1xuICAgIGlmIChzZWxlY3Rpb24udG9TdHJpbmcoKS5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc2VsZWN0aW9uLmdldFJhbmdlQXQoMCkuY29tbW9uQW5jZXN0b3JDb250YWluZXI7XG4gICAgfVxuICB9XG5cbiAgdmFyIHNjcm9sbGluZ0xvb3AgPSBudWxsO1xuICB2YXIgc2Nyb2xsRGlmZiA9IHt0b3A6IDAsIGxlZnQ6IDB9O1xuICBmdW5jdGlvbiBzdGFydFNjcm9sbGluZygpIHtcbiAgICBpZiAoIXNjcm9sbGluZ0xvb3ApIHtcbiAgICAgIHNjcm9sbGluZ0xvb3AgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghaW5zdGFuY2VzLmdldChlbGVtZW50KSkge1xuICAgICAgICAgIGNsZWFySW50ZXJ2YWwoc2Nyb2xsaW5nTG9vcCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlU2Nyb2xsKGVsZW1lbnQsICd0b3AnLCBlbGVtZW50LnNjcm9sbFRvcCArIHNjcm9sbERpZmYudG9wKTtcbiAgICAgICAgdXBkYXRlU2Nyb2xsKGVsZW1lbnQsICdsZWZ0JywgZWxlbWVudC5zY3JvbGxMZWZ0ICsgc2Nyb2xsRGlmZi5sZWZ0KTtcbiAgICAgICAgdXBkYXRlR2VvbWV0cnkoZWxlbWVudCk7XG4gICAgICB9LCA1MCk7IC8vIGV2ZXJ5IC4xIHNlY1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBzdG9wU2Nyb2xsaW5nKCkge1xuICAgIGlmIChzY3JvbGxpbmdMb29wKSB7XG4gICAgICBjbGVhckludGVydmFsKHNjcm9sbGluZ0xvb3ApO1xuICAgICAgc2Nyb2xsaW5nTG9vcCA9IG51bGw7XG4gICAgfVxuICAgIF8uc3RvcFNjcm9sbGluZyhlbGVtZW50KTtcbiAgfVxuXG4gIHZhciBpc1NlbGVjdGVkID0gZmFsc2U7XG4gIGkuZXZlbnQuYmluZChpLm93bmVyRG9jdW1lbnQsICdzZWxlY3Rpb25jaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGVsZW1lbnQuY29udGFpbnMoZ2V0UmFuZ2VOb2RlKCkpKSB7XG4gICAgICBpc1NlbGVjdGVkID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaXNTZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgc3RvcFNjcm9sbGluZygpO1xuICAgIH1cbiAgfSk7XG4gIGkuZXZlbnQuYmluZCh3aW5kb3csICdtb3VzZXVwJywgZnVuY3Rpb24gKCkge1xuICAgIGlmIChpc1NlbGVjdGVkKSB7XG4gICAgICBpc1NlbGVjdGVkID0gZmFsc2U7XG4gICAgICBzdG9wU2Nyb2xsaW5nKCk7XG4gICAgfVxuICB9KTtcblxuICBpLmV2ZW50LmJpbmQod2luZG93LCAnbW91c2Vtb3ZlJywgZnVuY3Rpb24gKGUpIHtcbiAgICBpZiAoaXNTZWxlY3RlZCkge1xuICAgICAgdmFyIG1vdXNlUG9zaXRpb24gPSB7eDogZS5wYWdlWCwgeTogZS5wYWdlWX07XG4gICAgICB2YXIgY29udGFpbmVyR2VvbWV0cnkgPSB7XG4gICAgICAgIGxlZnQ6IGVsZW1lbnQub2Zmc2V0TGVmdCxcbiAgICAgICAgcmlnaHQ6IGVsZW1lbnQub2Zmc2V0TGVmdCArIGVsZW1lbnQub2Zmc2V0V2lkdGgsXG4gICAgICAgIHRvcDogZWxlbWVudC5vZmZzZXRUb3AsXG4gICAgICAgIGJvdHRvbTogZWxlbWVudC5vZmZzZXRUb3AgKyBlbGVtZW50Lm9mZnNldEhlaWdodFxuICAgICAgfTtcblxuICAgICAgaWYgKG1vdXNlUG9zaXRpb24ueCA8IGNvbnRhaW5lckdlb21ldHJ5LmxlZnQgKyAzKSB7XG4gICAgICAgIHNjcm9sbERpZmYubGVmdCA9IC01O1xuICAgICAgICBfLnN0YXJ0U2Nyb2xsaW5nKGVsZW1lbnQsICd4Jyk7XG4gICAgICB9IGVsc2UgaWYgKG1vdXNlUG9zaXRpb24ueCA+IGNvbnRhaW5lckdlb21ldHJ5LnJpZ2h0IC0gMykge1xuICAgICAgICBzY3JvbGxEaWZmLmxlZnQgPSA1O1xuICAgICAgICBfLnN0YXJ0U2Nyb2xsaW5nKGVsZW1lbnQsICd4Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzY3JvbGxEaWZmLmxlZnQgPSAwO1xuICAgICAgfVxuXG4gICAgICBpZiAobW91c2VQb3NpdGlvbi55IDwgY29udGFpbmVyR2VvbWV0cnkudG9wICsgMykge1xuICAgICAgICBpZiAoY29udGFpbmVyR2VvbWV0cnkudG9wICsgMyAtIG1vdXNlUG9zaXRpb24ueSA8IDUpIHtcbiAgICAgICAgICBzY3JvbGxEaWZmLnRvcCA9IC01O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNjcm9sbERpZmYudG9wID0gLTIwO1xuICAgICAgICB9XG4gICAgICAgIF8uc3RhcnRTY3JvbGxpbmcoZWxlbWVudCwgJ3knKTtcbiAgICAgIH0gZWxzZSBpZiAobW91c2VQb3NpdGlvbi55ID4gY29udGFpbmVyR2VvbWV0cnkuYm90dG9tIC0gMykge1xuICAgICAgICBpZiAobW91c2VQb3NpdGlvbi55IC0gY29udGFpbmVyR2VvbWV0cnkuYm90dG9tICsgMyA8IDUpIHtcbiAgICAgICAgICBzY3JvbGxEaWZmLnRvcCA9IDU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2Nyb2xsRGlmZi50b3AgPSAyMDtcbiAgICAgICAgfVxuICAgICAgICBfLnN0YXJ0U2Nyb2xsaW5nKGVsZW1lbnQsICd5Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzY3JvbGxEaWZmLnRvcCA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmIChzY3JvbGxEaWZmLnRvcCA9PT0gMCAmJiBzY3JvbGxEaWZmLmxlZnQgPT09IDApIHtcbiAgICAgICAgc3RvcFNjcm9sbGluZygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RhcnRTY3JvbGxpbmcoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gIHZhciBpID0gaW5zdGFuY2VzLmdldChlbGVtZW50KTtcbiAgYmluZFNlbGVjdGlvbkhhbmRsZXIoZWxlbWVudCwgaSk7XG59O1xuXG59LHtcIi4uLy4uL2xpYi9oZWxwZXJcIjo2LFwiLi4vaW5zdGFuY2VzXCI6MTgsXCIuLi91cGRhdGUtZ2VvbWV0cnlcIjoxOSxcIi4uL3VwZGF0ZS1zY3JvbGxcIjoyMH1dLDE2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxudmFyIF8gPSByZXF1aXJlKCcuLi8uLi9saWIvaGVscGVyJyk7XG52YXIgaW5zdGFuY2VzID0gcmVxdWlyZSgnLi4vaW5zdGFuY2VzJyk7XG52YXIgdXBkYXRlR2VvbWV0cnkgPSByZXF1aXJlKCcuLi91cGRhdGUtZ2VvbWV0cnknKTtcbnZhciB1cGRhdGVTY3JvbGwgPSByZXF1aXJlKCcuLi91cGRhdGUtc2Nyb2xsJyk7XG5cbmZ1bmN0aW9uIGJpbmRUb3VjaEhhbmRsZXIoZWxlbWVudCwgaSwgc3VwcG9ydHNUb3VjaCwgc3VwcG9ydHNJZVBvaW50ZXIpIHtcbiAgZnVuY3Rpb24gc2hvdWxkUHJldmVudERlZmF1bHQoZGVsdGFYLCBkZWx0YVkpIHtcbiAgICB2YXIgc2Nyb2xsVG9wID0gZWxlbWVudC5zY3JvbGxUb3A7XG4gICAgdmFyIHNjcm9sbExlZnQgPSBlbGVtZW50LnNjcm9sbExlZnQ7XG4gICAgdmFyIG1hZ25pdHVkZVggPSBNYXRoLmFicyhkZWx0YVgpO1xuICAgIHZhciBtYWduaXR1ZGVZID0gTWF0aC5hYnMoZGVsdGFZKTtcblxuICAgIGlmIChtYWduaXR1ZGVZID4gbWFnbml0dWRlWCkge1xuICAgICAgLy8gdXNlciBpcyBwZXJoYXBzIHRyeWluZyB0byBzd2lwZSB1cC9kb3duIHRoZSBwYWdlXG5cbiAgICAgIGlmICgoKGRlbHRhWSA8IDApICYmIChzY3JvbGxUb3AgPT09IGkuY29udGVudEhlaWdodCAtIGkuY29udGFpbmVySGVpZ2h0KSkgfHxcbiAgICAgICAgICAoKGRlbHRhWSA+IDApICYmIChzY3JvbGxUb3AgPT09IDApKSkge1xuICAgICAgICByZXR1cm4gIWkuc2V0dGluZ3Muc3dpcGVQcm9wYWdhdGlvbjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG1hZ25pdHVkZVggPiBtYWduaXR1ZGVZKSB7XG4gICAgICAvLyB1c2VyIGlzIHBlcmhhcHMgdHJ5aW5nIHRvIHN3aXBlIGxlZnQvcmlnaHQgYWNyb3NzIHRoZSBwYWdlXG5cbiAgICAgIGlmICgoKGRlbHRhWCA8IDApICYmIChzY3JvbGxMZWZ0ID09PSBpLmNvbnRlbnRXaWR0aCAtIGkuY29udGFpbmVyV2lkdGgpKSB8fFxuICAgICAgICAgICgoZGVsdGFYID4gMCkgJiYgKHNjcm9sbExlZnQgPT09IDApKSkge1xuICAgICAgICByZXR1cm4gIWkuc2V0dGluZ3Muc3dpcGVQcm9wYWdhdGlvbjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFwcGx5VG91Y2hNb3ZlKGRpZmZlcmVuY2VYLCBkaWZmZXJlbmNlWSkge1xuICAgIHVwZGF0ZVNjcm9sbChlbGVtZW50LCAndG9wJywgZWxlbWVudC5zY3JvbGxUb3AgLSBkaWZmZXJlbmNlWSk7XG4gICAgdXBkYXRlU2Nyb2xsKGVsZW1lbnQsICdsZWZ0JywgZWxlbWVudC5zY3JvbGxMZWZ0IC0gZGlmZmVyZW5jZVgpO1xuXG4gICAgdXBkYXRlR2VvbWV0cnkoZWxlbWVudCk7XG4gIH1cblxuICB2YXIgc3RhcnRPZmZzZXQgPSB7fTtcbiAgdmFyIHN0YXJ0VGltZSA9IDA7XG4gIHZhciBzcGVlZCA9IHt9O1xuICB2YXIgZWFzaW5nTG9vcCA9IG51bGw7XG4gIHZhciBpbkdsb2JhbFRvdWNoID0gZmFsc2U7XG4gIHZhciBpbkxvY2FsVG91Y2ggPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnbG9iYWxUb3VjaFN0YXJ0KCkge1xuICAgIGluR2xvYmFsVG91Y2ggPSB0cnVlO1xuICB9XG4gIGZ1bmN0aW9uIGdsb2JhbFRvdWNoRW5kKCkge1xuICAgIGluR2xvYmFsVG91Y2ggPSBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFRvdWNoKGUpIHtcbiAgICBpZiAoZS50YXJnZXRUb3VjaGVzKSB7XG4gICAgICByZXR1cm4gZS50YXJnZXRUb3VjaGVzWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBNYXliZSBJRSBwb2ludGVyXG4gICAgICByZXR1cm4gZTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gc2hvdWxkSGFuZGxlKGUpIHtcbiAgICBpZiAoZS50YXJnZXRUb3VjaGVzICYmIGUudGFyZ2V0VG91Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoZS5wb2ludGVyVHlwZSAmJiBlLnBvaW50ZXJUeXBlICE9PSAnbW91c2UnICYmIGUucG9pbnRlclR5cGUgIT09IGUuTVNQT0lOVEVSX1RZUEVfTU9VU0UpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgZnVuY3Rpb24gdG91Y2hTdGFydChlKSB7XG4gICAgaWYgKHNob3VsZEhhbmRsZShlKSkge1xuICAgICAgaW5Mb2NhbFRvdWNoID0gdHJ1ZTtcblxuICAgICAgdmFyIHRvdWNoID0gZ2V0VG91Y2goZSk7XG5cbiAgICAgIHN0YXJ0T2Zmc2V0LnBhZ2VYID0gdG91Y2gucGFnZVg7XG4gICAgICBzdGFydE9mZnNldC5wYWdlWSA9IHRvdWNoLnBhZ2VZO1xuXG4gICAgICBzdGFydFRpbWUgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xuXG4gICAgICBpZiAoZWFzaW5nTG9vcCAhPT0gbnVsbCkge1xuICAgICAgICBjbGVhckludGVydmFsKGVhc2luZ0xvb3ApO1xuICAgICAgfVxuXG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiB0b3VjaE1vdmUoZSkge1xuICAgIGlmICghaW5Mb2NhbFRvdWNoICYmIGkuc2V0dGluZ3Muc3dpcGVQcm9wYWdhdGlvbikge1xuICAgICAgdG91Y2hTdGFydChlKTtcbiAgICB9XG4gICAgaWYgKCFpbkdsb2JhbFRvdWNoICYmIGluTG9jYWxUb3VjaCAmJiBzaG91bGRIYW5kbGUoZSkpIHtcbiAgICAgIHZhciB0b3VjaCA9IGdldFRvdWNoKGUpO1xuXG4gICAgICB2YXIgY3VycmVudE9mZnNldCA9IHtwYWdlWDogdG91Y2gucGFnZVgsIHBhZ2VZOiB0b3VjaC5wYWdlWX07XG5cbiAgICAgIHZhciBkaWZmZXJlbmNlWCA9IGN1cnJlbnRPZmZzZXQucGFnZVggLSBzdGFydE9mZnNldC5wYWdlWDtcbiAgICAgIHZhciBkaWZmZXJlbmNlWSA9IGN1cnJlbnRPZmZzZXQucGFnZVkgLSBzdGFydE9mZnNldC5wYWdlWTtcblxuICAgICAgYXBwbHlUb3VjaE1vdmUoZGlmZmVyZW5jZVgsIGRpZmZlcmVuY2VZKTtcbiAgICAgIHN0YXJ0T2Zmc2V0ID0gY3VycmVudE9mZnNldDtcblxuICAgICAgdmFyIGN1cnJlbnRUaW1lID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcblxuICAgICAgdmFyIHRpbWVHYXAgPSBjdXJyZW50VGltZSAtIHN0YXJ0VGltZTtcbiAgICAgIGlmICh0aW1lR2FwID4gMCkge1xuICAgICAgICBzcGVlZC54ID0gZGlmZmVyZW5jZVggLyB0aW1lR2FwO1xuICAgICAgICBzcGVlZC55ID0gZGlmZmVyZW5jZVkgLyB0aW1lR2FwO1xuICAgICAgICBzdGFydFRpbWUgPSBjdXJyZW50VGltZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNob3VsZFByZXZlbnREZWZhdWx0KGRpZmZlcmVuY2VYLCBkaWZmZXJlbmNlWSkpIHtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBmdW5jdGlvbiB0b3VjaEVuZCgpIHtcbiAgICBpZiAoIWluR2xvYmFsVG91Y2ggJiYgaW5Mb2NhbFRvdWNoKSB7XG4gICAgICBpbkxvY2FsVG91Y2ggPSBmYWxzZTtcblxuICAgICAgY2xlYXJJbnRlcnZhbChlYXNpbmdMb29wKTtcbiAgICAgIGVhc2luZ0xvb3AgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghaW5zdGFuY2VzLmdldChlbGVtZW50KSkge1xuICAgICAgICAgIGNsZWFySW50ZXJ2YWwoZWFzaW5nTG9vcCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKE1hdGguYWJzKHNwZWVkLngpIDwgMC4wMSAmJiBNYXRoLmFicyhzcGVlZC55KSA8IDAuMDEpIHtcbiAgICAgICAgICBjbGVhckludGVydmFsKGVhc2luZ0xvb3ApO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGFwcGx5VG91Y2hNb3ZlKHNwZWVkLnggKiAzMCwgc3BlZWQueSAqIDMwKTtcblxuICAgICAgICBzcGVlZC54ICo9IDAuODtcbiAgICAgICAgc3BlZWQueSAqPSAwLjg7XG4gICAgICB9LCAxMCk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHN1cHBvcnRzVG91Y2gpIHtcbiAgICBpLmV2ZW50LmJpbmQod2luZG93LCAndG91Y2hzdGFydCcsIGdsb2JhbFRvdWNoU3RhcnQpO1xuICAgIGkuZXZlbnQuYmluZCh3aW5kb3csICd0b3VjaGVuZCcsIGdsb2JhbFRvdWNoRW5kKTtcbiAgICBpLmV2ZW50LmJpbmQoZWxlbWVudCwgJ3RvdWNoc3RhcnQnLCB0b3VjaFN0YXJ0KTtcbiAgICBpLmV2ZW50LmJpbmQoZWxlbWVudCwgJ3RvdWNobW92ZScsIHRvdWNoTW92ZSk7XG4gICAgaS5ldmVudC5iaW5kKGVsZW1lbnQsICd0b3VjaGVuZCcsIHRvdWNoRW5kKTtcbiAgfVxuXG4gIGlmIChzdXBwb3J0c0llUG9pbnRlcikge1xuICAgIGlmICh3aW5kb3cuUG9pbnRlckV2ZW50KSB7XG4gICAgICBpLmV2ZW50LmJpbmQod2luZG93LCAncG9pbnRlcmRvd24nLCBnbG9iYWxUb3VjaFN0YXJ0KTtcbiAgICAgIGkuZXZlbnQuYmluZCh3aW5kb3csICdwb2ludGVydXAnLCBnbG9iYWxUb3VjaEVuZCk7XG4gICAgICBpLmV2ZW50LmJpbmQoZWxlbWVudCwgJ3BvaW50ZXJkb3duJywgdG91Y2hTdGFydCk7XG4gICAgICBpLmV2ZW50LmJpbmQoZWxlbWVudCwgJ3BvaW50ZXJtb3ZlJywgdG91Y2hNb3ZlKTtcbiAgICAgIGkuZXZlbnQuYmluZChlbGVtZW50LCAncG9pbnRlcnVwJywgdG91Y2hFbmQpO1xuICAgIH0gZWxzZSBpZiAod2luZG93Lk1TUG9pbnRlckV2ZW50KSB7XG4gICAgICBpLmV2ZW50LmJpbmQod2luZG93LCAnTVNQb2ludGVyRG93bicsIGdsb2JhbFRvdWNoU3RhcnQpO1xuICAgICAgaS5ldmVudC5iaW5kKHdpbmRvdywgJ01TUG9pbnRlclVwJywgZ2xvYmFsVG91Y2hFbmQpO1xuICAgICAgaS5ldmVudC5iaW5kKGVsZW1lbnQsICdNU1BvaW50ZXJEb3duJywgdG91Y2hTdGFydCk7XG4gICAgICBpLmV2ZW50LmJpbmQoZWxlbWVudCwgJ01TUG9pbnRlck1vdmUnLCB0b3VjaE1vdmUpO1xuICAgICAgaS5ldmVudC5iaW5kKGVsZW1lbnQsICdNU1BvaW50ZXJVcCcsIHRvdWNoRW5kKTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICBpZiAoIV8uZW52LnN1cHBvcnRzVG91Y2ggJiYgIV8uZW52LnN1cHBvcnRzSWVQb2ludGVyKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIGkgPSBpbnN0YW5jZXMuZ2V0KGVsZW1lbnQpO1xuICBiaW5kVG91Y2hIYW5kbGVyKGVsZW1lbnQsIGksIF8uZW52LnN1cHBvcnRzVG91Y2gsIF8uZW52LnN1cHBvcnRzSWVQb2ludGVyKTtcbn07XG5cbn0se1wiLi4vLi4vbGliL2hlbHBlclwiOjYsXCIuLi9pbnN0YW5jZXNcIjoxOCxcIi4uL3VwZGF0ZS1nZW9tZXRyeVwiOjE5LFwiLi4vdXBkYXRlLXNjcm9sbFwiOjIwfV0sMTc6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgXyA9IHJlcXVpcmUoJy4uL2xpYi9oZWxwZXInKTtcbnZhciBjbHMgPSByZXF1aXJlKCcuLi9saWIvY2xhc3MnKTtcbnZhciBpbnN0YW5jZXMgPSByZXF1aXJlKCcuL2luc3RhbmNlcycpO1xudmFyIHVwZGF0ZUdlb21ldHJ5ID0gcmVxdWlyZSgnLi91cGRhdGUtZ2VvbWV0cnknKTtcblxuLy8gSGFuZGxlcnNcbnZhciBoYW5kbGVycyA9IHtcbiAgJ2NsaWNrLXJhaWwnOiByZXF1aXJlKCcuL2hhbmRsZXIvY2xpY2stcmFpbCcpLFxuICAnZHJhZy1zY3JvbGxiYXInOiByZXF1aXJlKCcuL2hhbmRsZXIvZHJhZy1zY3JvbGxiYXInKSxcbiAgJ2tleWJvYXJkJzogcmVxdWlyZSgnLi9oYW5kbGVyL2tleWJvYXJkJyksXG4gICd3aGVlbCc6IHJlcXVpcmUoJy4vaGFuZGxlci9tb3VzZS13aGVlbCcpLFxuICAndG91Y2gnOiByZXF1aXJlKCcuL2hhbmRsZXIvdG91Y2gnKSxcbiAgJ3NlbGVjdGlvbic6IHJlcXVpcmUoJy4vaGFuZGxlci9zZWxlY3Rpb24nKVxufTtcbnZhciBuYXRpdmVTY3JvbGxIYW5kbGVyID0gcmVxdWlyZSgnLi9oYW5kbGVyL25hdGl2ZS1zY3JvbGwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZWxlbWVudCwgdXNlclNldHRpbmdzKSB7XG4gIHVzZXJTZXR0aW5ncyA9IHR5cGVvZiB1c2VyU2V0dGluZ3MgPT09ICdvYmplY3QnID8gdXNlclNldHRpbmdzIDoge307XG5cbiAgY2xzLmFkZChlbGVtZW50LCAncHMtY29udGFpbmVyJyk7XG5cbiAgLy8gQ3JlYXRlIGEgcGx1Z2luIGluc3RhbmNlLlxuICB2YXIgaSA9IGluc3RhbmNlcy5hZGQoZWxlbWVudCk7XG5cbiAgaS5zZXR0aW5ncyA9IF8uZXh0ZW5kKGkuc2V0dGluZ3MsIHVzZXJTZXR0aW5ncyk7XG4gIGNscy5hZGQoZWxlbWVudCwgJ3BzLXRoZW1lLScgKyBpLnNldHRpbmdzLnRoZW1lKTtcblxuICBpLnNldHRpbmdzLmhhbmRsZXJzLmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZXJOYW1lKSB7XG4gICAgaGFuZGxlcnNbaGFuZGxlck5hbWVdKGVsZW1lbnQpO1xuICB9KTtcblxuICBuYXRpdmVTY3JvbGxIYW5kbGVyKGVsZW1lbnQpO1xuXG4gIHVwZGF0ZUdlb21ldHJ5KGVsZW1lbnQpO1xufTtcblxufSx7XCIuLi9saWIvY2xhc3NcIjoyLFwiLi4vbGliL2hlbHBlclwiOjYsXCIuL2hhbmRsZXIvY2xpY2stcmFpbFwiOjEwLFwiLi9oYW5kbGVyL2RyYWctc2Nyb2xsYmFyXCI6MTEsXCIuL2hhbmRsZXIva2V5Ym9hcmRcIjoxMixcIi4vaGFuZGxlci9tb3VzZS13aGVlbFwiOjEzLFwiLi9oYW5kbGVyL25hdGl2ZS1zY3JvbGxcIjoxNCxcIi4vaGFuZGxlci9zZWxlY3Rpb25cIjoxNSxcIi4vaGFuZGxlci90b3VjaFwiOjE2LFwiLi9pbnN0YW5jZXNcIjoxOCxcIi4vdXBkYXRlLWdlb21ldHJ5XCI6MTl9XSwxODpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBfID0gcmVxdWlyZSgnLi4vbGliL2hlbHBlcicpO1xudmFyIGNscyA9IHJlcXVpcmUoJy4uL2xpYi9jbGFzcycpO1xudmFyIGRlZmF1bHRTZXR0aW5ncyA9IHJlcXVpcmUoJy4vZGVmYXVsdC1zZXR0aW5nJyk7XG52YXIgZG9tID0gcmVxdWlyZSgnLi4vbGliL2RvbScpO1xudmFyIEV2ZW50TWFuYWdlciA9IHJlcXVpcmUoJy4uL2xpYi9ldmVudC1tYW5hZ2VyJyk7XG52YXIgZ3VpZCA9IHJlcXVpcmUoJy4uL2xpYi9ndWlkJyk7XG5cbnZhciBpbnN0YW5jZXMgPSB7fTtcblxuZnVuY3Rpb24gSW5zdGFuY2UoZWxlbWVudCkge1xuICB2YXIgaSA9IHRoaXM7XG5cbiAgaS5zZXR0aW5ncyA9IF8uY2xvbmUoZGVmYXVsdFNldHRpbmdzKTtcbiAgaS5jb250YWluZXJXaWR0aCA9IG51bGw7XG4gIGkuY29udGFpbmVySGVpZ2h0ID0gbnVsbDtcbiAgaS5jb250ZW50V2lkdGggPSBudWxsO1xuICBpLmNvbnRlbnRIZWlnaHQgPSBudWxsO1xuXG4gIGkuaXNSdGwgPSBkb20uY3NzKGVsZW1lbnQsICdkaXJlY3Rpb24nKSA9PT0gXCJydGxcIjtcbiAgaS5pc05lZ2F0aXZlU2Nyb2xsID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgb3JpZ2luYWxTY3JvbGxMZWZ0ID0gZWxlbWVudC5zY3JvbGxMZWZ0O1xuICAgIHZhciByZXN1bHQgPSBudWxsO1xuICAgIGVsZW1lbnQuc2Nyb2xsTGVmdCA9IC0xO1xuICAgIHJlc3VsdCA9IGVsZW1lbnQuc2Nyb2xsTGVmdCA8IDA7XG4gICAgZWxlbWVudC5zY3JvbGxMZWZ0ID0gb3JpZ2luYWxTY3JvbGxMZWZ0O1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH0pKCk7XG4gIGkubmVnYXRpdmVTY3JvbGxBZGp1c3RtZW50ID0gaS5pc05lZ2F0aXZlU2Nyb2xsID8gZWxlbWVudC5zY3JvbGxXaWR0aCAtIGVsZW1lbnQuY2xpZW50V2lkdGggOiAwO1xuICBpLmV2ZW50ID0gbmV3IEV2ZW50TWFuYWdlcigpO1xuICBpLm93bmVyRG9jdW1lbnQgPSBlbGVtZW50Lm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQ7XG5cbiAgZnVuY3Rpb24gZm9jdXMoKSB7XG4gICAgY2xzLmFkZChlbGVtZW50LCAncHMtZm9jdXMnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGJsdXIoKSB7XG4gICAgY2xzLnJlbW92ZShlbGVtZW50LCAncHMtZm9jdXMnKTtcbiAgfVxuXG4gIGkuc2Nyb2xsYmFyWFJhaWwgPSBkb20uYXBwZW5kVG8oZG9tLmUoJ2RpdicsICdwcy1zY3JvbGxiYXIteC1yYWlsJyksIGVsZW1lbnQpO1xuICBpLnNjcm9sbGJhclggPSBkb20uYXBwZW5kVG8oZG9tLmUoJ2RpdicsICdwcy1zY3JvbGxiYXIteCcpLCBpLnNjcm9sbGJhclhSYWlsKTtcbiAgaS5zY3JvbGxiYXJYLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAwKTtcbiAgaS5ldmVudC5iaW5kKGkuc2Nyb2xsYmFyWCwgJ2ZvY3VzJywgZm9jdXMpO1xuICBpLmV2ZW50LmJpbmQoaS5zY3JvbGxiYXJYLCAnYmx1cicsIGJsdXIpO1xuICBpLnNjcm9sbGJhclhBY3RpdmUgPSBudWxsO1xuICBpLnNjcm9sbGJhclhXaWR0aCA9IG51bGw7XG4gIGkuc2Nyb2xsYmFyWExlZnQgPSBudWxsO1xuICBpLnNjcm9sbGJhclhCb3R0b20gPSBfLnRvSW50KGRvbS5jc3MoaS5zY3JvbGxiYXJYUmFpbCwgJ2JvdHRvbScpKTtcbiAgaS5pc1Njcm9sbGJhclhVc2luZ0JvdHRvbSA9IGkuc2Nyb2xsYmFyWEJvdHRvbSA9PT0gaS5zY3JvbGxiYXJYQm90dG9tOyAvLyAhaXNOYU5cbiAgaS5zY3JvbGxiYXJYVG9wID0gaS5pc1Njcm9sbGJhclhVc2luZ0JvdHRvbSA/IG51bGwgOiBfLnRvSW50KGRvbS5jc3MoaS5zY3JvbGxiYXJYUmFpbCwgJ3RvcCcpKTtcbiAgaS5yYWlsQm9yZGVyWFdpZHRoID0gXy50b0ludChkb20uY3NzKGkuc2Nyb2xsYmFyWFJhaWwsICdib3JkZXJMZWZ0V2lkdGgnKSkgKyBfLnRvSW50KGRvbS5jc3MoaS5zY3JvbGxiYXJYUmFpbCwgJ2JvcmRlclJpZ2h0V2lkdGgnKSk7XG4gIC8vIFNldCByYWlsIHRvIGRpc3BsYXk6YmxvY2sgdG8gY2FsY3VsYXRlIG1hcmdpbnNcbiAgZG9tLmNzcyhpLnNjcm9sbGJhclhSYWlsLCAnZGlzcGxheScsICdibG9jaycpO1xuICBpLnJhaWxYTWFyZ2luV2lkdGggPSBfLnRvSW50KGRvbS5jc3MoaS5zY3JvbGxiYXJYUmFpbCwgJ21hcmdpbkxlZnQnKSkgKyBfLnRvSW50KGRvbS5jc3MoaS5zY3JvbGxiYXJYUmFpbCwgJ21hcmdpblJpZ2h0JykpO1xuICBkb20uY3NzKGkuc2Nyb2xsYmFyWFJhaWwsICdkaXNwbGF5JywgJycpO1xuICBpLnJhaWxYV2lkdGggPSBudWxsO1xuICBpLnJhaWxYUmF0aW8gPSBudWxsO1xuXG4gIGkuc2Nyb2xsYmFyWVJhaWwgPSBkb20uYXBwZW5kVG8oZG9tLmUoJ2RpdicsICdwcy1zY3JvbGxiYXIteS1yYWlsJyksIGVsZW1lbnQpO1xuICBpLnNjcm9sbGJhclkgPSBkb20uYXBwZW5kVG8oZG9tLmUoJ2RpdicsICdwcy1zY3JvbGxiYXIteScpLCBpLnNjcm9sbGJhcllSYWlsKTtcbiAgaS5zY3JvbGxiYXJZLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAwKTtcbiAgaS5ldmVudC5iaW5kKGkuc2Nyb2xsYmFyWSwgJ2ZvY3VzJywgZm9jdXMpO1xuICBpLmV2ZW50LmJpbmQoaS5zY3JvbGxiYXJZLCAnYmx1cicsIGJsdXIpO1xuICBpLnNjcm9sbGJhcllBY3RpdmUgPSBudWxsO1xuICBpLnNjcm9sbGJhcllIZWlnaHQgPSBudWxsO1xuICBpLnNjcm9sbGJhcllUb3AgPSBudWxsO1xuICBpLnNjcm9sbGJhcllSaWdodCA9IF8udG9JbnQoZG9tLmNzcyhpLnNjcm9sbGJhcllSYWlsLCAncmlnaHQnKSk7XG4gIGkuaXNTY3JvbGxiYXJZVXNpbmdSaWdodCA9IGkuc2Nyb2xsYmFyWVJpZ2h0ID09PSBpLnNjcm9sbGJhcllSaWdodDsgLy8gIWlzTmFOXG4gIGkuc2Nyb2xsYmFyWUxlZnQgPSBpLmlzU2Nyb2xsYmFyWVVzaW5nUmlnaHQgPyBudWxsIDogXy50b0ludChkb20uY3NzKGkuc2Nyb2xsYmFyWVJhaWwsICdsZWZ0JykpO1xuICBpLnNjcm9sbGJhcllPdXRlcldpZHRoID0gaS5pc1J0bCA/IF8ub3V0ZXJXaWR0aChpLnNjcm9sbGJhclkpIDogbnVsbDtcbiAgaS5yYWlsQm9yZGVyWVdpZHRoID0gXy50b0ludChkb20uY3NzKGkuc2Nyb2xsYmFyWVJhaWwsICdib3JkZXJUb3BXaWR0aCcpKSArIF8udG9JbnQoZG9tLmNzcyhpLnNjcm9sbGJhcllSYWlsLCAnYm9yZGVyQm90dG9tV2lkdGgnKSk7XG4gIGRvbS5jc3MoaS5zY3JvbGxiYXJZUmFpbCwgJ2Rpc3BsYXknLCAnYmxvY2snKTtcbiAgaS5yYWlsWU1hcmdpbkhlaWdodCA9IF8udG9JbnQoZG9tLmNzcyhpLnNjcm9sbGJhcllSYWlsLCAnbWFyZ2luVG9wJykpICsgXy50b0ludChkb20uY3NzKGkuc2Nyb2xsYmFyWVJhaWwsICdtYXJnaW5Cb3R0b20nKSk7XG4gIGRvbS5jc3MoaS5zY3JvbGxiYXJZUmFpbCwgJ2Rpc3BsYXknLCAnJyk7XG4gIGkucmFpbFlIZWlnaHQgPSBudWxsO1xuICBpLnJhaWxZUmF0aW8gPSBudWxsO1xufVxuXG5mdW5jdGlvbiBnZXRJZChlbGVtZW50KSB7XG4gIHJldHVybiBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1wcy1pZCcpO1xufVxuXG5mdW5jdGlvbiBzZXRJZChlbGVtZW50LCBpZCkge1xuICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS1wcy1pZCcsIGlkKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlSWQoZWxlbWVudCkge1xuICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1wcy1pZCcpO1xufVxuXG5leHBvcnRzLmFkZCA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gIHZhciBuZXdJZCA9IGd1aWQoKTtcbiAgc2V0SWQoZWxlbWVudCwgbmV3SWQpO1xuICBpbnN0YW5jZXNbbmV3SWRdID0gbmV3IEluc3RhbmNlKGVsZW1lbnQpO1xuICByZXR1cm4gaW5zdGFuY2VzW25ld0lkXTtcbn07XG5cbmV4cG9ydHMucmVtb3ZlID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgZGVsZXRlIGluc3RhbmNlc1tnZXRJZChlbGVtZW50KV07XG4gIHJlbW92ZUlkKGVsZW1lbnQpO1xufTtcblxuZXhwb3J0cy5nZXQgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICByZXR1cm4gaW5zdGFuY2VzW2dldElkKGVsZW1lbnQpXTtcbn07XG5cbn0se1wiLi4vbGliL2NsYXNzXCI6MixcIi4uL2xpYi9kb21cIjozLFwiLi4vbGliL2V2ZW50LW1hbmFnZXJcIjo0LFwiLi4vbGliL2d1aWRcIjo1LFwiLi4vbGliL2hlbHBlclwiOjYsXCIuL2RlZmF1bHQtc2V0dGluZ1wiOjh9XSwxOTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBfID0gcmVxdWlyZSgnLi4vbGliL2hlbHBlcicpO1xudmFyIGNscyA9IHJlcXVpcmUoJy4uL2xpYi9jbGFzcycpO1xudmFyIGRvbSA9IHJlcXVpcmUoJy4uL2xpYi9kb20nKTtcbnZhciBpbnN0YW5jZXMgPSByZXF1aXJlKCcuL2luc3RhbmNlcycpO1xudmFyIHVwZGF0ZVNjcm9sbCA9IHJlcXVpcmUoJy4vdXBkYXRlLXNjcm9sbCcpO1xuXG5mdW5jdGlvbiBnZXRUaHVtYlNpemUoaSwgdGh1bWJTaXplKSB7XG4gIGlmIChpLnNldHRpbmdzLm1pblNjcm9sbGJhckxlbmd0aCkge1xuICAgIHRodW1iU2l6ZSA9IE1hdGgubWF4KHRodW1iU2l6ZSwgaS5zZXR0aW5ncy5taW5TY3JvbGxiYXJMZW5ndGgpO1xuICB9XG4gIGlmIChpLnNldHRpbmdzLm1heFNjcm9sbGJhckxlbmd0aCkge1xuICAgIHRodW1iU2l6ZSA9IE1hdGgubWluKHRodW1iU2l6ZSwgaS5zZXR0aW5ncy5tYXhTY3JvbGxiYXJMZW5ndGgpO1xuICB9XG4gIHJldHVybiB0aHVtYlNpemU7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUNzcyhlbGVtZW50LCBpKSB7XG4gIHZhciB4UmFpbE9mZnNldCA9IHt3aWR0aDogaS5yYWlsWFdpZHRofTtcbiAgaWYgKGkuaXNSdGwpIHtcbiAgICB4UmFpbE9mZnNldC5sZWZ0ID0gaS5uZWdhdGl2ZVNjcm9sbEFkanVzdG1lbnQgKyBlbGVtZW50LnNjcm9sbExlZnQgKyBpLmNvbnRhaW5lcldpZHRoIC0gaS5jb250ZW50V2lkdGg7XG4gIH0gZWxzZSB7XG4gICAgeFJhaWxPZmZzZXQubGVmdCA9IGVsZW1lbnQuc2Nyb2xsTGVmdDtcbiAgfVxuICBpZiAoaS5pc1Njcm9sbGJhclhVc2luZ0JvdHRvbSkge1xuICAgIHhSYWlsT2Zmc2V0LmJvdHRvbSA9IGkuc2Nyb2xsYmFyWEJvdHRvbSAtIGVsZW1lbnQuc2Nyb2xsVG9wO1xuICB9IGVsc2Uge1xuICAgIHhSYWlsT2Zmc2V0LnRvcCA9IGkuc2Nyb2xsYmFyWFRvcCArIGVsZW1lbnQuc2Nyb2xsVG9wO1xuICB9XG4gIGRvbS5jc3MoaS5zY3JvbGxiYXJYUmFpbCwgeFJhaWxPZmZzZXQpO1xuXG4gIHZhciB5UmFpbE9mZnNldCA9IHt0b3A6IGVsZW1lbnQuc2Nyb2xsVG9wLCBoZWlnaHQ6IGkucmFpbFlIZWlnaHR9O1xuICBpZiAoaS5pc1Njcm9sbGJhcllVc2luZ1JpZ2h0KSB7XG4gICAgaWYgKGkuaXNSdGwpIHtcbiAgICAgIHlSYWlsT2Zmc2V0LnJpZ2h0ID0gaS5jb250ZW50V2lkdGggLSAoaS5uZWdhdGl2ZVNjcm9sbEFkanVzdG1lbnQgKyBlbGVtZW50LnNjcm9sbExlZnQpIC0gaS5zY3JvbGxiYXJZUmlnaHQgLSBpLnNjcm9sbGJhcllPdXRlcldpZHRoO1xuICAgIH0gZWxzZSB7XG4gICAgICB5UmFpbE9mZnNldC5yaWdodCA9IGkuc2Nyb2xsYmFyWVJpZ2h0IC0gZWxlbWVudC5zY3JvbGxMZWZ0O1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoaS5pc1J0bCkge1xuICAgICAgeVJhaWxPZmZzZXQubGVmdCA9IGkubmVnYXRpdmVTY3JvbGxBZGp1c3RtZW50ICsgZWxlbWVudC5zY3JvbGxMZWZ0ICsgaS5jb250YWluZXJXaWR0aCAqIDIgLSBpLmNvbnRlbnRXaWR0aCAtIGkuc2Nyb2xsYmFyWUxlZnQgLSBpLnNjcm9sbGJhcllPdXRlcldpZHRoO1xuICAgIH0gZWxzZSB7XG4gICAgICB5UmFpbE9mZnNldC5sZWZ0ID0gaS5zY3JvbGxiYXJZTGVmdCArIGVsZW1lbnQuc2Nyb2xsTGVmdDtcbiAgICB9XG4gIH1cbiAgZG9tLmNzcyhpLnNjcm9sbGJhcllSYWlsLCB5UmFpbE9mZnNldCk7XG5cbiAgZG9tLmNzcyhpLnNjcm9sbGJhclgsIHtsZWZ0OiBpLnNjcm9sbGJhclhMZWZ0LCB3aWR0aDogaS5zY3JvbGxiYXJYV2lkdGggLSBpLnJhaWxCb3JkZXJYV2lkdGh9KTtcbiAgZG9tLmNzcyhpLnNjcm9sbGJhclksIHt0b3A6IGkuc2Nyb2xsYmFyWVRvcCwgaGVpZ2h0OiBpLnNjcm9sbGJhcllIZWlnaHQgLSBpLnJhaWxCb3JkZXJZV2lkdGh9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICB2YXIgaSA9IGluc3RhbmNlcy5nZXQoZWxlbWVudCk7XG5cbiAgaS5jb250YWluZXJXaWR0aCA9IGVsZW1lbnQuY2xpZW50V2lkdGg7XG4gIGkuY29udGFpbmVySGVpZ2h0ID0gZWxlbWVudC5jbGllbnRIZWlnaHQ7XG4gIGkuY29udGVudFdpZHRoID0gZWxlbWVudC5zY3JvbGxXaWR0aDtcbiAgaS5jb250ZW50SGVpZ2h0ID0gZWxlbWVudC5zY3JvbGxIZWlnaHQ7XG5cbiAgdmFyIGV4aXN0aW5nUmFpbHM7XG4gIGlmICghZWxlbWVudC5jb250YWlucyhpLnNjcm9sbGJhclhSYWlsKSkge1xuICAgIGV4aXN0aW5nUmFpbHMgPSBkb20ucXVlcnlDaGlsZHJlbihlbGVtZW50LCAnLnBzLXNjcm9sbGJhci14LXJhaWwnKTtcbiAgICBpZiAoZXhpc3RpbmdSYWlscy5sZW5ndGggPiAwKSB7XG4gICAgICBleGlzdGluZ1JhaWxzLmZvckVhY2goZnVuY3Rpb24gKHJhaWwpIHtcbiAgICAgICAgZG9tLnJlbW92ZShyYWlsKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBkb20uYXBwZW5kVG8oaS5zY3JvbGxiYXJYUmFpbCwgZWxlbWVudCk7XG4gIH1cbiAgaWYgKCFlbGVtZW50LmNvbnRhaW5zKGkuc2Nyb2xsYmFyWVJhaWwpKSB7XG4gICAgZXhpc3RpbmdSYWlscyA9IGRvbS5xdWVyeUNoaWxkcmVuKGVsZW1lbnQsICcucHMtc2Nyb2xsYmFyLXktcmFpbCcpO1xuICAgIGlmIChleGlzdGluZ1JhaWxzLmxlbmd0aCA+IDApIHtcbiAgICAgIGV4aXN0aW5nUmFpbHMuZm9yRWFjaChmdW5jdGlvbiAocmFpbCkge1xuICAgICAgICBkb20ucmVtb3ZlKHJhaWwpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGRvbS5hcHBlbmRUbyhpLnNjcm9sbGJhcllSYWlsLCBlbGVtZW50KTtcbiAgfVxuXG4gIGlmICghaS5zZXR0aW5ncy5zdXBwcmVzc1Njcm9sbFggJiYgaS5jb250YWluZXJXaWR0aCArIGkuc2V0dGluZ3Muc2Nyb2xsWE1hcmdpbk9mZnNldCA8IGkuY29udGVudFdpZHRoKSB7XG4gICAgaS5zY3JvbGxiYXJYQWN0aXZlID0gdHJ1ZTtcbiAgICBpLnJhaWxYV2lkdGggPSBpLmNvbnRhaW5lcldpZHRoIC0gaS5yYWlsWE1hcmdpbldpZHRoO1xuICAgIGkucmFpbFhSYXRpbyA9IGkuY29udGFpbmVyV2lkdGggLyBpLnJhaWxYV2lkdGg7XG4gICAgaS5zY3JvbGxiYXJYV2lkdGggPSBnZXRUaHVtYlNpemUoaSwgXy50b0ludChpLnJhaWxYV2lkdGggKiBpLmNvbnRhaW5lcldpZHRoIC8gaS5jb250ZW50V2lkdGgpKTtcbiAgICBpLnNjcm9sbGJhclhMZWZ0ID0gXy50b0ludCgoaS5uZWdhdGl2ZVNjcm9sbEFkanVzdG1lbnQgKyBlbGVtZW50LnNjcm9sbExlZnQpICogKGkucmFpbFhXaWR0aCAtIGkuc2Nyb2xsYmFyWFdpZHRoKSAvIChpLmNvbnRlbnRXaWR0aCAtIGkuY29udGFpbmVyV2lkdGgpKTtcbiAgfSBlbHNlIHtcbiAgICBpLnNjcm9sbGJhclhBY3RpdmUgPSBmYWxzZTtcbiAgfVxuXG4gIGlmICghaS5zZXR0aW5ncy5zdXBwcmVzc1Njcm9sbFkgJiYgaS5jb250YWluZXJIZWlnaHQgKyBpLnNldHRpbmdzLnNjcm9sbFlNYXJnaW5PZmZzZXQgPCBpLmNvbnRlbnRIZWlnaHQpIHtcbiAgICBpLnNjcm9sbGJhcllBY3RpdmUgPSB0cnVlO1xuICAgIGkucmFpbFlIZWlnaHQgPSBpLmNvbnRhaW5lckhlaWdodCAtIGkucmFpbFlNYXJnaW5IZWlnaHQ7XG4gICAgaS5yYWlsWVJhdGlvID0gaS5jb250YWluZXJIZWlnaHQgLyBpLnJhaWxZSGVpZ2h0O1xuICAgIGkuc2Nyb2xsYmFyWUhlaWdodCA9IGdldFRodW1iU2l6ZShpLCBfLnRvSW50KGkucmFpbFlIZWlnaHQgKiBpLmNvbnRhaW5lckhlaWdodCAvIGkuY29udGVudEhlaWdodCkpO1xuICAgIGkuc2Nyb2xsYmFyWVRvcCA9IF8udG9JbnQoZWxlbWVudC5zY3JvbGxUb3AgKiAoaS5yYWlsWUhlaWdodCAtIGkuc2Nyb2xsYmFyWUhlaWdodCkgLyAoaS5jb250ZW50SGVpZ2h0IC0gaS5jb250YWluZXJIZWlnaHQpKTtcbiAgfSBlbHNlIHtcbiAgICBpLnNjcm9sbGJhcllBY3RpdmUgPSBmYWxzZTtcbiAgfVxuXG4gIGlmIChpLnNjcm9sbGJhclhMZWZ0ID49IGkucmFpbFhXaWR0aCAtIGkuc2Nyb2xsYmFyWFdpZHRoKSB7XG4gICAgaS5zY3JvbGxiYXJYTGVmdCA9IGkucmFpbFhXaWR0aCAtIGkuc2Nyb2xsYmFyWFdpZHRoO1xuICB9XG4gIGlmIChpLnNjcm9sbGJhcllUb3AgPj0gaS5yYWlsWUhlaWdodCAtIGkuc2Nyb2xsYmFyWUhlaWdodCkge1xuICAgIGkuc2Nyb2xsYmFyWVRvcCA9IGkucmFpbFlIZWlnaHQgLSBpLnNjcm9sbGJhcllIZWlnaHQ7XG4gIH1cblxuICB1cGRhdGVDc3MoZWxlbWVudCwgaSk7XG5cbiAgaWYgKGkuc2Nyb2xsYmFyWEFjdGl2ZSkge1xuICAgIGNscy5hZGQoZWxlbWVudCwgJ3BzLWFjdGl2ZS14Jyk7XG4gIH0gZWxzZSB7XG4gICAgY2xzLnJlbW92ZShlbGVtZW50LCAncHMtYWN0aXZlLXgnKTtcbiAgICBpLnNjcm9sbGJhclhXaWR0aCA9IDA7XG4gICAgaS5zY3JvbGxiYXJYTGVmdCA9IDA7XG4gICAgdXBkYXRlU2Nyb2xsKGVsZW1lbnQsICdsZWZ0JywgMCk7XG4gIH1cbiAgaWYgKGkuc2Nyb2xsYmFyWUFjdGl2ZSkge1xuICAgIGNscy5hZGQoZWxlbWVudCwgJ3BzLWFjdGl2ZS15Jyk7XG4gIH0gZWxzZSB7XG4gICAgY2xzLnJlbW92ZShlbGVtZW50LCAncHMtYWN0aXZlLXknKTtcbiAgICBpLnNjcm9sbGJhcllIZWlnaHQgPSAwO1xuICAgIGkuc2Nyb2xsYmFyWVRvcCA9IDA7XG4gICAgdXBkYXRlU2Nyb2xsKGVsZW1lbnQsICd0b3AnLCAwKTtcbiAgfVxufTtcblxufSx7XCIuLi9saWIvY2xhc3NcIjoyLFwiLi4vbGliL2RvbVwiOjMsXCIuLi9saWIvaGVscGVyXCI6NixcIi4vaW5zdGFuY2VzXCI6MTgsXCIuL3VwZGF0ZS1zY3JvbGxcIjoyMH1dLDIwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxudmFyIGluc3RhbmNlcyA9IHJlcXVpcmUoJy4vaW5zdGFuY2VzJyk7XG5cbnZhciB1cEV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG52YXIgZG93bkV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG52YXIgbGVmdEV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG52YXIgcmlnaHRFdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xudmFyIHlFdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xudmFyIHhFdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xudmFyIHhTdGFydEV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG52YXIgeEVuZEV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG52YXIgeVN0YXJ0RXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbnZhciB5RW5kRXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbnZhciBsYXN0VG9wO1xudmFyIGxhc3RMZWZ0O1xuXG51cEV2ZW50LmluaXRFdmVudCgncHMtc2Nyb2xsLXVwJywgdHJ1ZSwgdHJ1ZSk7XG5kb3duRXZlbnQuaW5pdEV2ZW50KCdwcy1zY3JvbGwtZG93bicsIHRydWUsIHRydWUpO1xubGVmdEV2ZW50LmluaXRFdmVudCgncHMtc2Nyb2xsLWxlZnQnLCB0cnVlLCB0cnVlKTtcbnJpZ2h0RXZlbnQuaW5pdEV2ZW50KCdwcy1zY3JvbGwtcmlnaHQnLCB0cnVlLCB0cnVlKTtcbnlFdmVudC5pbml0RXZlbnQoJ3BzLXNjcm9sbC15JywgdHJ1ZSwgdHJ1ZSk7XG54RXZlbnQuaW5pdEV2ZW50KCdwcy1zY3JvbGwteCcsIHRydWUsIHRydWUpO1xueFN0YXJ0RXZlbnQuaW5pdEV2ZW50KCdwcy14LXJlYWNoLXN0YXJ0JywgdHJ1ZSwgdHJ1ZSk7XG54RW5kRXZlbnQuaW5pdEV2ZW50KCdwcy14LXJlYWNoLWVuZCcsIHRydWUsIHRydWUpO1xueVN0YXJ0RXZlbnQuaW5pdEV2ZW50KCdwcy15LXJlYWNoLXN0YXJ0JywgdHJ1ZSwgdHJ1ZSk7XG55RW5kRXZlbnQuaW5pdEV2ZW50KCdwcy15LXJlYWNoLWVuZCcsIHRydWUsIHRydWUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChlbGVtZW50LCBheGlzLCB2YWx1ZSkge1xuICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgdGhyb3cgJ1lvdSBtdXN0IHByb3ZpZGUgYW4gZWxlbWVudCB0byB0aGUgdXBkYXRlLXNjcm9sbCBmdW5jdGlvbic7XG4gIH1cblxuICBpZiAodHlwZW9mIGF4aXMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgdGhyb3cgJ1lvdSBtdXN0IHByb3ZpZGUgYW4gYXhpcyB0byB0aGUgdXBkYXRlLXNjcm9sbCBmdW5jdGlvbic7XG4gIH1cblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJykge1xuICAgIHRocm93ICdZb3UgbXVzdCBwcm92aWRlIGEgdmFsdWUgdG8gdGhlIHVwZGF0ZS1zY3JvbGwgZnVuY3Rpb24nO1xuICB9XG5cbiAgaWYgKGF4aXMgPT09ICd0b3AnICYmIHZhbHVlIDw9IDApIHtcbiAgICBlbGVtZW50LnNjcm9sbFRvcCA9IHZhbHVlID0gMDsgLy8gZG9uJ3QgYWxsb3cgbmVnYXRpdmUgc2Nyb2xsXG4gICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KHlTdGFydEV2ZW50KTtcbiAgfVxuXG4gIGlmIChheGlzID09PSAnbGVmdCcgJiYgdmFsdWUgPD0gMCkge1xuICAgIGVsZW1lbnQuc2Nyb2xsTGVmdCA9IHZhbHVlID0gMDsgLy8gZG9uJ3QgYWxsb3cgbmVnYXRpdmUgc2Nyb2xsXG4gICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KHhTdGFydEV2ZW50KTtcbiAgfVxuXG4gIHZhciBpID0gaW5zdGFuY2VzLmdldChlbGVtZW50KTtcblxuICBpZiAoYXhpcyA9PT0gJ3RvcCcgJiYgdmFsdWUgPj0gaS5jb250ZW50SGVpZ2h0IC0gaS5jb250YWluZXJIZWlnaHQpIHtcbiAgICAvLyBkb24ndCBhbGxvdyBzY3JvbGwgcGFzdCBjb250YWluZXJcbiAgICB2YWx1ZSA9IGkuY29udGVudEhlaWdodCAtIGkuY29udGFpbmVySGVpZ2h0O1xuICAgIGlmICh2YWx1ZSAtIGVsZW1lbnQuc2Nyb2xsVG9wIDw9IDEpIHtcbiAgICAgIC8vIG1pdGlnYXRlcyByb3VuZGluZyBlcnJvcnMgb24gbm9uLXN1YnBpeGVsIHNjcm9sbCB2YWx1ZXNcbiAgICAgIHZhbHVlID0gZWxlbWVudC5zY3JvbGxUb3A7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQuc2Nyb2xsVG9wID0gdmFsdWU7XG4gICAgfVxuICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudCh5RW5kRXZlbnQpO1xuICB9XG5cbiAgaWYgKGF4aXMgPT09ICdsZWZ0JyAmJiB2YWx1ZSA+PSBpLmNvbnRlbnRXaWR0aCAtIGkuY29udGFpbmVyV2lkdGgpIHtcbiAgICAvLyBkb24ndCBhbGxvdyBzY3JvbGwgcGFzdCBjb250YWluZXJcbiAgICB2YWx1ZSA9IGkuY29udGVudFdpZHRoIC0gaS5jb250YWluZXJXaWR0aDtcbiAgICBpZiAodmFsdWUgLSBlbGVtZW50LnNjcm9sbExlZnQgPD0gMSkge1xuICAgICAgLy8gbWl0aWdhdGVzIHJvdW5kaW5nIGVycm9ycyBvbiBub24tc3VicGl4ZWwgc2Nyb2xsIHZhbHVlc1xuICAgICAgdmFsdWUgPSBlbGVtZW50LnNjcm9sbExlZnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQuc2Nyb2xsTGVmdCA9IHZhbHVlO1xuICAgIH1cbiAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQoeEVuZEV2ZW50KTtcbiAgfVxuXG4gIGlmICghbGFzdFRvcCkge1xuICAgIGxhc3RUb3AgPSBlbGVtZW50LnNjcm9sbFRvcDtcbiAgfVxuXG4gIGlmICghbGFzdExlZnQpIHtcbiAgICBsYXN0TGVmdCA9IGVsZW1lbnQuc2Nyb2xsTGVmdDtcbiAgfVxuXG4gIGlmIChheGlzID09PSAndG9wJyAmJiB2YWx1ZSA8IGxhc3RUb3ApIHtcbiAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQodXBFdmVudCk7XG4gIH1cblxuICBpZiAoYXhpcyA9PT0gJ3RvcCcgJiYgdmFsdWUgPiBsYXN0VG9wKSB7XG4gICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KGRvd25FdmVudCk7XG4gIH1cblxuICBpZiAoYXhpcyA9PT0gJ2xlZnQnICYmIHZhbHVlIDwgbGFzdExlZnQpIHtcbiAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQobGVmdEV2ZW50KTtcbiAgfVxuXG4gIGlmIChheGlzID09PSAnbGVmdCcgJiYgdmFsdWUgPiBsYXN0TGVmdCkge1xuICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChyaWdodEV2ZW50KTtcbiAgfVxuXG4gIGlmIChheGlzID09PSAndG9wJykge1xuICAgIGVsZW1lbnQuc2Nyb2xsVG9wID0gbGFzdFRvcCA9IHZhbHVlO1xuICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudCh5RXZlbnQpO1xuICB9XG5cbiAgaWYgKGF4aXMgPT09ICdsZWZ0Jykge1xuICAgIGVsZW1lbnQuc2Nyb2xsTGVmdCA9IGxhc3RMZWZ0ID0gdmFsdWU7XG4gICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KHhFdmVudCk7XG4gIH1cblxufTtcblxufSx7XCIuL2luc3RhbmNlc1wiOjE4fV0sMjE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgXyA9IHJlcXVpcmUoJy4uL2xpYi9oZWxwZXInKTtcbnZhciBkb20gPSByZXF1aXJlKCcuLi9saWIvZG9tJyk7XG52YXIgaW5zdGFuY2VzID0gcmVxdWlyZSgnLi9pbnN0YW5jZXMnKTtcbnZhciB1cGRhdGVHZW9tZXRyeSA9IHJlcXVpcmUoJy4vdXBkYXRlLWdlb21ldHJ5Jyk7XG52YXIgdXBkYXRlU2Nyb2xsID0gcmVxdWlyZSgnLi91cGRhdGUtc2Nyb2xsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgdmFyIGkgPSBpbnN0YW5jZXMuZ2V0KGVsZW1lbnQpO1xuXG4gIGlmICghaSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIFJlY2FsY3VhdGUgbmVnYXRpdmUgc2Nyb2xsTGVmdCBhZGp1c3RtZW50XG4gIGkubmVnYXRpdmVTY3JvbGxBZGp1c3RtZW50ID0gaS5pc05lZ2F0aXZlU2Nyb2xsID8gZWxlbWVudC5zY3JvbGxXaWR0aCAtIGVsZW1lbnQuY2xpZW50V2lkdGggOiAwO1xuXG4gIC8vIFJlY2FsY3VsYXRlIHJhaWwgbWFyZ2luc1xuICBkb20uY3NzKGkuc2Nyb2xsYmFyWFJhaWwsICdkaXNwbGF5JywgJ2Jsb2NrJyk7XG4gIGRvbS5jc3MoaS5zY3JvbGxiYXJZUmFpbCwgJ2Rpc3BsYXknLCAnYmxvY2snKTtcbiAgaS5yYWlsWE1hcmdpbldpZHRoID0gXy50b0ludChkb20uY3NzKGkuc2Nyb2xsYmFyWFJhaWwsICdtYXJnaW5MZWZ0JykpICsgXy50b0ludChkb20uY3NzKGkuc2Nyb2xsYmFyWFJhaWwsICdtYXJnaW5SaWdodCcpKTtcbiAgaS5yYWlsWU1hcmdpbkhlaWdodCA9IF8udG9JbnQoZG9tLmNzcyhpLnNjcm9sbGJhcllSYWlsLCAnbWFyZ2luVG9wJykpICsgXy50b0ludChkb20uY3NzKGkuc2Nyb2xsYmFyWVJhaWwsICdtYXJnaW5Cb3R0b20nKSk7XG5cbiAgLy8gSGlkZSBzY3JvbGxiYXJzIG5vdCB0byBhZmZlY3Qgc2Nyb2xsV2lkdGggYW5kIHNjcm9sbEhlaWdodFxuICBkb20uY3NzKGkuc2Nyb2xsYmFyWFJhaWwsICdkaXNwbGF5JywgJ25vbmUnKTtcbiAgZG9tLmNzcyhpLnNjcm9sbGJhcllSYWlsLCAnZGlzcGxheScsICdub25lJyk7XG5cbiAgdXBkYXRlR2VvbWV0cnkoZWxlbWVudCk7XG5cbiAgLy8gVXBkYXRlIHRvcC9sZWZ0IHNjcm9sbCB0byB0cmlnZ2VyIGV2ZW50c1xuICB1cGRhdGVTY3JvbGwoZWxlbWVudCwgJ3RvcCcsIGVsZW1lbnQuc2Nyb2xsVG9wKTtcbiAgdXBkYXRlU2Nyb2xsKGVsZW1lbnQsICdsZWZ0JywgZWxlbWVudC5zY3JvbGxMZWZ0KTtcblxuICBkb20uY3NzKGkuc2Nyb2xsYmFyWFJhaWwsICdkaXNwbGF5JywgJycpO1xuICBkb20uY3NzKGkuc2Nyb2xsYmFyWVJhaWwsICdkaXNwbGF5JywgJycpO1xufTtcblxufSx7XCIuLi9saWIvZG9tXCI6MyxcIi4uL2xpYi9oZWxwZXJcIjo2LFwiLi9pbnN0YW5jZXNcIjoxOCxcIi4vdXBkYXRlLWdlb21ldHJ5XCI6MTksXCIuL3VwZGF0ZS1zY3JvbGxcIjoyMH1dfSx7fSxbMV0pO1xuIiwiKGZ1bmN0aW9uIChmYWN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICAvLyBBTURcbiAgICAgICAgZGVmaW5lKFsnanF1ZXJ5J10sIGZhY3RvcnkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIC8vIENvbW1vbkpTXG4gICAgICAgIGZhY3RvcnkocmVxdWlyZSgnanF1ZXJ5JykpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEJyb3dzZXIgZ2xvYmFsc1xuICAgICAgICBmYWN0b3J5KGpRdWVyeSk7XG4gICAgfVxufShmdW5jdGlvbiAoJCkge1xuICB2YXIgQ291bnRUbyA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy4kZWxlbWVudCA9ICQoZWxlbWVudCk7XG4gICAgdGhpcy5vcHRpb25zICA9ICQuZXh0ZW5kKHt9LCBDb3VudFRvLkRFRkFVTFRTLCB0aGlzLmRhdGFPcHRpb25zKCksIG9wdGlvbnMpO1xuICAgIHRoaXMuaW5pdCgpO1xuICB9O1xuXG4gIENvdW50VG8uREVGQVVMVFMgPSB7XG4gICAgZnJvbTogMCwgICAgICAgICAgICAgICAvLyB0aGUgbnVtYmVyIHRoZSBlbGVtZW50IHNob3VsZCBzdGFydCBhdFxuICAgIHRvOiAwLCAgICAgICAgICAgICAgICAgLy8gdGhlIG51bWJlciB0aGUgZWxlbWVudCBzaG91bGQgZW5kIGF0XG4gICAgc3BlZWQ6IDEwMDAsICAgICAgICAgICAvLyBob3cgbG9uZyBpdCBzaG91bGQgdGFrZSB0byBjb3VudCBiZXR3ZWVuIHRoZSB0YXJnZXQgbnVtYmVyc1xuICAgIHJlZnJlc2hJbnRlcnZhbDogMTAwLCAgLy8gaG93IG9mdGVuIHRoZSBlbGVtZW50IHNob3VsZCBiZSB1cGRhdGVkXG4gICAgZGVjaW1hbHM6IDAsICAgICAgICAgICAvLyB0aGUgbnVtYmVyIG9mIGRlY2ltYWwgcGxhY2VzIHRvIHNob3dcbiAgICBmb3JtYXR0ZXI6IGZvcm1hdHRlciwgIC8vIGhhbmRsZXIgZm9yIGZvcm1hdHRpbmcgdGhlIHZhbHVlIGJlZm9yZSByZW5kZXJpbmdcbiAgICBvblVwZGF0ZTogbnVsbCwgICAgICAgIC8vIGNhbGxiYWNrIG1ldGhvZCBmb3IgZXZlcnkgdGltZSB0aGUgZWxlbWVudCBpcyB1cGRhdGVkXG4gICAgb25Db21wbGV0ZTogbnVsbCAgICAgICAvLyBjYWxsYmFjayBtZXRob2QgZm9yIHdoZW4gdGhlIGVsZW1lbnQgZmluaXNoZXMgdXBkYXRpbmdcbiAgfTtcblxuICBDb3VudFRvLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMudmFsdWUgICAgID0gdGhpcy5vcHRpb25zLmZyb207XG4gICAgdGhpcy5sb29wcyAgICAgPSBNYXRoLmNlaWwodGhpcy5vcHRpb25zLnNwZWVkIC8gdGhpcy5vcHRpb25zLnJlZnJlc2hJbnRlcnZhbCk7XG4gICAgdGhpcy5sb29wQ291bnQgPSAwO1xuICAgIHRoaXMuaW5jcmVtZW50ID0gKHRoaXMub3B0aW9ucy50byAtIHRoaXMub3B0aW9ucy5mcm9tKSAvIHRoaXMubG9vcHM7XG4gIH07XG5cbiAgQ291bnRUby5wcm90b3R5cGUuZGF0YU9wdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICBmcm9tOiAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQuZGF0YSgnZnJvbScpLFxuICAgICAgdG86ICAgICAgICAgICAgICB0aGlzLiRlbGVtZW50LmRhdGEoJ3RvJyksXG4gICAgICBzcGVlZDogICAgICAgICAgIHRoaXMuJGVsZW1lbnQuZGF0YSgnc3BlZWQnKSxcbiAgICAgIHJlZnJlc2hJbnRlcnZhbDogdGhpcy4kZWxlbWVudC5kYXRhKCdyZWZyZXNoLWludGVydmFsJyksXG4gICAgICBkZWNpbWFsczogICAgICAgIHRoaXMuJGVsZW1lbnQuZGF0YSgnZGVjaW1hbHMnKVxuICAgIH07XG5cbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9wdGlvbnMpO1xuXG4gICAgZm9yICh2YXIgaSBpbiBrZXlzKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpXTtcblxuICAgICAgaWYgKHR5cGVvZihvcHRpb25zW2tleV0pID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBkZWxldGUgb3B0aW9uc1trZXldO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBvcHRpb25zO1xuICB9O1xuXG4gIENvdW50VG8ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnZhbHVlICs9IHRoaXMuaW5jcmVtZW50O1xuICAgIHRoaXMubG9vcENvdW50Kys7XG5cbiAgICB0aGlzLnJlbmRlcigpO1xuXG4gICAgaWYgKHR5cGVvZih0aGlzLm9wdGlvbnMub25VcGRhdGUpID09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5vblVwZGF0ZS5jYWxsKHRoaXMuJGVsZW1lbnQsIHRoaXMudmFsdWUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmxvb3BDb3VudCA+PSB0aGlzLmxvb3BzKSB7XG4gICAgICBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xuICAgICAgdGhpcy52YWx1ZSA9IHRoaXMub3B0aW9ucy50bztcblxuICAgICAgaWYgKHR5cGVvZih0aGlzLm9wdGlvbnMub25Db21wbGV0ZSkgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aGlzLm9wdGlvbnMub25Db21wbGV0ZS5jYWxsKHRoaXMuJGVsZW1lbnQsIHRoaXMudmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBDb3VudFRvLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGZvcm1hdHRlZFZhbHVlID0gdGhpcy5vcHRpb25zLmZvcm1hdHRlci5jYWxsKHRoaXMuJGVsZW1lbnQsIHRoaXMudmFsdWUsIHRoaXMub3B0aW9ucyk7XG4gICAgdGhpcy4kZWxlbWVudC50ZXh0KGZvcm1hdHRlZFZhbHVlKTtcbiAgfTtcblxuICBDb3VudFRvLnByb3RvdHlwZS5yZXN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc3RvcCgpO1xuICAgIHRoaXMuaW5pdCgpO1xuICAgIHRoaXMuc3RhcnQoKTtcbiAgfTtcblxuICBDb3VudFRvLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnN0b3AoKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICAgIHRoaXMuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCh0aGlzLnVwZGF0ZS5iaW5kKHRoaXMpLCB0aGlzLm9wdGlvbnMucmVmcmVzaEludGVydmFsKTtcbiAgfTtcblxuICBDb3VudFRvLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmludGVydmFsKSB7XG4gICAgICBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xuICAgIH1cbiAgfTtcblxuICBDb3VudFRvLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuaW50ZXJ2YWwpIHtcbiAgICAgIHRoaXMuc3RvcCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIGZvcm1hdHRlcih2YWx1ZSwgb3B0aW9ucykge1xuICAgIHJldHVybiB2YWx1ZS50b0ZpeGVkKG9wdGlvbnMuZGVjaW1hbHMpO1xuICB9XG5cbiAgJC5mbi5jb3VudFRvID0gZnVuY3Rpb24gKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzICAgPSAkKHRoaXMpO1xuICAgICAgdmFyIGRhdGEgICAgPSAkdGhpcy5kYXRhKCdjb3VudFRvJyk7XG4gICAgICB2YXIgaW5pdCAgICA9ICFkYXRhIHx8IHR5cGVvZihvcHRpb24pID09PSAnb2JqZWN0JztcbiAgICAgIHZhciBvcHRpb25zID0gdHlwZW9mKG9wdGlvbikgPT09ICdvYmplY3QnID8gb3B0aW9uIDoge307XG4gICAgICB2YXIgbWV0aG9kICA9IHR5cGVvZihvcHRpb24pID09PSAnc3RyaW5nJyA/IG9wdGlvbiA6ICdzdGFydCc7XG5cbiAgICAgIGlmIChpbml0KSB7XG4gICAgICAgIGlmIChkYXRhKSBkYXRhLnN0b3AoKTtcbiAgICAgICAgJHRoaXMuZGF0YSgnY291bnRUbycsIGRhdGEgPSBuZXcgQ291bnRUbyh0aGlzLCBvcHRpb25zKSk7XG4gICAgICB9XG5cbiAgICAgIGRhdGFbbWV0aG9kXS5jYWxsKGRhdGEpO1xuICAgIH0pO1xuICB9O1xufSkpO1xuIiwiLypcbiAgICAgXyBfICAgICAgXyAgICAgICBfXG4gX19ffCAoXykgX19ffCB8IF9fICAoXylfX19cbi8gX198IHwgfC8gX198IHwvIC8gIHwgLyBfX3xcblxcX18gXFwgfCB8IChfX3wgICA8IF8gfCBcXF9fIFxcXG58X19fL198X3xcXF9fX3xffFxcXyhfKS8gfF9fXy9cbiAgICAgICAgICAgICAgICAgICB8X18vXG5cbiBWZXJzaW9uOiAxLjUuOVxuICBBdXRob3I6IEtlbiBXaGVlbGVyXG4gV2Vic2l0ZTogaHR0cDovL2tlbndoZWVsZXIuZ2l0aHViLmlvXG4gICAgRG9jczogaHR0cDovL2tlbndoZWVsZXIuZ2l0aHViLmlvL3NsaWNrXG4gICAgUmVwbzogaHR0cDovL2dpdGh1Yi5jb20va2Vud2hlZWxlci9zbGlja1xuICBJc3N1ZXM6IGh0dHA6Ly9naXRodWIuY29tL2tlbndoZWVsZXIvc2xpY2svaXNzdWVzXG5cbiAqL1xuIWZ1bmN0aW9uKGEpe1widXNlIHN0cmljdFwiO1wiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wianF1ZXJ5XCJdLGEpOlwidW5kZWZpbmVkXCIhPXR5cGVvZiBleHBvcnRzP21vZHVsZS5leHBvcnRzPWEocmVxdWlyZShcImpxdWVyeVwiKSk6YShqUXVlcnkpfShmdW5jdGlvbihhKXtcInVzZSBzdHJpY3RcIjt2YXIgYj13aW5kb3cuU2xpY2t8fHt9O2I9ZnVuY3Rpb24oKXtmdW5jdGlvbiBjKGMsZCl7dmFyIGYsZT10aGlzO2UuZGVmYXVsdHM9e2FjY2Vzc2liaWxpdHk6ITAsYWRhcHRpdmVIZWlnaHQ6ITEsYXBwZW5kQXJyb3dzOmEoYyksYXBwZW5kRG90czphKGMpLGFycm93czohMCxhc05hdkZvcjpudWxsLHByZXZBcnJvdzonPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1yb2xlPVwibm9uZVwiIGNsYXNzPVwic2xpY2stcHJldlwiIGFyaWEtbGFiZWw9XCJQcmV2aW91c1wiIHRhYmluZGV4PVwiMFwiIHJvbGU9XCJidXR0b25cIj5QcmV2aW91czwvYnV0dG9uPicsbmV4dEFycm93Oic8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLXJvbGU9XCJub25lXCIgY2xhc3M9XCJzbGljay1uZXh0XCIgYXJpYS1sYWJlbD1cIk5leHRcIiB0YWJpbmRleD1cIjBcIiByb2xlPVwiYnV0dG9uXCI+TmV4dDwvYnV0dG9uPicsYXV0b3BsYXk6ITEsYXV0b3BsYXlTcGVlZDozZTMsY2VudGVyTW9kZTohMSxjZW50ZXJQYWRkaW5nOlwiNTBweFwiLGNzc0Vhc2U6XCJlYXNlXCIsY3VzdG9tUGFnaW5nOmZ1bmN0aW9uKGEsYil7cmV0dXJuJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtcm9sZT1cIm5vbmVcIiByb2xlPVwiYnV0dG9uXCIgYXJpYS1yZXF1aXJlZD1cImZhbHNlXCIgdGFiaW5kZXg9XCIwXCI+JysoYisxKStcIjwvYnV0dG9uPlwifSxkb3RzOiExLGRvdHNDbGFzczpcInNsaWNrLWRvdHNcIixkcmFnZ2FibGU6ITAsZWFzaW5nOlwibGluZWFyXCIsZWRnZUZyaWN0aW9uOi4zNSxmYWRlOiExLGZvY3VzT25TZWxlY3Q6ITEsaW5maW5pdGU6ITAsaW5pdGlhbFNsaWRlOjAsbGF6eUxvYWQ6XCJvbmRlbWFuZFwiLG1vYmlsZUZpcnN0OiExLHBhdXNlT25Ib3ZlcjohMCxwYXVzZU9uRG90c0hvdmVyOiExLHJlc3BvbmRUbzpcIndpbmRvd1wiLHJlc3BvbnNpdmU6bnVsbCxyb3dzOjEscnRsOiExLHNsaWRlOlwiXCIsc2xpZGVzUGVyUm93OjEsc2xpZGVzVG9TaG93OjEsc2xpZGVzVG9TY3JvbGw6MSxzcGVlZDo1MDAsc3dpcGU6ITAsc3dpcGVUb1NsaWRlOiExLHRvdWNoTW92ZTohMCx0b3VjaFRocmVzaG9sZDo1LHVzZUNTUzohMCx1c2VUcmFuc2Zvcm06ITEsdmFyaWFibGVXaWR0aDohMSx2ZXJ0aWNhbDohMSx2ZXJ0aWNhbFN3aXBpbmc6ITEsd2FpdEZvckFuaW1hdGU6ITAsekluZGV4OjFlM30sZS5pbml0aWFscz17YW5pbWF0aW5nOiExLGRyYWdnaW5nOiExLGF1dG9QbGF5VGltZXI6bnVsbCxjdXJyZW50RGlyZWN0aW9uOjAsY3VycmVudExlZnQ6bnVsbCxjdXJyZW50U2xpZGU6MCxkaXJlY3Rpb246MSwkZG90czpudWxsLGxpc3RXaWR0aDpudWxsLGxpc3RIZWlnaHQ6bnVsbCxsb2FkSW5kZXg6MCwkbmV4dEFycm93Om51bGwsJHByZXZBcnJvdzpudWxsLHNsaWRlQ291bnQ6bnVsbCxzbGlkZVdpZHRoOm51bGwsJHNsaWRlVHJhY2s6bnVsbCwkc2xpZGVzOm51bGwsc2xpZGluZzohMSxzbGlkZU9mZnNldDowLHN3aXBlTGVmdDpudWxsLCRsaXN0Om51bGwsdG91Y2hPYmplY3Q6e30sdHJhbnNmb3Jtc0VuYWJsZWQ6ITEsdW5zbGlja2VkOiExfSxhLmV4dGVuZChlLGUuaW5pdGlhbHMpLGUuYWN0aXZlQnJlYWtwb2ludD1udWxsLGUuYW5pbVR5cGU9bnVsbCxlLmFuaW1Qcm9wPW51bGwsZS5icmVha3BvaW50cz1bXSxlLmJyZWFrcG9pbnRTZXR0aW5ncz1bXSxlLmNzc1RyYW5zaXRpb25zPSExLGUuaGlkZGVuPVwiaGlkZGVuXCIsZS5wYXVzZWQ9ITEsZS5wb3NpdGlvblByb3A9bnVsbCxlLnJlc3BvbmRUbz1udWxsLGUucm93Q291bnQ9MSxlLnNob3VsZENsaWNrPSEwLGUuJHNsaWRlcj1hKGMpLGUuJHNsaWRlc0NhY2hlPW51bGwsZS50cmFuc2Zvcm1UeXBlPW51bGwsZS50cmFuc2l0aW9uVHlwZT1udWxsLGUudmlzaWJpbGl0eUNoYW5nZT1cInZpc2liaWxpdHljaGFuZ2VcIixlLndpbmRvd1dpZHRoPTAsZS53aW5kb3dUaW1lcj1udWxsLGY9YShjKS5kYXRhKFwic2xpY2tcIil8fHt9LGUub3B0aW9ucz1hLmV4dGVuZCh7fSxlLmRlZmF1bHRzLGYsZCksZS5jdXJyZW50U2xpZGU9ZS5vcHRpb25zLmluaXRpYWxTbGlkZSxlLm9yaWdpbmFsU2V0dGluZ3M9ZS5vcHRpb25zLFwidW5kZWZpbmVkXCIhPXR5cGVvZiBkb2N1bWVudC5tb3pIaWRkZW4/KGUuaGlkZGVuPVwibW96SGlkZGVuXCIsZS52aXNpYmlsaXR5Q2hhbmdlPVwibW96dmlzaWJpbGl0eWNoYW5nZVwiKTpcInVuZGVmaW5lZFwiIT10eXBlb2YgZG9jdW1lbnQud2Via2l0SGlkZGVuJiYoZS5oaWRkZW49XCJ3ZWJraXRIaWRkZW5cIixlLnZpc2liaWxpdHlDaGFuZ2U9XCJ3ZWJraXR2aXNpYmlsaXR5Y2hhbmdlXCIpLGUuYXV0b1BsYXk9YS5wcm94eShlLmF1dG9QbGF5LGUpLGUuYXV0b1BsYXlDbGVhcj1hLnByb3h5KGUuYXV0b1BsYXlDbGVhcixlKSxlLmNoYW5nZVNsaWRlPWEucHJveHkoZS5jaGFuZ2VTbGlkZSxlKSxlLmNsaWNrSGFuZGxlcj1hLnByb3h5KGUuY2xpY2tIYW5kbGVyLGUpLGUuc2VsZWN0SGFuZGxlcj1hLnByb3h5KGUuc2VsZWN0SGFuZGxlcixlKSxlLnNldFBvc2l0aW9uPWEucHJveHkoZS5zZXRQb3NpdGlvbixlKSxlLnN3aXBlSGFuZGxlcj1hLnByb3h5KGUuc3dpcGVIYW5kbGVyLGUpLGUuZHJhZ0hhbmRsZXI9YS5wcm94eShlLmRyYWdIYW5kbGVyLGUpLGUua2V5SGFuZGxlcj1hLnByb3h5KGUua2V5SGFuZGxlcixlKSxlLmF1dG9QbGF5SXRlcmF0b3I9YS5wcm94eShlLmF1dG9QbGF5SXRlcmF0b3IsZSksZS5pbnN0YW5jZVVpZD1iKyssZS5odG1sRXhwcj0vXig/OlxccyooPFtcXHdcXFddKz4pW14+XSopJC8sZS5yZWdpc3RlckJyZWFrcG9pbnRzKCksZS5pbml0KCEwKSxlLmNoZWNrUmVzcG9uc2l2ZSghMCl9dmFyIGI9MDtyZXR1cm4gY30oKSxiLnByb3RvdHlwZS5hZGRTbGlkZT1iLnByb3RvdHlwZS5zbGlja0FkZD1mdW5jdGlvbihiLGMsZCl7dmFyIGU9dGhpcztpZihcImJvb2xlYW5cIj09dHlwZW9mIGMpZD1jLGM9bnVsbDtlbHNlIGlmKDA+Y3x8Yz49ZS5zbGlkZUNvdW50KXJldHVybiExO2UudW5sb2FkKCksXCJudW1iZXJcIj09dHlwZW9mIGM/MD09PWMmJjA9PT1lLiRzbGlkZXMubGVuZ3RoP2EoYikuYXBwZW5kVG8oZS4kc2xpZGVUcmFjayk6ZD9hKGIpLmluc2VydEJlZm9yZShlLiRzbGlkZXMuZXEoYykpOmEoYikuaW5zZXJ0QWZ0ZXIoZS4kc2xpZGVzLmVxKGMpKTpkPT09ITA/YShiKS5wcmVwZW5kVG8oZS4kc2xpZGVUcmFjayk6YShiKS5hcHBlbmRUbyhlLiRzbGlkZVRyYWNrKSxlLiRzbGlkZXM9ZS4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpLGUuJHNsaWRlVHJhY2suY2hpbGRyZW4odGhpcy5vcHRpb25zLnNsaWRlKS5kZXRhY2goKSxlLiRzbGlkZVRyYWNrLmFwcGVuZChlLiRzbGlkZXMpLGUuJHNsaWRlcy5lYWNoKGZ1bmN0aW9uKGIsYyl7YShjKS5hdHRyKFwiZGF0YS1zbGljay1pbmRleFwiLGIpfSksZS4kc2xpZGVzQ2FjaGU9ZS4kc2xpZGVzLGUucmVpbml0KCl9LGIucHJvdG90eXBlLmFuaW1hdGVIZWlnaHQ9ZnVuY3Rpb24oKXt2YXIgYT10aGlzO2lmKDE9PT1hLm9wdGlvbnMuc2xpZGVzVG9TaG93JiZhLm9wdGlvbnMuYWRhcHRpdmVIZWlnaHQ9PT0hMCYmYS5vcHRpb25zLnZlcnRpY2FsPT09ITEpe3ZhciBiPWEuJHNsaWRlcy5lcShhLmN1cnJlbnRTbGlkZSkub3V0ZXJIZWlnaHQoITApO2EuJGxpc3QuYW5pbWF0ZSh7aGVpZ2h0OmJ9LGEub3B0aW9ucy5zcGVlZCl9fSxiLnByb3RvdHlwZS5hbmltYXRlU2xpZGU9ZnVuY3Rpb24oYixjKXt2YXIgZD17fSxlPXRoaXM7ZS5hbmltYXRlSGVpZ2h0KCksZS5vcHRpb25zLnJ0bD09PSEwJiZlLm9wdGlvbnMudmVydGljYWw9PT0hMSYmKGI9LWIpLGUudHJhbnNmb3Jtc0VuYWJsZWQ9PT0hMT9lLm9wdGlvbnMudmVydGljYWw9PT0hMT9lLiRzbGlkZVRyYWNrLmFuaW1hdGUoe2xlZnQ6Yn0sZS5vcHRpb25zLnNwZWVkLGUub3B0aW9ucy5lYXNpbmcsYyk6ZS4kc2xpZGVUcmFjay5hbmltYXRlKHt0b3A6Yn0sZS5vcHRpb25zLnNwZWVkLGUub3B0aW9ucy5lYXNpbmcsYyk6ZS5jc3NUcmFuc2l0aW9ucz09PSExPyhlLm9wdGlvbnMucnRsPT09ITAmJihlLmN1cnJlbnRMZWZ0PS1lLmN1cnJlbnRMZWZ0KSxhKHthbmltU3RhcnQ6ZS5jdXJyZW50TGVmdH0pLmFuaW1hdGUoe2FuaW1TdGFydDpifSx7ZHVyYXRpb246ZS5vcHRpb25zLnNwZWVkLGVhc2luZzplLm9wdGlvbnMuZWFzaW5nLHN0ZXA6ZnVuY3Rpb24oYSl7YT1NYXRoLmNlaWwoYSksZS5vcHRpb25zLnZlcnRpY2FsPT09ITE/KGRbZS5hbmltVHlwZV09XCJ0cmFuc2xhdGUoXCIrYStcInB4LCAwcHgpXCIsZS4kc2xpZGVUcmFjay5jc3MoZCkpOihkW2UuYW5pbVR5cGVdPVwidHJhbnNsYXRlKDBweCxcIithK1wicHgpXCIsZS4kc2xpZGVUcmFjay5jc3MoZCkpfSxjb21wbGV0ZTpmdW5jdGlvbigpe2MmJmMuY2FsbCgpfX0pKTooZS5hcHBseVRyYW5zaXRpb24oKSxiPU1hdGguY2VpbChiKSxlLm9wdGlvbnMudmVydGljYWw9PT0hMT9kW2UuYW5pbVR5cGVdPVwidHJhbnNsYXRlM2QoXCIrYitcInB4LCAwcHgsIDBweClcIjpkW2UuYW5pbVR5cGVdPVwidHJhbnNsYXRlM2QoMHB4LFwiK2IrXCJweCwgMHB4KVwiLGUuJHNsaWRlVHJhY2suY3NzKGQpLGMmJnNldFRpbWVvdXQoZnVuY3Rpb24oKXtlLmRpc2FibGVUcmFuc2l0aW9uKCksYy5jYWxsKCl9LGUub3B0aW9ucy5zcGVlZCkpfSxiLnByb3RvdHlwZS5hc05hdkZvcj1mdW5jdGlvbihiKXt2YXIgYz10aGlzLGQ9Yy5vcHRpb25zLmFzTmF2Rm9yO2QmJm51bGwhPT1kJiYoZD1hKGQpLm5vdChjLiRzbGlkZXIpKSxudWxsIT09ZCYmXCJvYmplY3RcIj09dHlwZW9mIGQmJmQuZWFjaChmdW5jdGlvbigpe3ZhciBjPWEodGhpcykuc2xpY2soXCJnZXRTbGlja1wiKTtjLnVuc2xpY2tlZHx8Yy5zbGlkZUhhbmRsZXIoYiwhMCl9KX0sYi5wcm90b3R5cGUuYXBwbHlUcmFuc2l0aW9uPWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMsYz17fTtiLm9wdGlvbnMuZmFkZT09PSExP2NbYi50cmFuc2l0aW9uVHlwZV09Yi50cmFuc2Zvcm1UeXBlK1wiIFwiK2Iub3B0aW9ucy5zcGVlZCtcIm1zIFwiK2Iub3B0aW9ucy5jc3NFYXNlOmNbYi50cmFuc2l0aW9uVHlwZV09XCJvcGFjaXR5IFwiK2Iub3B0aW9ucy5zcGVlZCtcIm1zIFwiK2Iub3B0aW9ucy5jc3NFYXNlLGIub3B0aW9ucy5mYWRlPT09ITE/Yi4kc2xpZGVUcmFjay5jc3MoYyk6Yi4kc2xpZGVzLmVxKGEpLmNzcyhjKX0sYi5wcm90b3R5cGUuYXV0b1BsYXk9ZnVuY3Rpb24oKXt2YXIgYT10aGlzO2EuYXV0b1BsYXlUaW1lciYmY2xlYXJJbnRlcnZhbChhLmF1dG9QbGF5VGltZXIpLGEuc2xpZGVDb3VudD5hLm9wdGlvbnMuc2xpZGVzVG9TaG93JiZhLnBhdXNlZCE9PSEwJiYoYS5hdXRvUGxheVRpbWVyPXNldEludGVydmFsKGEuYXV0b1BsYXlJdGVyYXRvcixhLm9wdGlvbnMuYXV0b3BsYXlTcGVlZCkpfSxiLnByb3RvdHlwZS5hdXRvUGxheUNsZWFyPWZ1bmN0aW9uKCl7dmFyIGE9dGhpczthLmF1dG9QbGF5VGltZXImJmNsZWFySW50ZXJ2YWwoYS5hdXRvUGxheVRpbWVyKX0sYi5wcm90b3R5cGUuYXV0b1BsYXlJdGVyYXRvcj1mdW5jdGlvbigpe3ZhciBhPXRoaXM7YS5vcHRpb25zLmluZmluaXRlPT09ITE/MT09PWEuZGlyZWN0aW9uPyhhLmN1cnJlbnRTbGlkZSsxPT09YS5zbGlkZUNvdW50LTEmJihhLmRpcmVjdGlvbj0wKSxhLnNsaWRlSGFuZGxlcihhLmN1cnJlbnRTbGlkZSthLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwpKTooYS5jdXJyZW50U2xpZGUtMT09PTAmJihhLmRpcmVjdGlvbj0xKSxhLnNsaWRlSGFuZGxlcihhLmN1cnJlbnRTbGlkZS1hLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwpKTphLnNsaWRlSGFuZGxlcihhLmN1cnJlbnRTbGlkZSthLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwpfSxiLnByb3RvdHlwZS5idWlsZEFycm93cz1mdW5jdGlvbigpe3ZhciBiPXRoaXM7Yi5vcHRpb25zLmFycm93cz09PSEwJiYoYi4kcHJldkFycm93PWEoYi5vcHRpb25zLnByZXZBcnJvdykuYWRkQ2xhc3MoXCJzbGljay1hcnJvd1wiKSxiLiRuZXh0QXJyb3c9YShiLm9wdGlvbnMubmV4dEFycm93KS5hZGRDbGFzcyhcInNsaWNrLWFycm93XCIpLGIuc2xpZGVDb3VudD5iLm9wdGlvbnMuc2xpZGVzVG9TaG93PyhiLiRwcmV2QXJyb3cucmVtb3ZlQ2xhc3MoXCJzbGljay1oaWRkZW5cIikucmVtb3ZlQXR0cihcImFyaWEtaGlkZGVuIHRhYmluZGV4XCIpLGIuJG5leHRBcnJvdy5yZW1vdmVDbGFzcyhcInNsaWNrLWhpZGRlblwiKS5yZW1vdmVBdHRyKFwiYXJpYS1oaWRkZW4gdGFiaW5kZXhcIiksYi5odG1sRXhwci50ZXN0KGIub3B0aW9ucy5wcmV2QXJyb3cpJiZiLiRwcmV2QXJyb3cucHJlcGVuZFRvKGIub3B0aW9ucy5hcHBlbmRBcnJvd3MpLGIuaHRtbEV4cHIudGVzdChiLm9wdGlvbnMubmV4dEFycm93KSYmYi4kbmV4dEFycm93LmFwcGVuZFRvKGIub3B0aW9ucy5hcHBlbmRBcnJvd3MpLGIub3B0aW9ucy5pbmZpbml0ZSE9PSEwJiZiLiRwcmV2QXJyb3cuYWRkQ2xhc3MoXCJzbGljay1kaXNhYmxlZFwiKS5hdHRyKFwiYXJpYS1kaXNhYmxlZFwiLFwidHJ1ZVwiKSk6Yi4kcHJldkFycm93LmFkZChiLiRuZXh0QXJyb3cpLmFkZENsYXNzKFwic2xpY2staGlkZGVuXCIpLmF0dHIoe1wiYXJpYS1kaXNhYmxlZFwiOlwidHJ1ZVwiLHRhYmluZGV4OlwiLTFcIn0pKX0sYi5wcm90b3R5cGUuYnVpbGREb3RzPWZ1bmN0aW9uKCl7dmFyIGMsZCxiPXRoaXM7aWYoYi5vcHRpb25zLmRvdHM9PT0hMCYmYi5zbGlkZUNvdW50PmIub3B0aW9ucy5zbGlkZXNUb1Nob3cpe2ZvcihkPSc8dWwgY2xhc3M9XCInK2Iub3B0aW9ucy5kb3RzQ2xhc3MrJ1wiPicsYz0wO2M8PWIuZ2V0RG90Q291bnQoKTtjKz0xKWQrPVwiPGxpPlwiK2Iub3B0aW9ucy5jdXN0b21QYWdpbmcuY2FsbCh0aGlzLGIsYykrXCI8L2xpPlwiO2QrPVwiPC91bD5cIixiLiRkb3RzPWEoZCkuYXBwZW5kVG8oYi5vcHRpb25zLmFwcGVuZERvdHMpLGIuJGRvdHMuZmluZChcImxpXCIpLmZpcnN0KCkuYWRkQ2xhc3MoXCJzbGljay1hY3RpdmVcIikuYXR0cihcImFyaWEtaGlkZGVuXCIsXCJmYWxzZVwiKX19LGIucHJvdG90eXBlLmJ1aWxkT3V0PWZ1bmN0aW9uKCl7dmFyIGI9dGhpcztiLiRzbGlkZXM9Yi4kc2xpZGVyLmNoaWxkcmVuKGIub3B0aW9ucy5zbGlkZStcIjpub3QoLnNsaWNrLWNsb25lZClcIikuYWRkQ2xhc3MoXCJzbGljay1zbGlkZVwiKSxiLnNsaWRlQ291bnQ9Yi4kc2xpZGVzLmxlbmd0aCxiLiRzbGlkZXMuZWFjaChmdW5jdGlvbihiLGMpe2EoYykuYXR0cihcImRhdGEtc2xpY2staW5kZXhcIixiKS5kYXRhKFwib3JpZ2luYWxTdHlsaW5nXCIsYShjKS5hdHRyKFwic3R5bGVcIil8fFwiXCIpfSksYi4kc2xpZGVyLmFkZENsYXNzKFwic2xpY2stc2xpZGVyXCIpLGIuJHNsaWRlVHJhY2s9MD09PWIuc2xpZGVDb3VudD9hKCc8ZGl2IGNsYXNzPVwic2xpY2stdHJhY2tcIi8+JykuYXBwZW5kVG8oYi4kc2xpZGVyKTpiLiRzbGlkZXMud3JhcEFsbCgnPGRpdiBjbGFzcz1cInNsaWNrLXRyYWNrXCIvPicpLnBhcmVudCgpLGIuJGxpc3Q9Yi4kc2xpZGVUcmFjay53cmFwKCc8ZGl2IGFyaWEtbGl2ZT1cInBvbGl0ZVwiIGNsYXNzPVwic2xpY2stbGlzdFwiLz4nKS5wYXJlbnQoKSxiLiRzbGlkZVRyYWNrLmNzcyhcIm9wYWNpdHlcIiwwKSwoYi5vcHRpb25zLmNlbnRlck1vZGU9PT0hMHx8Yi5vcHRpb25zLnN3aXBlVG9TbGlkZT09PSEwKSYmKGIub3B0aW9ucy5zbGlkZXNUb1Njcm9sbD0xKSxhKFwiaW1nW2RhdGEtbGF6eV1cIixiLiRzbGlkZXIpLm5vdChcIltzcmNdXCIpLmFkZENsYXNzKFwic2xpY2stbG9hZGluZ1wiKSxiLnNldHVwSW5maW5pdGUoKSxiLmJ1aWxkQXJyb3dzKCksYi5idWlsZERvdHMoKSxiLnVwZGF0ZURvdHMoKSxiLnNldFNsaWRlQ2xhc3NlcyhcIm51bWJlclwiPT10eXBlb2YgYi5jdXJyZW50U2xpZGU/Yi5jdXJyZW50U2xpZGU6MCksYi5vcHRpb25zLmRyYWdnYWJsZT09PSEwJiZiLiRsaXN0LmFkZENsYXNzKFwiZHJhZ2dhYmxlXCIpfSxiLnByb3RvdHlwZS5idWlsZFJvd3M9ZnVuY3Rpb24oKXt2YXIgYixjLGQsZSxmLGcsaCxhPXRoaXM7aWYoZT1kb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCksZz1hLiRzbGlkZXIuY2hpbGRyZW4oKSxhLm9wdGlvbnMucm93cz4xKXtmb3IoaD1hLm9wdGlvbnMuc2xpZGVzUGVyUm93KmEub3B0aW9ucy5yb3dzLGY9TWF0aC5jZWlsKGcubGVuZ3RoL2gpLGI9MDtmPmI7YisrKXt2YXIgaT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2ZvcihjPTA7YzxhLm9wdGlvbnMucm93cztjKyspe3ZhciBqPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7Zm9yKGQ9MDtkPGEub3B0aW9ucy5zbGlkZXNQZXJSb3c7ZCsrKXt2YXIgaz1iKmgrKGMqYS5vcHRpb25zLnNsaWRlc1BlclJvdytkKTtnLmdldChrKSYmai5hcHBlbmRDaGlsZChnLmdldChrKSl9aS5hcHBlbmRDaGlsZChqKX1lLmFwcGVuZENoaWxkKGkpfWEuJHNsaWRlci5odG1sKGUpLGEuJHNsaWRlci5jaGlsZHJlbigpLmNoaWxkcmVuKCkuY2hpbGRyZW4oKS5jc3Moe3dpZHRoOjEwMC9hLm9wdGlvbnMuc2xpZGVzUGVyUm93K1wiJVwiLGRpc3BsYXk6XCJpbmxpbmUtYmxvY2tcIn0pfX0sYi5wcm90b3R5cGUuY2hlY2tSZXNwb25zaXZlPWZ1bmN0aW9uKGIsYyl7dmFyIGUsZixnLGQ9dGhpcyxoPSExLGk9ZC4kc2xpZGVyLndpZHRoKCksaj13aW5kb3cuaW5uZXJXaWR0aHx8YSh3aW5kb3cpLndpZHRoKCk7aWYoXCJ3aW5kb3dcIj09PWQucmVzcG9uZFRvP2c9ajpcInNsaWRlclwiPT09ZC5yZXNwb25kVG8/Zz1pOlwibWluXCI9PT1kLnJlc3BvbmRUbyYmKGc9TWF0aC5taW4oaixpKSksZC5vcHRpb25zLnJlc3BvbnNpdmUmJmQub3B0aW9ucy5yZXNwb25zaXZlLmxlbmd0aCYmbnVsbCE9PWQub3B0aW9ucy5yZXNwb25zaXZlKXtmPW51bGw7Zm9yKGUgaW4gZC5icmVha3BvaW50cylkLmJyZWFrcG9pbnRzLmhhc093blByb3BlcnR5KGUpJiYoZC5vcmlnaW5hbFNldHRpbmdzLm1vYmlsZUZpcnN0PT09ITE/ZzxkLmJyZWFrcG9pbnRzW2VdJiYoZj1kLmJyZWFrcG9pbnRzW2VdKTpnPmQuYnJlYWtwb2ludHNbZV0mJihmPWQuYnJlYWtwb2ludHNbZV0pKTtudWxsIT09Zj9udWxsIT09ZC5hY3RpdmVCcmVha3BvaW50PyhmIT09ZC5hY3RpdmVCcmVha3BvaW50fHxjKSYmKGQuYWN0aXZlQnJlYWtwb2ludD1mLFwidW5zbGlja1wiPT09ZC5icmVha3BvaW50U2V0dGluZ3NbZl0/ZC51bnNsaWNrKGYpOihkLm9wdGlvbnM9YS5leHRlbmQoe30sZC5vcmlnaW5hbFNldHRpbmdzLGQuYnJlYWtwb2ludFNldHRpbmdzW2ZdKSxiPT09ITAmJihkLmN1cnJlbnRTbGlkZT1kLm9wdGlvbnMuaW5pdGlhbFNsaWRlKSxkLnJlZnJlc2goYikpLGg9Zik6KGQuYWN0aXZlQnJlYWtwb2ludD1mLFwidW5zbGlja1wiPT09ZC5icmVha3BvaW50U2V0dGluZ3NbZl0/ZC51bnNsaWNrKGYpOihkLm9wdGlvbnM9YS5leHRlbmQoe30sZC5vcmlnaW5hbFNldHRpbmdzLGQuYnJlYWtwb2ludFNldHRpbmdzW2ZdKSxiPT09ITAmJihkLmN1cnJlbnRTbGlkZT1kLm9wdGlvbnMuaW5pdGlhbFNsaWRlKSxkLnJlZnJlc2goYikpLGg9Zik6bnVsbCE9PWQuYWN0aXZlQnJlYWtwb2ludCYmKGQuYWN0aXZlQnJlYWtwb2ludD1udWxsLGQub3B0aW9ucz1kLm9yaWdpbmFsU2V0dGluZ3MsYj09PSEwJiYoZC5jdXJyZW50U2xpZGU9ZC5vcHRpb25zLmluaXRpYWxTbGlkZSksZC5yZWZyZXNoKGIpLGg9ZiksYnx8aD09PSExfHxkLiRzbGlkZXIudHJpZ2dlcihcImJyZWFrcG9pbnRcIixbZCxoXSl9fSxiLnByb3RvdHlwZS5jaGFuZ2VTbGlkZT1mdW5jdGlvbihiLGMpe3ZhciBmLGcsaCxkPXRoaXMsZT1hKGIudGFyZ2V0KTtzd2l0Y2goZS5pcyhcImFcIikmJmIucHJldmVudERlZmF1bHQoKSxlLmlzKFwibGlcIil8fChlPWUuY2xvc2VzdChcImxpXCIpKSxoPWQuc2xpZGVDb3VudCVkLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwhPT0wLGY9aD8wOihkLnNsaWRlQ291bnQtZC5jdXJyZW50U2xpZGUpJWQub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCxiLmRhdGEubWVzc2FnZSl7Y2FzZVwicHJldmlvdXNcIjpnPTA9PT1mP2Qub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDpkLm9wdGlvbnMuc2xpZGVzVG9TaG93LWYsZC5zbGlkZUNvdW50PmQub3B0aW9ucy5zbGlkZXNUb1Nob3cmJmQuc2xpZGVIYW5kbGVyKGQuY3VycmVudFNsaWRlLWcsITEsYyk7YnJlYWs7Y2FzZVwibmV4dFwiOmc9MD09PWY/ZC5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsOmYsZC5zbGlkZUNvdW50PmQub3B0aW9ucy5zbGlkZXNUb1Nob3cmJmQuc2xpZGVIYW5kbGVyKGQuY3VycmVudFNsaWRlK2csITEsYyk7YnJlYWs7Y2FzZVwiaW5kZXhcIjp2YXIgaT0wPT09Yi5kYXRhLmluZGV4PzA6Yi5kYXRhLmluZGV4fHxlLmluZGV4KCkqZC5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsO2Quc2xpZGVIYW5kbGVyKGQuY2hlY2tOYXZpZ2FibGUoaSksITEsYyksZS5jaGlsZHJlbigpLnRyaWdnZXIoXCJmb2N1c1wiKTticmVhaztkZWZhdWx0OnJldHVybn19LGIucHJvdG90eXBlLmNoZWNrTmF2aWdhYmxlPWZ1bmN0aW9uKGEpe3ZhciBjLGQsYj10aGlzO2lmKGM9Yi5nZXROYXZpZ2FibGVJbmRleGVzKCksZD0wLGE+Y1tjLmxlbmd0aC0xXSlhPWNbYy5sZW5ndGgtMV07ZWxzZSBmb3IodmFyIGUgaW4gYyl7aWYoYTxjW2VdKXthPWQ7YnJlYWt9ZD1jW2VdfXJldHVybiBhfSxiLnByb3RvdHlwZS5jbGVhblVwRXZlbnRzPWZ1bmN0aW9uKCl7dmFyIGI9dGhpcztiLm9wdGlvbnMuZG90cyYmbnVsbCE9PWIuJGRvdHMmJihhKFwibGlcIixiLiRkb3RzKS5vZmYoXCJjbGljay5zbGlja1wiLGIuY2hhbmdlU2xpZGUpLGIub3B0aW9ucy5wYXVzZU9uRG90c0hvdmVyPT09ITAmJmIub3B0aW9ucy5hdXRvcGxheT09PSEwJiZhKFwibGlcIixiLiRkb3RzKS5vZmYoXCJtb3VzZWVudGVyLnNsaWNrXCIsYS5wcm94eShiLnNldFBhdXNlZCxiLCEwKSkub2ZmKFwibW91c2VsZWF2ZS5zbGlja1wiLGEucHJveHkoYi5zZXRQYXVzZWQsYiwhMSkpKSxiLm9wdGlvbnMuYXJyb3dzPT09ITAmJmIuc2xpZGVDb3VudD5iLm9wdGlvbnMuc2xpZGVzVG9TaG93JiYoYi4kcHJldkFycm93JiZiLiRwcmV2QXJyb3cub2ZmKFwiY2xpY2suc2xpY2tcIixiLmNoYW5nZVNsaWRlKSxiLiRuZXh0QXJyb3cmJmIuJG5leHRBcnJvdy5vZmYoXCJjbGljay5zbGlja1wiLGIuY2hhbmdlU2xpZGUpKSxiLiRsaXN0Lm9mZihcInRvdWNoc3RhcnQuc2xpY2sgbW91c2Vkb3duLnNsaWNrXCIsYi5zd2lwZUhhbmRsZXIpLGIuJGxpc3Qub2ZmKFwidG91Y2htb3ZlLnNsaWNrIG1vdXNlbW92ZS5zbGlja1wiLGIuc3dpcGVIYW5kbGVyKSxiLiRsaXN0Lm9mZihcInRvdWNoZW5kLnNsaWNrIG1vdXNldXAuc2xpY2tcIixiLnN3aXBlSGFuZGxlciksYi4kbGlzdC5vZmYoXCJ0b3VjaGNhbmNlbC5zbGljayBtb3VzZWxlYXZlLnNsaWNrXCIsYi5zd2lwZUhhbmRsZXIpLGIuJGxpc3Qub2ZmKFwiY2xpY2suc2xpY2tcIixiLmNsaWNrSGFuZGxlciksYShkb2N1bWVudCkub2ZmKGIudmlzaWJpbGl0eUNoYW5nZSxiLnZpc2liaWxpdHkpLGIuJGxpc3Qub2ZmKFwibW91c2VlbnRlci5zbGlja1wiLGEucHJveHkoYi5zZXRQYXVzZWQsYiwhMCkpLGIuJGxpc3Qub2ZmKFwibW91c2VsZWF2ZS5zbGlja1wiLGEucHJveHkoYi5zZXRQYXVzZWQsYiwhMSkpLGIub3B0aW9ucy5hY2Nlc3NpYmlsaXR5PT09ITAmJmIuJGxpc3Qub2ZmKFwia2V5ZG93bi5zbGlja1wiLGIua2V5SGFuZGxlciksYi5vcHRpb25zLmZvY3VzT25TZWxlY3Q9PT0hMCYmYShiLiRzbGlkZVRyYWNrKS5jaGlsZHJlbigpLm9mZihcImNsaWNrLnNsaWNrXCIsYi5zZWxlY3RIYW5kbGVyKSxhKHdpbmRvdykub2ZmKFwib3JpZW50YXRpb25jaGFuZ2Uuc2xpY2suc2xpY2stXCIrYi5pbnN0YW5jZVVpZCxiLm9yaWVudGF0aW9uQ2hhbmdlKSxhKHdpbmRvdykub2ZmKFwicmVzaXplLnNsaWNrLnNsaWNrLVwiK2IuaW5zdGFuY2VVaWQsYi5yZXNpemUpLGEoXCJbZHJhZ2dhYmxlIT10cnVlXVwiLGIuJHNsaWRlVHJhY2spLm9mZihcImRyYWdzdGFydFwiLGIucHJldmVudERlZmF1bHQpLGEod2luZG93KS5vZmYoXCJsb2FkLnNsaWNrLnNsaWNrLVwiK2IuaW5zdGFuY2VVaWQsYi5zZXRQb3NpdGlvbiksYShkb2N1bWVudCkub2ZmKFwicmVhZHkuc2xpY2suc2xpY2stXCIrYi5pbnN0YW5jZVVpZCxiLnNldFBvc2l0aW9uKX0sYi5wcm90b3R5cGUuY2xlYW5VcFJvd3M9ZnVuY3Rpb24oKXt2YXIgYixhPXRoaXM7YS5vcHRpb25zLnJvd3M+MSYmKGI9YS4kc2xpZGVzLmNoaWxkcmVuKCkuY2hpbGRyZW4oKSxiLnJlbW92ZUF0dHIoXCJzdHlsZVwiKSxhLiRzbGlkZXIuaHRtbChiKSl9LGIucHJvdG90eXBlLmNsaWNrSGFuZGxlcj1mdW5jdGlvbihhKXt2YXIgYj10aGlzO2Iuc2hvdWxkQ2xpY2s9PT0hMSYmKGEuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCksYS5zdG9wUHJvcGFnYXRpb24oKSxhLnByZXZlbnREZWZhdWx0KCkpfSxiLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKGIpe3ZhciBjPXRoaXM7Yy5hdXRvUGxheUNsZWFyKCksYy50b3VjaE9iamVjdD17fSxjLmNsZWFuVXBFdmVudHMoKSxhKFwiLnNsaWNrLWNsb25lZFwiLGMuJHNsaWRlcikuZGV0YWNoKCksYy4kZG90cyYmYy4kZG90cy5yZW1vdmUoKSxjLiRwcmV2QXJyb3cmJmMuJHByZXZBcnJvdy5sZW5ndGgmJihjLiRwcmV2QXJyb3cucmVtb3ZlQ2xhc3MoXCJzbGljay1kaXNhYmxlZCBzbGljay1hcnJvdyBzbGljay1oaWRkZW5cIikucmVtb3ZlQXR0cihcImFyaWEtaGlkZGVuIGFyaWEtZGlzYWJsZWQgdGFiaW5kZXhcIikuY3NzKFwiZGlzcGxheVwiLFwiXCIpLGMuaHRtbEV4cHIudGVzdChjLm9wdGlvbnMucHJldkFycm93KSYmYy4kcHJldkFycm93LnJlbW92ZSgpKSxjLiRuZXh0QXJyb3cmJmMuJG5leHRBcnJvdy5sZW5ndGgmJihjLiRuZXh0QXJyb3cucmVtb3ZlQ2xhc3MoXCJzbGljay1kaXNhYmxlZCBzbGljay1hcnJvdyBzbGljay1oaWRkZW5cIikucmVtb3ZlQXR0cihcImFyaWEtaGlkZGVuIGFyaWEtZGlzYWJsZWQgdGFiaW5kZXhcIikuY3NzKFwiZGlzcGxheVwiLFwiXCIpLGMuaHRtbEV4cHIudGVzdChjLm9wdGlvbnMubmV4dEFycm93KSYmYy4kbmV4dEFycm93LnJlbW92ZSgpKSxjLiRzbGlkZXMmJihjLiRzbGlkZXMucmVtb3ZlQ2xhc3MoXCJzbGljay1zbGlkZSBzbGljay1hY3RpdmUgc2xpY2stY2VudGVyIHNsaWNrLXZpc2libGUgc2xpY2stY3VycmVudFwiKS5yZW1vdmVBdHRyKFwiYXJpYS1oaWRkZW5cIikucmVtb3ZlQXR0cihcImRhdGEtc2xpY2staW5kZXhcIikuZWFjaChmdW5jdGlvbigpe2EodGhpcykuYXR0cihcInN0eWxlXCIsYSh0aGlzKS5kYXRhKFwib3JpZ2luYWxTdHlsaW5nXCIpKX0pLGMuJHNsaWRlVHJhY2suY2hpbGRyZW4odGhpcy5vcHRpb25zLnNsaWRlKS5kZXRhY2goKSxjLiRzbGlkZVRyYWNrLmRldGFjaCgpLGMuJGxpc3QuZGV0YWNoKCksYy4kc2xpZGVyLmFwcGVuZChjLiRzbGlkZXMpKSxjLmNsZWFuVXBSb3dzKCksYy4kc2xpZGVyLnJlbW92ZUNsYXNzKFwic2xpY2stc2xpZGVyXCIpLGMuJHNsaWRlci5yZW1vdmVDbGFzcyhcInNsaWNrLWluaXRpYWxpemVkXCIpLGMudW5zbGlja2VkPSEwLGJ8fGMuJHNsaWRlci50cmlnZ2VyKFwiZGVzdHJveVwiLFtjXSl9LGIucHJvdG90eXBlLmRpc2FibGVUcmFuc2l0aW9uPWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMsYz17fTtjW2IudHJhbnNpdGlvblR5cGVdPVwiXCIsYi5vcHRpb25zLmZhZGU9PT0hMT9iLiRzbGlkZVRyYWNrLmNzcyhjKTpiLiRzbGlkZXMuZXEoYSkuY3NzKGMpfSxiLnByb3RvdHlwZS5mYWRlU2xpZGU9ZnVuY3Rpb24oYSxiKXt2YXIgYz10aGlzO2MuY3NzVHJhbnNpdGlvbnM9PT0hMT8oYy4kc2xpZGVzLmVxKGEpLmNzcyh7ekluZGV4OmMub3B0aW9ucy56SW5kZXh9KSxjLiRzbGlkZXMuZXEoYSkuYW5pbWF0ZSh7b3BhY2l0eToxfSxjLm9wdGlvbnMuc3BlZWQsYy5vcHRpb25zLmVhc2luZyxiKSk6KGMuYXBwbHlUcmFuc2l0aW9uKGEpLGMuJHNsaWRlcy5lcShhKS5jc3Moe29wYWNpdHk6MSx6SW5kZXg6Yy5vcHRpb25zLnpJbmRleH0pLGImJnNldFRpbWVvdXQoZnVuY3Rpb24oKXtjLmRpc2FibGVUcmFuc2l0aW9uKGEpLGIuY2FsbCgpfSxjLm9wdGlvbnMuc3BlZWQpKX0sYi5wcm90b3R5cGUuZmFkZVNsaWRlT3V0PWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXM7Yi5jc3NUcmFuc2l0aW9ucz09PSExP2IuJHNsaWRlcy5lcShhKS5hbmltYXRlKHtvcGFjaXR5OjAsekluZGV4OmIub3B0aW9ucy56SW5kZXgtMn0sYi5vcHRpb25zLnNwZWVkLGIub3B0aW9ucy5lYXNpbmcpOihiLmFwcGx5VHJhbnNpdGlvbihhKSxiLiRzbGlkZXMuZXEoYSkuY3NzKHtvcGFjaXR5OjAsekluZGV4OmIub3B0aW9ucy56SW5kZXgtMn0pKX0sYi5wcm90b3R5cGUuZmlsdGVyU2xpZGVzPWIucHJvdG90eXBlLnNsaWNrRmlsdGVyPWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXM7bnVsbCE9PWEmJihiLiRzbGlkZXNDYWNoZT1iLiRzbGlkZXMsYi51bmxvYWQoKSxiLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSkuZGV0YWNoKCksYi4kc2xpZGVzQ2FjaGUuZmlsdGVyKGEpLmFwcGVuZFRvKGIuJHNsaWRlVHJhY2spLGIucmVpbml0KCkpfSxiLnByb3RvdHlwZS5nZXRDdXJyZW50PWIucHJvdG90eXBlLnNsaWNrQ3VycmVudFNsaWRlPWZ1bmN0aW9uKCl7dmFyIGE9dGhpcztyZXR1cm4gYS5jdXJyZW50U2xpZGV9LGIucHJvdG90eXBlLmdldERvdENvdW50PWZ1bmN0aW9uKCl7dmFyIGE9dGhpcyxiPTAsYz0wLGQ9MDtpZihhLm9wdGlvbnMuaW5maW5pdGU9PT0hMClmb3IoO2I8YS5zbGlkZUNvdW50OykrK2QsYj1jK2Eub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCxjKz1hLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw8PWEub3B0aW9ucy5zbGlkZXNUb1Nob3c/YS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsOmEub3B0aW9ucy5zbGlkZXNUb1Nob3c7ZWxzZSBpZihhLm9wdGlvbnMuY2VudGVyTW9kZT09PSEwKWQ9YS5zbGlkZUNvdW50O2Vsc2UgZm9yKDtiPGEuc2xpZGVDb3VudDspKytkLGI9YythLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwsYys9YS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsPD1hLm9wdGlvbnMuc2xpZGVzVG9TaG93P2Eub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDphLm9wdGlvbnMuc2xpZGVzVG9TaG93O3JldHVybiBkLTF9LGIucHJvdG90eXBlLmdldExlZnQ9ZnVuY3Rpb24oYSl7dmFyIGMsZCxmLGI9dGhpcyxlPTA7cmV0dXJuIGIuc2xpZGVPZmZzZXQ9MCxkPWIuJHNsaWRlcy5maXJzdCgpLm91dGVySGVpZ2h0KCEwKSxiLm9wdGlvbnMuaW5maW5pdGU9PT0hMD8oYi5zbGlkZUNvdW50PmIub3B0aW9ucy5zbGlkZXNUb1Nob3cmJihiLnNsaWRlT2Zmc2V0PWIuc2xpZGVXaWR0aCpiLm9wdGlvbnMuc2xpZGVzVG9TaG93Ki0xLGU9ZCpiLm9wdGlvbnMuc2xpZGVzVG9TaG93Ki0xKSxiLnNsaWRlQ291bnQlYi5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsIT09MCYmYStiLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw+Yi5zbGlkZUNvdW50JiZiLnNsaWRlQ291bnQ+Yi5vcHRpb25zLnNsaWRlc1RvU2hvdyYmKGE+Yi5zbGlkZUNvdW50PyhiLnNsaWRlT2Zmc2V0PShiLm9wdGlvbnMuc2xpZGVzVG9TaG93LShhLWIuc2xpZGVDb3VudCkpKmIuc2xpZGVXaWR0aCotMSxlPShiLm9wdGlvbnMuc2xpZGVzVG9TaG93LShhLWIuc2xpZGVDb3VudCkpKmQqLTEpOihiLnNsaWRlT2Zmc2V0PWIuc2xpZGVDb3VudCViLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwqYi5zbGlkZVdpZHRoKi0xLGU9Yi5zbGlkZUNvdW50JWIub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCpkKi0xKSkpOmErYi5vcHRpb25zLnNsaWRlc1RvU2hvdz5iLnNsaWRlQ291bnQmJihiLnNsaWRlT2Zmc2V0PShhK2Iub3B0aW9ucy5zbGlkZXNUb1Nob3ctYi5zbGlkZUNvdW50KSpiLnNsaWRlV2lkdGgsZT0oYStiLm9wdGlvbnMuc2xpZGVzVG9TaG93LWIuc2xpZGVDb3VudCkqZCksYi5zbGlkZUNvdW50PD1iLm9wdGlvbnMuc2xpZGVzVG9TaG93JiYoYi5zbGlkZU9mZnNldD0wLGU9MCksYi5vcHRpb25zLmNlbnRlck1vZGU9PT0hMCYmYi5vcHRpb25zLmluZmluaXRlPT09ITA/Yi5zbGlkZU9mZnNldCs9Yi5zbGlkZVdpZHRoKk1hdGguZmxvb3IoYi5vcHRpb25zLnNsaWRlc1RvU2hvdy8yKS1iLnNsaWRlV2lkdGg6Yi5vcHRpb25zLmNlbnRlck1vZGU9PT0hMCYmKGIuc2xpZGVPZmZzZXQ9MCxiLnNsaWRlT2Zmc2V0Kz1iLnNsaWRlV2lkdGgqTWF0aC5mbG9vcihiLm9wdGlvbnMuc2xpZGVzVG9TaG93LzIpKSxjPWIub3B0aW9ucy52ZXJ0aWNhbD09PSExP2EqYi5zbGlkZVdpZHRoKi0xK2Iuc2xpZGVPZmZzZXQ6YSpkKi0xK2UsYi5vcHRpb25zLnZhcmlhYmxlV2lkdGg9PT0hMCYmKGY9Yi5zbGlkZUNvdW50PD1iLm9wdGlvbnMuc2xpZGVzVG9TaG93fHxiLm9wdGlvbnMuaW5maW5pdGU9PT0hMT9iLiRzbGlkZVRyYWNrLmNoaWxkcmVuKFwiLnNsaWNrLXNsaWRlXCIpLmVxKGEpOmIuJHNsaWRlVHJhY2suY2hpbGRyZW4oXCIuc2xpY2stc2xpZGVcIikuZXEoYStiLm9wdGlvbnMuc2xpZGVzVG9TaG93KSxjPWIub3B0aW9ucy5ydGw9PT0hMD9mWzBdPy0xKihiLiRzbGlkZVRyYWNrLndpZHRoKCktZlswXS5vZmZzZXRMZWZ0LWYud2lkdGgoKSk6MDpmWzBdPy0xKmZbMF0ub2Zmc2V0TGVmdDowLGIub3B0aW9ucy5jZW50ZXJNb2RlPT09ITAmJihmPWIuc2xpZGVDb3VudDw9Yi5vcHRpb25zLnNsaWRlc1RvU2hvd3x8Yi5vcHRpb25zLmluZmluaXRlPT09ITE/Yi4kc2xpZGVUcmFjay5jaGlsZHJlbihcIi5zbGljay1zbGlkZVwiKS5lcShhKTpiLiRzbGlkZVRyYWNrLmNoaWxkcmVuKFwiLnNsaWNrLXNsaWRlXCIpLmVxKGErYi5vcHRpb25zLnNsaWRlc1RvU2hvdysxKSxjPWIub3B0aW9ucy5ydGw9PT0hMD9mWzBdPy0xKihiLiRzbGlkZVRyYWNrLndpZHRoKCktZlswXS5vZmZzZXRMZWZ0LWYud2lkdGgoKSk6MDpmWzBdPy0xKmZbMF0ub2Zmc2V0TGVmdDowLGMrPShiLiRsaXN0LndpZHRoKCktZi5vdXRlcldpZHRoKCkpLzIpKSxjfSxiLnByb3RvdHlwZS5nZXRPcHRpb249Yi5wcm90b3R5cGUuc2xpY2tHZXRPcHRpb249ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcztyZXR1cm4gYi5vcHRpb25zW2FdfSxiLnByb3RvdHlwZS5nZXROYXZpZ2FibGVJbmRleGVzPWZ1bmN0aW9uKCl7dmFyIGUsYT10aGlzLGI9MCxjPTAsZD1bXTtmb3IoYS5vcHRpb25zLmluZmluaXRlPT09ITE/ZT1hLnNsaWRlQ291bnQ6KGI9LTEqYS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsLGM9LTEqYS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsLGU9MiphLnNsaWRlQ291bnQpO2U+YjspZC5wdXNoKGIpLGI9YythLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwsYys9YS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsPD1hLm9wdGlvbnMuc2xpZGVzVG9TaG93P2Eub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDphLm9wdGlvbnMuc2xpZGVzVG9TaG93O3JldHVybiBkfSxiLnByb3RvdHlwZS5nZXRTbGljaz1mdW5jdGlvbigpe3JldHVybiB0aGlzfSxiLnByb3RvdHlwZS5nZXRTbGlkZUNvdW50PWZ1bmN0aW9uKCl7dmFyIGMsZCxlLGI9dGhpcztyZXR1cm4gZT1iLm9wdGlvbnMuY2VudGVyTW9kZT09PSEwP2Iuc2xpZGVXaWR0aCpNYXRoLmZsb29yKGIub3B0aW9ucy5zbGlkZXNUb1Nob3cvMik6MCxiLm9wdGlvbnMuc3dpcGVUb1NsaWRlPT09ITA/KGIuJHNsaWRlVHJhY2suZmluZChcIi5zbGljay1zbGlkZVwiKS5lYWNoKGZ1bmN0aW9uKGMsZil7cmV0dXJuIGYub2Zmc2V0TGVmdC1lK2EoZikub3V0ZXJXaWR0aCgpLzI+LTEqYi5zd2lwZUxlZnQ/KGQ9ZiwhMSk6dm9pZCAwfSksYz1NYXRoLmFicyhhKGQpLmF0dHIoXCJkYXRhLXNsaWNrLWluZGV4XCIpLWIuY3VycmVudFNsaWRlKXx8MSk6Yi5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsfSxiLnByb3RvdHlwZS5nb1RvPWIucHJvdG90eXBlLnNsaWNrR29Ubz1mdW5jdGlvbihhLGIpe3ZhciBjPXRoaXM7Yy5jaGFuZ2VTbGlkZSh7ZGF0YTp7bWVzc2FnZTpcImluZGV4XCIsaW5kZXg6cGFyc2VJbnQoYSl9fSxiKX0sYi5wcm90b3R5cGUuaW5pdD1mdW5jdGlvbihiKXt2YXIgYz10aGlzO2EoYy4kc2xpZGVyKS5oYXNDbGFzcyhcInNsaWNrLWluaXRpYWxpemVkXCIpfHwoYShjLiRzbGlkZXIpLmFkZENsYXNzKFwic2xpY2staW5pdGlhbGl6ZWRcIiksYy5idWlsZFJvd3MoKSxjLmJ1aWxkT3V0KCksYy5zZXRQcm9wcygpLGMuc3RhcnRMb2FkKCksYy5sb2FkU2xpZGVyKCksYy5pbml0aWFsaXplRXZlbnRzKCksYy51cGRhdGVBcnJvd3MoKSxjLnVwZGF0ZURvdHMoKSksYiYmYy4kc2xpZGVyLnRyaWdnZXIoXCJpbml0XCIsW2NdKSxjLm9wdGlvbnMuYWNjZXNzaWJpbGl0eT09PSEwJiZjLmluaXRBREEoKX0sYi5wcm90b3R5cGUuaW5pdEFycm93RXZlbnRzPWZ1bmN0aW9uKCl7dmFyIGE9dGhpczthLm9wdGlvbnMuYXJyb3dzPT09ITAmJmEuc2xpZGVDb3VudD5hLm9wdGlvbnMuc2xpZGVzVG9TaG93JiYoYS4kcHJldkFycm93Lm9uKFwiY2xpY2suc2xpY2tcIix7bWVzc2FnZTpcInByZXZpb3VzXCJ9LGEuY2hhbmdlU2xpZGUpLGEuJG5leHRBcnJvdy5vbihcImNsaWNrLnNsaWNrXCIse21lc3NhZ2U6XCJuZXh0XCJ9LGEuY2hhbmdlU2xpZGUpKX0sYi5wcm90b3R5cGUuaW5pdERvdEV2ZW50cz1mdW5jdGlvbigpe3ZhciBiPXRoaXM7Yi5vcHRpb25zLmRvdHM9PT0hMCYmYi5zbGlkZUNvdW50PmIub3B0aW9ucy5zbGlkZXNUb1Nob3cmJmEoXCJsaVwiLGIuJGRvdHMpLm9uKFwiY2xpY2suc2xpY2tcIix7bWVzc2FnZTpcImluZGV4XCJ9LGIuY2hhbmdlU2xpZGUpLGIub3B0aW9ucy5kb3RzPT09ITAmJmIub3B0aW9ucy5wYXVzZU9uRG90c0hvdmVyPT09ITAmJmIub3B0aW9ucy5hdXRvcGxheT09PSEwJiZhKFwibGlcIixiLiRkb3RzKS5vbihcIm1vdXNlZW50ZXIuc2xpY2tcIixhLnByb3h5KGIuc2V0UGF1c2VkLGIsITApKS5vbihcIm1vdXNlbGVhdmUuc2xpY2tcIixhLnByb3h5KGIuc2V0UGF1c2VkLGIsITEpKX0sYi5wcm90b3R5cGUuaW5pdGlhbGl6ZUV2ZW50cz1mdW5jdGlvbigpe3ZhciBiPXRoaXM7Yi5pbml0QXJyb3dFdmVudHMoKSxiLmluaXREb3RFdmVudHMoKSxiLiRsaXN0Lm9uKFwidG91Y2hzdGFydC5zbGljayBtb3VzZWRvd24uc2xpY2tcIix7YWN0aW9uOlwic3RhcnRcIn0sYi5zd2lwZUhhbmRsZXIpLGIuJGxpc3Qub24oXCJ0b3VjaG1vdmUuc2xpY2sgbW91c2Vtb3ZlLnNsaWNrXCIse2FjdGlvbjpcIm1vdmVcIn0sYi5zd2lwZUhhbmRsZXIpLGIuJGxpc3Qub24oXCJ0b3VjaGVuZC5zbGljayBtb3VzZXVwLnNsaWNrXCIse2FjdGlvbjpcImVuZFwifSxiLnN3aXBlSGFuZGxlciksYi4kbGlzdC5vbihcInRvdWNoY2FuY2VsLnNsaWNrIG1vdXNlbGVhdmUuc2xpY2tcIix7YWN0aW9uOlwiZW5kXCJ9LGIuc3dpcGVIYW5kbGVyKSxiLiRsaXN0Lm9uKFwiY2xpY2suc2xpY2tcIixiLmNsaWNrSGFuZGxlciksYShkb2N1bWVudCkub24oYi52aXNpYmlsaXR5Q2hhbmdlLGEucHJveHkoYi52aXNpYmlsaXR5LGIpKSxiLiRsaXN0Lm9uKFwibW91c2VlbnRlci5zbGlja1wiLGEucHJveHkoYi5zZXRQYXVzZWQsYiwhMCkpLGIuJGxpc3Qub24oXCJtb3VzZWxlYXZlLnNsaWNrXCIsYS5wcm94eShiLnNldFBhdXNlZCxiLCExKSksYi5vcHRpb25zLmFjY2Vzc2liaWxpdHk9PT0hMCYmYi4kbGlzdC5vbihcImtleWRvd24uc2xpY2tcIixiLmtleUhhbmRsZXIpLGIub3B0aW9ucy5mb2N1c09uU2VsZWN0PT09ITAmJmEoYi4kc2xpZGVUcmFjaykuY2hpbGRyZW4oKS5vbihcImNsaWNrLnNsaWNrXCIsYi5zZWxlY3RIYW5kbGVyKSxhKHdpbmRvdykub24oXCJvcmllbnRhdGlvbmNoYW5nZS5zbGljay5zbGljay1cIitiLmluc3RhbmNlVWlkLGEucHJveHkoYi5vcmllbnRhdGlvbkNoYW5nZSxiKSksYSh3aW5kb3cpLm9uKFwicmVzaXplLnNsaWNrLnNsaWNrLVwiK2IuaW5zdGFuY2VVaWQsYS5wcm94eShiLnJlc2l6ZSxiKSksYShcIltkcmFnZ2FibGUhPXRydWVdXCIsYi4kc2xpZGVUcmFjaykub24oXCJkcmFnc3RhcnRcIixiLnByZXZlbnREZWZhdWx0KSxhKHdpbmRvdykub24oXCJsb2FkLnNsaWNrLnNsaWNrLVwiK2IuaW5zdGFuY2VVaWQsYi5zZXRQb3NpdGlvbiksYShkb2N1bWVudCkub24oXCJyZWFkeS5zbGljay5zbGljay1cIitiLmluc3RhbmNlVWlkLGIuc2V0UG9zaXRpb24pfSxiLnByb3RvdHlwZS5pbml0VUk9ZnVuY3Rpb24oKXt2YXIgYT10aGlzO2Eub3B0aW9ucy5hcnJvd3M9PT0hMCYmYS5zbGlkZUNvdW50PmEub3B0aW9ucy5zbGlkZXNUb1Nob3cmJihhLiRwcmV2QXJyb3cuc2hvdygpLGEuJG5leHRBcnJvdy5zaG93KCkpLGEub3B0aW9ucy5kb3RzPT09ITAmJmEuc2xpZGVDb3VudD5hLm9wdGlvbnMuc2xpZGVzVG9TaG93JiZhLiRkb3RzLnNob3coKSxhLm9wdGlvbnMuYXV0b3BsYXk9PT0hMCYmYS5hdXRvUGxheSgpfSxiLnByb3RvdHlwZS5rZXlIYW5kbGVyPWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXM7YS50YXJnZXQudGFnTmFtZS5tYXRjaChcIlRFWFRBUkVBfElOUFVUfFNFTEVDVFwiKXx8KDM3PT09YS5rZXlDb2RlJiZiLm9wdGlvbnMuYWNjZXNzaWJpbGl0eT09PSEwP2IuY2hhbmdlU2xpZGUoe2RhdGE6e21lc3NhZ2U6XCJwcmV2aW91c1wifX0pOjM5PT09YS5rZXlDb2RlJiZiLm9wdGlvbnMuYWNjZXNzaWJpbGl0eT09PSEwJiZiLmNoYW5nZVNsaWRlKHtkYXRhOnttZXNzYWdlOlwibmV4dFwifX0pKX0sYi5wcm90b3R5cGUubGF6eUxvYWQ9ZnVuY3Rpb24oKXtmdW5jdGlvbiBnKGIpe2EoXCJpbWdbZGF0YS1sYXp5XVwiLGIpLmVhY2goZnVuY3Rpb24oKXt2YXIgYj1hKHRoaXMpLGM9YSh0aGlzKS5hdHRyKFwiZGF0YS1sYXp5XCIpLGQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtkLm9ubG9hZD1mdW5jdGlvbigpe2IuYW5pbWF0ZSh7b3BhY2l0eTowfSwxMDAsZnVuY3Rpb24oKXtiLmF0dHIoXCJzcmNcIixjKS5hbmltYXRlKHtvcGFjaXR5OjF9LDIwMCxmdW5jdGlvbigpe2IucmVtb3ZlQXR0cihcImRhdGEtbGF6eVwiKS5yZW1vdmVDbGFzcyhcInNsaWNrLWxvYWRpbmdcIil9KX0pfSxkLnNyYz1jfSl9dmFyIGMsZCxlLGYsYj10aGlzO2Iub3B0aW9ucy5jZW50ZXJNb2RlPT09ITA/Yi5vcHRpb25zLmluZmluaXRlPT09ITA/KGU9Yi5jdXJyZW50U2xpZGUrKGIub3B0aW9ucy5zbGlkZXNUb1Nob3cvMisxKSxmPWUrYi5vcHRpb25zLnNsaWRlc1RvU2hvdysyKTooZT1NYXRoLm1heCgwLGIuY3VycmVudFNsaWRlLShiLm9wdGlvbnMuc2xpZGVzVG9TaG93LzIrMSkpLGY9MisoYi5vcHRpb25zLnNsaWRlc1RvU2hvdy8yKzEpK2IuY3VycmVudFNsaWRlKTooZT1iLm9wdGlvbnMuaW5maW5pdGU/Yi5vcHRpb25zLnNsaWRlc1RvU2hvdytiLmN1cnJlbnRTbGlkZTpiLmN1cnJlbnRTbGlkZSxmPWUrYi5vcHRpb25zLnNsaWRlc1RvU2hvdyxiLm9wdGlvbnMuZmFkZT09PSEwJiYoZT4wJiZlLS0sZjw9Yi5zbGlkZUNvdW50JiZmKyspKSxjPWIuJHNsaWRlci5maW5kKFwiLnNsaWNrLXNsaWRlXCIpLnNsaWNlKGUsZiksZyhjKSxiLnNsaWRlQ291bnQ8PWIub3B0aW9ucy5zbGlkZXNUb1Nob3c/KGQ9Yi4kc2xpZGVyLmZpbmQoXCIuc2xpY2stc2xpZGVcIiksZyhkKSk6Yi5jdXJyZW50U2xpZGU+PWIuc2xpZGVDb3VudC1iLm9wdGlvbnMuc2xpZGVzVG9TaG93PyhkPWIuJHNsaWRlci5maW5kKFwiLnNsaWNrLWNsb25lZFwiKS5zbGljZSgwLGIub3B0aW9ucy5zbGlkZXNUb1Nob3cpLGcoZCkpOjA9PT1iLmN1cnJlbnRTbGlkZSYmKGQ9Yi4kc2xpZGVyLmZpbmQoXCIuc2xpY2stY2xvbmVkXCIpLnNsaWNlKC0xKmIub3B0aW9ucy5zbGlkZXNUb1Nob3cpLGcoZCkpfSxiLnByb3RvdHlwZS5sb2FkU2xpZGVyPWZ1bmN0aW9uKCl7dmFyIGE9dGhpczthLnNldFBvc2l0aW9uKCksYS4kc2xpZGVUcmFjay5jc3Moe29wYWNpdHk6MX0pLGEuJHNsaWRlci5yZW1vdmVDbGFzcyhcInNsaWNrLWxvYWRpbmdcIiksYS5pbml0VUkoKSxcInByb2dyZXNzaXZlXCI9PT1hLm9wdGlvbnMubGF6eUxvYWQmJmEucHJvZ3Jlc3NpdmVMYXp5TG9hZCgpfSxiLnByb3RvdHlwZS5uZXh0PWIucHJvdG90eXBlLnNsaWNrTmV4dD1mdW5jdGlvbigpe3ZhciBhPXRoaXM7YS5jaGFuZ2VTbGlkZSh7ZGF0YTp7bWVzc2FnZTpcIm5leHRcIn19KX0sYi5wcm90b3R5cGUub3JpZW50YXRpb25DaGFuZ2U9ZnVuY3Rpb24oKXt2YXIgYT10aGlzO2EuY2hlY2tSZXNwb25zaXZlKCksYS5zZXRQb3NpdGlvbigpfSxiLnByb3RvdHlwZS5wYXVzZT1iLnByb3RvdHlwZS5zbGlja1BhdXNlPWZ1bmN0aW9uKCl7dmFyIGE9dGhpczthLmF1dG9QbGF5Q2xlYXIoKSxhLnBhdXNlZD0hMH0sYi5wcm90b3R5cGUucGxheT1iLnByb3RvdHlwZS5zbGlja1BsYXk9ZnVuY3Rpb24oKXt2YXIgYT10aGlzO2EucGF1c2VkPSExLGEuYXV0b1BsYXkoKX0sYi5wcm90b3R5cGUucG9zdFNsaWRlPWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXM7Yi4kc2xpZGVyLnRyaWdnZXIoXCJhZnRlckNoYW5nZVwiLFtiLGFdKSxiLmFuaW1hdGluZz0hMSxiLnNldFBvc2l0aW9uKCksYi5zd2lwZUxlZnQ9bnVsbCxiLm9wdGlvbnMuYXV0b3BsYXk9PT0hMCYmYi5wYXVzZWQ9PT0hMSYmYi5hdXRvUGxheSgpLGIub3B0aW9ucy5hY2Nlc3NpYmlsaXR5PT09ITAmJmIuaW5pdEFEQSgpfSxiLnByb3RvdHlwZS5wcmV2PWIucHJvdG90eXBlLnNsaWNrUHJldj1mdW5jdGlvbigpe3ZhciBhPXRoaXM7YS5jaGFuZ2VTbGlkZSh7ZGF0YTp7bWVzc2FnZTpcInByZXZpb3VzXCJ9fSl9LGIucHJvdG90eXBlLnByZXZlbnREZWZhdWx0PWZ1bmN0aW9uKGEpe2EucHJldmVudERlZmF1bHQoKX0sYi5wcm90b3R5cGUucHJvZ3Jlc3NpdmVMYXp5TG9hZD1mdW5jdGlvbigpe3ZhciBjLGQsYj10aGlzO2M9YShcImltZ1tkYXRhLWxhenldXCIsYi4kc2xpZGVyKS5sZW5ndGgsYz4wJiYoZD1hKFwiaW1nW2RhdGEtbGF6eV1cIixiLiRzbGlkZXIpLmZpcnN0KCksZC5hdHRyKFwic3JjXCIsbnVsbCksZC5hdHRyKFwic3JjXCIsZC5hdHRyKFwiZGF0YS1sYXp5XCIpKS5yZW1vdmVDbGFzcyhcInNsaWNrLWxvYWRpbmdcIikubG9hZChmdW5jdGlvbigpe2QucmVtb3ZlQXR0cihcImRhdGEtbGF6eVwiKSxiLnByb2dyZXNzaXZlTGF6eUxvYWQoKSxiLm9wdGlvbnMuYWRhcHRpdmVIZWlnaHQ9PT0hMCYmYi5zZXRQb3NpdGlvbigpfSkuZXJyb3IoZnVuY3Rpb24oKXtkLnJlbW92ZUF0dHIoXCJkYXRhLWxhenlcIiksYi5wcm9ncmVzc2l2ZUxhenlMb2FkKCl9KSl9LGIucHJvdG90eXBlLnJlZnJlc2g9ZnVuY3Rpb24oYil7dmFyIGQsZSxjPXRoaXM7ZT1jLnNsaWRlQ291bnQtYy5vcHRpb25zLnNsaWRlc1RvU2hvdyxjLm9wdGlvbnMuaW5maW5pdGV8fChjLnNsaWRlQ291bnQ8PWMub3B0aW9ucy5zbGlkZXNUb1Nob3c/Yy5jdXJyZW50U2xpZGU9MDpjLmN1cnJlbnRTbGlkZT5lJiYoYy5jdXJyZW50U2xpZGU9ZSkpLGQ9Yy5jdXJyZW50U2xpZGUsYy5kZXN0cm95KCEwKSxhLmV4dGVuZChjLGMuaW5pdGlhbHMse2N1cnJlbnRTbGlkZTpkfSksYy5pbml0KCksYnx8Yy5jaGFuZ2VTbGlkZSh7ZGF0YTp7bWVzc2FnZTpcImluZGV4XCIsaW5kZXg6ZH19LCExKX0sYi5wcm90b3R5cGUucmVnaXN0ZXJCcmVha3BvaW50cz1mdW5jdGlvbigpe3ZhciBjLGQsZSxiPXRoaXMsZj1iLm9wdGlvbnMucmVzcG9uc2l2ZXx8bnVsbDtpZihcImFycmF5XCI9PT1hLnR5cGUoZikmJmYubGVuZ3RoKXtiLnJlc3BvbmRUbz1iLm9wdGlvbnMucmVzcG9uZFRvfHxcIndpbmRvd1wiO2ZvcihjIGluIGYpaWYoZT1iLmJyZWFrcG9pbnRzLmxlbmd0aC0xLGQ9ZltjXS5icmVha3BvaW50LGYuaGFzT3duUHJvcGVydHkoYykpe2Zvcig7ZT49MDspYi5icmVha3BvaW50c1tlXSYmYi5icmVha3BvaW50c1tlXT09PWQmJmIuYnJlYWtwb2ludHMuc3BsaWNlKGUsMSksZS0tO2IuYnJlYWtwb2ludHMucHVzaChkKSxiLmJyZWFrcG9pbnRTZXR0aW5nc1tkXT1mW2NdLnNldHRpbmdzfWIuYnJlYWtwb2ludHMuc29ydChmdW5jdGlvbihhLGMpe3JldHVybiBiLm9wdGlvbnMubW9iaWxlRmlyc3Q/YS1jOmMtYX0pfX0sYi5wcm90b3R5cGUucmVpbml0PWZ1bmN0aW9uKCl7dmFyIGI9dGhpcztiLiRzbGlkZXM9Yi4kc2xpZGVUcmFjay5jaGlsZHJlbihiLm9wdGlvbnMuc2xpZGUpLmFkZENsYXNzKFwic2xpY2stc2xpZGVcIiksYi5zbGlkZUNvdW50PWIuJHNsaWRlcy5sZW5ndGgsYi5jdXJyZW50U2xpZGU+PWIuc2xpZGVDb3VudCYmMCE9PWIuY3VycmVudFNsaWRlJiYoYi5jdXJyZW50U2xpZGU9Yi5jdXJyZW50U2xpZGUtYi5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsKSxiLnNsaWRlQ291bnQ8PWIub3B0aW9ucy5zbGlkZXNUb1Nob3cmJihiLmN1cnJlbnRTbGlkZT0wKSxiLnJlZ2lzdGVyQnJlYWtwb2ludHMoKSxiLnNldFByb3BzKCksYi5zZXR1cEluZmluaXRlKCksYi5idWlsZEFycm93cygpLGIudXBkYXRlQXJyb3dzKCksYi5pbml0QXJyb3dFdmVudHMoKSxiLmJ1aWxkRG90cygpLGIudXBkYXRlRG90cygpLGIuaW5pdERvdEV2ZW50cygpLGIuY2hlY2tSZXNwb25zaXZlKCExLCEwKSxiLm9wdGlvbnMuZm9jdXNPblNlbGVjdD09PSEwJiZhKGIuJHNsaWRlVHJhY2spLmNoaWxkcmVuKCkub24oXCJjbGljay5zbGlja1wiLGIuc2VsZWN0SGFuZGxlciksYi5zZXRTbGlkZUNsYXNzZXMoMCksYi5zZXRQb3NpdGlvbigpLGIuJHNsaWRlci50cmlnZ2VyKFwicmVJbml0XCIsW2JdKSxiLm9wdGlvbnMuYXV0b3BsYXk9PT0hMCYmYi5mb2N1c0hhbmRsZXIoKX0sYi5wcm90b3R5cGUucmVzaXplPWZ1bmN0aW9uKCl7dmFyIGI9dGhpczthKHdpbmRvdykud2lkdGgoKSE9PWIud2luZG93V2lkdGgmJihjbGVhclRpbWVvdXQoYi53aW5kb3dEZWxheSksYi53aW5kb3dEZWxheT13aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpe2Iud2luZG93V2lkdGg9YSh3aW5kb3cpLndpZHRoKCksYi5jaGVja1Jlc3BvbnNpdmUoKSxiLnVuc2xpY2tlZHx8Yi5zZXRQb3NpdGlvbigpfSw1MCkpfSxiLnByb3RvdHlwZS5yZW1vdmVTbGlkZT1iLnByb3RvdHlwZS5zbGlja1JlbW92ZT1mdW5jdGlvbihhLGIsYyl7dmFyIGQ9dGhpcztyZXR1cm5cImJvb2xlYW5cIj09dHlwZW9mIGE/KGI9YSxhPWI9PT0hMD8wOmQuc2xpZGVDb3VudC0xKTphPWI9PT0hMD8tLWE6YSxkLnNsaWRlQ291bnQ8MXx8MD5hfHxhPmQuc2xpZGVDb3VudC0xPyExOihkLnVubG9hZCgpLGM9PT0hMD9kLiRzbGlkZVRyYWNrLmNoaWxkcmVuKCkucmVtb3ZlKCk6ZC4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpLmVxKGEpLnJlbW92ZSgpLGQuJHNsaWRlcz1kLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSksZC4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpLmRldGFjaCgpLGQuJHNsaWRlVHJhY2suYXBwZW5kKGQuJHNsaWRlcyksZC4kc2xpZGVzQ2FjaGU9ZC4kc2xpZGVzLHZvaWQgZC5yZWluaXQoKSl9LGIucHJvdG90eXBlLnNldENTUz1mdW5jdGlvbihhKXt2YXIgZCxlLGI9dGhpcyxjPXt9O2Iub3B0aW9ucy5ydGw9PT0hMCYmKGE9LWEpLGQ9XCJsZWZ0XCI9PWIucG9zaXRpb25Qcm9wP01hdGguY2VpbChhKStcInB4XCI6XCIwcHhcIixlPVwidG9wXCI9PWIucG9zaXRpb25Qcm9wP01hdGguY2VpbChhKStcInB4XCI6XCIwcHhcIixjW2IucG9zaXRpb25Qcm9wXT1hLGIudHJhbnNmb3Jtc0VuYWJsZWQ9PT0hMT9iLiRzbGlkZVRyYWNrLmNzcyhjKTooYz17fSxiLmNzc1RyYW5zaXRpb25zPT09ITE/KGNbYi5hbmltVHlwZV09XCJ0cmFuc2xhdGUoXCIrZCtcIiwgXCIrZStcIilcIixiLiRzbGlkZVRyYWNrLmNzcyhjKSk6KGNbYi5hbmltVHlwZV09XCJ0cmFuc2xhdGUzZChcIitkK1wiLCBcIitlK1wiLCAwcHgpXCIsYi4kc2xpZGVUcmFjay5jc3MoYykpKX0sYi5wcm90b3R5cGUuc2V0RGltZW5zaW9ucz1mdW5jdGlvbigpe3ZhciBhPXRoaXM7YS5vcHRpb25zLnZlcnRpY2FsPT09ITE/YS5vcHRpb25zLmNlbnRlck1vZGU9PT0hMCYmYS4kbGlzdC5jc3Moe3BhZGRpbmc6XCIwcHggXCIrYS5vcHRpb25zLmNlbnRlclBhZGRpbmd9KTooYS4kbGlzdC5oZWlnaHQoYS4kc2xpZGVzLmZpcnN0KCkub3V0ZXJIZWlnaHQoITApKmEub3B0aW9ucy5zbGlkZXNUb1Nob3cpLGEub3B0aW9ucy5jZW50ZXJNb2RlPT09ITAmJmEuJGxpc3QuY3NzKHtwYWRkaW5nOmEub3B0aW9ucy5jZW50ZXJQYWRkaW5nK1wiIDBweFwifSkpLGEubGlzdFdpZHRoPWEuJGxpc3Qud2lkdGgoKSxhLmxpc3RIZWlnaHQ9YS4kbGlzdC5oZWlnaHQoKSxhLm9wdGlvbnMudmVydGljYWw9PT0hMSYmYS5vcHRpb25zLnZhcmlhYmxlV2lkdGg9PT0hMT8oYS5zbGlkZVdpZHRoPU1hdGguY2VpbChhLmxpc3RXaWR0aC9hLm9wdGlvbnMuc2xpZGVzVG9TaG93KSxhLiRzbGlkZVRyYWNrLndpZHRoKE1hdGguY2VpbChhLnNsaWRlV2lkdGgqYS4kc2xpZGVUcmFjay5jaGlsZHJlbihcIi5zbGljay1zbGlkZVwiKS5sZW5ndGgpKSk6YS5vcHRpb25zLnZhcmlhYmxlV2lkdGg9PT0hMD9hLiRzbGlkZVRyYWNrLndpZHRoKDVlMyphLnNsaWRlQ291bnQpOihhLnNsaWRlV2lkdGg9TWF0aC5jZWlsKGEubGlzdFdpZHRoKSxhLiRzbGlkZVRyYWNrLmhlaWdodChNYXRoLmNlaWwoYS4kc2xpZGVzLmZpcnN0KCkub3V0ZXJIZWlnaHQoITApKmEuJHNsaWRlVHJhY2suY2hpbGRyZW4oXCIuc2xpY2stc2xpZGVcIikubGVuZ3RoKSkpO3ZhciBiPWEuJHNsaWRlcy5maXJzdCgpLm91dGVyV2lkdGgoITApLWEuJHNsaWRlcy5maXJzdCgpLndpZHRoKCk7YS5vcHRpb25zLnZhcmlhYmxlV2lkdGg9PT0hMSYmYS4kc2xpZGVUcmFjay5jaGlsZHJlbihcIi5zbGljay1zbGlkZVwiKS53aWR0aChhLnNsaWRlV2lkdGgtYil9LGIucHJvdG90eXBlLnNldEZhZGU9ZnVuY3Rpb24oKXt2YXIgYyxiPXRoaXM7Yi4kc2xpZGVzLmVhY2goZnVuY3Rpb24oZCxlKXtjPWIuc2xpZGVXaWR0aCpkKi0xLGIub3B0aW9ucy5ydGw9PT0hMD9hKGUpLmNzcyh7cG9zaXRpb246XCJyZWxhdGl2ZVwiLHJpZ2h0OmMsdG9wOjAsekluZGV4OmIub3B0aW9ucy56SW5kZXgtMixvcGFjaXR5OjB9KTphKGUpLmNzcyh7cG9zaXRpb246XCJyZWxhdGl2ZVwiLGxlZnQ6Yyx0b3A6MCx6SW5kZXg6Yi5vcHRpb25zLnpJbmRleC0yLG9wYWNpdHk6MH0pfSksYi4kc2xpZGVzLmVxKGIuY3VycmVudFNsaWRlKS5jc3Moe3pJbmRleDpiLm9wdGlvbnMuekluZGV4LTEsb3BhY2l0eToxfSl9LGIucHJvdG90eXBlLnNldEhlaWdodD1mdW5jdGlvbigpe3ZhciBhPXRoaXM7aWYoMT09PWEub3B0aW9ucy5zbGlkZXNUb1Nob3cmJmEub3B0aW9ucy5hZGFwdGl2ZUhlaWdodD09PSEwJiZhLm9wdGlvbnMudmVydGljYWw9PT0hMSl7dmFyIGI9YS4kc2xpZGVzLmVxKGEuY3VycmVudFNsaWRlKS5vdXRlckhlaWdodCghMCk7YS4kbGlzdC5jc3MoXCJoZWlnaHRcIixiKX19LGIucHJvdG90eXBlLnNldE9wdGlvbj1iLnByb3RvdHlwZS5zbGlja1NldE9wdGlvbj1mdW5jdGlvbihiLGMsZCl7dmFyIGYsZyxlPXRoaXM7aWYoXCJyZXNwb25zaXZlXCI9PT1iJiZcImFycmF5XCI9PT1hLnR5cGUoYykpZm9yKGcgaW4gYylpZihcImFycmF5XCIhPT1hLnR5cGUoZS5vcHRpb25zLnJlc3BvbnNpdmUpKWUub3B0aW9ucy5yZXNwb25zaXZlPVtjW2ddXTtlbHNle2ZvcihmPWUub3B0aW9ucy5yZXNwb25zaXZlLmxlbmd0aC0xO2Y+PTA7KWUub3B0aW9ucy5yZXNwb25zaXZlW2ZdLmJyZWFrcG9pbnQ9PT1jW2ddLmJyZWFrcG9pbnQmJmUub3B0aW9ucy5yZXNwb25zaXZlLnNwbGljZShmLDEpLGYtLTtlLm9wdGlvbnMucmVzcG9uc2l2ZS5wdXNoKGNbZ10pfWVsc2UgZS5vcHRpb25zW2JdPWM7ZD09PSEwJiYoZS51bmxvYWQoKSxlLnJlaW5pdCgpKX0sYi5wcm90b3R5cGUuc2V0UG9zaXRpb249ZnVuY3Rpb24oKXt2YXIgYT10aGlzO2Euc2V0RGltZW5zaW9ucygpLGEuc2V0SGVpZ2h0KCksYS5vcHRpb25zLmZhZGU9PT0hMT9hLnNldENTUyhhLmdldExlZnQoYS5jdXJyZW50U2xpZGUpKTphLnNldEZhZGUoKSxhLiRzbGlkZXIudHJpZ2dlcihcInNldFBvc2l0aW9uXCIsW2FdKX0sYi5wcm90b3R5cGUuc2V0UHJvcHM9ZnVuY3Rpb24oKXt2YXIgYT10aGlzLGI9ZG9jdW1lbnQuYm9keS5zdHlsZTthLnBvc2l0aW9uUHJvcD1hLm9wdGlvbnMudmVydGljYWw9PT0hMD9cInRvcFwiOlwibGVmdFwiLFwidG9wXCI9PT1hLnBvc2l0aW9uUHJvcD9hLiRzbGlkZXIuYWRkQ2xhc3MoXCJzbGljay12ZXJ0aWNhbFwiKTphLiRzbGlkZXIucmVtb3ZlQ2xhc3MoXCJzbGljay12ZXJ0aWNhbFwiKSwodm9pZCAwIT09Yi5XZWJraXRUcmFuc2l0aW9ufHx2b2lkIDAhPT1iLk1velRyYW5zaXRpb258fHZvaWQgMCE9PWIubXNUcmFuc2l0aW9uKSYmYS5vcHRpb25zLnVzZUNTUz09PSEwJiYoYS5jc3NUcmFuc2l0aW9ucz0hMCksYS5vcHRpb25zLmZhZGUmJihcIm51bWJlclwiPT10eXBlb2YgYS5vcHRpb25zLnpJbmRleD9hLm9wdGlvbnMuekluZGV4PDMmJihhLm9wdGlvbnMuekluZGV4PTMpOmEub3B0aW9ucy56SW5kZXg9YS5kZWZhdWx0cy56SW5kZXgpLHZvaWQgMCE9PWIuT1RyYW5zZm9ybSYmKGEuYW5pbVR5cGU9XCJPVHJhbnNmb3JtXCIsYS50cmFuc2Zvcm1UeXBlPVwiLW8tdHJhbnNmb3JtXCIsYS50cmFuc2l0aW9uVHlwZT1cIk9UcmFuc2l0aW9uXCIsdm9pZCAwPT09Yi5wZXJzcGVjdGl2ZVByb3BlcnR5JiZ2b2lkIDA9PT1iLndlYmtpdFBlcnNwZWN0aXZlJiYoYS5hbmltVHlwZT0hMSkpLHZvaWQgMCE9PWIuTW96VHJhbnNmb3JtJiYoYS5hbmltVHlwZT1cIk1velRyYW5zZm9ybVwiLGEudHJhbnNmb3JtVHlwZT1cIi1tb3otdHJhbnNmb3JtXCIsYS50cmFuc2l0aW9uVHlwZT1cIk1velRyYW5zaXRpb25cIix2b2lkIDA9PT1iLnBlcnNwZWN0aXZlUHJvcGVydHkmJnZvaWQgMD09PWIuTW96UGVyc3BlY3RpdmUmJihhLmFuaW1UeXBlPSExKSksdm9pZCAwIT09Yi53ZWJraXRUcmFuc2Zvcm0mJihhLmFuaW1UeXBlPVwid2Via2l0VHJhbnNmb3JtXCIsYS50cmFuc2Zvcm1UeXBlPVwiLXdlYmtpdC10cmFuc2Zvcm1cIixhLnRyYW5zaXRpb25UeXBlPVwid2Via2l0VHJhbnNpdGlvblwiLHZvaWQgMD09PWIucGVyc3BlY3RpdmVQcm9wZXJ0eSYmdm9pZCAwPT09Yi53ZWJraXRQZXJzcGVjdGl2ZSYmKGEuYW5pbVR5cGU9ITEpKSx2b2lkIDAhPT1iLm1zVHJhbnNmb3JtJiYoYS5hbmltVHlwZT1cIm1zVHJhbnNmb3JtXCIsYS50cmFuc2Zvcm1UeXBlPVwiLW1zLXRyYW5zZm9ybVwiLGEudHJhbnNpdGlvblR5cGU9XCJtc1RyYW5zaXRpb25cIix2b2lkIDA9PT1iLm1zVHJhbnNmb3JtJiYoYS5hbmltVHlwZT0hMSkpLHZvaWQgMCE9PWIudHJhbnNmb3JtJiZhLmFuaW1UeXBlIT09ITEmJihhLmFuaW1UeXBlPVwidHJhbnNmb3JtXCIsYS50cmFuc2Zvcm1UeXBlPVwidHJhbnNmb3JtXCIsYS50cmFuc2l0aW9uVHlwZT1cInRyYW5zaXRpb25cIiksYS50cmFuc2Zvcm1zRW5hYmxlZD1hLm9wdGlvbnMudXNlVHJhbnNmb3JtJiZudWxsIT09YS5hbmltVHlwZSYmYS5hbmltVHlwZSE9PSExfSxiLnByb3RvdHlwZS5zZXRTbGlkZUNsYXNzZXM9ZnVuY3Rpb24oYSl7dmFyIGMsZCxlLGYsYj10aGlzO2Q9Yi4kc2xpZGVyLmZpbmQoXCIuc2xpY2stc2xpZGVcIikucmVtb3ZlQ2xhc3MoXCJzbGljay1hY3RpdmUgc2xpY2stY2VudGVyIHNsaWNrLWN1cnJlbnRcIikuYXR0cihcImFyaWEtaGlkZGVuXCIsXCJ0cnVlXCIpLGIuJHNsaWRlcy5lcShhKS5hZGRDbGFzcyhcInNsaWNrLWN1cnJlbnRcIiksYi5vcHRpb25zLmNlbnRlck1vZGU9PT0hMD8oYz1NYXRoLmZsb29yKGIub3B0aW9ucy5zbGlkZXNUb1Nob3cvMiksYi5vcHRpb25zLmluZmluaXRlPT09ITAmJihhPj1jJiZhPD1iLnNsaWRlQ291bnQtMS1jP2IuJHNsaWRlcy5zbGljZShhLWMsYStjKzEpLmFkZENsYXNzKFwic2xpY2stYWN0aXZlXCIpLmF0dHIoXCJhcmlhLWhpZGRlblwiLFwiZmFsc2VcIik6KGU9Yi5vcHRpb25zLnNsaWRlc1RvU2hvdythLGQuc2xpY2UoZS1jKzEsZStjKzIpLmFkZENsYXNzKFwic2xpY2stYWN0aXZlXCIpLmF0dHIoXCJhcmlhLWhpZGRlblwiLFwiZmFsc2VcIikpLDA9PT1hP2QuZXEoZC5sZW5ndGgtMS1iLm9wdGlvbnMuc2xpZGVzVG9TaG93KS5hZGRDbGFzcyhcInNsaWNrLWNlbnRlclwiKTphPT09Yi5zbGlkZUNvdW50LTEmJmQuZXEoYi5vcHRpb25zLnNsaWRlc1RvU2hvdykuYWRkQ2xhc3MoXCJzbGljay1jZW50ZXJcIikpLGIuJHNsaWRlcy5lcShhKS5hZGRDbGFzcyhcInNsaWNrLWNlbnRlclwiKSk6YT49MCYmYTw9Yi5zbGlkZUNvdW50LWIub3B0aW9ucy5zbGlkZXNUb1Nob3c/Yi4kc2xpZGVzLnNsaWNlKGEsYStiLm9wdGlvbnMuc2xpZGVzVG9TaG93KS5hZGRDbGFzcyhcInNsaWNrLWFjdGl2ZVwiKS5hdHRyKFwiYXJpYS1oaWRkZW5cIixcImZhbHNlXCIpOmQubGVuZ3RoPD1iLm9wdGlvbnMuc2xpZGVzVG9TaG93P2QuYWRkQ2xhc3MoXCJzbGljay1hY3RpdmVcIikuYXR0cihcImFyaWEtaGlkZGVuXCIsXCJmYWxzZVwiKTooZj1iLnNsaWRlQ291bnQlYi5vcHRpb25zLnNsaWRlc1RvU2hvdyxlPWIub3B0aW9ucy5pbmZpbml0ZT09PSEwP2Iub3B0aW9ucy5zbGlkZXNUb1Nob3crYTphLGIub3B0aW9ucy5zbGlkZXNUb1Nob3c9PWIub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCYmYi5zbGlkZUNvdW50LWE8Yi5vcHRpb25zLnNsaWRlc1RvU2hvdz9kLnNsaWNlKGUtKGIub3B0aW9ucy5zbGlkZXNUb1Nob3ctZiksZStmKS5hZGRDbGFzcyhcInNsaWNrLWFjdGl2ZVwiKS5hdHRyKFwiYXJpYS1oaWRkZW5cIixcImZhbHNlXCIpOmQuc2xpY2UoZSxlK2Iub3B0aW9ucy5zbGlkZXNUb1Nob3cpLmFkZENsYXNzKFwic2xpY2stYWN0aXZlXCIpLmF0dHIoXCJhcmlhLWhpZGRlblwiLFwiZmFsc2VcIikpLFwib25kZW1hbmRcIj09PWIub3B0aW9ucy5sYXp5TG9hZCYmYi5sYXp5TG9hZCgpfSxiLnByb3RvdHlwZS5zZXR1cEluZmluaXRlPWZ1bmN0aW9uKCl7dmFyIGMsZCxlLGI9dGhpcztpZihiLm9wdGlvbnMuZmFkZT09PSEwJiYoYi5vcHRpb25zLmNlbnRlck1vZGU9ITEpLGIub3B0aW9ucy5pbmZpbml0ZT09PSEwJiZiLm9wdGlvbnMuZmFkZT09PSExJiYoZD1udWxsLGIuc2xpZGVDb3VudD5iLm9wdGlvbnMuc2xpZGVzVG9TaG93KSl7Zm9yKGU9Yi5vcHRpb25zLmNlbnRlck1vZGU9PT0hMD9iLm9wdGlvbnMuc2xpZGVzVG9TaG93KzE6Yi5vcHRpb25zLnNsaWRlc1RvU2hvdyxjPWIuc2xpZGVDb3VudDtjPmIuc2xpZGVDb3VudC1lO2MtPTEpZD1jLTEsYShiLiRzbGlkZXNbZF0pLmNsb25lKCEwKS5hdHRyKFwiaWRcIixcIlwiKS5hdHRyKFwiZGF0YS1zbGljay1pbmRleFwiLGQtYi5zbGlkZUNvdW50KS5wcmVwZW5kVG8oYi4kc2xpZGVUcmFjaykuYWRkQ2xhc3MoXCJzbGljay1jbG9uZWRcIik7Zm9yKGM9MDtlPmM7Yys9MSlkPWMsYShiLiRzbGlkZXNbZF0pLmNsb25lKCEwKS5hdHRyKFwiaWRcIixcIlwiKS5hdHRyKFwiZGF0YS1zbGljay1pbmRleFwiLGQrYi5zbGlkZUNvdW50KS5hcHBlbmRUbyhiLiRzbGlkZVRyYWNrKS5hZGRDbGFzcyhcInNsaWNrLWNsb25lZFwiKTtiLiRzbGlkZVRyYWNrLmZpbmQoXCIuc2xpY2stY2xvbmVkXCIpLmZpbmQoXCJbaWRdXCIpLmVhY2goZnVuY3Rpb24oKXthKHRoaXMpLmF0dHIoXCJpZFwiLFwiXCIpfSl9fSxiLnByb3RvdHlwZS5zZXRQYXVzZWQ9ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcztiLm9wdGlvbnMuYXV0b3BsYXk9PT0hMCYmYi5vcHRpb25zLnBhdXNlT25Ib3Zlcj09PSEwJiYoYi5wYXVzZWQ9YSxhP2IuYXV0b1BsYXlDbGVhcigpOmIuYXV0b1BsYXkoKSl9LGIucHJvdG90eXBlLnNlbGVjdEhhbmRsZXI9ZnVuY3Rpb24oYil7dmFyIGM9dGhpcyxkPWEoYi50YXJnZXQpLmlzKFwiLnNsaWNrLXNsaWRlXCIpP2EoYi50YXJnZXQpOmEoYi50YXJnZXQpLnBhcmVudHMoXCIuc2xpY2stc2xpZGVcIiksZT1wYXJzZUludChkLmF0dHIoXCJkYXRhLXNsaWNrLWluZGV4XCIpKTtyZXR1cm4gZXx8KGU9MCksYy5zbGlkZUNvdW50PD1jLm9wdGlvbnMuc2xpZGVzVG9TaG93PyhjLnNldFNsaWRlQ2xhc3NlcyhlKSx2b2lkIGMuYXNOYXZGb3IoZSkpOnZvaWQgYy5zbGlkZUhhbmRsZXIoZSl9LGIucHJvdG90eXBlLnNsaWRlSGFuZGxlcj1mdW5jdGlvbihhLGIsYyl7dmFyIGQsZSxmLGcsaD1udWxsLGk9dGhpcztyZXR1cm4gYj1ifHwhMSxpLmFuaW1hdGluZz09PSEwJiZpLm9wdGlvbnMud2FpdEZvckFuaW1hdGU9PT0hMHx8aS5vcHRpb25zLmZhZGU9PT0hMCYmaS5jdXJyZW50U2xpZGU9PT1hfHxpLnNsaWRlQ291bnQ8PWkub3B0aW9ucy5zbGlkZXNUb1Nob3c/dm9pZCAwOihiPT09ITEmJmkuYXNOYXZGb3IoYSksZD1hLGg9aS5nZXRMZWZ0KGQpLGc9aS5nZXRMZWZ0KGkuY3VycmVudFNsaWRlKSxpLmN1cnJlbnRMZWZ0PW51bGw9PT1pLnN3aXBlTGVmdD9nOmkuc3dpcGVMZWZ0LGkub3B0aW9ucy5pbmZpbml0ZT09PSExJiZpLm9wdGlvbnMuY2VudGVyTW9kZT09PSExJiYoMD5hfHxhPmkuZ2V0RG90Q291bnQoKSppLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwpP3ZvaWQoaS5vcHRpb25zLmZhZGU9PT0hMSYmKGQ9aS5jdXJyZW50U2xpZGUsYyE9PSEwP2kuYW5pbWF0ZVNsaWRlKGcsZnVuY3Rpb24oKXtpLnBvc3RTbGlkZShkKTtcbn0pOmkucG9zdFNsaWRlKGQpKSk6aS5vcHRpb25zLmluZmluaXRlPT09ITEmJmkub3B0aW9ucy5jZW50ZXJNb2RlPT09ITAmJigwPmF8fGE+aS5zbGlkZUNvdW50LWkub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCk/dm9pZChpLm9wdGlvbnMuZmFkZT09PSExJiYoZD1pLmN1cnJlbnRTbGlkZSxjIT09ITA/aS5hbmltYXRlU2xpZGUoZyxmdW5jdGlvbigpe2kucG9zdFNsaWRlKGQpfSk6aS5wb3N0U2xpZGUoZCkpKTooaS5vcHRpb25zLmF1dG9wbGF5PT09ITAmJmNsZWFySW50ZXJ2YWwoaS5hdXRvUGxheVRpbWVyKSxlPTA+ZD9pLnNsaWRlQ291bnQlaS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsIT09MD9pLnNsaWRlQ291bnQtaS5zbGlkZUNvdW50JWkub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDppLnNsaWRlQ291bnQrZDpkPj1pLnNsaWRlQ291bnQ/aS5zbGlkZUNvdW50JWkub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCE9PTA/MDpkLWkuc2xpZGVDb3VudDpkLGkuYW5pbWF0aW5nPSEwLGkuJHNsaWRlci50cmlnZ2VyKFwiYmVmb3JlQ2hhbmdlXCIsW2ksaS5jdXJyZW50U2xpZGUsZV0pLGY9aS5jdXJyZW50U2xpZGUsaS5jdXJyZW50U2xpZGU9ZSxpLnNldFNsaWRlQ2xhc3NlcyhpLmN1cnJlbnRTbGlkZSksaS51cGRhdGVEb3RzKCksaS51cGRhdGVBcnJvd3MoKSxpLm9wdGlvbnMuZmFkZT09PSEwPyhjIT09ITA/KGkuZmFkZVNsaWRlT3V0KGYpLGkuZmFkZVNsaWRlKGUsZnVuY3Rpb24oKXtpLnBvc3RTbGlkZShlKX0pKTppLnBvc3RTbGlkZShlKSx2b2lkIGkuYW5pbWF0ZUhlaWdodCgpKTp2b2lkKGMhPT0hMD9pLmFuaW1hdGVTbGlkZShoLGZ1bmN0aW9uKCl7aS5wb3N0U2xpZGUoZSl9KTppLnBvc3RTbGlkZShlKSkpKX0sYi5wcm90b3R5cGUuc3RhcnRMb2FkPWZ1bmN0aW9uKCl7dmFyIGE9dGhpczthLm9wdGlvbnMuYXJyb3dzPT09ITAmJmEuc2xpZGVDb3VudD5hLm9wdGlvbnMuc2xpZGVzVG9TaG93JiYoYS4kcHJldkFycm93LmhpZGUoKSxhLiRuZXh0QXJyb3cuaGlkZSgpKSxhLm9wdGlvbnMuZG90cz09PSEwJiZhLnNsaWRlQ291bnQ+YS5vcHRpb25zLnNsaWRlc1RvU2hvdyYmYS4kZG90cy5oaWRlKCksYS4kc2xpZGVyLmFkZENsYXNzKFwic2xpY2stbG9hZGluZ1wiKX0sYi5wcm90b3R5cGUuc3dpcGVEaXJlY3Rpb249ZnVuY3Rpb24oKXt2YXIgYSxiLGMsZCxlPXRoaXM7cmV0dXJuIGE9ZS50b3VjaE9iamVjdC5zdGFydFgtZS50b3VjaE9iamVjdC5jdXJYLGI9ZS50b3VjaE9iamVjdC5zdGFydFktZS50b3VjaE9iamVjdC5jdXJZLGM9TWF0aC5hdGFuMihiLGEpLGQ9TWF0aC5yb3VuZCgxODAqYy9NYXRoLlBJKSwwPmQmJihkPTM2MC1NYXRoLmFicyhkKSksNDU+PWQmJmQ+PTA/ZS5vcHRpb25zLnJ0bD09PSExP1wibGVmdFwiOlwicmlnaHRcIjozNjA+PWQmJmQ+PTMxNT9lLm9wdGlvbnMucnRsPT09ITE/XCJsZWZ0XCI6XCJyaWdodFwiOmQ+PTEzNSYmMjI1Pj1kP2Uub3B0aW9ucy5ydGw9PT0hMT9cInJpZ2h0XCI6XCJsZWZ0XCI6ZS5vcHRpb25zLnZlcnRpY2FsU3dpcGluZz09PSEwP2Q+PTM1JiYxMzU+PWQ/XCJsZWZ0XCI6XCJyaWdodFwiOlwidmVydGljYWxcIn0sYi5wcm90b3R5cGUuc3dpcGVFbmQ9ZnVuY3Rpb24oYSl7dmFyIGMsYj10aGlzO2lmKGIuZHJhZ2dpbmc9ITEsYi5zaG91bGRDbGljaz1iLnRvdWNoT2JqZWN0LnN3aXBlTGVuZ3RoPjEwPyExOiEwLHZvaWQgMD09PWIudG91Y2hPYmplY3QuY3VyWClyZXR1cm4hMTtpZihiLnRvdWNoT2JqZWN0LmVkZ2VIaXQ9PT0hMCYmYi4kc2xpZGVyLnRyaWdnZXIoXCJlZGdlXCIsW2IsYi5zd2lwZURpcmVjdGlvbigpXSksYi50b3VjaE9iamVjdC5zd2lwZUxlbmd0aD49Yi50b3VjaE9iamVjdC5taW5Td2lwZSlzd2l0Y2goYi5zd2lwZURpcmVjdGlvbigpKXtjYXNlXCJsZWZ0XCI6Yz1iLm9wdGlvbnMuc3dpcGVUb1NsaWRlP2IuY2hlY2tOYXZpZ2FibGUoYi5jdXJyZW50U2xpZGUrYi5nZXRTbGlkZUNvdW50KCkpOmIuY3VycmVudFNsaWRlK2IuZ2V0U2xpZGVDb3VudCgpLGIuc2xpZGVIYW5kbGVyKGMpLGIuY3VycmVudERpcmVjdGlvbj0wLGIudG91Y2hPYmplY3Q9e30sYi4kc2xpZGVyLnRyaWdnZXIoXCJzd2lwZVwiLFtiLFwibGVmdFwiXSk7YnJlYWs7Y2FzZVwicmlnaHRcIjpjPWIub3B0aW9ucy5zd2lwZVRvU2xpZGU/Yi5jaGVja05hdmlnYWJsZShiLmN1cnJlbnRTbGlkZS1iLmdldFNsaWRlQ291bnQoKSk6Yi5jdXJyZW50U2xpZGUtYi5nZXRTbGlkZUNvdW50KCksYi5zbGlkZUhhbmRsZXIoYyksYi5jdXJyZW50RGlyZWN0aW9uPTEsYi50b3VjaE9iamVjdD17fSxiLiRzbGlkZXIudHJpZ2dlcihcInN3aXBlXCIsW2IsXCJyaWdodFwiXSl9ZWxzZSBiLnRvdWNoT2JqZWN0LnN0YXJ0WCE9PWIudG91Y2hPYmplY3QuY3VyWCYmKGIuc2xpZGVIYW5kbGVyKGIuY3VycmVudFNsaWRlKSxiLnRvdWNoT2JqZWN0PXt9KX0sYi5wcm90b3R5cGUuc3dpcGVIYW5kbGVyPWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXM7aWYoIShiLm9wdGlvbnMuc3dpcGU9PT0hMXx8XCJvbnRvdWNoZW5kXCJpbiBkb2N1bWVudCYmYi5vcHRpb25zLnN3aXBlPT09ITF8fGIub3B0aW9ucy5kcmFnZ2FibGU9PT0hMSYmLTEhPT1hLnR5cGUuaW5kZXhPZihcIm1vdXNlXCIpKSlzd2l0Y2goYi50b3VjaE9iamVjdC5maW5nZXJDb3VudD1hLm9yaWdpbmFsRXZlbnQmJnZvaWQgMCE9PWEub3JpZ2luYWxFdmVudC50b3VjaGVzP2Eub3JpZ2luYWxFdmVudC50b3VjaGVzLmxlbmd0aDoxLGIudG91Y2hPYmplY3QubWluU3dpcGU9Yi5saXN0V2lkdGgvYi5vcHRpb25zLnRvdWNoVGhyZXNob2xkLGIub3B0aW9ucy52ZXJ0aWNhbFN3aXBpbmc9PT0hMCYmKGIudG91Y2hPYmplY3QubWluU3dpcGU9Yi5saXN0SGVpZ2h0L2Iub3B0aW9ucy50b3VjaFRocmVzaG9sZCksYS5kYXRhLmFjdGlvbil7Y2FzZVwic3RhcnRcIjpiLnN3aXBlU3RhcnQoYSk7YnJlYWs7Y2FzZVwibW92ZVwiOmIuc3dpcGVNb3ZlKGEpO2JyZWFrO2Nhc2VcImVuZFwiOmIuc3dpcGVFbmQoYSl9fSxiLnByb3RvdHlwZS5zd2lwZU1vdmU9ZnVuY3Rpb24oYSl7dmFyIGQsZSxmLGcsaCxiPXRoaXM7cmV0dXJuIGg9dm9pZCAwIT09YS5vcmlnaW5hbEV2ZW50P2Eub3JpZ2luYWxFdmVudC50b3VjaGVzOm51bGwsIWIuZHJhZ2dpbmd8fGgmJjEhPT1oLmxlbmd0aD8hMTooZD1iLmdldExlZnQoYi5jdXJyZW50U2xpZGUpLGIudG91Y2hPYmplY3QuY3VyWD12b2lkIDAhPT1oP2hbMF0ucGFnZVg6YS5jbGllbnRYLGIudG91Y2hPYmplY3QuY3VyWT12b2lkIDAhPT1oP2hbMF0ucGFnZVk6YS5jbGllbnRZLGIudG91Y2hPYmplY3Quc3dpcGVMZW5ndGg9TWF0aC5yb3VuZChNYXRoLnNxcnQoTWF0aC5wb3coYi50b3VjaE9iamVjdC5jdXJYLWIudG91Y2hPYmplY3Quc3RhcnRYLDIpKSksYi5vcHRpb25zLnZlcnRpY2FsU3dpcGluZz09PSEwJiYoYi50b3VjaE9iamVjdC5zd2lwZUxlbmd0aD1NYXRoLnJvdW5kKE1hdGguc3FydChNYXRoLnBvdyhiLnRvdWNoT2JqZWN0LmN1clktYi50b3VjaE9iamVjdC5zdGFydFksMikpKSksZT1iLnN3aXBlRGlyZWN0aW9uKCksXCJ2ZXJ0aWNhbFwiIT09ZT8odm9pZCAwIT09YS5vcmlnaW5hbEV2ZW50JiZiLnRvdWNoT2JqZWN0LnN3aXBlTGVuZ3RoPjQmJmEucHJldmVudERlZmF1bHQoKSxnPShiLm9wdGlvbnMucnRsPT09ITE/MTotMSkqKGIudG91Y2hPYmplY3QuY3VyWD5iLnRvdWNoT2JqZWN0LnN0YXJ0WD8xOi0xKSxiLm9wdGlvbnMudmVydGljYWxTd2lwaW5nPT09ITAmJihnPWIudG91Y2hPYmplY3QuY3VyWT5iLnRvdWNoT2JqZWN0LnN0YXJ0WT8xOi0xKSxmPWIudG91Y2hPYmplY3Quc3dpcGVMZW5ndGgsYi50b3VjaE9iamVjdC5lZGdlSGl0PSExLGIub3B0aW9ucy5pbmZpbml0ZT09PSExJiYoMD09PWIuY3VycmVudFNsaWRlJiZcInJpZ2h0XCI9PT1lfHxiLmN1cnJlbnRTbGlkZT49Yi5nZXREb3RDb3VudCgpJiZcImxlZnRcIj09PWUpJiYoZj1iLnRvdWNoT2JqZWN0LnN3aXBlTGVuZ3RoKmIub3B0aW9ucy5lZGdlRnJpY3Rpb24sYi50b3VjaE9iamVjdC5lZGdlSGl0PSEwKSxiLm9wdGlvbnMudmVydGljYWw9PT0hMT9iLnN3aXBlTGVmdD1kK2YqZzpiLnN3aXBlTGVmdD1kK2YqKGIuJGxpc3QuaGVpZ2h0KCkvYi5saXN0V2lkdGgpKmcsYi5vcHRpb25zLnZlcnRpY2FsU3dpcGluZz09PSEwJiYoYi5zd2lwZUxlZnQ9ZCtmKmcpLGIub3B0aW9ucy5mYWRlPT09ITB8fGIub3B0aW9ucy50b3VjaE1vdmU9PT0hMT8hMTpiLmFuaW1hdGluZz09PSEwPyhiLnN3aXBlTGVmdD1udWxsLCExKTp2b2lkIGIuc2V0Q1NTKGIuc3dpcGVMZWZ0KSk6dm9pZCAwKX0sYi5wcm90b3R5cGUuc3dpcGVTdGFydD1mdW5jdGlvbihhKXt2YXIgYyxiPXRoaXM7cmV0dXJuIDEhPT1iLnRvdWNoT2JqZWN0LmZpbmdlckNvdW50fHxiLnNsaWRlQ291bnQ8PWIub3B0aW9ucy5zbGlkZXNUb1Nob3c/KGIudG91Y2hPYmplY3Q9e30sITEpOih2b2lkIDAhPT1hLm9yaWdpbmFsRXZlbnQmJnZvaWQgMCE9PWEub3JpZ2luYWxFdmVudC50b3VjaGVzJiYoYz1hLm9yaWdpbmFsRXZlbnQudG91Y2hlc1swXSksYi50b3VjaE9iamVjdC5zdGFydFg9Yi50b3VjaE9iamVjdC5jdXJYPXZvaWQgMCE9PWM/Yy5wYWdlWDphLmNsaWVudFgsYi50b3VjaE9iamVjdC5zdGFydFk9Yi50b3VjaE9iamVjdC5jdXJZPXZvaWQgMCE9PWM/Yy5wYWdlWTphLmNsaWVudFksdm9pZChiLmRyYWdnaW5nPSEwKSl9LGIucHJvdG90eXBlLnVuZmlsdGVyU2xpZGVzPWIucHJvdG90eXBlLnNsaWNrVW5maWx0ZXI9ZnVuY3Rpb24oKXt2YXIgYT10aGlzO251bGwhPT1hLiRzbGlkZXNDYWNoZSYmKGEudW5sb2FkKCksYS4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpLmRldGFjaCgpLGEuJHNsaWRlc0NhY2hlLmFwcGVuZFRvKGEuJHNsaWRlVHJhY2spLGEucmVpbml0KCkpfSxiLnByb3RvdHlwZS51bmxvYWQ9ZnVuY3Rpb24oKXt2YXIgYj10aGlzO2EoXCIuc2xpY2stY2xvbmVkXCIsYi4kc2xpZGVyKS5yZW1vdmUoKSxiLiRkb3RzJiZiLiRkb3RzLnJlbW92ZSgpLGIuJHByZXZBcnJvdyYmYi5odG1sRXhwci50ZXN0KGIub3B0aW9ucy5wcmV2QXJyb3cpJiZiLiRwcmV2QXJyb3cucmVtb3ZlKCksYi4kbmV4dEFycm93JiZiLmh0bWxFeHByLnRlc3QoYi5vcHRpb25zLm5leHRBcnJvdykmJmIuJG5leHRBcnJvdy5yZW1vdmUoKSxiLiRzbGlkZXMucmVtb3ZlQ2xhc3MoXCJzbGljay1zbGlkZSBzbGljay1hY3RpdmUgc2xpY2stdmlzaWJsZSBzbGljay1jdXJyZW50XCIpLmF0dHIoXCJhcmlhLWhpZGRlblwiLFwidHJ1ZVwiKS5jc3MoXCJ3aWR0aFwiLFwiXCIpfSxiLnByb3RvdHlwZS51bnNsaWNrPWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXM7Yi4kc2xpZGVyLnRyaWdnZXIoXCJ1bnNsaWNrXCIsW2IsYV0pLGIuZGVzdHJveSgpfSxiLnByb3RvdHlwZS51cGRhdGVBcnJvd3M9ZnVuY3Rpb24oKXt2YXIgYixhPXRoaXM7Yj1NYXRoLmZsb29yKGEub3B0aW9ucy5zbGlkZXNUb1Nob3cvMiksYS5vcHRpb25zLmFycm93cz09PSEwJiZhLnNsaWRlQ291bnQ+YS5vcHRpb25zLnNsaWRlc1RvU2hvdyYmIWEub3B0aW9ucy5pbmZpbml0ZSYmKGEuJHByZXZBcnJvdy5yZW1vdmVDbGFzcyhcInNsaWNrLWRpc2FibGVkXCIpLmF0dHIoXCJhcmlhLWRpc2FibGVkXCIsXCJmYWxzZVwiKSxhLiRuZXh0QXJyb3cucmVtb3ZlQ2xhc3MoXCJzbGljay1kaXNhYmxlZFwiKS5hdHRyKFwiYXJpYS1kaXNhYmxlZFwiLFwiZmFsc2VcIiksMD09PWEuY3VycmVudFNsaWRlPyhhLiRwcmV2QXJyb3cuYWRkQ2xhc3MoXCJzbGljay1kaXNhYmxlZFwiKS5hdHRyKFwiYXJpYS1kaXNhYmxlZFwiLFwidHJ1ZVwiKSxhLiRuZXh0QXJyb3cucmVtb3ZlQ2xhc3MoXCJzbGljay1kaXNhYmxlZFwiKS5hdHRyKFwiYXJpYS1kaXNhYmxlZFwiLFwiZmFsc2VcIikpOmEuY3VycmVudFNsaWRlPj1hLnNsaWRlQ291bnQtYS5vcHRpb25zLnNsaWRlc1RvU2hvdyYmYS5vcHRpb25zLmNlbnRlck1vZGU9PT0hMT8oYS4kbmV4dEFycm93LmFkZENsYXNzKFwic2xpY2stZGlzYWJsZWRcIikuYXR0cihcImFyaWEtZGlzYWJsZWRcIixcInRydWVcIiksYS4kcHJldkFycm93LnJlbW92ZUNsYXNzKFwic2xpY2stZGlzYWJsZWRcIikuYXR0cihcImFyaWEtZGlzYWJsZWRcIixcImZhbHNlXCIpKTphLmN1cnJlbnRTbGlkZT49YS5zbGlkZUNvdW50LTEmJmEub3B0aW9ucy5jZW50ZXJNb2RlPT09ITAmJihhLiRuZXh0QXJyb3cuYWRkQ2xhc3MoXCJzbGljay1kaXNhYmxlZFwiKS5hdHRyKFwiYXJpYS1kaXNhYmxlZFwiLFwidHJ1ZVwiKSxhLiRwcmV2QXJyb3cucmVtb3ZlQ2xhc3MoXCJzbGljay1kaXNhYmxlZFwiKS5hdHRyKFwiYXJpYS1kaXNhYmxlZFwiLFwiZmFsc2VcIikpKX0sYi5wcm90b3R5cGUudXBkYXRlRG90cz1mdW5jdGlvbigpe3ZhciBhPXRoaXM7bnVsbCE9PWEuJGRvdHMmJihhLiRkb3RzLmZpbmQoXCJsaVwiKS5yZW1vdmVDbGFzcyhcInNsaWNrLWFjdGl2ZVwiKS5hdHRyKFwiYXJpYS1oaWRkZW5cIixcInRydWVcIiksYS4kZG90cy5maW5kKFwibGlcIikuZXEoTWF0aC5mbG9vcihhLmN1cnJlbnRTbGlkZS9hLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwpKS5hZGRDbGFzcyhcInNsaWNrLWFjdGl2ZVwiKS5hdHRyKFwiYXJpYS1oaWRkZW5cIixcImZhbHNlXCIpKX0sYi5wcm90b3R5cGUudmlzaWJpbGl0eT1mdW5jdGlvbigpe3ZhciBhPXRoaXM7ZG9jdW1lbnRbYS5oaWRkZW5dPyhhLnBhdXNlZD0hMCxhLmF1dG9QbGF5Q2xlYXIoKSk6YS5vcHRpb25zLmF1dG9wbGF5PT09ITAmJihhLnBhdXNlZD0hMSxhLmF1dG9QbGF5KCkpfSxiLnByb3RvdHlwZS5pbml0QURBPWZ1bmN0aW9uKCl7dmFyIGI9dGhpcztiLiRzbGlkZXMuYWRkKGIuJHNsaWRlVHJhY2suZmluZChcIi5zbGljay1jbG9uZWRcIikpLmF0dHIoe1wiYXJpYS1oaWRkZW5cIjpcInRydWVcIix0YWJpbmRleDpcIi0xXCJ9KS5maW5kKFwiYSwgaW5wdXQsIGJ1dHRvbiwgc2VsZWN0XCIpLmF0dHIoe3RhYmluZGV4OlwiLTFcIn0pLGIuJHNsaWRlVHJhY2suYXR0cihcInJvbGVcIixcImxpc3Rib3hcIiksYi4kc2xpZGVzLm5vdChiLiRzbGlkZVRyYWNrLmZpbmQoXCIuc2xpY2stY2xvbmVkXCIpKS5lYWNoKGZ1bmN0aW9uKGMpe2EodGhpcykuYXR0cih7cm9sZTpcIm9wdGlvblwiLFwiYXJpYS1kZXNjcmliZWRieVwiOlwic2xpY2stc2xpZGVcIitiLmluc3RhbmNlVWlkK2N9KX0pLG51bGwhPT1iLiRkb3RzJiZiLiRkb3RzLmF0dHIoXCJyb2xlXCIsXCJ0YWJsaXN0XCIpLmZpbmQoXCJsaVwiKS5lYWNoKGZ1bmN0aW9uKGMpe2EodGhpcykuYXR0cih7cm9sZTpcInByZXNlbnRhdGlvblwiLFwiYXJpYS1zZWxlY3RlZFwiOlwiZmFsc2VcIixcImFyaWEtY29udHJvbHNcIjpcIm5hdmlnYXRpb25cIitiLmluc3RhbmNlVWlkK2MsaWQ6XCJzbGljay1zbGlkZVwiK2IuaW5zdGFuY2VVaWQrY30pfSkuZmlyc3QoKS5hdHRyKFwiYXJpYS1zZWxlY3RlZFwiLFwidHJ1ZVwiKS5lbmQoKS5maW5kKFwiYnV0dG9uXCIpLmF0dHIoXCJyb2xlXCIsXCJidXR0b25cIikuZW5kKCkuY2xvc2VzdChcImRpdlwiKS5hdHRyKFwicm9sZVwiLFwidG9vbGJhclwiKSxiLmFjdGl2YXRlQURBKCl9LGIucHJvdG90eXBlLmFjdGl2YXRlQURBPWZ1bmN0aW9uKCl7dmFyIGE9dGhpczthLiRzbGlkZVRyYWNrLmZpbmQoXCIuc2xpY2stYWN0aXZlXCIpLmF0dHIoe1wiYXJpYS1oaWRkZW5cIjpcImZhbHNlXCJ9KS5maW5kKFwiYSwgaW5wdXQsIGJ1dHRvbiwgc2VsZWN0XCIpLmF0dHIoe3RhYmluZGV4OlwiMFwifSl9LGIucHJvdG90eXBlLmZvY3VzSGFuZGxlcj1mdW5jdGlvbigpe3ZhciBiPXRoaXM7Yi4kc2xpZGVyLm9uKFwiZm9jdXMuc2xpY2sgYmx1ci5zbGlja1wiLFwiKlwiLGZ1bmN0aW9uKGMpe2Muc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7dmFyIGQ9YSh0aGlzKTtzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7Yi5pc1BsYXkmJihkLmlzKFwiOmZvY3VzXCIpPyhiLmF1dG9QbGF5Q2xlYXIoKSxiLnBhdXNlZD0hMCk6KGIucGF1c2VkPSExLGIuYXV0b1BsYXkoKSkpfSwwKX0pfSxhLmZuLnNsaWNrPWZ1bmN0aW9uKCl7dmFyIGYsZyxhPXRoaXMsYz1hcmd1bWVudHNbMF0sZD1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsMSksZT1hLmxlbmd0aDtmb3IoZj0wO2U+ZjtmKyspaWYoXCJvYmplY3RcIj09dHlwZW9mIGN8fFwidW5kZWZpbmVkXCI9PXR5cGVvZiBjP2FbZl0uc2xpY2s9bmV3IGIoYVtmXSxjKTpnPWFbZl0uc2xpY2tbY10uYXBwbHkoYVtmXS5zbGljayxkKSxcInVuZGVmaW5lZFwiIT10eXBlb2YgZylyZXR1cm4gZztyZXR1cm4gYX19KTsiLCIvKipcbiAqIElvbi5DaGVja1JhZGlvXG4gKiB2ZXJzaW9uIDIuMC4wIEJ1aWxkIDQyXG4gKiDCqSBEZW5pcyBJbmVzaGluLCAyMDE1XG4gKlxuICogUHJvamVjdCBwYWdlOiAgICBodHRwOi8vaW9uZGVuLmNvbS9hL3BsdWdpbnMvaW9uLkNoZWNrUmFkaW8vZW4uaHRtbFxuICogR2l0SHViIHBhZ2U6ICAgICBodHRwczovL2dpdGh1Yi5jb20vSW9uRGVuL2lvbi5DaGVja1JhZGlvXG4gKlxuICogUmVsZWFzZWQgdW5kZXIgTUlUIGxpY2VuY2U6XG4gKiBodHRwOi8vaW9uZGVuLmNvbS9hL3BsdWdpbnMvbGljZW5jZS1lbi5odG1sXG4gKi9cblxuOyhmdW5jdGlvbiAoJCwgd2luZG93KSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBpZiAoJC5mbi5pb25DaGVja1JhZGlvKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIVN0cmluZy5wcm90b3R5cGUudHJpbSkge1xuICAgICAgICAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgcnRyaW0gPSAvXltcXHNcXHVGRUZGXFx4QTBdK3xbXFxzXFx1RkVGRlxceEEwXSskL2c7XG4gICAgICAgICAgICBTdHJpbmcucHJvdG90eXBlLnRyaW0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlKHJ0cmltLCAnJyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KSgpO1xuICAgIH1cblxuXG5cbiAgICB2YXIgY29sbGVjdGlvbiA9IHt9LFxuICAgICAgICBpbnN0YW5jZXMgPSB7fTtcblxuICAgIHZhciBJb25DaGVja1JhZGlvID0gZnVuY3Rpb24gKGdyb3VwKSB7XG4gICAgICAgIHRoaXMuZ3JvdXAgPSBncm91cC5jb250ZW50O1xuICAgICAgICB0aGlzLnR5cGUgPSBncm91cC50eXBlO1xuICAgICAgICB0aGlzLiRncm91cCA9ICQodGhpcy5ncm91cCk7XG4gICAgICAgIHRoaXMub2xkID0gbnVsbDtcbiAgICAgICAgdGhpcy5vYnNlcnZlciA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIElvbkNoZWNrUmFkaW8ucHJvdG90eXBlID0ge1xuICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVhZHkgPSB0aGlzLiRncm91cC5lcSgwKS5oYXNDbGFzcyhcImljci1pbnB1dFwiKTtcblxuICAgICAgICAgICAgaWYgKHJlYWR5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcmVwYXJlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlSFRNTCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHByZXBhcmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgICAgICAkaXRlbSxcbiAgICAgICAgICAgICAgICAkcGFyZW50LFxuICAgICAgICAgICAgICAgIGk7XG5cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmdyb3VwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgJGl0ZW0gPSAkKHRoaXMuZ3JvdXBbaV0pO1xuICAgICAgICAgICAgICAgICRwYXJlbnQgPSAkaXRlbS5wYXJlbnQoKS5wYXJlbnQoKTtcbiAgICAgICAgICAgICAgICAkLmRhdGEodGhpcy5ncm91cFtpXSwgXCJpY3ItcGFyZW50XCIsICRwYXJlbnQpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5wcmVzZXRDaGVja2VkKHRoaXMuZ3JvdXBbaV0pO1xuICAgICAgICAgICAgICAgIHRoaXMucHJlc2V0RGlzYWJsZWQodGhpcy5ncm91cFtpXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuJGdyb3VwLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmNoYW5nZSh0aGlzKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLiRncm91cC5vbihcImZvY3VzXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmZvY3VzKHRoaXMpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuJGdyb3VwLm9uKFwiYmx1clwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5ibHVyKHRoaXMpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFRyYWNlIGlucHV0IFwiZGlzYWJsZWRcIiBhdHRyaWJ1dGUgbXV0YXRpb25cbiAgICAgICAgICAgIC8vIE9ubHkgZm9yIG1vZGVybiBicm93c2Vycy4gSUUxMStcbiAgICAgICAgICAgIC8vIFRvIGFkZCBjcm9zcyBicm93c2VyIHN1cHBvcnQsIGluc3RhbGwgdGhpczpcbiAgICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tZWdhd2FjL011dGF0aW9uT2JzZXJ2ZXIuanNcbiAgICAgICAgICAgIGlmICh3aW5kb3cuTXV0YXRpb25PYnNlcnZlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0VXBPYnNlcnZlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHNldFVwT2JzZXJ2ZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgICAgIGk7XG5cbiAgICAgICAgICAgIHRoaXMub2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbiAobXV0YXRpb25zKSB7XG4gICAgICAgICAgICAgICAgbXV0YXRpb25zLmZvckVhY2goZnVuY3Rpb24gKG11dGF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUgPSBtdXRhdGlvbi50YXJnZXQ7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUgPT09IFwiZGlzYWJsZWRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi50b2dnbGUoc2VsZi5nZXRQYXJlbnQobm9kZSksIG5vZGUuZGlzYWJsZWQsIFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5ncm91cC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMub2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLmdyb3VwW2ldLCB7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHRydWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLiRncm91cC5vZmYoKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMub2JzZXJ2ZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgICAgICB0aGlzLm9ic2VydmVyID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBwcmVzZXRDaGVja2VkOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgaWYgKG5vZGUuY2hlY2tlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlKHRoaXMuZ2V0UGFyZW50KG5vZGUpLCB0cnVlLCBcImNoZWNrZWRcIik7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy50eXBlID09PSBcInJhZGlvXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbGQgPSBub2RlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBwcmVzZXREaXNhYmxlZDogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIGlmIChub2RlLmRpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50b2dnbGUodGhpcy5nZXRQYXJlbnQobm9kZSksIHRydWUsIFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2hhbmdlOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgdGhpcy50b2dnbGUodGhpcy5nZXRQYXJlbnQobm9kZSksIG5vZGUuY2hlY2tlZCwgXCJjaGVja2VkXCIpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy50eXBlID09PSBcInJhZGlvXCIgJiYgdGhpcy5vbGQgJiYgdGhpcy5vbGQgIT09IG5vZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZSh0aGlzLmdldFBhcmVudCh0aGlzLm9sZCksIHRoaXMub2xkLmNoZWNrZWQsIFwiY2hlY2tlZFwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5vbGQgPSBub2RlO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZvY3VzOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgdGhpcy50b2dnbGUodGhpcy5nZXRQYXJlbnQobm9kZSksIHRydWUsIFwiZm9jdXNlZFwiKTtcbiAgICAgICAgfSxcblxuICAgICAgICBibHVyOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgdGhpcy50b2dnbGUodGhpcy5nZXRQYXJlbnQobm9kZSksIGZhbHNlLCBcImZvY3VzZWRcIik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdG9nZ2xlOiBmdW5jdGlvbiAoJG5vZGUsIHN0YXRlLCBjbGFzc19uYW1lKSB7XG4gICAgICAgICAgICBpZiAoc3RhdGUpIHtcbiAgICAgICAgICAgICAgICAkbm9kZS5hZGRDbGFzcyhjbGFzc19uYW1lKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJG5vZGUucmVtb3ZlQ2xhc3MoY2xhc3NfbmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0UGFyZW50OiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgcmV0dXJuICQuZGF0YShub2RlLCBcImljci1wYXJlbnRcIik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gYXV0byB0cmFuc2Zvcm0gY29kZSB0byBjb3JyZWN0IGxheW91dFxuICAgICAgICAvLyBWRVJZIFNMT1coISkgZm9yIGxhenkgZGV2ZWxvcGVyc1xuICAgICAgICAvLyB0byBhdm9pZCB0aGlzLCB1c2UgcmVjb21tZW5kZWQgaHRtbCBsYXlvdXRcbiAgICAgICAgY3JlYXRlSFRNTDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHRwbCA9XG4gICAgICAgICAgICAgICAgICAgICc8bGFiZWwgY2xhc3M9XCJpY3ItbGFiZWxcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgJyAgIDxzcGFuIGNsYXNzPVwiaWNyLWl0ZW0gdHlwZV97dHlwZX1cIj48L3NwYW4+JyArXG4gICAgICAgICAgICAgICAgICAgICcgICA8c3BhbiBjbGFzcz1cImljci1oaWRkZW5cIj48aW5wdXQgY2xhc3M9XCJpY3ItaW5wdXQge2NsYXNzX2xpc3R9XCIgdHlwZT1cInt0eXBlfVwiIG5hbWU9XCJ7bmFtZX1cIiB2YWx1ZT1cInt2YWx1ZX1cIiB7ZGlzYWJsZWR9IHtjaGVja2VkfSAvPjwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICAgJyAgIDxzcGFuIGNsYXNzPVwiaWNyLXRleHRcIj57dGV4dH08L3NwYW4+JyArXG4gICAgICAgICAgICAgICAgICAgICc8L2xhYmVsPicsXG5cbiAgICAgICAgICAgICAgICBjbGFzc2VzID0gW10sXG4gICAgICAgICAgICAgICAgdHlwZXMgPSBbXSxcbiAgICAgICAgICAgICAgICBuYW1lcyA9IFtdLFxuICAgICAgICAgICAgICAgIHZhbHVlcyA9IFtdLFxuICAgICAgICAgICAgICAgIHRleHRzID0gW10sXG4gICAgICAgICAgICAgICAgY2hlY2tlZF9saXN0ID0gW10sXG4gICAgICAgICAgICAgICAgZGlzYWJsZWRfbGlzdCA9IFtdLFxuICAgICAgICAgICAgICAgIG5jID0gW10sXG4gICAgICAgICAgICAgICAgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIHZhciBnZXRUZXh0UGFyZW50ID0gZnVuY3Rpb24gKCRsYWJlbCkge1xuICAgICAgICAgICAgICAgIHZhciBsYWJlbCA9ICRsYWJlbFswXSxcbiAgICAgICAgICAgICAgICAgICAgcXVldWUgPSBbXSxcbiAgICAgICAgICAgICAgICAgICAgbm9kZXMgPSBsYWJlbC5jaGlsZE5vZGVzLFxuICAgICAgICAgICAgICAgICAgICBjdXIsIHRleHQsIGh0bWwsXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0LCBlbmQsIGk7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgcXVldWUucHVzaChub2Rlc1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgd2hpbGUgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBjdXIgPSBxdWV1ZVswXTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VyLm5vZGVUeXBlID09PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gY3VyLm5vZGVWYWx1ZS50cmltKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VyLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlcyA9IGN1ci5jaGlsZE5vZGVzO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWV1ZS5wdXNoKG5vZGVzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5zcGxpY2UuY2FsbChxdWV1ZSwgMCwgMSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaHRtbCA9IGN1ci5wYXJlbnROb2RlLmlubmVySFRNTDtcblxuICAgICAgICAgICAgICAgIGlmIChodG1sLmluZGV4T2YoJzxpbnB1dCcpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQgPSBodG1sLmluZGV4T2YoJzxpbnB1dCcpO1xuICAgICAgICAgICAgICAgICAgICBodG1sID0gaHRtbC5zbGljZShzdGFydCk7XG4gICAgICAgICAgICAgICAgICAgIGVuZCA9IGh0bWwuaW5kZXhPZignPicpO1xuICAgICAgICAgICAgICAgICAgICBodG1sID0gaHRtbC5zbGljZShlbmQgKyAxKS50cmltKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGh0bWw7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgZ2V0SFRNTCA9IGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRwID0gdHBsLnJlcGxhY2UoL1xce2NsYXNzX2xpc3RcXH0vLCBjbGFzc2VzW2ldKTtcbiAgICAgICAgICAgICAgICB0cCA9IHRwLnJlcGxhY2UoL1xce3R5cGVcXH0vZywgdHlwZXNbaV0pO1xuICAgICAgICAgICAgICAgIHRwID0gdHAucmVwbGFjZSgvXFx7bmFtZVxcfS8sIG5hbWVzW2ldKTtcbiAgICAgICAgICAgICAgICB0cCA9IHRwLnJlcGxhY2UoL1xce3ZhbHVlXFx9LywgdmFsdWVzW2ldKTtcbiAgICAgICAgICAgICAgICB0cCA9IHRwLnJlcGxhY2UoL1xce3RleHRcXH0vLCB0ZXh0c1tpXSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZGlzYWJsZWRfbGlzdFtpXSkge1xuICAgICAgICAgICAgICAgICAgICB0cCA9IHRwLnJlcGxhY2UoL1xce2Rpc2FibGVkXFx9LywgXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0cCA9IHRwLnJlcGxhY2UoL1xce2Rpc2FibGVkXFx9LywgXCJcIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGNoZWNrZWRfbGlzdFtpXSkge1xuICAgICAgICAgICAgICAgICAgICB0cCA9IHRwLnJlcGxhY2UoL1xce2NoZWNrZWRcXH0vLCBcImNoZWNrZWRcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdHAgPSB0cC5yZXBsYWNlKC9cXHtjaGVja2VkXFx9LywgXCJcIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRwO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy4kZ3JvdXAuZWFjaChmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgICAgIHZhciAkbGFiZWwsXG4gICAgICAgICAgICAgICAgICAgICRuZXh0LFxuICAgICAgICAgICAgICAgICAgICAkY3VyID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NfbGlzdCA9ICRjdXIucHJvcChcImNsYXNzTmFtZVwiKSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9ICRjdXIucHJvcChcInR5cGVcIiksXG4gICAgICAgICAgICAgICAgICAgIG5hbWUgPSAkY3VyLnByb3AoXCJuYW1lXCIpLFxuICAgICAgICAgICAgICAgICAgICB2YWwgPSAkY3VyLnByb3AoXCJ2YWx1ZVwiKSxcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tlZCA9ICRjdXIucHJvcChcImNoZWNrZWRcIiksXG4gICAgICAgICAgICAgICAgICAgIGRpc2FibGVkID0gJGN1ci5wcm9wKFwiZGlzYWJsZWRcIiksXG4gICAgICAgICAgICAgICAgICAgIGlkID0gJGN1ci5wcm9wKFwiaWRcIiksXG4gICAgICAgICAgICAgICAgICAgIGh0bWw7XG5cbiAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2goY2xhc3NfbGlzdCk7XG4gICAgICAgICAgICAgICAgdHlwZXMucHVzaCh0eXBlKTtcbiAgICAgICAgICAgICAgICBuYW1lcy5wdXNoKG5hbWUpO1xuICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKHZhbCk7XG4gICAgICAgICAgICAgICAgY2hlY2tlZF9saXN0LnB1c2goY2hlY2tlZCk7XG4gICAgICAgICAgICAgICAgZGlzYWJsZWRfbGlzdC5wdXNoKGRpc2FibGVkKTtcblxuICAgICAgICAgICAgICAgIGlmIChpZCkge1xuICAgICAgICAgICAgICAgICAgICAkbGFiZWwgPSAkKFwibGFiZWxbZm9yPSdcIiArIGlkICsgXCInXVwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkbGFiZWwgPSAkY3VyLmNsb3Nlc3QoXCJsYWJlbFwiKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0ZXh0cy5wdXNoKGdldFRleHRQYXJlbnQoJGxhYmVsKSk7XG5cbiAgICAgICAgICAgICAgICBodG1sID0gZ2V0SFRNTChpKTtcbiAgICAgICAgICAgICAgICAkbGFiZWwuYWZ0ZXIoaHRtbCk7XG4gICAgICAgICAgICAgICAgJG5leHQgPSAkbGFiZWwubmV4dCgpO1xuICAgICAgICAgICAgICAgIG5jLnB1c2goJG5leHRbMF0pO1xuXG4gICAgICAgICAgICAgICAgJGN1ci5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAkbGFiZWwucmVtb3ZlKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy4kZ3JvdXAgPSAkKG5jKS5maW5kKFwiaW5wdXRcIik7XG4gICAgICAgICAgICB0aGlzLiRncm91cC5lYWNoKGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5ncm91cFtpXSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbltuYW1lc1swXV1baV0gPSB0aGlzO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMucHJlcGFyZSgpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgICQuZm4uaW9uQ2hlY2tSYWRpbyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGksXG4gICAgICAgICAgICBsb2NhbCA9IFtdLFxuICAgICAgICAgICAgaW5wdXQsXG4gICAgICAgICAgICBuYW1lO1xuXG4gICAgICAgIHZhciB3YXJuID0gZnVuY3Rpb24gKHRleHQpIHtcbiAgICAgICAgICAgIHdpbmRvdy5jb25zb2xlICYmIHdpbmRvdy5jb25zb2xlLndhcm4gJiYgd2luZG93LmNvbnNvbGUud2Fybih0ZXh0KTtcbiAgICAgICAgfTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaW5wdXQgPSB0aGlzW2ldO1xuICAgICAgICAgICAgbmFtZSA9IGlucHV0Lm5hbWU7XG5cbiAgICAgICAgICAgIGlmIChpbnB1dC50eXBlICE9PSBcInJhZGlvXCIgJiYgaW5wdXQudHlwZSAhPT0gXCJjaGVja2JveFwiIHx8ICFuYW1lKSB7XG4gICAgICAgICAgICAgICAgd2FybihcIklvbi5DaGVja1JhZGlvOiBTb21lIGlucHV0cyBoYXZlIHdyb25nIHR5cGUgb3IgYWJzZW50IG5hbWUgYXR0cmlidXRlIVwiKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29sbGVjdGlvbltuYW1lXSA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBpbnB1dC50eXBlLFxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFtdXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbG9jYWwucHVzaChpbnB1dCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbG9jYWwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlucHV0ID0gbG9jYWxbaV07XG4gICAgICAgICAgICBuYW1lID0gaW5wdXQubmFtZTtcblxuICAgICAgICAgICAgY29sbGVjdGlvbltuYW1lXS5jb250ZW50LnB1c2goaW5wdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChpIGluIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgIGlmIChpbnN0YW5jZXNbaV0pIHtcbiAgICAgICAgICAgICAgICBpbnN0YW5jZXNbaV0uZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIGluc3RhbmNlc1tpXSA9IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGluc3RhbmNlc1tpXSA9IG5ldyBJb25DaGVja1JhZGlvKGNvbGxlY3Rpb25baV0pO1xuICAgICAgICB9XG4gICAgfTtcblxufSkoalF1ZXJ5LCB3aW5kb3cpO1xuIiwiLyoqXG4gKiBKYXZhU2NyaXB0IENsaWVudCBEZXRlY3Rpb25cbiAqIChDKSB2aWF6ZW5ldHRpIEdtYkggKENocmlzdGlhbiBMdWR3aWcpXG4gKiBodHRwOi8vanNmaWRkbGUubmV0L0NocmlzdGlhbkwvQVZ5TkQvXG4gKi9cbiQgPSBqUXVlcnkubm9Db25mbGljdCgpO1xuKGZ1bmN0aW9uICh3aW5kb3cpIHtcbiAgICB7XG4gICAgICAgIHZhciB1bmtub3duID0gJy0nO1xuXG4gICAgICAgIC8vIHNjcmVlblxuICAgICAgICB2YXIgc2NyZWVuU2l6ZSA9ICcnO1xuICAgICAgICBpZiAoc2NyZWVuLndpZHRoKSB7XG4gICAgICAgICAgICB3aWR0aCA9IChzY3JlZW4ud2lkdGgpID8gc2NyZWVuLndpZHRoIDogJyc7XG4gICAgICAgICAgICBoZWlnaHQgPSAoc2NyZWVuLmhlaWdodCkgPyBzY3JlZW4uaGVpZ2h0IDogJyc7XG4gICAgICAgICAgICBzY3JlZW5TaXplICs9ICcnICsgd2lkdGggKyBcIiB4IFwiICsgaGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYnJvd3NlclxuICAgICAgICB2YXIgblZlciA9IG5hdmlnYXRvci5hcHBWZXJzaW9uO1xuICAgICAgICB2YXIgbkFndCA9IG5hdmlnYXRvci51c2VyQWdlbnQ7XG4gICAgICAgIHZhciBicm93c2VyID0gbmF2aWdhdG9yLmFwcE5hbWU7XG4gICAgICAgIHZhciB2ZXJzaW9uID0gJycgKyBwYXJzZUZsb2F0KG5hdmlnYXRvci5hcHBWZXJzaW9uKTtcbiAgICAgICAgdmFyIG1ham9yVmVyc2lvbiA9IHBhcnNlSW50KG5hdmlnYXRvci5hcHBWZXJzaW9uLCAxMCk7XG4gICAgICAgIHZhciBuYW1lT2Zmc2V0LCB2ZXJPZmZzZXQsIGl4O1xuXG4gICAgICAgIC8vIE9wZXJhXG4gICAgICAgIGlmICgodmVyT2Zmc2V0ID0gbkFndC5pbmRleE9mKCdPcGVyYScpKSAhPSAtMSkge1xuICAgICAgICAgICAgYnJvd3NlciA9ICdPcGVyYSc7XG4gICAgICAgICAgICB2ZXJzaW9uID0gbkFndC5zdWJzdHJpbmcodmVyT2Zmc2V0ICsgNik7XG4gICAgICAgICAgICBpZiAoKHZlck9mZnNldCA9IG5BZ3QuaW5kZXhPZignVmVyc2lvbicpKSAhPSAtMSkge1xuICAgICAgICAgICAgICAgIHZlcnNpb24gPSBuQWd0LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBPcGVyYSBOZXh0XG4gICAgICAgIGlmICgodmVyT2Zmc2V0ID0gbkFndC5pbmRleE9mKCdPUFInKSkgIT0gLTEpIHtcbiAgICAgICAgICAgIGJyb3dzZXIgPSAnT3BlcmEnO1xuICAgICAgICAgICAgdmVyc2lvbiA9IG5BZ3Quc3Vic3RyaW5nKHZlck9mZnNldCArIDQpO1xuICAgICAgICB9XG4gICAgICAgIC8vIE1TSUVcbiAgICAgICAgZWxzZSBpZiAoKHZlck9mZnNldCA9IG5BZ3QuaW5kZXhPZignTVNJRScpKSAhPSAtMSkge1xuICAgICAgICAgICAgYnJvd3NlciA9ICdNaWNyb3NvZnQgSW50ZXJuZXQgRXhwbG9yZXInO1xuICAgICAgICAgICAgdmVyc2lvbiA9IG5BZ3Quc3Vic3RyaW5nKHZlck9mZnNldCArIDUpO1xuICAgICAgICB9XG4gICAgICAgIC8vIENocm9tZVxuICAgICAgICBlbHNlIGlmICgodmVyT2Zmc2V0ID0gbkFndC5pbmRleE9mKCdDaHJvbWUnKSkgIT0gLTEpIHtcbiAgICAgICAgICAgIGJyb3dzZXIgPSAnQ2hyb21lJztcbiAgICAgICAgICAgIHZlcnNpb24gPSBuQWd0LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA3KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBTYWZhcmlcbiAgICAgICAgZWxzZSBpZiAoKHZlck9mZnNldCA9IG5BZ3QuaW5kZXhPZignU2FmYXJpJykpICE9IC0xKSB7XG4gICAgICAgICAgICBicm93c2VyID0gJ1NhZmFyaSc7XG4gICAgICAgICAgICB2ZXJzaW9uID0gbkFndC5zdWJzdHJpbmcodmVyT2Zmc2V0ICsgNyk7XG4gICAgICAgICAgICBpZiAoKHZlck9mZnNldCA9IG5BZ3QuaW5kZXhPZignVmVyc2lvbicpKSAhPSAtMSkge1xuICAgICAgICAgICAgICAgIHZlcnNpb24gPSBuQWd0LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBGaXJlZm94XG4gICAgICAgIGVsc2UgaWYgKCh2ZXJPZmZzZXQgPSBuQWd0LmluZGV4T2YoJ0ZpcmVmb3gnKSkgIT0gLTEpIHtcbiAgICAgICAgICAgIGJyb3dzZXIgPSAnRmlyZWZveCc7XG4gICAgICAgICAgICB2ZXJzaW9uID0gbkFndC5zdWJzdHJpbmcodmVyT2Zmc2V0ICsgOCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTVNJRSAxMStcbiAgICAgICAgZWxzZSBpZiAobkFndC5pbmRleE9mKCdUcmlkZW50LycpICE9IC0xKSB7XG4gICAgICAgICAgICBicm93c2VyID0gJ01pY3Jvc29mdCBJbnRlcm5ldCBFeHBsb3Jlcic7XG4gICAgICAgICAgICB2ZXJzaW9uID0gbkFndC5zdWJzdHJpbmcobkFndC5pbmRleE9mKCdydjonKSArIDMpO1xuICAgICAgICB9XG4gICAgICAgIC8vIE90aGVyIGJyb3dzZXJzXG4gICAgICAgIGVsc2UgaWYgKChuYW1lT2Zmc2V0ID0gbkFndC5sYXN0SW5kZXhPZignICcpICsgMSkgPCAodmVyT2Zmc2V0ID0gbkFndC5sYXN0SW5kZXhPZignLycpKSkge1xuICAgICAgICAgICAgYnJvd3NlciA9IG5BZ3Quc3Vic3RyaW5nKG5hbWVPZmZzZXQsIHZlck9mZnNldCk7XG4gICAgICAgICAgICB2ZXJzaW9uID0gbkFndC5zdWJzdHJpbmcodmVyT2Zmc2V0ICsgMSk7XG4gICAgICAgICAgICBpZiAoYnJvd3Nlci50b0xvd2VyQ2FzZSgpID09IGJyb3dzZXIudG9VcHBlckNhc2UoKSkge1xuICAgICAgICAgICAgICAgIGJyb3dzZXIgPSBuYXZpZ2F0b3IuYXBwTmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyB0cmltIHRoZSB2ZXJzaW9uIHN0cmluZ1xuICAgICAgICBpZiAoKGl4ID0gdmVyc2lvbi5pbmRleE9mKCc7JykpICE9IC0xKSB2ZXJzaW9uID0gdmVyc2lvbi5zdWJzdHJpbmcoMCwgaXgpO1xuICAgICAgICBpZiAoKGl4ID0gdmVyc2lvbi5pbmRleE9mKCcgJykpICE9IC0xKSB2ZXJzaW9uID0gdmVyc2lvbi5zdWJzdHJpbmcoMCwgaXgpO1xuICAgICAgICBpZiAoKGl4ID0gdmVyc2lvbi5pbmRleE9mKCcpJykpICE9IC0xKSB2ZXJzaW9uID0gdmVyc2lvbi5zdWJzdHJpbmcoMCwgaXgpO1xuXG4gICAgICAgIG1ham9yVmVyc2lvbiA9IHBhcnNlSW50KCcnICsgdmVyc2lvbiwgMTApO1xuICAgICAgICBpZiAoaXNOYU4obWFqb3JWZXJzaW9uKSkge1xuICAgICAgICAgICAgdmVyc2lvbiA9ICcnICsgcGFyc2VGbG9hdChuYXZpZ2F0b3IuYXBwVmVyc2lvbik7XG4gICAgICAgICAgICBtYWpvclZlcnNpb24gPSBwYXJzZUludChuYXZpZ2F0b3IuYXBwVmVyc2lvbiwgMTApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbW9iaWxlIHZlcnNpb25cbiAgICAgICAgdmFyIG1vYmlsZSA9IC9Nb2JpbGV8bWluaXxGZW5uZWN8QW5kcm9pZHxpUChhZHxvZHxob25lKS8udGVzdChuVmVyKTtcblxuICAgICAgICAvLyBjb29raWVcbiAgICAgICAgdmFyIGNvb2tpZUVuYWJsZWQgPSAobmF2aWdhdG9yLmNvb2tpZUVuYWJsZWQpID8gdHJ1ZSA6IGZhbHNlO1xuXG4gICAgICAgIGlmICh0eXBlb2YgbmF2aWdhdG9yLmNvb2tpZUVuYWJsZWQgPT0gJ3VuZGVmaW5lZCcgJiYgIWNvb2tpZUVuYWJsZWQpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmNvb2tpZSA9ICd0ZXN0Y29va2llJztcbiAgICAgICAgICAgIGNvb2tpZUVuYWJsZWQgPSAoZG9jdW1lbnQuY29va2llLmluZGV4T2YoJ3Rlc3Rjb29raWUnKSAhPSAtMSkgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzeXN0ZW1cbiAgICAgICAgdmFyIG9zID0gdW5rbm93bjtcbiAgICAgICAgdmFyIGNsaWVudFN0cmluZ3MgPSBbXG4gICAgICAgICAgICB7czonV2luZG93cyAxMCcsIHI6LyhXaW5kb3dzIDEwLjB8V2luZG93cyBOVCAxMC4wKS99LFxuICAgICAgICAgICAge3M6J1dpbmRvd3MgOC4xJywgcjovKFdpbmRvd3MgOC4xfFdpbmRvd3MgTlQgNi4zKS99LFxuICAgICAgICAgICAge3M6J1dpbmRvd3MgOCcsIHI6LyhXaW5kb3dzIDh8V2luZG93cyBOVCA2LjIpL30sXG4gICAgICAgICAgICB7czonV2luZG93cyA3JywgcjovKFdpbmRvd3MgN3xXaW5kb3dzIE5UIDYuMSkvfSxcbiAgICAgICAgICAgIHtzOidXaW5kb3dzIFZpc3RhJywgcjovV2luZG93cyBOVCA2LjAvfSxcbiAgICAgICAgICAgIHtzOidXaW5kb3dzIFNlcnZlciAyMDAzJywgcjovV2luZG93cyBOVCA1LjIvfSxcbiAgICAgICAgICAgIHtzOidXaW5kb3dzIFhQJywgcjovKFdpbmRvd3MgTlQgNS4xfFdpbmRvd3MgWFApL30sXG4gICAgICAgICAgICB7czonV2luZG93cyAyMDAwJywgcjovKFdpbmRvd3MgTlQgNS4wfFdpbmRvd3MgMjAwMCkvfSxcbiAgICAgICAgICAgIHtzOidXaW5kb3dzIE1FJywgcjovKFdpbiA5eCA0LjkwfFdpbmRvd3MgTUUpL30sXG4gICAgICAgICAgICB7czonV2luZG93cyA5OCcsIHI6LyhXaW5kb3dzIDk4fFdpbjk4KS99LFxuICAgICAgICAgICAge3M6J1dpbmRvd3MgOTUnLCByOi8oV2luZG93cyA5NXxXaW45NXxXaW5kb3dzXzk1KS99LFxuICAgICAgICAgICAge3M6J1dpbmRvd3MgTlQgNC4wJywgcjovKFdpbmRvd3MgTlQgNC4wfFdpbk5UNC4wfFdpbk5UfFdpbmRvd3MgTlQpL30sXG4gICAgICAgICAgICB7czonV2luZG93cyBDRScsIHI6L1dpbmRvd3MgQ0UvfSxcbiAgICAgICAgICAgIHtzOidXaW5kb3dzIDMuMTEnLCByOi9XaW4xNi99LFxuICAgICAgICAgICAge3M6J0FuZHJvaWQnLCByOi9BbmRyb2lkL30sXG4gICAgICAgICAgICB7czonT3BlbiBCU0QnLCByOi9PcGVuQlNEL30sXG4gICAgICAgICAgICB7czonU3VuIE9TJywgcjovU3VuT1MvfSxcbiAgICAgICAgICAgIHtzOidMaW51eCcsIHI6LyhMaW51eHxYMTEpL30sXG4gICAgICAgICAgICB7czonaU9TJywgcjovKGlQaG9uZXxpUGFkfGlQb2QpL30sXG4gICAgICAgICAgICB7czonTWFjIE9TIFgnLCByOi9NYWMgT1MgWC99LFxuICAgICAgICAgICAge3M6J01hYyBPUycsIHI6LyhNYWNQUEN8TWFjSW50ZWx8TWFjX1Bvd2VyUEN8TWFjaW50b3NoKS99LFxuICAgICAgICAgICAge3M6J1FOWCcsIHI6L1FOWC99LFxuICAgICAgICAgICAge3M6J1VOSVgnLCByOi9VTklYL30sXG4gICAgICAgICAgICB7czonQmVPUycsIHI6L0JlT1MvfSxcbiAgICAgICAgICAgIHtzOidPUy8yJywgcjovT1NcXC8yL30sXG4gICAgICAgICAgICB7czonU2VhcmNoIEJvdCcsIHI6LyhudWhrfEdvb2dsZWJvdHxZYW1teWJvdHxPcGVuYm90fFNsdXJwfE1TTkJvdHxBc2sgSmVldmVzXFwvVGVvbWF8aWFfYXJjaGl2ZXIpL31cbiAgICAgICAgXTtcbiAgICAgICAgZm9yICh2YXIgaWQgaW4gY2xpZW50U3RyaW5ncykge1xuICAgICAgICAgICAgdmFyIGNzID0gY2xpZW50U3RyaW5nc1tpZF07XG4gICAgICAgICAgICBpZiAoY3Muci50ZXN0KG5BZ3QpKSB7XG4gICAgICAgICAgICAgICAgb3MgPSBjcy5zO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG9zVmVyc2lvbiA9IHVua25vd247XG5cbiAgICAgICAgaWYgKC9XaW5kb3dzLy50ZXN0KG9zKSkge1xuICAgICAgICAgICAgb3NWZXJzaW9uID0gL1dpbmRvd3MgKC4qKS8uZXhlYyhvcylbMV07XG4gICAgICAgICAgICBvcyA9ICdXaW5kb3dzJztcbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCAob3MpIHtcbiAgICAgICAgICAgIGNhc2UgJ01hYyBPUyBYJzpcbiAgICAgICAgICAgICAgICBvc1ZlcnNpb24gPSAvTWFjIE9TIFggKDEwW1xcLlxcX1xcZF0rKS8uZXhlYyhuQWd0KVsxXTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnQW5kcm9pZCc6XG4gICAgICAgICAgICAgICAgb3NWZXJzaW9uID0gL0FuZHJvaWQgKFtcXC5cXF9cXGRdKykvLmV4ZWMobkFndClbMV07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ2lPUyc6XG4gICAgICAgICAgICAgICAgb3NWZXJzaW9uID0gL09TIChcXGQrKV8oXFxkKylfPyhcXGQrKT8vLmV4ZWMoblZlcik7XG4gICAgICAgICAgICAgICAgb3NWZXJzaW9uID0gb3NWZXJzaW9uWzFdICsgJy4nICsgb3NWZXJzaW9uWzJdICsgJy4nICsgKG9zVmVyc2lvblszXSB8IDApO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZmxhc2ggKHlvdSdsbCBuZWVkIHRvIGluY2x1ZGUgc3dmb2JqZWN0KVxuICAgICAgICAvKiBzY3JpcHQgc3JjPVwiLy9hamF4Lmdvb2dsZWFwaXMuY29tL2FqYXgvbGlicy9zd2ZvYmplY3QvMi4yL3N3Zm9iamVjdC5qc1wiICovXG4gICAgICAgIHZhciBmbGFzaFZlcnNpb24gPSAnbm8gY2hlY2snO1xuICAgICAgICBpZiAodHlwZW9mIHN3Zm9iamVjdCAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdmFyIGZ2ID0gc3dmb2JqZWN0LmdldEZsYXNoUGxheWVyVmVyc2lvbigpO1xuICAgICAgICAgICAgaWYgKGZ2Lm1ham9yID4gMCkge1xuICAgICAgICAgICAgICAgIGZsYXNoVmVyc2lvbiA9IGZ2Lm1ham9yICsgJy4nICsgZnYubWlub3IgKyAnIHInICsgZnYucmVsZWFzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgIHtcbiAgICAgICAgICAgICAgICBmbGFzaFZlcnNpb24gPSB1bmtub3duO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2luZG93LmpzY2QgPSB7XG4gICAgICAgIHNjcmVlbjogc2NyZWVuU2l6ZSxcbiAgICAgICAgYnJvd3NlcjogYnJvd3NlcixcbiAgICAgICAgYnJvd3NlclZlcnNpb246IHZlcnNpb24sXG4gICAgICAgIGJyb3dzZXJNYWpvclZlcnNpb246IG1ham9yVmVyc2lvbixcbiAgICAgICAgbW9iaWxlOiBtb2JpbGUsXG4gICAgICAgIG9zOiBvcyxcbiAgICAgICAgb3NWZXJzaW9uOiBvc1ZlcnNpb24sXG4gICAgICAgIGNvb2tpZXM6IGNvb2tpZUVuYWJsZWQsXG4gICAgICAgIGZsYXNoVmVyc2lvbjogZmxhc2hWZXJzaW9uXG4gICAgfTtcbn0odGhpcykpO1xuJCgnaHRtbCcpLmFkZENsYXNzKCdPUy0nKyBqc2NkLm9zICsnIE9TLVYnKyBqc2NkLm9zVmVyc2lvbiArJyBCcm93c2VyLScrIGpzY2QuYnJvd3NlciArJyBCcm93c2VyLVYnKyBqc2NkLmJyb3dzZXJNYWpvclZlcnNpb24gKycgTW9iaWxlLScrIGpzY2QubW9iaWxlKTtcbiIsIiQgPSBqUXVlcnkubm9Db25mbGljdCgpO1xuXG5qUXVlcnkoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgalF1ZXJ5KGRvY3VtZW50LmJvZHkpLm9uKCdjbGljaycsICcjbG9hZF9tb3JlX3JvYm9qb2JzJywgZnVuY3Rpb24gKGV2ZW50KXtcbiAgICAgICAgdmFyIHBvc3RPZmZzZXQgPSBqUXVlcnkoJyNsb2FkX21vcmVfcm9ib2pvYnMnKS5kYXRhKCdvZmZzZXQnKTtcbiAgICAgICAgdmFyIHRvdGFsX3Bvc3RzX2NvdW50ID0galF1ZXJ5KCcjbG9hZF9tb3JlX3JvYm9qb2JzJykuZGF0YSgnY291bnQnKTtcbiAgICAgICAgalF1ZXJ5KCcuam9iLWhpZGRlbicpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGpRdWVyeSh0aGlzKS5yZW1vdmVDbGFzcygnam9iLWhpZGRlbicpO1xuICAgICAgICB9KTtcbiAgICAgICAgalF1ZXJ5KCcubG9hZF9tb3JlX2pvYnMnKS5oaWRlKCk7XG4gICAgICAgIGpRdWVyeSggZG9jdW1lbnQgKS5hamF4Q29tcGxldGUoZnVuY3Rpb24oIGV2dCxyZXF1ZXN0LCBzZXR0aW5ncyApIHtcbiAgICAgICAgICAgIHZhciB1cmwgPSBzZXR0aW5ncy51cmw7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIGpRdWVyeShkb2N1bWVudC5ib2R5KS5vbignY2xpY2snLCAnLnBhZ2VoZWFkLWJ1dHRvbicsIGZ1bmN0aW9uIChldmVudCl7XG4gICAgICBqUXVlcnkoJy5hcHBsaWNhdGlvbl9kZXRhaWxzJykuc2hvdygpO1xuICAgIH0pO1xuXG59KTtcblxuLyoqXG4gKiBKYXZhU2NyaXB0IENsaWVudCBEZXRlY3Rpb25cbiAqIChDKSB2aWF6ZW5ldHRpIEdtYkggKENocmlzdGlhbiBMdWR3aWcpXG4gKiBodHRwOi8vanNmaWRkbGUubmV0L0NocmlzdGlhbkwvQVZ5TkQvXG4gKi9cbihmdW5jdGlvbiAod2luZG93KSB7XG4gICAge1xuICAgICAgICB2YXIgdW5rbm93biA9ICctJztcblxuICAgICAgICAvLyBzY3JlZW5cbiAgICAgICAgdmFyIHNjcmVlblNpemUgPSAnJztcbiAgICAgICAgaWYgKHNjcmVlbi53aWR0aCkge1xuICAgICAgICAgICAgd2lkdGggPSAoc2NyZWVuLndpZHRoKSA/IHNjcmVlbi53aWR0aCA6ICcnO1xuICAgICAgICAgICAgaGVpZ2h0ID0gKHNjcmVlbi5oZWlnaHQpID8gc2NyZWVuLmhlaWdodCA6ICcnO1xuICAgICAgICAgICAgc2NyZWVuU2l6ZSArPSAnJyArIHdpZHRoICsgXCIgeCBcIiArIGhlaWdodDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGJyb3dzZXJcbiAgICAgICAgdmFyIG5WZXIgPSBuYXZpZ2F0b3IuYXBwVmVyc2lvbjtcbiAgICAgICAgdmFyIG5BZ3QgPSBuYXZpZ2F0b3IudXNlckFnZW50O1xuICAgICAgICB2YXIgYnJvd3NlciA9IG5hdmlnYXRvci5hcHBOYW1lO1xuICAgICAgICB2YXIgdmVyc2lvbiA9ICcnICsgcGFyc2VGbG9hdChuYXZpZ2F0b3IuYXBwVmVyc2lvbik7XG4gICAgICAgIHZhciBtYWpvclZlcnNpb24gPSBwYXJzZUludChuYXZpZ2F0b3IuYXBwVmVyc2lvbiwgMTApO1xuICAgICAgICB2YXIgbmFtZU9mZnNldCwgdmVyT2Zmc2V0LCBpeDtcblxuICAgICAgICAvLyBPcGVyYVxuICAgICAgICBpZiAoKHZlck9mZnNldCA9IG5BZ3QuaW5kZXhPZignT3BlcmEnKSkgIT0gLTEpIHtcbiAgICAgICAgICAgIGJyb3dzZXIgPSAnT3BlcmEnO1xuICAgICAgICAgICAgdmVyc2lvbiA9IG5BZ3Quc3Vic3RyaW5nKHZlck9mZnNldCArIDYpO1xuICAgICAgICAgICAgaWYgKCh2ZXJPZmZzZXQgPSBuQWd0LmluZGV4T2YoJ1ZlcnNpb24nKSkgIT0gLTEpIHtcbiAgICAgICAgICAgICAgICB2ZXJzaW9uID0gbkFndC5zdWJzdHJpbmcodmVyT2Zmc2V0ICsgOCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gT3BlcmEgTmV4dFxuICAgICAgICBpZiAoKHZlck9mZnNldCA9IG5BZ3QuaW5kZXhPZignT1BSJykpICE9IC0xKSB7XG4gICAgICAgICAgICBicm93c2VyID0gJ09wZXJhJztcbiAgICAgICAgICAgIHZlcnNpb24gPSBuQWd0LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA0KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBNU0lFXG4gICAgICAgIGVsc2UgaWYgKCh2ZXJPZmZzZXQgPSBuQWd0LmluZGV4T2YoJ01TSUUnKSkgIT0gLTEpIHtcbiAgICAgICAgICAgIGJyb3dzZXIgPSAnTWljcm9zb2Z0IEludGVybmV0IEV4cGxvcmVyJztcbiAgICAgICAgICAgIHZlcnNpb24gPSBuQWd0LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA1KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBDaHJvbWVcbiAgICAgICAgZWxzZSBpZiAoKHZlck9mZnNldCA9IG5BZ3QuaW5kZXhPZignQ2hyb21lJykpICE9IC0xKSB7XG4gICAgICAgICAgICBicm93c2VyID0gJ0Nocm9tZSc7XG4gICAgICAgICAgICB2ZXJzaW9uID0gbkFndC5zdWJzdHJpbmcodmVyT2Zmc2V0ICsgNyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gU2FmYXJpXG4gICAgICAgIGVsc2UgaWYgKCh2ZXJPZmZzZXQgPSBuQWd0LmluZGV4T2YoJ1NhZmFyaScpKSAhPSAtMSkge1xuICAgICAgICAgICAgYnJvd3NlciA9ICdTYWZhcmknO1xuICAgICAgICAgICAgdmVyc2lvbiA9IG5BZ3Quc3Vic3RyaW5nKHZlck9mZnNldCArIDcpO1xuICAgICAgICAgICAgaWYgKCh2ZXJPZmZzZXQgPSBuQWd0LmluZGV4T2YoJ1ZlcnNpb24nKSkgIT0gLTEpIHtcbiAgICAgICAgICAgICAgICB2ZXJzaW9uID0gbkFndC5zdWJzdHJpbmcodmVyT2Zmc2V0ICsgOCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gRmlyZWZveFxuICAgICAgICBlbHNlIGlmICgodmVyT2Zmc2V0ID0gbkFndC5pbmRleE9mKCdGaXJlZm94JykpICE9IC0xKSB7XG4gICAgICAgICAgICBicm93c2VyID0gJ0ZpcmVmb3gnO1xuICAgICAgICAgICAgdmVyc2lvbiA9IG5BZ3Quc3Vic3RyaW5nKHZlck9mZnNldCArIDgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIE1TSUUgMTErXG4gICAgICAgIGVsc2UgaWYgKG5BZ3QuaW5kZXhPZignVHJpZGVudC8nKSAhPSAtMSkge1xuICAgICAgICAgICAgYnJvd3NlciA9ICdNaWNyb3NvZnQgSW50ZXJuZXQgRXhwbG9yZXInO1xuICAgICAgICAgICAgdmVyc2lvbiA9IG5BZ3Quc3Vic3RyaW5nKG5BZ3QuaW5kZXhPZigncnY6JykgKyAzKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBPdGhlciBicm93c2Vyc1xuICAgICAgICBlbHNlIGlmICgobmFtZU9mZnNldCA9IG5BZ3QubGFzdEluZGV4T2YoJyAnKSArIDEpIDwgKHZlck9mZnNldCA9IG5BZ3QubGFzdEluZGV4T2YoJy8nKSkpIHtcbiAgICAgICAgICAgIGJyb3dzZXIgPSBuQWd0LnN1YnN0cmluZyhuYW1lT2Zmc2V0LCB2ZXJPZmZzZXQpO1xuICAgICAgICAgICAgdmVyc2lvbiA9IG5BZ3Quc3Vic3RyaW5nKHZlck9mZnNldCArIDEpO1xuICAgICAgICAgICAgaWYgKGJyb3dzZXIudG9Mb3dlckNhc2UoKSA9PSBicm93c2VyLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAgICAgICAgICAgICBicm93c2VyID0gbmF2aWdhdG9yLmFwcE5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gdHJpbSB0aGUgdmVyc2lvbiBzdHJpbmdcbiAgICAgICAgaWYgKChpeCA9IHZlcnNpb24uaW5kZXhPZignOycpKSAhPSAtMSkgdmVyc2lvbiA9IHZlcnNpb24uc3Vic3RyaW5nKDAsIGl4KTtcbiAgICAgICAgaWYgKChpeCA9IHZlcnNpb24uaW5kZXhPZignICcpKSAhPSAtMSkgdmVyc2lvbiA9IHZlcnNpb24uc3Vic3RyaW5nKDAsIGl4KTtcbiAgICAgICAgaWYgKChpeCA9IHZlcnNpb24uaW5kZXhPZignKScpKSAhPSAtMSkgdmVyc2lvbiA9IHZlcnNpb24uc3Vic3RyaW5nKDAsIGl4KTtcblxuICAgICAgICBtYWpvclZlcnNpb24gPSBwYXJzZUludCgnJyArIHZlcnNpb24sIDEwKTtcbiAgICAgICAgaWYgKGlzTmFOKG1ham9yVmVyc2lvbikpIHtcbiAgICAgICAgICAgIHZlcnNpb24gPSAnJyArIHBhcnNlRmxvYXQobmF2aWdhdG9yLmFwcFZlcnNpb24pO1xuICAgICAgICAgICAgbWFqb3JWZXJzaW9uID0gcGFyc2VJbnQobmF2aWdhdG9yLmFwcFZlcnNpb24sIDEwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG1vYmlsZSB2ZXJzaW9uXG4gICAgICAgIHZhciBtb2JpbGUgPSAvTW9iaWxlfG1pbml8RmVubmVjfEFuZHJvaWR8aVAoYWR8b2R8aG9uZSkvLnRlc3QoblZlcik7XG5cbiAgICAgICAgLy8gY29va2llXG4gICAgICAgIHZhciBjb29raWVFbmFibGVkID0gKG5hdmlnYXRvci5jb29raWVFbmFibGVkKSA/IHRydWUgOiBmYWxzZTtcblxuICAgICAgICBpZiAodHlwZW9mIG5hdmlnYXRvci5jb29raWVFbmFibGVkID09ICd1bmRlZmluZWQnICYmICFjb29raWVFbmFibGVkKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5jb29raWUgPSAndGVzdGNvb2tpZSc7XG4gICAgICAgICAgICBjb29raWVFbmFibGVkID0gKGRvY3VtZW50LmNvb2tpZS5pbmRleE9mKCd0ZXN0Y29va2llJykgIT0gLTEpID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc3lzdGVtXG4gICAgICAgIHZhciBvcyA9IHVua25vd247XG4gICAgICAgIHZhciBjbGllbnRTdHJpbmdzID0gW1xuICAgICAgICAgICAge3M6J1dpbmRvd3MgMTAnLCByOi8oV2luZG93cyAxMC4wfFdpbmRvd3MgTlQgMTAuMCkvfSxcbiAgICAgICAgICAgIHtzOidXaW5kb3dzIDguMScsIHI6LyhXaW5kb3dzIDguMXxXaW5kb3dzIE5UIDYuMykvfSxcbiAgICAgICAgICAgIHtzOidXaW5kb3dzIDgnLCByOi8oV2luZG93cyA4fFdpbmRvd3MgTlQgNi4yKS99LFxuICAgICAgICAgICAge3M6J1dpbmRvd3MgNycsIHI6LyhXaW5kb3dzIDd8V2luZG93cyBOVCA2LjEpL30sXG4gICAgICAgICAgICB7czonV2luZG93cyBWaXN0YScsIHI6L1dpbmRvd3MgTlQgNi4wL30sXG4gICAgICAgICAgICB7czonV2luZG93cyBTZXJ2ZXIgMjAwMycsIHI6L1dpbmRvd3MgTlQgNS4yL30sXG4gICAgICAgICAgICB7czonV2luZG93cyBYUCcsIHI6LyhXaW5kb3dzIE5UIDUuMXxXaW5kb3dzIFhQKS99LFxuICAgICAgICAgICAge3M6J1dpbmRvd3MgMjAwMCcsIHI6LyhXaW5kb3dzIE5UIDUuMHxXaW5kb3dzIDIwMDApL30sXG4gICAgICAgICAgICB7czonV2luZG93cyBNRScsIHI6LyhXaW4gOXggNC45MHxXaW5kb3dzIE1FKS99LFxuICAgICAgICAgICAge3M6J1dpbmRvd3MgOTgnLCByOi8oV2luZG93cyA5OHxXaW45OCkvfSxcbiAgICAgICAgICAgIHtzOidXaW5kb3dzIDk1JywgcjovKFdpbmRvd3MgOTV8V2luOTV8V2luZG93c185NSkvfSxcbiAgICAgICAgICAgIHtzOidXaW5kb3dzIE5UIDQuMCcsIHI6LyhXaW5kb3dzIE5UIDQuMHxXaW5OVDQuMHxXaW5OVHxXaW5kb3dzIE5UKS99LFxuICAgICAgICAgICAge3M6J1dpbmRvd3MgQ0UnLCByOi9XaW5kb3dzIENFL30sXG4gICAgICAgICAgICB7czonV2luZG93cyAzLjExJywgcjovV2luMTYvfSxcbiAgICAgICAgICAgIHtzOidBbmRyb2lkJywgcjovQW5kcm9pZC99LFxuICAgICAgICAgICAge3M6J09wZW4gQlNEJywgcjovT3BlbkJTRC99LFxuICAgICAgICAgICAge3M6J1N1biBPUycsIHI6L1N1bk9TL30sXG4gICAgICAgICAgICB7czonTGludXgnLCByOi8oTGludXh8WDExKS99LFxuICAgICAgICAgICAge3M6J2lPUycsIHI6LyhpUGhvbmV8aVBhZHxpUG9kKS99LFxuICAgICAgICAgICAge3M6J01hYyBPUyBYJywgcjovTWFjIE9TIFgvfSxcbiAgICAgICAgICAgIHtzOidNYWMgT1MnLCByOi8oTWFjUFBDfE1hY0ludGVsfE1hY19Qb3dlclBDfE1hY2ludG9zaCkvfSxcbiAgICAgICAgICAgIHtzOidRTlgnLCByOi9RTlgvfSxcbiAgICAgICAgICAgIHtzOidVTklYJywgcjovVU5JWC99LFxuICAgICAgICAgICAge3M6J0JlT1MnLCByOi9CZU9TL30sXG4gICAgICAgICAgICB7czonT1MvMicsIHI6L09TXFwvMi99LFxuICAgICAgICAgICAge3M6J1NlYXJjaCBCb3QnLCByOi8obnVoa3xHb29nbGVib3R8WWFtbXlib3R8T3BlbmJvdHxTbHVycHxNU05Cb3R8QXNrIEplZXZlc1xcL1Rlb21hfGlhX2FyY2hpdmVyKS99XG4gICAgICAgIF07XG4gICAgICAgIGZvciAodmFyIGlkIGluIGNsaWVudFN0cmluZ3MpIHtcbiAgICAgICAgICAgIHZhciBjcyA9IGNsaWVudFN0cmluZ3NbaWRdO1xuICAgICAgICAgICAgaWYgKGNzLnIudGVzdChuQWd0KSkge1xuICAgICAgICAgICAgICAgIG9zID0gY3MucztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBvc1ZlcnNpb24gPSB1bmtub3duO1xuXG4gICAgICAgIGlmICgvV2luZG93cy8udGVzdChvcykpIHtcbiAgICAgICAgICAgIG9zVmVyc2lvbiA9IC9XaW5kb3dzICguKikvLmV4ZWMob3MpWzFdO1xuICAgICAgICAgICAgb3MgPSAnV2luZG93cyc7XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKG9zKSB7XG4gICAgICAgICAgICBjYXNlICdNYWMgT1MgWCc6XG4gICAgICAgICAgICAgICAgb3NWZXJzaW9uID0gL01hYyBPUyBYICgxMFtcXC5cXF9cXGRdKykvLmV4ZWMobkFndClbMV07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ0FuZHJvaWQnOlxuICAgICAgICAgICAgICAgIG9zVmVyc2lvbiA9IC9BbmRyb2lkIChbXFwuXFxfXFxkXSspLy5leGVjKG5BZ3QpWzFdO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdpT1MnOlxuICAgICAgICAgICAgICAgIG9zVmVyc2lvbiA9IC9PUyAoXFxkKylfKFxcZCspXz8oXFxkKyk/Ly5leGVjKG5WZXIpO1xuICAgICAgICAgICAgICAgIG9zVmVyc2lvbiA9IG9zVmVyc2lvblsxXSArICcuJyArIG9zVmVyc2lvblsyXSArICcuJyArIChvc1ZlcnNpb25bM10gfCAwKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGZsYXNoICh5b3UnbGwgbmVlZCB0byBpbmNsdWRlIHN3Zm9iamVjdClcbiAgICAgICAgLyogc2NyaXB0IHNyYz1cIi8vYWpheC5nb29nbGVhcGlzLmNvbS9hamF4L2xpYnMvc3dmb2JqZWN0LzIuMi9zd2ZvYmplY3QuanNcIiAqL1xuICAgICAgICB2YXIgZmxhc2hWZXJzaW9uID0gJ25vIGNoZWNrJztcbiAgICAgICAgaWYgKHR5cGVvZiBzd2ZvYmplY3QgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHZhciBmdiA9IHN3Zm9iamVjdC5nZXRGbGFzaFBsYXllclZlcnNpb24oKTtcbiAgICAgICAgICAgIGlmIChmdi5tYWpvciA+IDApIHtcbiAgICAgICAgICAgICAgICBmbGFzaFZlcnNpb24gPSBmdi5tYWpvciArICcuJyArIGZ2Lm1pbm9yICsgJyByJyArIGZ2LnJlbGVhc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlICB7XG4gICAgICAgICAgICAgICAgZmxhc2hWZXJzaW9uID0gdW5rbm93bjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy5qc2NkID0ge1xuICAgICAgICBzY3JlZW46IHNjcmVlblNpemUsXG4gICAgICAgIGJyb3dzZXI6IGJyb3dzZXIsXG4gICAgICAgIGJyb3dzZXJWZXJzaW9uOiB2ZXJzaW9uLFxuICAgICAgICBicm93c2VyTWFqb3JWZXJzaW9uOiBtYWpvclZlcnNpb24sXG4gICAgICAgIG1vYmlsZTogbW9iaWxlLFxuICAgICAgICBvczogb3MsXG4gICAgICAgIG9zVmVyc2lvbjogb3NWZXJzaW9uLFxuICAgICAgICBjb29raWVzOiBjb29raWVFbmFibGVkLFxuICAgICAgICBmbGFzaFZlcnNpb246IGZsYXNoVmVyc2lvblxuICAgIH07XG59KHRoaXMpKTtcbiQoJ2h0bWwnKS5hZGRDbGFzcygnT1MtJysganNjZC5vcyArJyBPUy1WJysganNjZC5vc1ZlcnNpb24gKycgQnJvd3Nlci0nKyBqc2NkLmJyb3dzZXIgKycgQnJvd3Nlci1WJysganNjZC5icm93c2VyTWFqb3JWZXJzaW9uICsnIE1vYmlsZS0nKyBqc2NkLm1vYmlsZSk7XG5cbmpRdWVyeSgnI2xvZ2luZm9ybWZyb250ZW5kJykudmFsaWRhdGUoe1xuICAgIHJ1bGVzOiB7XG4gICAgICAgIGxvZzogXCJyZXF1aXJlZFwiLFxuICAgICAgICBwd2Q6IFwicmVxdWlyZWRcIlxuICAgIH0sXG4gICAgLy8gU3BlY2lmeSB0aGUgdmFsaWRhdGlvbiBlcnJvciBtZXNzYWdlc1xuICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgIGxvZzogXCJQbGVhc2UgZW50ZXIgeW91ciBFbWFpbCBvciBVc2VyIE5hbWVcIixcbiAgICAgICAgcHdkOiBcIlBsZWFzZSBlbnRlciB5b3VyIHBhc3N3b3JkXCIsXG4gICAgfSxcbiAgICBzdWJtaXRIYW5kbGVyOiBmdW5jdGlvbihmb3JtKSB7XG4gICAgICBmb3JtLnN1Ym1pdCgpO1xuICAgIH1cbn0pO1xuXG4vLyBqcXVlcnkgZm9ybSB2YWxpZGF0aW9uXG5qUXVlcnkoXCIjcmVnaXN0cmF0aW9uTW9kZWxcIikudmFsaWRhdGUoe1xuICAgIHJ1bGVzOiB7XG4gICAgICAgIHVzZXJfdGl0bGU6IFwicmVxdWlyZWRcIixcbiAgICAgICAgbmV3X3VzZXJfZW1haWxuZXdfdXNlcl9lbWFpbDoge1xuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICBlbWFpbDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICB1c2VyX3Bhc3N3b3JkOiB7XG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgIG1pbmxlbmd0aDogNFxuICAgICAgICB9LFxuICAgIH0sXG4gICAgLy8gU3BlY2lmeSB0aGUgdmFsaWRhdGlvbiBlcnJvciBtZXNzYWdlc1xuICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgIHVzZXJfdGl0bGU6IFwiUGxlYXNlIGVudGVyIHlvdXIgUm9sZVwiLFxuICAgICAgICBuZXdfdXNlcl9lbWFpbDogXCJQbGVhc2UgZW50ZXIgYSB2YWxpZCBlbWFpbCBhZGRyZXNzXCIsXG4gICAgICAgIHVzZXJfcGFzc3dvcmQ6IHtcbiAgICAgICAgICAgIHJlcXVpcmVkOiBcIlBsZWFzZSBwcm92aWRlIGEgcGFzc3dvcmRcIixcbiAgICAgICAgICAgIG1pbmxlbmd0aDogXCJZb3VyIHBhc3N3b3JkIG11c3QgYmUgYXQgbGVhc3QgNCBjaGFyYWN0ZXJzIGxvbmdcIlxuICAgICAgICB9LFxuICAgIH0sXG5cbiAgICBzdWJtaXRIYW5kbGVyOiBmdW5jdGlvbihmb3JtKSB7XG4gICAgICAgIGZvcm0uc3VibWl0KCk7XG4gICAgfVxufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
