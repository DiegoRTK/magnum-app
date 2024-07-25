import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'magnum-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent {
  @Input() tabs: string[] = [];
  @Input() selectedTab: number = 0;
  @Output() tabSelected: EventEmitter<number> = new EventEmitter();

  public selectTab(index: number) {
    this.selectedTab = index;
    this.tabSelected.emit(index);
  }
}
