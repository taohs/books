/*
 * spa.chat.js
 * Chat feature module for SPA
 */
/*jslint        browser:true,   continue:true
  devel:true, indent:2,    maxerr:50,
  newcap:true,    nomen:true, plusplus:true,
  regexp:true,    sloppy:true,    vars:false,
  white:true
  */

/*global $, spa, getComputedStyle */

spa.chat = (function(){
  //-------------- BEGIN MODULE SCOPE  VARIABLES ----------
  var configMap = {
    main_html : String() 
      + '<div class="spa-chat">'
      + '  <div class="spa-chat-head">'
      + '    <div class="spa-chat-head-toggle">+</div>'
      + '    <div class="spa-chat-head-title">'
      + '       Chat'
      + '    </div>'
      + '  </div>'
      + '  <div class="spa-chat-closer">x</div>'
      + '  <div class="spa-chat-sizer">'
        +   '<div class="spa-chat-list">'
        +   '   <div class="spa-chat-list-box"></div>'
        +   '</div>'
        +   '<div class="spa-chat-msg">'
        +   '   <div class="spa-chat-msg-log"></div>'
        +   '   <div class="spa-chat-msg-in">'
            +   '   <form class="spa-chat-msg-form">'
            +   '       <input type="text">'
            +   '       <input type="submit" style="display: none" >'
            +   '       <div class="spa-chat-msg-send"> send </div>'
        +   '</div>'
      + '    <div class="spa-chat-box">' 
      + '       <input type="text"/> <div>send</div>  '
      + '    </div>'
      + '  </div>'
      + '</div>',
    settable_map : {
      slider_open_time : true,
      slider_close_time: true,
      slider_opened_em : true,
      slider_closed_em : true,
      slider_opened_title: true,
      slider_closed_title: true,

      chat_model : true,
      people_model : true,
      set_chat_anchor : true
    },

    slider_open_time    : 250,
    slider_close_time   : 250,
    slider_opened_em    : 18,
    slider_closed_em    : 2,
    slider_opened_title : 'Click to close',
    slider_closed_title : 'Click to open',
    slider_opened_min_em:10,
    window_height_min_em:20,

    chat_model : null,
    people_model : null,
    set_chat_anchor : null
  },
  stateMap = {
    // $container : null
    $append_target  : null,
    position_type   : 'closed',
    px_per_em       : 0,
    slider_hidden_px: 0,
    slider_closed_px: 0,
    slider_opened_px: 0
  },
  jqueryMap = {},
  getEmSize, setPxSizes, setSliderPosition, onClickToggle,

  setJqueryMap, configModule, initModule,
  removeSlider, handleResize;

  //-------------- END MODULE SCOPE VARIABLES  ------------
  //
  //----------------- BEGIN UTILITY METHODS ---------------
  getEmSize = function ( elem ) {
    return Number( getComputedStyle( elem, '').fontSize.match(/\d*\.?\d*/)[0] );
  };
  //------------------- END UTILITY METHODS ---------------
  //
  //----------------- BEGIN DOM METHODS -------------------
  // Begin Dom method /setJqueryMap/
  setJqueryMap = function () {
    var $append_target = stateMap.$append_target,
    $slider = $append_target.find( '.spa-chat' );

    //var $container = stateMap.$container;
    jqueryMap = { 
      $slider : $slider,
      $head : $slider.find( '.spa-chat-head' ),
      $toggle : $slider.find( '.spa-chat-head-toggle' ),
      $title  : $slider.find( '.spa-chat-head-title' ),
      $sizer  : $slider.find( '.spa-chat-sizer' ),
      $msgs   : $slider.find( '.spa-chat-msgs' ),
      $box    : $slider.find( '.spa-chat-box' ),
      $input  : $slider.find( '.spa-chat-input input[type=text]' )
    };
  };
  // End DOM method /setJqueryMap/

  // Begin DOM method /setPxSizes/
  setPxSizes = function () {
    var px_per_em, window_height_em, opened_height_em;
    px_per_em = getEmSize( jqueryMap.$slider.get(0) );
    window_height_em = Math.floor(( $(window).height() / px_per_em) +  0.5);

    opened_height_em = window_height_em > configMap.window_height_min_em 
      ?  configMap.slider_opened_em
      :  configMap.slider_opened_min_em;

    stateMap.px_per_em = px_per_em;
    stateMap.slider_closed_px = configMap.slider_closed_em * px_per_em;
    stateMap.slider_opened_px = opened_height_em * px_per_em;
    jqueryMap.$sizer.css({
      height : ( opened_height_em -2 ) * px_per_em
    });
  };
  // End DOM method /setPxSizes/
  // Begin DOM method /setSliderPosition
  // Example : spa.chat.setSliderPosition
  // Purpose : Move the chat slider to the requested position
  // Argument: // * position_type - enum('closed','opened', or 'hidden')
  // * callback - optional callback to be run end  at the end
  // of slider animation . The callback receives a jQuery
  // collection representing the slider div as its single
  // argument
  // Action  :
  // This method moves the slider into the requested position.
  // If the requested position is the current position, it
  // returns true without taking further action
  // Returns :
  // *  true - The requested position was achieved.
  // *  false - The requested position was not achieved.
  // Throws : none;
  setSliderPosition = function ( position_type, callback ) {
    var height_px, animate_time, slider_title, toggle_text ;

    // return true if slider already in requested position
    if ( stateMap.position === position_type ) {
      return true;
    }

    // prepare anmiate parameters
    switch ( position_type ) {
      case 'opened':
        height_px = stateMap.slider_opened_px;
        animate_time = configMap.slider_open_time;
        slider_title = configMap.slider_opened_title;
        toggle_text = '=';
        break;

      case 'hidden':
        height_px = 0;
        animate_time = configMap.slider_open_time;
        slider_title = '';
        toggle_text = '+';
        break;

      case 'closed' :
        height_px = stateMap.slider_closed_px;
        animate_time = configMap.slider_close_time;
        slider_title = configMap.slider_closed_title;
        toggle_text = '+';
        break;

      default :
        return false;
    }

    // animate slider position change
    stateMap.position_type = '';
    jqueryMap.$slider.animate(
        { height : height_px },
        animate_time,
        function () {
          jqueryMap.$toggle.prop( 'title', slider_title );
          jqueryMap.$toggle.text( toggle_text ) ;
          stateMap.position_type = position_type;
          if ( callback ) { callback( jqueryMap.$slider ) ; }
        }
        );
    return true;
  };
  // End DOM method /setSliderPosition
  //------------------- END DOM METHODS -------------------
  //
  //----------------- BEGIN EVEVT METHODS -----------------
  onClickToggle = function ( event ) {
    var set_chat_anchor = configMap.set_chat_anchor;
    if ( stateMap.position_type === 'opened' ) {
      set_chat_anchor( 'closed' );
    } else if ( stateMap.position_type === 'closed' ) {
      set_chat_anchor( 'opened' );
    }
    return false;
  };
  //------------------- END EVENT METHODS -----------------

  removeSlider = function () {
    if ( jqueryMap.$slider ) {
      jqueryMap.$slider.remove();
      jqueryMap = {};
    }
    stateMap.$append_target = null;
    stateMap.position_type = "closed";

    configMap.chat_model = null;
    configMap.people_model = null;
    configMap.set_chat_anchor = null;
    return true;

  };
  handleResize = function () {
    if (! jqueryMap.$slider ) { return false; }
    setPxSizes();
    if ( stateMap.position_type === 'opened' ) {
      jqueryMap.$slider.css({ height: stateMap.slider_opened_px });
    }
    return true;
  };
  //----------------- BEGIN PUBLIC METHODS ----------------
  // Begin public method /configModule/
  // Purpose    : Adjust configuration of allowed keys
  // Arguments  : A map of settable keys and values
  //    *   color_name  -   color to use
  // Setting    :
  //    *   configMap.settable_map,declare allowed keys
  // Return     : true
  // Throws     : none
  //
  configModule = function ( input_map ) {
    spa.util.setConfigMap({
      input_map : input_map,
      settable_map : configMap.settable_map,
      config_map: configMap
    });
    return true;
  };
  // End public method /configModule/
  //
  // Begin public method /initModule/
  // Purpose    : Initializes module
  // Argument   :
  //    *   $container the jquery element used by this feature
  // Return     : ture
  // Throws     : none
  //initModule = function ( $container ) {
  //  $container.html( configMap.main_html );
  //  stateMap.$container = $container;
  //  setJqueryMap();
  //  return true;
  //}
  initModule = function ( $append_target ) {

    $append_target.append( configMap.main_html );
    stateMap.$append_target = $append_target ;
    setJqueryMap();
    setPxSizes();

    // initialize chat slider to default title and state;
    jqueryMap.$toggle.prop( 'title', configMap.slider_closed_title );
    jqueryMap.$head.click( onClickToggle );
    stateMap.position_type = 'closed';

    return true;
  };
    // End piblic method /initModule/
    //------------------- END PUBLIC MEHTODS ----------------
    return { 
      setSliderPosition : setSliderPosition,
      configModule : configModule ,
      initModule : initModule,
      removeSlider : removeSlider,
      handleResize : handleResize
    };
    //
  }());
