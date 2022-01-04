declare var M: any; // in order to have no TS problems

export class MaterialService {
  static toast(message: string) {
    M.toast({ html: message });
  }
}
