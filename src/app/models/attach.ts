export interface Attach {
  id: string,
  file: File,
  mode: 'add'|'del'|'keep',
  thumbnail: string
}