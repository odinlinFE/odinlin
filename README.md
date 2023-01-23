# odinlin organization

WIP...

 /** Set to `true` so stop the grid updating data after and edit. When this is set, it is intended the application will update the data, eg in an external immutable store, and then pass the new dataset to the grid. */
readOnlyEdit ?: boolean;
   /** Value has changed after editing. Only fires when doing Read Only Edits, ie `readOnlyEdit=true`. */
   onCellEditRequest?(event: CellEditRequestEvent<TData>): void;
