import { ElementRef } from "@angular/core";

declare var M: any; // in order to have no TS problems

export interface MaterialInstance {
  open(): void;
  close(): void;
  destroy(): void;
};

export interface MaterialDatePicker extends MaterialInstance {
  date?: Date;
};

export class MaterialService {
  static toast(message: string) {
    M.toast({ html: message });
  };

  static initializeFloatingButton(ref: ElementRef) {
    M.FloatingActionButton.init(ref.nativeElement);
  };

  static updateTextInputs() {
    M.updateTextFields();
  };

  static initModal(ref: ElementRef): MaterialInstance {
    return M.Modal.init(ref.nativeElement);
  };

  static initTooltip(ref: ElementRef): MaterialInstance {
    return M.Tooltip.init(ref.nativeElement);
  };

  static initDatePicker(ref: ElementRef, onClose: () => void): MaterialDatePicker {
    return M.Datepicker.init(ref.nativeElement, {
      format: 'dd.mm.yyyy',
      showClearButton: true,
      onClose,
    });
  };

  static initTapTarget(ref: ElementRef): MaterialInstance {
    return M.TapTarget.init(ref.nativeElement);
  };
}
