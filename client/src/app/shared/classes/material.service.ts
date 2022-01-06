import { ElementRef } from "@angular/core";

declare var M: any; // in order to have no TS problems

export class MaterialService {
  static toast(message: string) {
    M.toast({ html: message });
  }

  static initializeFloatingButton(ref: ElementRef) {
    M.FloatingActionButton.init(ref.nativeElement);
  }

  static updateTextInputs() {
    M.updateTextFields();
  }
}
