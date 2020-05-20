import { Component, forwardRef, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { DropdownComponent } from '../dropdown.component';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { trigger, state, style, transition, animate } from '@angular/animations';

export const MULTIPLE_SELECT_DROPDOWN_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line: no-use-before-declare
  useExisting: forwardRef(() => MultipleSelectDropdownComponent),
  multi: true,
};

@Component({
  selector: 'app-multiple-select-dropdown',
  providers: [MULTIPLE_SELECT_DROPDOWN_VALUE_ACCESSOR],
  templateUrl: './multiple-select-dropdown.component.html',
  styleUrls: ['./multiple-select-dropdown.component.scss'],
  animations: [
    trigger('collapsed', [
      state('true', style({ height: 0 })),
      state('false', style({ height: '*' })),
      transition('true => false', animate('400ms ease-in')),
      transition('false => true', animate('400ms ease-out'))
    ])
  ]
})
export class MultipleSelectDropdownComponent extends DropdownComponent implements OnInit {
  faCheck = faCheck;

  selectedItems: any[];
  selectedMarkers: boolean[];

  constructor() {
    super();
   }

  ngOnInit() {
    if (!this.selectedItems) {
      this.selectedItems = [];
    }

    this.selectedMarkers = [];
    for (const item of this.items) {
      this.selectedMarkers.push(this.selectedItems && this.selectedItems.includes(item));
    }
  }

  onItemSelectionSwitched(index: number) {
    this.selectedMarkers[index] = !this.selectedMarkers[index];
    if (this.selectedMarkers[index]) {
      this.selectedItems.push(this.items[index]);
    } else {
      this.selectedItems.splice(this.selectedItems.indexOf(this.items[index], 1));
    }

    this.onChange(this.selectedItems);
  }

  onDropdownInputKey(event: KeyboardEvent) {
    // TODO
    if (event.keyCode === 13) { // enter
      event.stopPropagation(); // don't submit the form

      if (this.dropdownOpen) {
        this.dropdownOpen = false;
      } else {
        this.openDropdown();
      }
    } else if (event.keyCode === 38) { // arrow up
      if (this.dropdownOpen && this.hoveredItemIndex > 0) {
        this.hoveredItemIndex--;
        this.scrollIntoViewIfNeeded(this.optionsListElement.nativeElement.children[this.hoveredItemIndex]);
      }
    } else if (event.keyCode === 40) { // arrow down
      if (this.dropdownOpen && this.hoveredItemIndex < (this.filteredItems.length - 1)) {
        this.hoveredItemIndex++;
        this.scrollIntoViewIfNeeded(this.optionsListElement.nativeElement.children[this.hoveredItemIndex]);
      } else if (!this.dropdownOpen) {
        this.openDropdown();
      }
    } else if (event.keyCode === 27) { // escape
      if (this.dropdownOpen) {
        this.dropdownOpen = false;
      }
    } else if (event.keyCode === 32) { // space bar - select/deselect option
      event.preventDefault();

      if (this.dropdownOpen && this.hoveredItemIndex >= 0) {
        this.onItemSelectionSwitched(this.hoveredItemIndex);
      }
    } else {
      event.preventDefault();
    }
  }

  writeValue(obj: any[]) {
    this.selectedItems = obj;
    
  }

}
