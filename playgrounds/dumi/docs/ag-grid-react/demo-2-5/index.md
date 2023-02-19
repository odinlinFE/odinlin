---
nav:
  title: agGridReact
  order: 2
group:
  title: Editing
  order: 3
title: 5. 单元格联动
order: 5
---

:::info{title="单元格联动"}
- ⛔️ 没有用 hooks 包裹处理的rowData，是不具备编辑脏检查能力的（应该是引用修改）

- grid编辑相关api
  - api.setRowData([]);
  - var rowNode = gridRef.current!.api.getRowNode('bb')!; 
    rowNode.setData(newData);
    rowNode.setDataValue('price', newPrice);
  - api.applyTransaction({a remove: rowData })!;
  - api.applyTransactionAsync({ update: [newItem] }, resultCallback);
:::

<code src="./index.tsx"></code>
