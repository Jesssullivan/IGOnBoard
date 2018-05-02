import { Injectable } from '@angular/core';

@Injectable()
export class MemberDataService {

  private memberObj: any = { phone: '(xxx) xxx-xxxx' };
  private basicInfoComplete = false;
  private _membershipPoliciesComplete = false;
  private _liabilityWaverComplete = false;
  private _additionalInfoComplete = false;

  constructor() { }

  set firstname(value) {
    this.memberObj.firstname = value;
  }
  get firstname() {
    return this.memberObj.firstname || '';
  }

  set lastname(value) {
    this.memberObj.lastname = value;
  }
  get lastname() {
    return this.memberObj.lastname || '';
  }

  set phone(value) {
    this.memberObj.phone = value;
  }
  get phone() {
    return this.memberObj.phone;
  }

  set email(value) {
    this.memberObj.email = value;
  }
  get email() {
    return this.memberObj.email || '';
  }

  set waiverAccepted(value) {
    this.memberObj.waiverAccepted = !!value;
  }
  get waiverAccepted() {
    return !!this.memberObj.waiverAccepted;
  }

  set membershipPoliciesAgreedTo(value) {
    this.memberObj.membershipPoliciesAgreedTo = !!value;
  }
  get membershipPoliciesAgreedTo() {
    return !!this.memberObj.membershipPoliciesAgreedTo;
  }

  set over18(value) {
    this.memberObj.over18 = value;
  }
  get over18() {
    return this.memberObj.over18; // don't force a boolean response
  }

  set requestFinancialAid(value) {
    this.memberObj.requestFinancialAid = value;
  }
  get requestFinancialAid() {
    return this.memberObj.requestFinancialAid; // don't force a boolean response
  }

  set student(value) {
    this.memberObj.student = !!value;
  }
  get student() {
    return !!this.memberObj.student;
  }

  set school(value) {
    this.memberObj.school = value;
  }
  get school() {
    return this.memberObj.school || '';
  }

  set graduation(value) {
    this.memberObj.graduation = value;
  }
  get graduation() {
    return this.memberObj.graduation || '';
  }

  set studentid(value) {
    this.memberObj.studentid = value._content;
  }
  get studentid() {
    return this.memberObj.studentid;
  }

  set guardian(value) {
    this.memberObj.guardian = value;
  }
  get guardian() {
    return this.memberObj.guardian || '';
  }

  set guardian_phone(value) {
    this.memberObj.guardian_phone = value;
  }
  get guardian_phone() {
    return this.memberObj.guardian_phone;
  }

  set interests_other(value) {
    this.memberObj.interests_other = value;
  }
  get interests_other() {
    return this.memberObj.interests_other || '';
  }

  hasInterest(key) {
    if (Array.isArray(this.memberObj.interests)) {
      return this.memberObj.interests.indexOf(key) >= 0;
    }
    return false;
  }

  changeInterest($event, key) {
    const temp = new Set(this.memberObj.interests || []);
    if ($event.checked) {
      temp.add(key);
    } else {
      temp.delete(key);
    }
    this.memberObj.interests = Array.from(temp);
  }

  getMember(omissions = []) {
    const m = Object.assign({}, {}, this.memberObj);
    omissions.forEach(k => {
      delete m[k];
    });
    return m;
  }

  updateFields(obj) {
    this.memberObj = Object.assign({}, this.memberObj, obj);
    this.setBasicInformationComplete(this.memberObj.basic_info_complete);
    this.setLiabilityWaiverComplete(this.memberObj.waiver_complete);
    this.setMembershipPoliciesComplete(this.memberObj.membership_policies_complete);
    this.setAdditionalInfoComplete(this.memberObj.additional_info_complete);
  }

  setBasicInformationComplete(status) {
    this.basicInfoComplete = !!status;
  }

  basicInformationComplete() {
    return this.basicInfoComplete;
  }

  setMembershipPoliciesComplete(status) {
    this._membershipPoliciesComplete = !!status;
  }

  membershipPoliciesComplete() {
    return this._membershipPoliciesComplete && !!this.memberObj.membershipPoliciesAgreedTo;
  }

  setLiabilityWaiverComplete(status) {
    this._liabilityWaverComplete = !!status;
  }

  liabilityWaverComplete() {
    return this._liabilityWaverComplete && !!this.memberObj.waiverAccepted;
  }

  setAdditionalInfoComplete(status) {
    this._additionalInfoComplete = !!status;
  }

  additionalInfoComplete() {
    return this._additionalInfoComplete;
  }
}
