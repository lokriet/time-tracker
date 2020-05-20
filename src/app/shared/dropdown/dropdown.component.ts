import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
  styleUrls: ['./dropdown.component.scss'],
  animations: [
    trigger('collapsed', [
      state('true', style({ height: 0 })),
      state('false', style({ height: '*' })),
      transition('true => false', animate('400ms ease-in')),
      transition('false => true', animate('400ms ease-out'))
  ])
  ]
})
export class DropdownComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Input() items = [];
  @Input() selectedItem: any;
  @Input() displayProperty: string;
  @Input() placeholder = '';
  @Input() dropdownItemTemplate: TemplateRef<any>;

  @ViewChild('dropdownElement', { static: true }) dropdownElement: ElementRef;
  @ViewChild('optionsList', { static: true }) optionsListElement: ElementRef;
  @ViewChild('dropdownInput', {static: true}) dropdownInput: ElementRef;

  dropdownOpen = false;
  hoveredItemIndex = -1;
  selectedItemIndex = -1;

  unfilteredItems: {value: string, index: number}[];
  filteredItems: {value: string, index: number}[];
  filterString: string;

  onChange: any = () => { };

  constructor() { }

  ngOnInit() {
    document.addEventListener('mouseup', (event: MouseEvent) => {
      if (!this.dropdownElement.nativeElement.contains(event.target)) {
        this.dropdownOpen = false;
      }
    });

    this.unfilteredItems =  this.items.map((item, index) => {
      const value = this.getItemDisplayString(item);
      return {value, index};
    });

    this.resetDropdownState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (propName === 'items') {
        this.unfilteredItems =  this.items.map((item, index) => {
          const value = this.getItemDisplayString(item);
          return {value, index};
        });

        this.resetDropdownState();
      }
    }
  }

  private resetDropdownState() {
    if (this.selectedItem) {
      this.selectedItemIndex = this.items.indexOf(this.selectedItem);
    }

    this.filterString = null;
    this.filteredItems = [...this.unfilteredItems];
    this.hoveredItemIndex = -1;
  }

  getItemDisplayString(item: any): string {
    return (this.displayProperty ? item[this.displayProperty] : item) as string;
  }

  onDropdownInputClicked() {
    if (this.dropdownOpen) {
      this.dropdownOpen = false;
    } else {
      this.openDropdown();
    }
  }

  openDropdown() {
    this.dropdownOpen = true;
    this.hoveredItemIndex = Math.max(this.selectedItem ? this.selectedItemIndex : 0, 0);
    this.scrollIntoViewIfNeeded(this.optionsListElement.nativeElement.children[this.hoveredItemIndex]);
  }

  onDropdownInputKey(event: KeyboardEvent) {
    // TODO
    if (event.keyCode === 13) { // enter
      event.stopPropagation(); // don't submit the form

      if (this.dropdownOpen && this.hoveredItemIndex !== -1) {
        this.selectedItem = this.items[this.filteredItems[this.hoveredItemIndex].index];
        this.resetDropdownState();
        this.dropdownOpen = false;

        this.onChange(this.selectedItem);
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
    } else { // entering characters in input control => filter items in the dropdown
      if (!this.dropdownOpen) {
        this.openDropdown();
      }

      this.filterString = this.dropdownInput.nativeElement.value.toLowerCase();
      this.filteredItems = this.unfilteredItems
                              .filter(item => !this.filterString || item.value.toLowerCase().includes(this.filterString));

      this.selectedItemIndex = -1;
      this.hoveredItemIndex = 0;
      if (this.selectedItem) {
        this.selectedItemIndex =
            this.filteredItems.findIndex(filteredItem => filteredItem.value === this.getItemDisplayString(this.selectedItem));
        this.hoveredItemIndex = Math.max(this.selectedItemIndex, 0);
      }
    }
  }

  scrollIntoViewIfNeeded(element) {
    const parent = element.parentNode;
    const overTop = element.offsetTop < parent.scrollTop;
    const overBottom = (element.offsetTop + element.clientHeight) > (parent.clientHeight + parent.scrollTop);

    if (overTop) {
      parent.scrollTop = element.offsetTop;
    } else if (overBottom) {
      parent.scrollTop = element.offsetTop + parent.clientHeight;
    }
  }

  onItemSelected(itemIndex: number) {
    this.dropdownOpen = false;
    this.selectedItem = this.items[itemIndex];
    this.resetDropdownState();

    this.onChange(this.selectedItem);
  }

  onItemHovered(listIndex: number) {
    this.hoveredItemIndex = listIndex;
  }

  writeValue(obj: any): void {
    this.selectedItem = obj;
    if (this.selectedItem) {
      this.selectedItemIndex = this.items.indexOf(this.selectedItem);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    // TODO
  }
}
