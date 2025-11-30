
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NlabsTreeListComponent, TreeNode } from 'nlabs-treelist';
// import { NlabsTreeListComponent, TreeNode } from '../../../../package/projects/nlabs-treelist/src/public-api';
import { OrganizasyonService } from './organizasyon.service';

interface Proje {
  ad: string;
  baslangicTarihi: string;
  devamEdiyorMu: boolean;
  bitisTarihi: string;
  sorumluOrganizasyonIds: string[];
  calisanOrganizasyonIds: string[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, NlabsTreeListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [OrganizasyonService]
})
export class App implements OnInit {

      // TreeList'e dinamik children yükleme fonksiyonu
      loadAltOrganizasyonlar = (parentId: string) => {
        return this.organizasyonService.getAltOrganizasyonlar(parentId).toPromise().then(children =>
          (children ?? []).map(org => ({
            id: org.id,
            name: org.name ?? '',
            imageUrl: org.gorselUrl,
            expanded: false,
            children: [],
            hasChildren: true,
            checked: false
          }))
        );
      };
    onNodeExpanded(node: any, tip: 'sorumlu' | 'calisan') {
      // Eğer children zaten yüklüyse tekrar yükleme
      if (node.children && node.children.length > 0) return;

      this.organizasyonService.getAltOrganizasyonlar(node.id).subscribe((children: any[]) => {
        node.children = children.map((org: any) => ({
          id: org.id,
          name: org.name ?? '',
          imageUrl: org.gorselUrl,
          expanded: false,
          children: [],
          hasChildren: true,
          checked: false
        }));
        // Değişiklik algılansın diye array referansını değiştir
        if (tip === 'sorumlu') {
          this.sorumluOrganizasyonNodes = [...this.sorumluOrganizasyonNodes];
        } else {
          this.calisanOrganizasyonNodes = [...this.calisanOrganizasyonNodes];
        }
      });
    }
  protected title = 'Proje Yönetimi Sistemi';

  theme: 'light' | 'dark' = 'light';
  sorumluOrganizasyonNodes: TreeNode[] = [];
  calisanOrganizasyonNodes: TreeNode[] = [];

  proje: Proje = {
    ad: '',
    baslangicTarihi: '',
    devamEdiyorMu: false,
    bitisTarihi: '',
    sorumluOrganizasyonIds: [],
    calisanOrganizasyonIds: []
  };

  constructor(private organizasyonService: OrganizasyonService) {}

  ngOnInit() {
    // Üst organizasyonları yükle
    this.loadOrganizasyonlar();

    // Bugünün tarihini başlangıç tarihine ata
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    this.proje.baslangicTarihi = `${year}-${month}-${day}`;
  }

  loadOrganizasyonlar() {
    this.organizasyonService.getUstOrganizasyonlar().subscribe(data => {
      // Sorumlu organizasyonlar için
      this.sorumluOrganizasyonNodes = data.map(org => ({
        id: org.id,
        name: org.name ?? '',
        imageUrl: org.gorselUrl,
        expanded: false,
        children: [],
        hasChildren: true,
        checked: false
      }));

      // Çalışan organizasyonlar için (aynı veri)
      this.calisanOrganizasyonNodes = data.map(org => ({
        id: org.id,
        name: org.name ?? '',
        imageUrl: org.gorselUrl,
        expanded: false,
        children: [],
        hasChildren: true,
        checked: false
      }));
    });
  }

  onSorumluOrganizasyonChange(selectedIds: string[]) {
    this.proje.sorumluOrganizasyonIds = selectedIds;
    console.log('Sorumlu Organizasyonlar:', selectedIds);
  }

  onCalisanOrganizasyonChange(selectedIds: string[]) {
    this.proje.calisanOrganizasyonIds = selectedIds;
    console.log('Çalışan Organizasyonlar:', selectedIds);
  }

  // CRUD İşlemleri
  onNodeAdd(parentNode: any) {
    console.log('Alt öğe ekle:', parentNode);
    const childName = prompt(`"${parentNode.name}" altına yeni organizasyon adı:`);
    if (childName) {
      // Backend'e POST isteği atabilirsiniz
      const newNode = {
        id: crypto.randomUUID(),
        name: childName,
        imageUrl: `https://picsum.photos/200/200?random=${Date.now()}`,
        expanded: false,
        children: [],
        hasChildren: false,
        checked: false
      };

      // Parent node'un children'ına ekle
      if (!parentNode.children) {
        parentNode.children = [];
      }
      parentNode.children.push(newNode);
      parentNode.hasChildren = true;
      parentNode.expanded = true;

      // Trigger change detection
      this.calisanOrganizasyonNodes = [...this.calisanOrganizasyonNodes];

      alert(`"${childName}" başarıyla eklendi!`);
    }
  }

  onNodeEdit(node: any) {
    console.log('Düzenle:', node);
    const newName = prompt(`Organizasyon adını düzenle:`, node.name);
    if (newName && newName !== node.name) {
      // Backend'e PUT isteği atabilirsiniz
      node.name = newName;

      // Trigger change detection
      this.calisanOrganizasyonNodes = [...this.calisanOrganizasyonNodes];

      alert(`Organizasyon adı "${newName}" olarak güncellendi!`);
    }
  }

  onNodeDelete(node: any) {
    console.log('Sil:', node);
    const confirmDelete = confirm(`"${node.name}" organizasyonunu silmek istediğinize emin misiniz?`);
    if (confirmDelete) {
      // Backend'e DELETE isteği atabilirsiniz
      this.removeNodeFromTree(this.calisanOrganizasyonNodes, node.id);

      // Trigger change detection
      this.calisanOrganizasyonNodes = [...this.calisanOrganizasyonNodes];

      alert(`"${node.name}" başarıyla silindi!`);
    }
  }

  private removeNodeFromTree(nodes: any[], nodeId: string): boolean {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === nodeId) {
        nodes.splice(i, 1);
        return true;
      }
      if (nodes[i].children && nodes[i].children.length > 0) {
        if (this.removeNodeFromTree(nodes[i].children, nodeId)) {
          return true;
        }
      }
    }
    return false;
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
  }

  onSubmit() {
    console.log('Proje Kaydediliyor:', this.proje);
    alert('Proje başarıyla kaydedildi!\n\n' + JSON.stringify(this.proje, null, 2));
  }
}
