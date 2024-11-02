export interface UserType {
  id: number;
  username: string;
  password: string;
  name: string;
  image: string;
  gists: GistType[];
  versions: VersionType[];
  edits: EditType[];
}
export interface GistType {
  id: number;
  title: string;
  parentId: number | null;
  userId: number;
  createdAt: string;
  versions: VersionType[];
  gists: GistType[];
}

export interface VersionType {
  id: number;
  point: string;
  userId: number;
  user: UserType;
  createdAt: string;
  gistId: number;
  gist: GistType;
  edits: EditType[];
}

export interface EditType {
  id: number;
  body: string;
  userId: number;
  user: UserType;
  versionId: number;
  version: VersionType;
  newnessCount: number;
  importantCount: number;
  qualityCount: number;
  flag: boolean;
  createdAt: string;
  updatedAt: string;
}
