import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class HomeClient {
    constructor(private http: HttpClient) { }

    async getAllUsers(username: string, email: string): Promise<string[]> {
        return this.http.get('/api/home/getallusers', new HttpParams().append('username', username).append('email', email)).toPromise();
    }

    async login(username: string, password: string): Promise<boolean> {
        return this.http.post('/api/home/login', new HttpParams().append('username', username).append('password', password)).toPromise();
    }
}