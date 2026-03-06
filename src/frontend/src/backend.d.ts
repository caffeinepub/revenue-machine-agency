import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Inquiry {
    id: bigint;
    name: string;
    plan: string;
    email: string;
    companyName?: string;
}
export interface backendInterface {
    debugClearInquiries(): Promise<void>;
    debugDeleteInquiry(id: bigint): Promise<void>;
    debugGetAllInquiries(): Promise<Array<Inquiry>>;
    getVisitCount(): Promise<bigint>;
    incrementVisitCount(): Promise<void>;
    submitInquiry(name: string, email: string, companyName: string | null, plan: string): Promise<void>;
}
