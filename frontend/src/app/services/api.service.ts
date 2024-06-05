import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Options, Shift } from './types';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private API_URL = "http://localhost:8080/shifts"

  constructor(private httpClient: HttpClient) {}

  getShifts(options?: Options): Observable<Shift[]> {
    return this.httpClient.get<Shift[]>(this.API_URL, options)
  }

  bookShift(id: string, options?: Options): Observable<Shift> {
    const url = `${this.API_URL}/${id}/book`
    return this.httpClient.post<Shift>(url, {}, options)
  }

  cancelShit(id: string, options?: Options): Observable<Shift> {
    const url = `${this.API_URL}/${id}/cancel`
    return this.httpClient.post<Shift>(url, {}, options)
  }
}
