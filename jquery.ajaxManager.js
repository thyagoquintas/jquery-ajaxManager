/*!
 * jQuery AjaxManager plugin v1.0.0
 * 
 * Copyright 2012, Thyago Quintas (dev@thyagoquintas.com.br)
 * https://github.com/thyagoquintas/jquery-ajaxManager/
 * 
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0 
 */

(function ($, document, undefined) {
	var requests = [];
	var running = false;

	//Compare Objects
	var equals = function(y,x){
		var p;
		for(p in y) {
	    	if(typeof(x[p])=='undefined') {return false;}
	    }
		
	    for(p in y) {
	    	if (y[p]) {
	       		switch(typeof(y[p])) {
	       	    	case 'object':
	                	if (!y[p].equals(x[p])) { return false; } break;
	                case 'function':
	                	if (typeof(x[p])=='undefined' || (p != 'equals' && y[p].toString() != x[p].toString()))
	                		return false;
	                	break;
	                default:
	                	if (y[p] != x[p]) { return false; }
	                }
	        }else{
		        if (x[p])
		        	return false;
		    } 
		}
	    for(p in x) {
		    if(typeof(y[p])=='undefined') {return false;}
		}
		return true;
	};




	var methods = {
		init : function(content) {
	    	return requests;
	    },
    
	    running : function(){
	    	return running;
	    },
    
	    add : function(content) {
	    	if(content == undefined) $.error('Content is empty on jQuery.ajaxManager');
	    	var contents = $.extend({ type: 'POST' }, content);
		
	    	//minimal
	    	if(contents["url"] != undefined && contents["type"] != undefined){
				requests.push(contents);
				return contents;
			} else {
				$.error('The content needs the minimal values: URL and TYPE on jQuery.ajaxManager');
			}
		},
    
		remove : function(content) {
			if(content == undefined) $.error('Content is empty on jQuery.ajaxManager');
			var contents = $.extend({ type: 'POST' }, content);

			var i = 0;
			for(var i = 0; i < requests.length; i++){
				if(equals(requests[i],contents)){
					requests.splice(i, 1);
					return true;
				}
			};
	       	$.error('Request was not found.');
	     },
    
	     stop : function(){
		    requests = [];
		    clearTimeout(this.tid);
		    running = false;
		 },
    
		 run : function(content){
		    var oriSuc;
		    running = true;
        
			if(requests.length) {
				oriSuc = requests[0].complete;

				requests[0].complete = function() {
					 if(typeof oriSuc === 'function') oriSuc();
					 requests.shift();
					 $.ajaxManager('run');
				};   

				$.ajax(requests[0]);
			} else {
            	self.tid = setTimeout(function() { 
            		$.ajaxManager('run'); 
            	}, 1000);
            }
         }
    
    };

    $.ajaxManager = function(method) {
	    //Start ajax
    	if(!methods.running.apply(this, []))
    		methods.run.apply(this, []);
    
    	if (methods[method]) {
	    	return methods[method].apply( this, Array.prototype.slice.call(arguments, 1));
	    } else if (typeof method === 'object' || ! method) {
		    return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.ajaxManager');
		}
	};
	
})(jQuery, document);