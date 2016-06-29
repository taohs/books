/*
 * spa.avtr.js
 * Avatar feature module
 */
/*jslint        browser:true,   continue:true
  devel:true, indent:2,    maxerr:50,
  newcap:true,    nomen:true, plusplus:true,
  regexp:true,    sloppy:true,    vars:false,
  white:true
  */

/*global $, spa */
/**
 * 耦合了 css  spa-avtr*
 * @type {{configModule, initModule}}
 */
spa.avtr = (function(){

  "use strict";
  //-------------------- BEGIN MODULE SCOPE VARIABLES -------
  var
	  /**
     *
     * @type {{chat_model: null, people_model: null, settable_map: {chat_model: boolean, people_model: boolean}}}
     */
     configMap = {
	     /**
        * declare setting of Object people and chat ;
        */
       chat_model : null,
       people_model : null,

       settable_map : {
         chat_model : true,
         people_model : true
       }

     },

    /**
     *
      * @type {{drag_map: null, $drag_target: null, drag_bg_color: undefined}}
     */
     stateMap = {
       drag_map : null,
       $drag_target : null,
       drag_bg_color : undefined
     },
     jqueryMap = {},

     getRandRgb,
     setJqueryMap,
     updateAvatar,
     onTapNav,
     onHeldstartNav, onHeldmoveNav, onHeldendNav,
     onSetchatee, onListchange,
     onLogout,
     configModule, initModule;

  //-------------------- END MODULE SCOPE VARIABLES -----------

  //-------------------- BEGIN UTILITY METHODS ----------------

  getRandRgb = function () {
    var i, rgb_list = [];
    for ( i = 0; i < 3; i++ ) {
      rgb_list.push( Math.floor( Math.random() * 128 ) + 128 );
    }
    return 'rgb(' + rgb_list.join(',') + ')';
  };
	/**
   *
   * @param $container
   */
  setJqueryMap = function ( $container ) {
    jqueryMap = { $container : $container } ;
  };
  /**
   *
   * @param $target
	 */
  updateAvatar = function ( $target ) {
    var css_map, person_id;

    css_map = {
      top : parseInt( $target.css( 'top' ), 10 ),
      left : parseInt( $target.css( 'left' ), 10),
      'background-color' : $target.css('background-color')
    };

    person_id = $target.attr( 'data-id' );
    configMap.chat_model.update_avatar({
      person_id : person_id, css_map : css_map
    });

  };

  //--------------------- END DOM METHODS ---------------------
  
  //---------------------- BEGIN EVENT HANDLES
	/**
   *
   * @param event
   * @returns {boolean}
   */
  onTapNav = function ( event ) {
    var css_map,
      $target = $( event.elem_target ).closest('.spa-avtr-box');
    if ( $target.length === 0 ) { return false; }
    $target.css({ 'background-color': getRandRgb() });
    updateAvatar();
  };

  /**
   *
   * @param event
   * @returns {boolean}
	 */
  onHeldstartNav = function ( event ) {
    var offset_target_map, offset_nav_map,
      $target = $( event.elem_target ).closest('.spa-avtr-box');

    if ( $target.length === 0 ) { return false; }

    stateMap.$drag_target = $target;
    offset_target_map = $target.offset();
    offset_nav_map = jqueryMap.$container.offset();

    offset_target_map.top -= offset_nav_map.top;
    offset_target_map.left -= offset_nav_map.left;

    stateMap.drag_map = offset_target_map;
    stateMap.drag_bg_color = $target.css( 'background-color' );

    $target
      .addClass('spa-x-is-drag')
      .css('background-color','');
  };
  
  onHeldmoveNav = function ( event ) {
    var drag_map = stateMap.drag_map;
    if ( !drag_map ) { return false; }
    
    drag_map.top += event.px_delta_y;
    drag_map.left += event.px_delta_x;
    
    stateMap.$drag_target.css({
      top : drag_map.top,
      left : drag_map.left
    });
    
  };
	/**
   * reset stateMap;
   * 
   * @param event
   * @returns {boolean}
   */
  onHeldendNav = function ( event ) {
    var $drag_target = stateMap.$drag_target;
    if ( !$drag_target ) { return false; }
    
    $drag_target
      .removeClass('spa-x-is-drag')
      .css('background-color', stateMap.drag_bg_color);
    
    stateMap.drag_bg_color = undefined;
    stateMap.$drag_target = null;
    stateMap.drag_map = null;
    updateAvatar($drag_target);
    
  };
  
  onSetchatee = function ( event, arg_map ) {
    var 
      $nav = $(this),
      new_chatee = arg_map.new_chatee,
      old_chatee = arg_map.old_chatee;
    
    // Use this to highlight avatar of user in var area
    // See new_chatee.name, old_chatee.name etc.
    
    // Remove highlight  from old_chatee avatar hear
    if ( old_chatee ) {
      $nav
        .find( '.spa-avta-box[data-id=' + old_chatee.cid + ']' )
        .removeClass('spa-x-is-chatee');
    }
    
    //add highlight to new chatee avatar here
    if ( new_chatee ) {
      $nav
        .find('.spa-avtr-box[data-id=' + new_chatee.cid + ']')
        .addClass('spa-x-is-chatee');
    }
  };
  
  
  onListchange = function ( event ) {
    var 
      $nav = $(this),
      people_db = configMap.people_model.get_db(),
      user = configMap.people_model.get_user(),
      chatee = configMap.chat_model.get_chatee() || {},
      $box;
    
    $nav.empty();
    // if the user is logged out, do not render
    if ( user.get_is_anon() ) { return false; }
    
    people_db().each( function ( person, idx ) {
      var class_list;
      if (person.get_is_anon()) { return true ;}
      class_list = ['spa-avta-box'];
      
      if ( person.id === chatee.id ) {
        class_list.push( 'spa-avta-box ');
      }
      
      if ( person.get_is_user() ) {
        class_list.push( 'spa-x-is-user' );
      }
      
      $box = $('<div/>')
        .addClass( class_list.join(' '))
        .css( person.css_map )
        .attr( 'data-id', String( person.id ))
        .prop( 'title', spa.util_b.encodeHtml( person.name ))
        .text( person.name )
        .appendTo($nav);
    });
  };
  
  onLogout = function () {
    jqueryMap.$container.empty();  
  };
  //---------------ENV EVENT HANDLES -------------
  
  // --------------- BEGIN PUBLIC METHODS ------------j
  configModule = function ( input_map ) {
    spa.util.setConfigMap({
      input_map : input_map,
      settable_map : configMap.settable_map,
      config_map : configMap
    });
    return true;
    
  };
  
  initModule = function ( $container ) {
    setJqueryMap( $container );

    //bind model global events
    $.gevent.subscribe( $container, 'spa-setchatee', onSetchatee );
    $.gevent.subscribe( $container, 'spa-listchange', onListchange );
    $.gevent.subscribe( $container, 'spa-logout', onLogout );

    //bind actions
    $container
      .bind('utap', onTapNav)
      .bind('uheldstart', onHeldstartNav)
      .bind('uheldmove', onHeldmoveNav)
      .bind('uheldend', onHeldendNav);
    
    return true;
  };
  
  
  return {
    configModule : configModule,
    initModule : initModule
  };

    

    
}());
