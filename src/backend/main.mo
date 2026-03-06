import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

actor {
  type Inquiry = {
    id : Nat;
    name : Text;
    email : Text;
    companyName : ?Text;
    plan : Text;
  };

  module Inquiry {
    public func compare(inquiry1 : Inquiry, inquiry2 : Inquiry) : Order.Order {
      Nat.compare(inquiry1.id, inquiry2.id);
    };
  };

  let inquiries = Map.empty<Nat, Inquiry>();
  var nextInquiryId = 0;
  var visitCount = 0;

  public shared ({ caller }) func submitInquiry(name : Text, email : Text, companyName : ?Text, plan : Text) : async () {
    let inquiry : Inquiry = {
      id = nextInquiryId;
      name;
      email;
      companyName;
      plan;
    };
    inquiries.add(nextInquiryId, inquiry);
    nextInquiryId += 1;
  };

  public shared ({ caller }) func incrementVisitCount() : async () {
    visitCount += 1;
  };

  public query ({ caller }) func getVisitCount() : async Nat {
    visitCount;
  };

  public query ({ caller }) func debugGetAllInquiries() : async [Inquiry] {
    inquiries.values().toArray().sort();
  };

  public shared ({ caller }) func debugDeleteInquiry(id : Nat) : async () {
    if (not inquiries.containsKey(id)) {
      Runtime.trap("Inquiry does not exist");
    };
    inquiries.remove(id);
  };

  public shared ({ caller }) func debugClearInquiries() : async () {
    inquiries.clear();
    nextInquiryId := 0;
  };
};
