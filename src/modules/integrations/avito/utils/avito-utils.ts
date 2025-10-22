export function checkingFileSize(file: Express.Multer.File, maxSizeMB = 24) {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error(`Файл слишком большой. Максимальный размер: ${maxSizeMB}MB`);
  }
}
