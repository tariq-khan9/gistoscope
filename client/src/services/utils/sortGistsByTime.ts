import { GistType } from "../types";

export function sortGistsByTime(
  gists: GistType[],
  sortOrder: "asc" | "desc" = "asc"
): GistType[] {
  // Sort order can be 'asc' for ascending or 'desc' for descending
  const sortByCreatedAt = (
    a: { createdAt: string },
    b: { createdAt: string }
  ) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  };

  // Recursive function to sort gists, their versions, and edits, including nested child gists
  const sortGistRecursively = (gist: GistType): GistType => {
    // Sort versions of each gist by createdAt
    const sortedVersions = gist.versions
      .map((version) => {
        // Sort edits of each version by createdAt
        const sortedEdits = [...version.edits].sort(sortByCreatedAt);

        return {
          ...version,
          edits: sortedEdits,
        };
      })
      .sort(sortByCreatedAt);

    // Sort child gists recursively if there are any
    const sortedChildren =
      gist.gists?.map(sortGistRecursively).sort(sortByCreatedAt) || [];

    return {
      ...gist,
      versions: sortedVersions,
      gists: sortedChildren,
    };
  };

  // Sort top-level gists
  const sortedGists = gists.map(sortGistRecursively).sort(sortByCreatedAt);

  return sortedGists;
}
