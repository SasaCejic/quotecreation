import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { FlowNavigationFinishEvent } from 'lightning/flowSupport';
import STAGENAME_FIELD from '@salesforce/schema/Opportunity.StageName';

const fields = [STAGENAME_FIELD];

export default class ToastInLightningFlow extends LightningElement {
    @api recordId;
    @api mode;
    @api variant;
    @api message;
    @api title;

    connectedCallback() {
        this.handleShowToast();
        this.handoverCloseAction();
    }

    async handleShowToast() {
        const toastEvt = new ShowToastEvent({
            title: this.title,
            mode: this.mode,
            variant: this.variant,
            message: this.message
        });

        this.dispatchEvent(toastEvt);
    }

    handoverCloseAction() {
        const navigateNextEvent = new FlowNavigationFinishEvent();
        this.dispatchEvent(navigateNextEvent);
    }
    
}