export interface Attach {
  id: string,
  file: File,
  name: string,
  mode: 'add'|'del'|'keep',
  thumbnail: string
}
