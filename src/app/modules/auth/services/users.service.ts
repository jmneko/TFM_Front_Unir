import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, firstValueFrom, lastValueFrom } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from 'src/app/core/models/decodedToken.interface';

type FormLoginValue = { email: string; password: string };
type FormLoginResponse = { success: string; token: string; fatal: string };
type FormRegisterValue = {
  nombre: string;
  apellidos: string;
  mail: string;
  pass: string;
  rol: string;
  foto?: string;
  tel?: string;
  pxh?: number;
  experiencia?: number;
  lat?: number;
  lon?: number;
};
type FormRegisterResponse = { success: string; token: string; fatal: string };

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private baseUrl: string = 'http://localhost:3000/api/usuarios';
  private httpClient = inject(HttpClient);
  token: string | null;
  userId: number | null;
  tokenChange = new Subject<string | null>();

  constructor() {
    this.token = localStorage.getItem('auth_token');
    this.userId = localStorage.getItem('userId')
      ? Number(localStorage.getItem('userId'))
      : null;
  }
  
  login(values: FormLoginValue): Promise<FormLoginResponse> {
    return firstValueFrom(
      this.httpClient.post<FormLoginResponse>(`${this.baseUrl}/login`, values)
    ).then((response) => {
      this.token = response.token;
      this.tokenChange.next(this.token);
      return response;
    });
  }

  register(values: FormRegisterValue) {
    return firstValueFrom(
      this.httpClient.post<FormRegisterResponse>(
        `${this.baseUrl}/register`,
        values
      )
    ).then((response) => {
      this.token = response.token;
      this.tokenChange.next(this.token);
      return response;
    });
  }

  getDecodedToken(): DecodedToken | null {
    const token = localStorage.getItem('auth_token');
    return token ? jwtDecode(token) : null;
  }
  
  isAdmin(): boolean {
    const decodedToken = this.getDecodedToken();
    return decodedToken ? decodedToken.user_rol === 'admin' : false;
  }
  
  isTeacher(): boolean {
    const decodedToken = this.getDecodedToken();
    return decodedToken ? decodedToken.user_rol === 'prof' : false;
  }

  isTeacherOrStudent(): boolean {
    const decodedToken = this.getDecodedToken();
    return decodedToken ? decodedToken.user_rol === 'prof' || decodedToken.user_rol === 'alumn' : false;
  }

  getDataById (id:number):Promise<any>{
    return lastValueFrom(this.httpClient.get<any>(`${this.baseUrl}/${id}`))
  }
  
  isLogged(): boolean {
    return localStorage.getItem('auth_token') ? true : false;
  }

  logOut() {
    this.token = null;
    this.tokenChange.next(null);
    localStorage.removeItem('auth_token');
  }

  clearUserId() {
    this.userId = null;
    localStorage.removeItem('userId');
  }
}
