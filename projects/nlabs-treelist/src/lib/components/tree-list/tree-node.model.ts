export interface TreeNode {
  id: string;
  parentId?: string;
  name: string;
  children?: TreeNode[];
  expanded?: boolean;
  checked?: boolean;
  hasChildren?: boolean; // API'den gelecek, child'ı olup olmadığını belirtir
}
