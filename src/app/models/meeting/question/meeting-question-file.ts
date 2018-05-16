/**
 * Файл для вопроса ОСС
 */
export interface MeetingQuestionFile {

  /**
   * ID
   */
  id: string;

  /**
   * Имя файла
   */
  name: string;

  /**
   * Размер файла
   */
  fileSize: number;

  /**
   * Путь до файла
   */
  filePath: string;

  /**
   * Mime
   */
  mimeType: string;
}
