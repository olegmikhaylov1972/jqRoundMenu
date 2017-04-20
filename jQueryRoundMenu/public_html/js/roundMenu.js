(function( $ ) {
    var defaults = { 
        Radius: 50,
        rItem: 25,
        left: 300,
        top: 300,
        margin: '0 auto', 
        background: 'radial-gradient(farthest-side circle at 65% 25%, LightBlue, darkblue)',
        boxShadow: '5px 10px 20px rgba(0,0,0,0.3), -5px -10px 20px rgba(255,255,255,0.5)',
        
        expanded: true,
        dd: true
    };
    var params;
    
    var items = new Array();
    var defItem = {
        text: '',
        img: '',
        color: 'Plum',
        callback: null,
        subMenu: null,
        smType: 'text'
    };
    
    var ddValues = {
        shiftX: 0,
        shiftY: 0
    };
    
    var spaceItem = 25;
    var bestAngle;
    var move = false;
    
    var mobj;
    var divText
        
    var methods = {
        init: function(options) { 
            mobj = $(this);
            params = $.extend({}, defaults, options);
                
            mobj.css('position', 'absolute');
            mobj.css('border-radius', '50%');
            
            mobj.css('width', params.Radius*2 + 'px');
            mobj.css('height', params.Radius*2 + 'px');
            mobj.css('top', params.top + 'px');
            mobj.css('left', params.left + 'px');
            mobj.css('margin', params.margin);
            mobj.css('background', params.background);
            mobj.css('box-shadow', params.boxShadow);
            
            var text    = (params.expanded) ? 'X' : 'Меню';
            var fSize   = (params.expanded) ? params.Radius/text.length : params.Radius/(text.length/2);
            divText = $("<div></div>").text(text);
            
            divText.attr('id', 'jq-menu-divtext');
            divText.css('width', params.Radius*2  + 'px');
            divText.css('height', params.Radius*2  + 'px');
            divText.css('line-height', params.Radius*2 + 'px');
            divText.css('font-family', 'Arial');
            divText.css('text-align', 'center');
            divText.css('font-size', fSize + 'px');
            divText.css('color', 'WhiteSmoke');
            
            mobj.append(divText);

            var R = params.Radius + params.rItem + spaceItem;
            var L = 2*params.rItem + spaceItem;
            
            var a = Math.acos((L/2)/R);
            bestAngle = Math.PI-2*a;
            
            var init = mobj.data('roundMenu');
 
            if (init) {
                return this;
            } else {
                mobj.data('roundMenu', true);
                
                if (params.dd) {
                    divText.bind("mousedown.roundMenu", mobj.menuMouseDown);
                    divText.bind("dragstart.roundMenu", mobj.menuDragStart);
                }
                
                divText.bind("click.roundMenu", mobj.menuClick);
                mobj.bind("selectstart",function(e){
                    return false;
                });
            }
        },
        
        appendItem:  function(options) { 
            var pItem = $.extend({}, defItem, options);
            
            var divItem = $('<div></div>');
            
            if (pItem.text === '')
                divItem.text('Item ' + items.length);
            else
                divItem.text(pItem.text);
            
            if (pItem.img !== '') {
                divItem.text('');
                
                var itemImg = $('<img>');
                itemImg.attr('src', pItem.img)
                itemImg.css('vertical-align', 'middle');
                itemImg.css('opacity', '0.7');
                divItem.append(itemImg);
            }
            
            divItem.css('position', 'absolute');
            divItem.css('border-radius', '50%');
            
            var delta = params.Radius - params.rItem;
            divItem.css('top', delta + 'px');
            divItem.css('left', delta + 'px');
            
            divItem.css('width', params.rItem*2  + 'px');
            divItem.css('height', params.rItem*2  + 'px');
            divItem.css('line-height', params.rItem*2  + 'px');
            divItem.css('font-family', 'Arial');
            divItem.css('text-align', 'center');
            divItem.css('font-size', 12 + 'px');
            divItem.css('color', 'WhiteSmoke');
            divItem.css('margin', '0 auto');
            divItem.css('background', 'radial-gradient(farthest-side circle at 65% 25%, white, ' + pItem.color + ')');
            divItem.css('box-shadow', '5px 10px 20px rgba(0,0,0,0.3), -5px -10px 20px rgba(255,255,255,0.5)');
            
  //          if (pItem.callback !== null)
//                divItem.attr('onclick', pItem.callback+'(event)');
            
            divItem.bind('click', mobj.itemClick);
            
            items.push(divItem);
            mobj.append(divItem);
            
            if (pItem.subMenu !== null) {
                var id = 'item-sub-menu-div-'+items.length;
                divItem.attr('subMenu', id);
                divItem.attr('smExp', '0');
                
                if (pItem.smType === 'text') 
                    methods.createDivTextSubMenu(id, pItem);
                if (pItem.smType === 'img') 
                    methods.createDivImgSubMenu(id, pItem);
            }
            
            methods.recalcItemsPos.call();
        },
        
        createDivTextSubMenu: function(id, pItem) {
            var divSM = $('<div></div>');
            
            divSM.attr('id', id);
            
            divSM.css('position', 'absolute');
            divSM.css('border-radius', '15%');
            
            divSM.css('width', params.rItem*7  + 'px');
            divSM.css('height', params.rItem*(pItem.subMenu.length+1) + 'px');
            divSM.css('text-align', 'center');
            divSM.css('margin', '0 auto');
            divSM.css('background', 'radial-gradient(farthest-side circle at 65% 25%, rgb(255,248,220), rgb(222, 184, 135))');
            divSM.css('box-shadow', '5px 10px 20px rgba(0,0,0,0.3), -5px -10px 20px rgba(255,255,255,0.5)');
            
            for (var i = 0; i < pItem.subMenu.length; ++i) {
                var smItemDiv  = $('<div></div>');
                var smItemSpan = $('<span></span>');

                smItemDiv.attr('class', 'item-submenu-div');
                smItemDiv.css({'background-color': '#DAA520',
                               'border-radius': '90%',
                               'width': params.rItem*4+'px',
                               'margin':'5px', 
                               'margin-left': params.rItem*2+10+'px',
                               'padding':'5px', 
                               'font-family': 'Tahoma', 
                               'font-size': '9pt'});
                
                smItemSpan.attr('class', 'item-submenu-span');
                smItemSpan.css({'color':'#000', 'text-decoration':'none'});
                smItemSpan.text(pItem.subMenu[i].text);
                
                smItemDiv.append(smItemSpan);
                divSM.append(smItemDiv);
            }
            
            divSM.bind('click', mobj.itemSMClick);
            mobj.append(divSM);
            $(".item-submenu-div").dynamenu("sliding");
            
            divSM.hide();
        },
        
        createDivImgSubMenu: function(id, pItem) {
            var divSM = $('<div></div>');
            
            divSM.attr('id', id);
            
            divSM.css('position', 'absolute');
            divSM.css('text-align', 'center');
            divSM.css('margin', '0 auto');
            
            var delta = params.rItem*0.5;
            for (var i = 0; i < pItem.subMenu.length; ++i) {
                var smItemDiv  = $('<div></div>');
                var itemImg = $('<img>');
                    itemImg.attr('src', pItem.subMenu[i].img)
                    itemImg.css('vertical-align', 'middle');
                    itemImg.css('opacity', '0.7');
                smItemDiv.append(itemImg);

                smItemDiv.attr('class', 'item-submenu-div');
                smItemDiv.css({'position': 'absolute',
                               'top': '0px',
                               'left': delta + 'px',
                               'border-radius': '50%',
                               'width': params.rItem*2  + 'px',
                               'height': params.rItem*2  + 'px',
                               'line-height': params.rItem*2  + 'px',
                               'margin':'0 auto', 
                               'background': 'radial-gradient(farthest-side circle at 65% 25%, white, blue)',
                               'box-shadow': '5px 10px 20px rgba(0,0,0,0.3), -5px -10px 20px rgba(255,255,255,0.5)'});
                
                divSM.append(smItemDiv);
                delta += params.rItem*2.5;
            }
            
            divSM.bind('click', mobj.itemSMClick);
            mobj.append(divSM);
            
            divSM.hide();
        },
        
        recalcItemsPos:  function() { 
            var position = mobj.position();
            var R        = params.Radius + params.rItem + spaceItem;
            var wH       = $(window).height();
            var wW       = $(window).width();
            
            var cx = new Point2D(position.left + params.Radius, position.top + params.Radius);
            var r1 = new Point2D(0, 0);
            var r2 = new Point2D(wW, wH);
            
            var angle1 = 0;
            var angle2 = 0;
            var angle  = 0;
            var k      = 0;
                
            var result = Intersection.intersectCircleRectangle.call(this, cx, R, r1, r2);
            
            if (result.points.length > 0) {
                var x = result.points[0].x - cx.x;
                var y = result.points[0].y - cx.y;
                angle1 = Math.atan2(y, x);
                
                x = result.points[1].x - cx.x;
                y = result.points[1].y - cx.y;
                angle2 = Math.atan2(y, x);
                
                angle = (angle1+angle2)/2;
                
                x = cx.x + (R+params.rItem)*Math.cos(angle);
                y = cx.y + (R+params.rItem)*Math.sin(angle);
                
                k = methods.checkCoord.call(this, x, y);
            }
            
            var  angles = methods.calcAngles.call(this, angle1, angle2, angle, k);
            
            for(var i=0; i < items.length; ++i) {
                x = cx.x + R*Math.cos(angles[i]);
                y = cx.y + R*Math.sin(angles[i]);
                
                items[i].css('top', (y - position.top - params.rItem) + 'px');
                items[i].css('left', (x - position.left - params.rItem) + 'px');
                items[i].attr('ang', angles[i]);
            }
        },
        
        checkCoord: function(x, y) {
            var wH       = $(window).height();
            var wW       = $(window).width();
            
            if((x < 0)||(x > wW)||(y < 0)||(y > wH))
                return Math.PI;
            else
                return 0;
        },
        
        calcAngles: function(a1, a2, a, k) {
            var aArray = new Array();
            var segment, sAngle, dAngle;
            
            if (items.length === 1)
                return aArray.push(a + k);
                
            if((a1 !== 0)||(a2 !== 0)) {
                if(k > 0)
                    segment = 2*Math.PI - (Math.abs(a1) + Math.abs(a2));
                else
                    segment = Math.abs(a1) + Math.abs(a2);
            } else
                segment = 2*Math.PI;
            
            if(segment/(items.length) > bestAngle)
                dAngle = bestAngle;
            else
                dAngle = segment/(items.length);
            
            sAngle = (a+k)-dAngle*((items.length/2)-0.5);
            aArray.push(sAngle);
            
            for(var i=0; i < items.length-1; ++i) {
                sAngle += dAngle;
                aArray.push(sAngle);
            }
            
            return aArray;
        }
    };

    $.fn.roundMenu = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Метод ' +  method + ' в jQuery.tooltip не существует' );
        }    
    };
    
    $.fn.menuClick = function(e) {
        if (move) {
            move = false;
            return 0;
        }
        
        for(var i=0; i < items.length; ++i) {
            if(params.expanded) {
                items[i].fadeOut(500);
            }
            else {
                items[i].fadeIn(500);
            }
        }
        
        params.expanded = !params.expanded;
        
        var divText = mobj.find('[id=jq-menu-divtext]');
        var text    = (params.expanded) ? 'X' : 'Меню';
        var fSize   = (params.expanded) ? params.Radius/text.length : params.Radius/(text.length/2);
        
        divText.text(text);
        divText.css('font-size', fSize + 'px');
    };

    $.fn.itemClick = function(e) {
        var target = $(e.target);
        if (!target.is('div'))
            target = $(e.target).parent();
        
        if (target.attr('subMenu') === undefined) {
            mobj.smColAll();
            return 0;
        }
        
        if (target.attr('smExp') === '0') {
            mobj.smColAll();
            mobj.itemSMExp(target);
        } else
            mobj.itemSMCol(target);
    };
    
    $.fn.itemSMClick = function(e) {
        mobj.smColAll();
    };
    
    $.fn.itemSMExp = function(target) {
        var position = mobj.position();
        var distR = params.Radius + params.rItem*4.5 + spaceItem;
        var cx = {x: position.left + params.Radius, y: position.top + params.Radius};
        
        var ang = parseFloat(target.attr('ang'));
        var x = cx.x + distR*Math.cos(ang);
        var y = cx.y + distR*Math.sin(ang);
        
        target.animate({left: (x - position.left - params.rItem), top: (y - position.top - params.rItem)}, 500);
        
        var divSM = $('#'+target.attr('subMenu'));
        
        var testAng = (ang < 0) ? 2*Math.PI+ang : ang;
        var smPosX = x - position.left - params.rItem - 5;
        var smPosY = y - position.top - params.rItem - 5;
        
        if (testAng < 1.5*Math.PI && testAng > Math.PI/2) {
            smPosX = x - position.left + params.rItem - divSM.width() + 5;
            smPosY = y - position.top - params.rItem - 5;
            $("> .item-submenu-div", divSM).css('margin-left', '5px');
        } else
            $("> .item-submenu-div", divSM).css('margin-left', params.rItem*2+10+'px');
        
        divSM.css('top', smPosY + 'px');
        divSM.css('left', smPosX + 'px');
        divSM.css('z-index', -1);
        divSM.fadeIn(500);
        
        target.attr('smExp', '1');
    };
    
    $.fn.itemSMCol = function(target) {
        var position = mobj.position();
        var distR = params.Radius + params.rItem + spaceItem;
        var cx = {x: position.left + params.Radius, y: position.top + params.Radius};
        
        var ang = parseFloat(target.attr('ang'));
        var x = cx.x + distR*Math.cos(ang);
        var y = cx.y + distR*Math.sin(ang);
        
        target.animate({left: (x - position.left - params.rItem), top: (y - position.top - params.rItem)}, 500);
        
        var divSM = $('#'+target.attr('subMenu'));
        divSM.fadeOut(500);
        
        target.attr('smExp', '0');
    };
    
    $.fn.smColAll = function() {
        for(var i=0; i < items.length-1; ++i) {
            if (items[i].attr('smExp') === '1')
                mobj.itemSMCol(items[i]);
        }
    };
    
// For Drag and Droup

    $.fn.menuMouseDown = function(e) {
        var coords = $(this).getCoords($(this));
        ddValues.shiftX = e.pageX - coords.left;
        ddValues.shiftY = e.pageY - coords.top;
        
        $(this).css('position', 'absolute');
        $(this).css('zIndex', 1000);

        $(this).smColAll();
        $(this).moveAt(e);

        $(document).bind("mousemove",function(e){
            move = true;
            $(this).moveAt(e);
            methods.recalcItemsPos.call();
        });
        
        divText.bind("mouseup", function(e) {
            $(document).unbind('mousemove');
            divText.unbind('mouseup.roundMenu');
            e.stopPropagation();
        });        
    };
    
    $.fn.moveAt = function(e) {
        mobj.css('left', e.pageX - ddValues.shiftX + 'px');
        mobj.css('top', e.pageY - ddValues.shiftY + 'px');
    };
    
    $.fn.getCoords = function(elem) {
        var box = elem[0].getBoundingClientRect();
        
        return {
            top: box.top + $(window).scrollTop(),
            left: box.left + $(window).scrollLeft()
        };
    };
    
    $.fn.menuDragStart = function() {
        return false;
    };
})(jQuery);

(function( $ ){
  var methods = {
    init : function( options ) { 
        
    },
    sliding: function( ) {

        return this.each(function() {
            
            $(this).css({"opacity":"0.4"});
            
            $(this).hover(function() {
//                $("span.item-submenu-span", this).css({"font-weight":"bold"});                
                
                $(this).animate({
                    opacity:1,
                    "margin-left":"+=5"
                }, 100, "linear", function() {
                 
                }
                );
            },
            function() {
//                    $("span.item-submenu-span", this).css({"font-weight":"normal"});                

                    $(this).animate({
                    opacity:0.4,
                    "margin-left":"-=5"                        
                }, 100, "linear", function() {
                  
                });
            });
                          
        });
    }
  };

  $.fn.dynamenu = function( method ) {
    
    if ( methods[method] ) {
      methods.init.apply( this, arguments );
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else {
      $.error( 'Метод' +  method + ' не существует!' );
    }      
  };

})( jQuery );


