/*
 * spa.fake.js
 * Fake module
 */
/*jslint        browser:true,   continue:true
  devel:true, indent:2,    maxerr:50,
  newcap:true,    nomen:true, plusplus:true,
  regexp:true,    sloppy:true,    vars:false,
  white:true
  */

/*global $, spa */
spa.fake = (function() { 
  'use strict';
  var getPeopleList, fakeIdSerial, makeFakeId, mockSio ;

  fakeIdSerial = 5;

  makeFakeId = function () {
    return 'id_' + String( fakeIdSerial++ );
  };
  
  getPeopleList = function () {
    return [
      { 
        name: 'Betty', _id: 'id_01',
        css_map: { top: 20, left: 20, 'background-color': 'rgb( 128, 128, 128 )'}
      },
      { 
        name: 'Mike', _id: 'id_02',
        css_map: { top: 60, left: 20, 'background-color': 'rgb( 128, 128, 128)' }
      },
      {
        name: 'Pebbles', _id: 'id_03',
        css_map: { top: 100, left: 20, 'background-color': 'rgb( 128, 128, 128)' }
      },
      {
        name: 'Wilma', _id: 'id_04',
        css_map: { top: 140, left: 20, 'background-color': 'rgb( 128, 128, 128)' }
      }
    ];
  };

  mockSio = (function () {
    var on_sio, emit_sio, callback_map = {}, emit_mock_msg, send_listchange, listchange_idto;

    on_sio = function ( msg_type, callback ) {
      callback_map[ msg_type ] = callback;
    };

    emit_sio = function ( msg_type, data ) {

      // respond to 'adduser' event with 'userupdate'
      // callback after a 3s delay
      //
      if ( msg_type === 'adduser' && callback_map.userupdate ) {
        setTimeout( function () {
          callback_map.userupdate(
              [{
                _id : makeFakeId(),
                name : data.name,
                css_map : data.css_map
              }]
              );
        }, 3000);
      }

      // updatechat.
      if ( msg_type === 'updatechat' && callback_map.updatechat ) { 
        setTimeout( function () {
          var user = spa.model.people.get_user();
          callback_map.updatechat([{
            dest_id : user.id,
            dest_name : user.name,
            sender_id : data.dest_id,
            msg_text  : 'Thanks for the note, ' + user.name
          }]);
        
        },2000);
      }

      if ( msg_type === 'leavechat' ) {
        // reset login status
        delete callback_map.listchange;
        delete callback_map.updatechat;

        if ( listchange_idto ) {
          clearTimeout( listchange_idto );
          listchange_idto = undefined;
        }
        send_listchange();
      }
    
    };

    emit_mock_msg = function () {
      setTimeout( function (){
        var user = spa.model.people.get_user();
        if ( callback_map.updatechat ) {
          callback_map.updatechat([{
            dest_id : user.id,
            dest_name : user.name,
            sender_id : 'id_04',
            msg_text  : 'Hi there ' + user.name + '! Wilma here.'
          }]);
        } else {
          emit_mock_msg();
        }
      }, 4000 );
    
    };


    // Try once per second to use listchange callback
    // Stop trying after first success
    send_listchange = function (){
      listchange_idto = setTimeout( function () {
        if ( callback_map.listchange ) {
          callback_map.listchange(getPeopleList());
          emit_mock_msg();
          listchange_idto = undefined;
        } else {
          send_listchange();
        }
      } ,1000);
    };

    // We have to start the process
    send_listchange();

    return { emit : emit_sio, on : on_sio };
  }());
  
  
  return { 
    getPeopleList : getPeopleList,
    mockSio : mockSio
  }; 
}());
