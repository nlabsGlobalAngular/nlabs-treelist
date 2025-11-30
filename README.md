# nlabs-treelist

Angular için geliştirilen dinamik ve özelleştirilebilir TreeList bileşeni ve backend API'si.

## Proje Yapısı

Bu repository, nlabs-treelist ekosisteminin iki ana bileşenini içerir:

### 1. TreeList - .NET Web API
Backend API projesi, hiyerarşik veri yapılarını yönetmek ve sunmak için geliştirilmiş ASP.NET Core Web API'sidir.

**Klasör:** `TreeList/`

**Özellikler:**
- Organizasyon hiyerarşisi yönetimi
- RESTful API endpoints
- Dinamik alt düğüm yükleme desteği
- CORS yapılandırması

**Çalıştırma:**
```bash
cd TreeList
dotnet run
```

API varsayılan olarak `https://localhost:7200` adresinde çalışır.

**Örnek Endpoint:**
```
GET /api/organizasyon
GET /api/organizasyon/{parentId}
```

### 2. nlabs-treelist Angular Paketi

NPM üzerinden yayınlanan, Angular uygulamalarında kullanılabilen TreeList bileşeni.

**NPM:** [npmjs.com/package/nlabs-treelist](https://www.npmjs.com/package/nlabs-treelist)

**GitHub:** [github.com/NlabsNpmPackages/nlabs-treelist](https://github.com/NlabsNpmPackages/nlabs-treelist)

**Kurulum:**
```bash
npm install nlabs-treelist
```

**Özellikler:**
- Dinamik çocuk yükleme (API entegrasyonu)
- Özelleştirilebilir alan eşleme (id, parentId, name, children)
- Tema desteği (Açık/Koyu mod)
- Seçim ve genişletme yönetimi
- Event/callback desteği
- TypeScript desteği

## Kullanım Senaryosu

### Backend API Kurulumu

1. TreeList API'sini çalıştırın:
```bash
cd TreeList
dotnet restore
dotnet run
```

2. API'nin çalıştığını test edin:
```bash
curl https://localhost:7200/api/organizasyon
```

### Frontend Entegrasyonu

1. Yeni bir Angular projesi oluşturun veya mevcut projeye ekleyin:
```bash
ng new my-treelist-app
cd my-treelist-app
```

2. nlabs-treelist paketini kurun:
```bash
npm install nlabs-treelist
```

3. Component'inize ekleyin:

```typescript
import { Component } from '@angular/core';
import { NlabsTreelistComponent } from 'nlabs-treelist';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NlabsTreelistComponent],
  template: `
    <nlabs-treelist
      [data]="organizasyonlar"
      [loadChildren]="loadChildren"
      [fieldMapping]="fieldMapping"
      [theme]="'light'"
      (onNodeClick)="handleNodeClick($event)"
      (onNodeExpand)="handleNodeExpand($event)">
    </nlabs-treelist>
  `
})
export class AppComponent {
  organizasyonlar: any[] = [];

  fieldMapping = {
    id: 'id',
    parentId: 'ustOrganizasyonId',
    name: 'ad',
    children: 'altOrganizasyonlar',
    hasChildren: 'altVarMi'
  };

  ngOnInit() {
    // İlk seviye verileri yükle
    fetch('https://localhost:7200/api/organizasyon')
      .then(res => res.json())
      .then(data => this.organizasyonlar = data);
  }

  loadChildren = (node: any) => {
    return fetch(`https://localhost:7200/api/organizasyon/${node.id}`)
      .then(res => res.json());
  };

  handleNodeClick(node: any) {
    console.log('Tıklanan düğüm:', node);
  }

  handleNodeExpand(node: any) {
    console.log('Genişletilen düğüm:', node);
  }
}
```

## Demo Uygulaması

Repository'de test ve geliştirme amaçlı bir demo Angular uygulaması da bulunmaktadır (gitignore'da hariç tutulmuştur).

Demo uygulaması, TreeList API ve nlabs-treelist paketinin birlikte nasıl çalıştığını gösterir.

## Geliştirme

### API Geliştirme

```bash
cd TreeList
dotnet watch run
```

### Paket Güncellemeleri

nlabs-treelist paketi için güncellemeler [NPM repository](https://www.npmjs.com/package/nlabs-treelist)'de yayınlanır.

Son versiyon: **1.0.2**

## Katkı ve Destek

Katkılarınızı bekliyoruz! Issues ve pull request'lerinizi paylaşabilirsiniz.

### İlgili Linkler

- Angular Paketi: [github.com/NlabsNpmPackages/nlabs-treelist](https://github.com/NlabsNpmPackages/nlabs-treelist)
- NPM Paketi: [npmjs.com/package/nlabs-treelist](https://www.npmjs.com/package/nlabs-treelist)
- Demo Uygulama: [github.com/nlabsGlobalAngular/nlabs-treelist](https://github.com/nlabsGlobalAngular/nlabs-treelist)

## Lisans

MIT License - Detaylar için `LICENSE` dosyasına bakınız.
