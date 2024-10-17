

type BaseType = "File" | "Directory"



interface FsEntity {
  eid: string,
  parentEid: string | null,
  ownerUid: string,
  name: string,
  baseType: BaseType,
  mimeType: string | null,
  size: number,
  createdAt: string,
  modifiedAt: string,
  isShared: boolean,
  sharedLink: string | null,

  _pseudoFsPath: string | undefined,
}



export type { FsEntity }