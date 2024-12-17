import { LightningElement, api, wire } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getRecord, createRecord } from "lightning/uiRecordApi";
import { CloseActionScreenEvent } from 'lightning/actions';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import {NavigationMixin} from 'lightning/navigation';
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity';

export default class DuplicateOpportunityForm extends NavigationMixin(LightningElement) {
    @api recordId;
    opportunityObject = OPPORTUNITY_OBJECT;
    existingOpportunity;
    createdRecordId;
    fieldsToShow = [];
    fieldsToShow2 = [];
    tempFieldsToShow = [];
    tempFieldsToShow2 = [];
    hiddenFields = [];
    hiddenBlankFields = [];

    @wire(getObjectInfo, { objectApiName: OPPORTUNITY_OBJECT })
    opportunityObjectInfo;

    @wire(getRecord, { recordId: "$recordId", layoutTypes: ["Full"] })
    wiredRecord({ data, error }) {
        if (data) {
            if (data.fields.RecordType.value.fields.Name.value == 'Renewal' || data.fields.RecordType.value.fields.Name.value == 'Upgrade') {
                this.toast('Cannot duplicate this Opportunity', `You cannot duplicate ${data.fields.RecordType.value.fields.Name.value} Opporunities`, 'error', 'dismissable');
                this.closeModal();
            } else {
                let currentIndex = 0;
                this.existingOpportunity = data;
                Object.keys(data.fields).forEach(fieldApiName => {

                    let fieldValue = data.fields[`${fieldApiName}`].value;

                    if (fieldApiName == 'Name' || fieldApiName == 'StageName' || fieldApiName == 'Amount' || fieldApiName == 'CloseDate' || fieldApiName == 'Priority__c' || fieldApiName == 'Appointment_Date__c' || fieldApiName == 'Contract_period_start__c' || fieldApiName == 'Contract_period_end__c' || fieldApiName == 'CurrencyIsoCode' || fieldApiName == 'NextStep') {

                        if (fieldApiName == 'Amount' || fieldApiName == 'CloseDate' || fieldApiName == 'Appointment_Date__c' || fieldApiName == 'Contract_period_start__c' || fieldApiName == 'Contract_period_end__c' || fieldApiName == 'NextStep') {
                            fieldValue = null;
                        } else if (fieldApiName == 'StageName') {
                            fieldValue = 'Appointment';
                        }


                        if (currentIndex < 10 / 2) {
                            if (fieldApiName == 'Appointment_Date__c') {
                                this.tempFieldsToShow.push({fieldApiName: fieldApiName, value: fieldValue, required: true});
                            } else {
                                this.tempFieldsToShow.push({fieldApiName: fieldApiName, value: fieldValue});
                            }
                            
                        } else {
                            if (fieldApiName == 'Appointment_Date__c') {
                                this.tempFieldsToShow2.push({fieldApiName: fieldApiName, value: fieldValue, required: true});
                            } else {
                                this.tempFieldsToShow2.push({fieldApiName: fieldApiName, value: fieldValue});
                            }    
                        }

                        currentIndex++;

                    } else if (fieldApiName == 'AccountId' || fieldApiName == 'RecordTypeId' || fieldApiName == 'ParentOpportunity__c' || fieldApiName == 'LeadSource' || fieldApiName == 'Marketfit__c' || fieldApiName == 'Marketfit_Explanation__c' || fieldApiName == 'Type') {

                        this.hiddenFields.push({fieldApiName: fieldApiName, value: fieldValue});

                    } else if (fieldApiName == 'Cloned_From__c') {
                        
                        fieldValue = this.recordId;

                        this.hiddenFields.push({fieldApiName: fieldApiName, value: fieldValue});

                    } else {
                        if (fieldApiName == 'Pricebook2Id' || fieldApiName == 'Pricebook2') {
                            this.hiddenBlankFields.push({fieldApiName: fieldApiName, value: null});
                        } else {
                            this.hiddenBlankFields.push({fieldApiName: fieldApiName, value: fieldValue});
                        }
                    }

                });

                for (let i = 0; i < this.tempFieldsToShow.length; i++) {
                    this.fieldsToShow.push(null);
                }

                for (let i = 0; i < this.tempFieldsToShow2.length; i++) {
                    this.fieldsToShow2.push(null);
                }

                this.tempFieldsToShow.forEach(field => {
                    if(field.fieldApiName == 'Name' || field.fieldApiName == 'Appointment_Date__c' || field.fieldApiName == 'NextStep' || field.fieldApiName == 'Contract_period_start__c' || field.fieldApiName == 'Contract_period_end__c') {
                        switch (field.fieldApiName) {
                            case 'Name':
                                this.fieldsToShow[0] = field;
                                break;
                            case 'Appointment_Date__c':
                                this.fieldsToShow[1] = field;
                                break;
                            case 'NextStep':
                                this.fieldsToShow[2] = field;
                                break;
                            case 'Contract_period_start__c':
                                this.fieldsToShow[3] = field;
                                break;
                            case 'Contract_period_end__c':
                                this.fieldsToShow[4] = field;
                                break;
                            default:
                                break;
                        }
                    } else {
                        switch (field.fieldApiName) {
                            case 'StageName':
                                this.fieldsToShow2[0] = field;
                                break;
                            case 'Amount':
                                this.fieldsToShow2[1] = field;
                                break;
                            case 'Priority__c':
                                this.fieldsToShow2[2] = field;
                                break;
                            case 'CloseDate':
                                this.fieldsToShow2[3] = field;
                                break;
                            case 'CurrencyIsoCode':
                                this.fieldsToShow2[4] = field;
                                break;
                            default:
                                break;
                        }
                    }
                });

                this.tempFieldsToShow2.forEach(field => {
                    if(field.fieldApiName == 'Name' || field.fieldApiName == 'Appointment_Date__c' || field.fieldApiName == 'NextStep' || field.fieldApiName == 'Contract_period_start__c' || field.fieldApiName == 'Contract_period_end__c') {
                        switch (field.fieldApiName) {
                            case 'Name':
                                this.fieldsToShow[0] = field;
                                break;
                            case 'Appointment_Date__c':
                                this.fieldsToShow[1] = field;
                                break;
                            case 'NextStep':
                                this.fieldsToShow[2] = field;
                                break;
                            case 'Contract_period_start__c':
                                this.fieldsToShow[3] = field;
                                break;
                            case 'Contract_period_end__c':
                                this.fieldsToShow[4] = field;
                                break;
                            default:
                                break;
                        }
                    } else {
                        switch (field.fieldApiName) {
                            case 'StageName':
                                this.fieldsToShow2[0] = field;
                                break;
                            case 'Amount':
                                this.fieldsToShow2[1] = field;
                                break;
                            case 'Priority__c':
                                this.fieldsToShow2[2] = field;
                                break;
                            case 'CloseDate':
                                this.fieldsToShow2[3] = field;
                                break;
                            case 'CurrencyIsoCode':
                                this.fieldsToShow2[4] = field;
                                break;
                            default:
                                break;
                        }
                    }
                });

            }
        }
    }

    handleSubmit (event) {
        event.preventDefault();
        const fieldsToSubmit = event.detail.fields;
        this.template.querySelector('lightning-record-edit-form').submit(fieldsToSubmit);
    }

    showSuccessMessage (event) {
        this.toast('Success', 'Record has been created successfully', 'success', 'dismissable');
        this.navigate('standard__recordPage', event.detail.id, OPPORTUNITY_OBJECT.objectApiName, 'view');
    }

    showErrorMessage (event) {
        this.toast('Error creating record', 'Duplicate record cannot be created' , 'error', 'dismissable');
    }

    closeModal() {
        this.dispatchEvent(new CloseActionScreenEvent());
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