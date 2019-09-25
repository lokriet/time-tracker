import { Component, OnInit, Input, ViewChild, ElementRef, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export const DROPDOWN_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line: no-use-before-declare
  useExisting: forwardRef(() => DropdownComponent),
  multi: true,
};


@Component({
  selector: 'app-dropdown',
  providers: [DROPDOWN_VALUE_ACCESSOR],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit, ControlValueAccessor {
  @Input() items = [];
  @Input() selectedItem: any;
  @Input() displayProperty: string;
  @Input() placeholder = '';
  @ViewChild('dropdownElement', { static: true }) dropdownElement: ElementRef;
  @ViewChild('optionsListElement', { static: true }) optionsListElement: ElementRef;

  dropdownOpen = false;
  hoveredItemIndex = -1;
  selectedItemIndex = -1;

  onChange: any = () => { };

  constructor() { }

  ngOnInit() {
    document.addEventListener('mouseup', (event: MouseEvent) => {
      if (!this.dropdownElement.nativeElement.contains(event.target)) {
        this.dropdownOpen = false;
      }
    });

    if (this.selectedItem) {
      this.selectedItemIndex = this.items.indexOf(this.selectedItem);
    }
  }

  onDropdownInputClicked() {
    if (this.dropdownOpen) {
      this.dropdownOpen = false;
    } else {
      this.openDropdown();
    }
  }

  private openDropdown() {
    this.dropdownOpen = true;
    this.hoveredItemIndex = Math.max(this.selectedItem ? this.selectedItemIndex : 0, 0);
    this.scrollIntoViewIfNeeded(this.optionsListElement.nativeElement.children[this.hoveredItemIndex]);
  }

  onDropdownInputKey(event: KeyboardEvent) {
    // TODO
    if (event.keyCode === 13) { // enter
      event.stopPropagation(); // don't submit the form

      if (this.dropdownOpen && this.hoveredItemIndex !== -1) {
        this.selectedItem = this.items[this.hoveredItemIndex];
        this.selectedItemIndex = this.hoveredItemIndex;
        this.dropdownOpen = false;
      }
    } else if (event.keyCode === 38) { // arrow up
      if (this.dropdownOpen && this.hoveredItemIndex > 0) {
        this.hoveredItemIndex--;
        this.scrollIntoViewIfNeeded(this.optionsListElement.nativeElement.children[this.hoveredItemIndex]);
      }
    } else if (event.keyCode === 40) { // arrow down
      if (this.dropdownOpen && this.hoveredItemIndex < (this.items.length - 1)) {
        this.hoveredItemIndex++;
        this.scrollIntoViewIfNeeded(this.optionsListElement.nativeElement.children[this.hoveredItemIndex]);
      } else if (!this.dropdownOpen) {
        this.openDropdown();
      }
    } else if (event.keyCode === 27) { // escape
      if (this.dropdownOpen) {
        this.dropdownOpen = false;
      }
    } else {
      if (!this.dropdownOpen) {
        this.openDropdown();
      }
    }
  }

  private scrollIntoViewIfNeeded(element) {
    const parent = element.parentNode;
    const overTop = element.offsetTop < parent.scrollTop;
    const overBottom = (element.offsetTop + element.clientHeight) > (parent.clientHeight + parent.scrollTop);

    if (overTop) {
      parent.scrollTop = element.offsetTop;
    } else if (overBottom) {
      parent.scrollTop = element.offsetTop + parent.clientHeight;
    }
  }

  onItemSelected(itemIndex) {
    this.dropdownOpen = false;
    this.selectedItem = this.items[itemIndex];
    this.selectedItemIndex = itemIndex;
    this.onChange(this.selectedItem);
  }

  onItemHovered(index: number) {
    this.hoveredItemIndex = index;
  }

  writeValue(obj: any): void {
    this.selectedItem = obj;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    // TODO
  }
}
