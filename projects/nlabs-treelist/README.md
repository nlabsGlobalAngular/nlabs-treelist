# nlabs-treelist

A powerful, customizable TreeList component for Angular with theme support, dynamic loading, and flexible configurations.

## Features

- ✨ **Theme Support**: Built-in Light/Dark/System theme switcher
- 🎨 **Customizable**: Highly configurable with multiple input options
- 🔄 **Dynamic Loading**: Lazy load children nodes on demand
- 📦 **Standalone Component**: No module imports required
- 🎯 **TypeScript**: Full TypeScript support
- 🌳 **Hierarchical Data**: Display tree structures with ease
- ⚡ **Auto-expand & Auto-select**: Optional automatic behaviors
- 🎭 **Multiple Name Click Actions**: Configure what happens when clicking node names

## Installation

```bash
npm install nlabs-treelist
```

## Usage

### Basic Example

```typescript
import { Component } from '@angular/core';
import { NlabsTreeListComponent, TreeNode } from 'nlabs-treelist';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NlabsTreeListComponent],
  template: `
    <nlabs-tree-list
      [nodes]="treeData"
      [theme]="'light'"
      (selectedIdsChange)="onSelectionChange($event)"
    ></nlabs-tree-list>
  `
})
export class AppComponent {
  treeData: TreeNode[] = [
    {
      id: '1',
      name: 'Root Node',
      children: [
        { id: '1-1', name: 'Child 1', parentId: '1', children: [] },
        { id: '1-2', name: 'Child 2', parentId: '1', children: [] }
      ]
    }
  ];

  onSelectionChange(selectedIds: string[]) {
    console.log('Selected IDs:', selectedIds);
  }
}
```

## API Reference

### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `nodes` | `TreeNode[]` | `[]` | The tree data to display |
| `theme` | `'light' \| 'dark'` | `'light'` | Theme when `showThemeSwitcher` is false |
| `showThemeSwitcher` | `boolean` | `false` | Show theme switcher UI (Light/Dark/System) |
| `expandOnSelect` | `boolean` | `false` | Auto-expand node when checkbox is selected |
| `selectChildren` | `boolean` | `false` | Auto-select all children when parent is selected |
| `nameClickAction` | `'toggle' \| 'select' \| 'both'` | `'toggle'` | Action when clicking node name |
| `loadChildrenFn` | `(nodeId: string) => Promise<TreeNode[]>` | `undefined` | Function to load children dynamically |

### Outputs

| Output | Type | Description |
|--------|------|-------------|
| `selectedIdsChange` | `EventEmitter<string[]>` | Emits selected node IDs |
| `themeChange` | `EventEmitter<'light' \| 'dark'>` | Emits when theme changes |
| `nodeExpanded` | `EventEmitter<TreeNode>` | Emits when node is expanded |
| `nodeCollapsed` | `EventEmitter<TreeNode>` | Emits when node is collapsed |

## License

MIT
