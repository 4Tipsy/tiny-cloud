

export function prettifySize(sizeInBytes: number): string {
  switch (true) {
    case sizeInBytes < 1000:
      return `${sizeInBytes.toString().replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + ' ')} B`
    case sizeInBytes < 1000000:
      const sizeKB = sizeInBytes / 1000
      return `${sizeKB.toFixed(2).toString().replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + ' ')} KB`
    case sizeInBytes < 1000000000:
      const sizeMB = sizeInBytes / 1000000
      return `${sizeMB.toFixed(2).toString().replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + ' ')} MB`
    default:
      const sizeGB = sizeInBytes / 1000000000
      return `${sizeGB.toFixed(2).toString().replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + ' ')} GB`
  }
}





export function prettifySize_onlyMb(sizeInBytes: number): string {
  const sizeMB = sizeInBytes / 1000000
  return `${sizeMB.toFixed(2).toString().replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + ' ')} MB`
  
}