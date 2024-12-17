import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import {NavigationMixin} from 'lightning/navigation';
import { CloseActionScreenEvent } from 'lightning/actions';
import { getRecord, getFieldValue } from "lightning/uiRecordApi";
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';
import OPPORTUNITY_FIELD from '@salesforce/schema/SBQQ__Quote__c.SBQQ__Opportunity2__c';
import PRIMARY_FIELD from '@salesforce/schema/SBQQ__Quote__c.SBQQ__Primary__c';
import PRIMARY_CONTACT_FELD from '@salesforce/schema/SBQQ__Quote__c.SBQQ__PrimaryContact__c';
import OFFER_TITLE_FIELD from '@salesforce/schema/SBQQ__Quote__c.Offer_Title__c';
import ACCOUNT_FIELD from '@salesforce/schema/SBQQ__Quote__c.SBQQ__Account__c';
import PRICEBOOK_FIELD from '@salesforce/schema/SBQQ__Quote__c.SBQQ__PriceBook__c';
import SALESREP_FIELD from '@salesforce/schema/SBQQ__Quote__c.SBQQ__SalesRep__c';
import SUBSCRIPTION_TERM_FIELD from '@salesforce/schema/SBQQ__Quote__c.SBQQ__SubscriptionTerm__c';
import OPPORTUNITY_ACCOUNT_FIELD from '@salesforce/schema/Opportunity.AccountId';
import OPPORTUNITY_PRICEBOOK_FIELD from '@salesforce/schema/Opportunity.Pricebook2Id';
import Id from '@salesforce/user/Id';

const fields = [OPPORTUNITY_ACCOUNT_FIELD, OPPORTUNITY_PRICEBOOK_FIELD];


export default class QuoteCreation extends NavigationMixin(LightningElement) {

    @api recordId;
    userId = Id;
    primaryContact;
    error;

    opportunityField = OPPORTUNITY_FIELD;
    primaryField = PRIMARY_FIELD;
    primaryContactField = PRIMARY_CONTACT_FELD;
    offerTitleField = OFFER_TITLE_FIELD;
    subscriptionTermField = SUBSCRIPTION_TERM_FIELD;
    accountField = ACCOUNT_FIELD;
    pricebookField = PRICEBOOK_FIELD;
    salesRepField = SALESREP_FIELD;

    @wire(getRecord, { recordId: '$recordId', fields })
    opportunity;

    @wire(getRelatedListRecords, {
        parentRecordId: '$recordId',
        relatedListId: 'OpportunityContactRoles',
        fields: ['OpportunityContactRole.ContactId', 'OpportunityContactRole.IsPrimary'],
        sortBy: ['OpportunityContactRole.IsPrimary']
    })contactRoles({ error, data }) {
        if (data) {
            this.primaryContact = (data.records[data.records.length - 1].fields.IsPrimary.value) ? data.records[data.records.length - 1].fields.ContactId.value : null;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.primaryContact = undefined;
        }
    }

    get account() {
        return getFieldValue(this.opportunity.data, OPPORTUNITY_ACCOUNT_FIELD);
    }

    get pricebook() {
        return getFieldValue(this.opportunity.data, OPPORTUNITY_PRICEBOOK_FIELD);
    }

    closeModal() {
        this.dispatchEvent(new CloseActionScreenEvent());
    }

    onSubmitHandler(event) {
        event.preventDefault();
        const fieldsToSubmit = event.detail.fields;
        this.template.querySelector('lightning-record-edit-form').submit(fieldsToSubmit);
    }

    showErrorMessage(event) {
        this.toast('Error', 'Record cannot be created', 'error', 'dismissable');
    }

    showSuccessMessage(event) {
        this.toast('Success', 'Quote has been created successfully', 'success', 'dismissable');
        this.navigate('standard__recordPage', event.detail.id, 'SBQQ__Quote__c', 'view');
    }

    navigate(type, recordId, objectApiName, actionName) {
        this[NavigationMixin.Navigate]({
            type: type,
            attributes:{
                recordId: recordId,
                objectApiName: objectApiName,
                actionName: actionName
            }
        });
    }

    toast(title, message, variant, mode) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: variant,
                mode: mode
            })
        );
    }
    

}