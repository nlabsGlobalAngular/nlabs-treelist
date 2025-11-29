import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TreeNode } from './tree-node.model';

@Component({
  selector: 'nlabs-tree-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tree-list.component.html',
  styleUrls: ['./tree-list.component.css']
})
export class NlabsTreeListComponent implements OnInit, OnChanges {
  @Input() nodes: any[] = [];
  @Input() idField: string = 'id';
  @Input() parentIdField: string = 'parentId';
  @Input() nameField: string = 'name';
  @Input() childrenField: string = 'children';

  // Alan eşleme ile veri erişimi
  private getId(node: any): string {
    return node?.[this.idField];
  }
  private getParentId(node: any): string | undefined {
    return node?.[this.parentIdField];
  }
  private getName(node: any): string {
    return node?.[this.nameField];
  }
  private getChildren(node: any): any[] | undefined {
    return node?.[this.childrenField];
  }
  private setChildren(node: any, children: any[]) {
    node[this.childrenField] = children;
  }
  @Input() theme: 'light' | 'dark' = 'light'; // Manuel tema (showThemeSwitcher=false ise kullanılır)
  @Input() showThemeSwitcher: boolean = false; // Tema switcher gösterilsin mi?
  @Input() expandOnSelect: boolean = false; // Checkbox seçildiğinde otomatik expand
  @Input() selectChildren: boolean = false; // Parent seçildiğinde children'ı da seç
  @Input() nameClickAction: 'toggle' | 'select' | 'both' = 'toggle'; // Name'e tıklayınca ne olsun
  @Input() loadChildrenFn?: (nodeId: string) => Promise<TreeNode[]>; // Children yüklemek için kullanıcı tarafından sağlanan fonksiyon

  @Output() selectedIdsChange = new EventEmitter<string[]>();
  @Output() themeChange = new EventEmitter<'light' | 'dark'>();
  @Output() nodeExpanded = new EventEmitter<TreeNode>();
  @Output() nodeCollapsed = new EventEmitter<TreeNode>();

  // Tema switcher için state
  themeMode: 'light' | 'dark' | 'system' = 'system';
  private systemThemePreference: 'light' | 'dark' = 'light';
  currentTheme: 'light' | 'dark' = 'light';

  @HostBinding('class.treelist-dark') get isDark() {
    return this.currentTheme === 'dark';
  }
  @HostBinding('class.treelist-light') get isLight() {
    return this.currentTheme === 'light';
  }

  constructor() {}

  ngOnInit() {
    // showThemeSwitcher aktifse sistem temasını dinle
    if (this.showThemeSwitcher) {
      this.detectSystemTheme();
      this.listenToSystemThemeChanges();
      this.updateCurrentTheme();
    } else {
      // Manuel tema kullan
      this.currentTheme = this.theme;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // theme input'u değiştiğinde ve showThemeSwitcher false ise güncelle
    if (changes['theme'] && !this.showThemeSwitcher) {
      this.currentTheme = this.theme;
    }
  }

  // Sistem temasını algıla
  private detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.systemThemePreference = 'dark';
    } else {
      this.systemThemePreference = 'light';
    }
  }

  // Sistem tema değişikliklerini dinle
  private listenToSystemThemeChanges() {
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        this.systemThemePreference = e.matches ? 'dark' : 'light';
        if (this.themeMode === 'system') {
          this.updateCurrentTheme();
        }
      });
    }
  }

  // Aktif temayı güncelle
  private updateCurrentTheme() {
    if (this.themeMode === 'system') {
      this.currentTheme = this.systemThemePreference;
    } else {
      this.currentTheme = this.themeMode;
    }
    this.themeChange.emit(this.currentTheme);
  }

  // Tema modunu değiştir
  setThemeMode(mode: 'light' | 'dark' | 'system') {
    this.themeMode = mode;
    this.updateCurrentTheme();
  }

  async toggle(node: any) {
    node.expanded = !node.expanded;
    if (node.expanded) {
      this.nodeExpanded.emit(node);
      const children = this.getChildren(node);
      if ((!children || children.length === 0) && this.loadChildrenFn) {
        await this.loadChildren(node);
      }
    } else {
      this.nodeCollapsed.emit(node);
    }
  }

  onNameClick(node: any) {
    // nameClickAction'a göre davranış belirle
    switch (this.nameClickAction) {
      case 'toggle':
        this.toggleNode(node);
        break;
      case 'select':
        this.toggleCheckbox(node);
        break;
      case 'both':
        this.toggleNode(node);
        this.toggleCheckbox(node);
        break;
    }
  }

  private toggleNode(node: any) {
    if (node.expanded) {
      node.expanded = false;
      this.nodeCollapsed.emit(node);
    } else {
      node.expanded = true;
      this.nodeExpanded.emit(node);
      const children = this.getChildren(node);
      if ((!children || children.length === 0) && this.loadChildrenFn) {
        this.loadChildren(node);
      }
    }
  }

  private toggleCheckbox(node: any) {
    node.checked = !node.checked;
    const children = this.getChildren(node);
    // selectChildren aktifse
    if (this.selectChildren) {
      if (node.checked) {
        // Seçiliyorsa: children yüklü değilse yükle ve seç
        if (!children || children.length === 0) {
          if (!node.expanded) {
            node.expanded = true;
          }
          this.loadChildrenAndSelect(node, true);
          return; // Early return, loadChildrenAndSelect emitSelectedIds çağıracak
        } else {
          this.selectAllChildren(node, true);
        }
      } else {
        // Seçim kaldırılıyorsa: children varsa seçimlerini kaldır
        if (children && children.length > 0) {
          this.selectAllChildren(node, false);
        }
      }
    }
    // expandOnSelect aktifse ve node seçildiyse, otomatik expand et
    if (this.expandOnSelect && node.checked && !node.expanded) {
      node.expanded = true;
      if ((!children || children.length === 0) && this.loadChildrenFn) {
        this.loadChildren(node);
      }
    }
    this.onCheckboxChange();
  }

  private selectAllChildren(node: any, checked: boolean) {
    const children = this.getChildren(node);
    if (!children) return;
    for (const child of children) {
      child.checked = checked;
      const childChildren = this.getChildren(child);
      if (childChildren && childChildren.length > 0) {
        this.selectAllChildren(child, checked);
      }
    }
  }

  shouldShowToggle(node: any): boolean {
    // Eğer hasChildren özelliği varsa onu kullan
    if (node.hasChildren !== undefined) {
      return node.hasChildren;
    }
    const children = this.getChildren(node);
    if (children && children.length > 0) {
      return true;
    }
    if (node.hasChildren === false) {
      return false;
    }
    return true;
  }

  private async loadChildren(node: any) {
    if (!this.loadChildrenFn) return;
    try {
      const children = await this.loadChildrenFn(this.getId(node));
      this.setChildren(node, children);
      if (children.length === 0) {
        node.hasChildren = false;
        node.expanded = false;
      } else {
        node.hasChildren = true;
      }
    } catch (error) {
      console.error('Error loading children:', error);
      node.hasChildren = false;
      node.expanded = false;
    }
  }

  // Seçili ID'leri topla ve emit et
  emitSelectedIds() {
    const selectedIds = this.collectSelectedIds(this.nodes);
    this.selectedIdsChange.emit(selectedIds);
  }

  // Tüm node'ları recursive olarak dolaşıp seçili olanların ID'lerini topla
  private collectSelectedIds(nodes: any[]): string[] {
    let ids: string[] = [];
    for (const node of nodes) {
      if (node.checked) {
        ids.push(this.getId(node));
      }
      const children = this.getChildren(node);
      if (children && children.length > 0) {
        ids = ids.concat(this.collectSelectedIds(children));
      }
    }
    return ids;
  }

  // Checkbox değiştiğinde çağrılacak
  onCheckboxChange(node?: any) {
    if (node) {
      const children = this.getChildren(node);
      if (this.selectChildren && node.checked) {
        if (!children || children.length === 0) {
          if (!node.expanded) {
            node.expanded = true;
          }
          this.loadChildrenAndSelect(node, node.checked || false);
          return;
        } else {
          this.selectAllChildren(node, node.checked || false);
        }
      } else if (this.selectChildren && !node.checked) {
        if (children && children.length > 0) {
          this.selectAllChildren(node, false);
        }
      }
      if (this.expandOnSelect && node.checked && !node.expanded) {
        node.expanded = true;
        if ((!children || children.length === 0) && this.loadChildrenFn) {
          this.loadChildren(node);
        }
      }
    }
    this.emitSelectedIds();
  }

  private async loadChildrenAndSelect(node: any, checked: boolean) {
    if (!this.loadChildrenFn) return;
    try {
      const children = await this.loadChildrenFn(this.getId(node));
      // Children'ları checked durumu ile oluştur
      const checkedChildren = children.map(child => ({ ...child, checked: checked }));
      this.setChildren(node, checkedChildren);
      if (children.length === 0) {
        node.hasChildren = false;
        node.expanded = false;
      } else {
        node.hasChildren = true;
      }
      this.emitSelectedIds();
    } catch (error) {
      console.error('Error loading children:', error);
      node.hasChildren = false;
      node.expanded = false;
    }
  }
}
