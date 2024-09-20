
import { GistType } from "../types";

export function groupGistsByParent(gists: GistType[]) {
    // Create a map where each gist's id is a key for quick access
    const gistsById = gists.reduce((map: any, gist: GistType) => {
      map[gist.id] = { ...gist, gists: [] };
      return map;
    }, {});
  
    // Initialize an array to hold the top-level (root) gists
    const rootGists: GistType[] = [];
  
    // Loop through the gists and place each one in the appropriate position
    gists.forEach((gist: GistType) => {
      if (gist.parentId === null) {
        // Top-level gist (no parent), so add it to the root array
        rootGists.push(gistsById[gist.id]);
      } else if (gistsById[gist.parentId]) {
        // Add gist to its parent's 'children' array
        gistsById[gist.parentId].gists.push(gistsById[gist.id]);
      }
    });
    
    return rootGists;
    
  }