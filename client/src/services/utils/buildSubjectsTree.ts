type Subject = {
  id: number;
  title: string;
  parentId: number | null;
};

type TreeNode = {
  name: string;
  children: TreeNode[];
};

export function buildTree(subjects: Subject[]): TreeNode[] {
  // Map each subject by its ID for quick lookups
  const subjectMap = new Map<number, TreeNode>();

  // Initialize nodes for all subjects
  subjects.forEach((subject) => {
    subjectMap.set(subject.id, { name: subject.title, children: [] });
  });

  // Array to store the root nodes (subjects with parentId null)
  const rootNodes: TreeNode[] = [];

  // Build the tree structure
  subjects.forEach((subject) => {
    const node = subjectMap.get(subject.id)!;

    if (subject.parentId === null) {
      // Add root subjects directly to the root nodes
      rootNodes.push(node);
    } else {
      // Add current node to its parent's children
      const parent = subjectMap.get(subject.parentId);
      if (parent) {
        parent.children.push(node);
      }
    }
  });

  return rootNodes;
}
