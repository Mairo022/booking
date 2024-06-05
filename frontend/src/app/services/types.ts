import { HttpContext, HttpHeaders, HttpParams } from "@angular/common/http";

export interface Options {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    } | undefined;
    context?: HttpContext | undefined;
    observe?: "body" | undefined;
    params?: HttpParams | undefined;
    reportProgress?: boolean | undefined;
    responseType?: "json" | undefined;
    withCredentials?: boolean | undefined;
    transferCache?: boolean | undefined;
}

export interface Shift {
    id: string
    area: string,
    booked: boolean
    startTime: number
    endTime: number
    loading?: boolean
}