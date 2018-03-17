import PubSub from 'pubsub-js';
export default class ErrorFinder{
	publishErrors(mistakes) {
		for(var key in mistakes.errors){
			PubSub.publish('reporting-validation-error',mistakes.errors[key]);
		}
	}	
}