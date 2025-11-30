import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Organizasyon {
  id: string;
  name: string;
  gorselUrl?: string;
  ustOrganizasyonMu: boolean;
  ustOrganizasyonId?: string;
  ustOrganizasyon?: Organizasyon | null;
}

@Injectable({ providedIn: 'root' })
export class OrganizasyonService {
  private apiUrl = 'http://localhost:5259/organizasyon'; // Gerekirse portu değiştirin

  constructor(private http: HttpClient) {}

  getUstOrganizasyonlar(): Observable<Organizasyon[]> {
    return this.http.get<Organizasyon[]>(`${this.apiUrl}/ust`);
  }

  getAltOrganizasyonlar(ustId: string): Observable<Organizasyon[]> {
    return this.http.get<Organizasyon[]>(`${this.apiUrl}/alt/${ustId}`);
  }
}
