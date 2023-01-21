---
title: rc-demo
order: 1
nav:
  title: 指南
  order: 1
group:
  title: playgrounds
  order: 3
---

# rc-demo

```jsx
/**
 * title: 引用子包
 * description: 从 &apos;@odinlin/utils&apos; 子包中引入 toString 方法
 */

import React from 'react';
import { toString } from '@odinlin/utils';

export default () => (
  <div>
    <ul>
      <li>运行 `toString(1, 'lower')`</li>
      <li>返回值: { toString(1, 'lower') }</li>
    </ul>
  </div>
)
```
