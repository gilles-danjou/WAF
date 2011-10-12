/**
 * @brief			Stacks.js implements the Stacks module, part of WAF/Core/Native
 * @details			The Stacks module is part of the Core and Native composite modules.
 * 
 * 
 *  
 * @author			julienfeasson
 * @date			March 2009 
 * @version			1.0
 * 
 * @include			copyright.txt
 */

/* JSLint Declarations */
/*global WAF*/

/**
 * Class Stack
 *
 * @classDescription		This class creates a new instance of Stack
 *
 * \~english
 * @brief					This is the declaration of the Stack class.
 * @details					The Stack class is used to execute asynchronous code in a synchronous manner.
 * 
 * @return					{Stack} returns a new Stack object
 * @author 					julienfeasson
 * @see						none
 * @version					1.0
 * @constructor
 */
WAF.classes.Stack = function () {
	
	this.events = [];
	this.ready = true;
	
	/**
	 * 
	 * @param {function} action
	 * @param {Object} token
	 */
	this.addEvent = function (action,token) {
		var newStackEvent = new WAF.classes.Event();
		newStackEvent.type = WAF.constants.events.types.onEventComplete;
		newStackEvent.action = action;
		newStackEvent.token = token;
		newStackEvent.stack = this;
		
		this.events.push(newStackEvent);
		
		this.fire();
				
		return this;	
	};
	
	/**
	 * 
	 * @param {Object} forceContinue
	 */
	this.fire = function (forceContinue) {
		if (this.ready | forceContinue) {
			if (this.events.length > 0) {
				this.ready = false;
				
				var event = this.events[0];
				
				if (event.action(event)) {
					this.events.shift();
					this.ready = true;
					this.fire();					
				}
			}
		}
	};
	
	return this;
};

