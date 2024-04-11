import {NostrliveryEventProcessor} from "./model/NostrliveryEventProcessor";
import {NostrliveryEventType} from "./model/NostrliveryEvent";
import {LoginEventProcessor} from "./LoginEventProcessor";

export class NostrliveryEventProcessorFactory {

    private processors = {
        [NostrliveryEventType.LOGIN] : new LoginEventProcessor()
    }

    getInstance(eventType: NostrliveryEventType): NostrliveryEventProcessor {
        return this.processors[eventType.valueOf()]
    }

}