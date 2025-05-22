import type Quill from "quill"; // Import type only

let ctrlShiftAPressed = false;
let editorInstances: Quill[] = []; // ✅ Explicit type

export function setCtrlShiftAPressed(val: boolean): void {
  ctrlShiftAPressed = val;
}

export function getCtrlShiftAPressed(): boolean {
  return ctrlShiftAPressed;
}

export function setEditorInstances(refs: Quill[]): void {
  editorInstances = refs;
}

export function getEditorInstances(): Quill[] {
  return editorInstances;
}
