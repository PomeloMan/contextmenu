## contextmenu
自定义右键菜单
### 使用
```
const cm = contextmenu({
  selector: '.mode-fixed',
  mode: 'fixed',
  menus: [
    { name: '新增', handler: () => {} },
    { name: '修改', handler: () => {} },
    { name: '删除', handler: () => {} },
    { name: '更多', children: [
      { name: '新增', handler: () => {} },
      { name: '修改', handler: () => {} },
      { name: '删除', handler: () => {} },
    ] },
  ]
});
```
### API
##### 属性
|参数|说明|类型|默认值|
|----|----|----|----|
| id | 唯一标识 | string | btoa(uuidv4()) |
| selector | 作用元素 | string | 'body' |
| menus | 菜单 | Menu[] | [] |
| maxWidth | 最大长度 | number | 160 |
| number | 菜单大小 | 'small' \| 'default' \| 'large' | 'default'
| duration | 动画时长(ms) | number | 100 |
| mode | 模式 | 'default' \| 'fixed' | 'default' |
| ulClassName | 自定义根菜单class名称 | string | '' |

##### Menu属性
|参数|说明|类型|默认值|
|----------|---------|----------|----------|
| id       | 唯一标识 | string   | -        |
| name     | 菜单名称 | string   | -        |
| children | 子级菜单 | Menu[]   | -        |
| handler  | 点击事件 | Function | () => {} |

##### 方法
|名称|说明|
|------------------|-----------|
| destroy          | 销毁组件   |
| showContextMenu  | 显示主菜单 |
| closeContextMenu | 关闭主菜单 |