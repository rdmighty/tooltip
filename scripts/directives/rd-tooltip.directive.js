(function(){
    'use strict';
    var _a = function(obj){
        if(!obj)
            return obj;
        else
            return angular.element(obj);
    }
    var rdTooltip = angular.module('rd.tooltip', [])

    .directive('rdTooltip', ['$compile', '$tooltip', '$templateCache', '$timeout', '$parse', function($compile, $tooltip, $templateCache, $timeout, $parse){
        return {
            restrict: 'A', 
            scope: true,                     
            link: function(scope, elem, attr, transclude){
                var aElem = _a(elem),                    
                    body = angular.element(document.querySelector('body')),
                    tooltip = null, 
                    tooltipArrow = null;  

                function safeApply($scope){
                    if(!$scope.$$phase)
                        $scope.$apply();
                }                                                   

                scope.rdTooltip = attr.rdTooltip;

                if(attr.rdTooltip.indexOf(' ') === -1){
                    scope.$watch(attr.rdTooltip, function (newValue, oldValue) {
                        if (newValue)
                            scope.rdTooltip = newValue;
                    });
                }                
                
                function adjustTooltipPosition(){
                    tooltip = _a($templateCache.get('rdTooltip.tpl.html'));

                    //put it just after the host element
                    aElem.after(tooltip);
                    $compile(tooltip)(scope); //get any directive inside tooltip
                    safeApply(scope);

                    tooltipArrow = _a(tooltip[0].querySelector('div.rd-tooltip-arrow'));    

                    //adjust the location of the tooltip relative to host element
                    var aElemOffLeft = aElem[0].offsetLeft,
                        aElemOffRight = aElem[0].offsetRight,
                        aElemOffTop = aElem[0].offsetTop,
                        aElemWidth = aElem[0].clientWidth,
                        aElemHeight = aElem[0].clientHeight,
                        bodyClientWidth = body[0].clientWidth;

                    var tooltipHeight = tooltip[0].clientHeight,
                        tooltipWidth = tooltip[0].clientWidth,
                        tooltipOfTop = tooltip[0].offsetTop,
                        tooltipOffLeft = tooltip[0].offsetLeft;
                    
                    var toBottom = false, toLeftOffset = true, toRightOffset = false;         

                    //decide whether to show at the top or bottom  
                    if((aElemOffTop - 9 - tooltipHeight) < 0)
                        toBottom = true;

                    //to show at left offset?
                    if(bodyClientWidth < (aElemOffLeft + tooltipWidth)){
                        toLeftOffset = false;
                        toRightOffset = true;
                    }

                    //to show at right offset?
                    if(!toLeftOffset){
                        if((aElemOffLeft - tooltipWidth) < 0)
                            toRightOffset = false;
                    }

                    if(!toBottom && toLeftOffset){
                        tooltip.css('top', (aElemOffTop - 9 - tooltipHeight));
                        tooltip.css('left', (aElemOffLeft + 1));
                        tooltipArrow.addClass('rd-tooltip-bottom-left');
                    }
                    else if(!toBottom && !toLeftOffset && toRightOffset){
                        tooltip.css('top', (aElemOffTop - 9 - tooltipHeight));
                        tooltip.css('left', (aElemOffLeft - tooltipWidth + 1));
                        tooltipArrow.addClass('rd-tooltip-bottom-right');
                    }
                    else if(toBottom && toLeftOffset){
                        tooltip.css('top', (aElemOffTop + aElemHeight + 9));
                        tooltip.css('left', (aElemOffLeft + 1));
                        tooltipArrow.addClass('rd-tooltip-top-left');
                    }
                    else if(toBottom && !toLeftOffset && toRightOffset){
                        tooltip.css('top', (aElemOffTop + aElemHeight + 9));
                        tooltip.css('left', (aElemOffLeft - tooltipWidth + 1));
                        tooltipArrow.addClass('rd-tooltip-top-right');
                    }
                    else if(toBottom && !toLeftOffset && !toRightOffset){     
                        tooltip.css('left', (aElemOffLeft + 1));                   
                        tooltip.css('min-width',aElemWidth+'px !important');
                        tooltip.css('width', aElemWidth+'px !important');  
                        tooltipArrow.addClass('rd-tooltip-top-left');  
                        //recalculate the height of tooltip
                        tooltipHeight = tooltip[0].clientHeight; 
                        tooltip.css('top', (aElemOffTop + aElemHeight + 9));                                                                    
                    }
                    else if(!toBottom && !toLeftOffset && !toRightOffset){ 
                        tooltip.css('left', (aElemOffLeft + 1));                        
                        tooltip.css('min-width',aElemWidth+'px !important');
                        tooltip.css('width', aElemWidth+'px !important');
                        tooltipArrow.addClass('rd-tooltip-bottom-left');   
                        //recalculate the height of tooltip
                        tooltipHeight = tooltip[0].clientHeight;
                        tooltip.css('top', (aElemOffTop - 9 - tooltipHeight));                                                                    
                    }
                    tooltip.css({'visibility':'visible', 'opacity': '1'});
                }

                //events
                aElem.on('mouseenter', function(){                    
                    adjustTooltipPosition();
                });  
                aElem.on('mouseleave', function(){
                    if(tooltip){
                        tooltip.css('opacity','0');
                        $timeout(function(){
                            tooltip.remove();
                            tooltip = null;
                        });                        
                    }
                });              
            }
        }
    }])
    .run(["$templateCache", function ($templateCache) {
        $templateCache.put('rdTooltip.tpl.html', "<div class='rd-tooltip'><div class='rd-tooltip-arrow'></div><div class='rd-tooltip-content'><span ng-bind='rdTooltip'></span></div></div>");       
    }])
})();