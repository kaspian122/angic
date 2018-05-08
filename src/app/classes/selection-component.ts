import {SelectionModel} from "@angular/cdk/collections";
import {MatTableDataSource} from "@angular/material";
/**
 * Общий функционал для компонент с таблицами (множественный выбор)
 */
export abstract class SelectionComponent<T> {

  // Источник данных
  protected dataSource = new MatTableDataSource<T>();
  // Множественный выбор элементов
  protected selection = new SelectionModel(true, []);

  /**
   * Возврашает список id выбранных строк
   */
  getSelectedIds(): string[] {
    return this.selection.selected.map(s => s.id);
  }

  /**
   * Возвращает флаг выбраны ли все строки
   */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }

  /**
   * Выбирает все строки, если есть не выбранные, в противном случае - снимает выбор со всех
   */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /**
   * Обновляет таблицу(переопределить для обновления dataSource при наследовании прям от SelectionComponent)
   */
  protected updateTable(): void {
    this.selection.clear();
  }

}
