import { select } from 'd3-selection';
import 'd3-transition';
import 'd3-ease';
import { easeLinear } from 'd3-ease';
import { debounce } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import { Menu } from './model/Menu';
import { Event } from './model/Event';

export class ContextMenuOption {
  id?: string = btoa(uuidv4());
  selector?: string = 'body'; // 生效范围
  menus?: Menu[] = []; // 菜单列表
  maxWidth?: number = 160; // 菜单最大长度
  size?: 'small' | 'default' | 'large' = 'default'; // min-height:'24|32|40' font-size:'10|12|14'
  duration?: number = 100; // 动画时长
  mode?: 'default' | 'fixed' = 'default'; // default: 默认自适应高，超出最大长度（maxWidth）自动换行  fixed: 固定高度，超出省略号
  ulClassName?: string = '';
}

export class ContextMenu {

  wrap: any; // 菜单根元素
  option: ContextMenuOption = new ContextMenuOption();

  constructor(option?: ContextMenuOption) {
    this.option = { ...this.option, ...option } // 初始化数据
    this.wrap = select('body') // 初始化根元素
      .append('div')
      .attr('id', this.option.id)
      .classed('contextmenu-wrap', true);
    this._initListener();
  }

  private _initListener() {
    select(this.option.selector).on(Event.CONTEXTMENU, this.showContextMenu.bind(this));
    select(this.option.selector).on(Event.CLICK, this.closeContextMenu.bind(this));
  }

  /**
   * 销毁组件元素
   */
  destroy() {
    this.wrap.remove();
  }

  /**
   * 显示主菜单
   */
  showContextMenu() {
    event.preventDefault()

    let root = select(`#${this.option.id} ul.contextmenu`);
    if (!root || !root.node()) {
      root = this._createMenu(<any>event, this.wrap, { ...this.option, ulClassName: '' });
    }

    root
      .style('left', `${(<any>event).x}px`)
      .style('top', `${(<any>event).y + window.scrollY}px`)
      .style('overflow', 'hidden');
    // 计算菜单元素长高
    const { width, height } = this._calc(root);
    // 添加过渡效果
    root
      .style('width', `0px`)
      .style('height', `0px`)
      .transition()
      .duration(this.option.duration)
      .ease(easeLinear)
      .style('width', `${width}px`)
      .style('height', `${height}px`);
  }

  /**
   * 关闭主菜单
   */
  closeContextMenu = debounce(() => {
    select(`#${this.option.id} ul.contextmenu`)
      .style('overflow', 'hidden')
      .transition()
      .duration(this.option.duration)
      .ease(easeLinear)
      .style('width', '0px')
      .style('height', '0px');
  }, this.option.duration, { leading: true, trailing: false })

  /**
   * 计算菜单长高
   * @param ul 
   */
  private _calc(ul) {
    let width = 0;
    let height = 0;
    // 计算自适应宽高
    Array.from(ul.node().children).forEach((n: any) => {
      if (n.offsetWidth > width) {
        width = n.offsetWidth > this.option.maxWidth ? this.option.maxWidth : n.offsetWidth
        n.style.width = `${width}px`
      }
      height += n.offsetHeight;
    })
    return {
      width: width > this.option.maxWidth ? this.option.maxWidth : width,
      height: height
    };
  }

  /**
   * 
   * @param param event
   * @param option ContextMenuOption
   */
  private _createMenu({ x, y }, selection: any, option: ContextMenuOption) {
    const _this = this;
    // 生成ul元素
    const ul = selection
      .append('ul')
      .classed('contextmenu', true)
      .classed(option.size, true)
      .classed(option.ulClassName, true)
      // .style('height', '0px')
      .style('left', `${x}px`)
      .style('top', `${y}px`);
    // 生成li元素
    ul.selectAll('li')
      .data(option.menus)
      .enter()
      .append('li')
      .classed('contextmenu-item', true)
      .on(Event.MOUSEENTER, (data, i, array) => {
        if (option.mode == 'fixed') {
          select(array[i]).attr('title', data.name);
        }
        _this._handleMouseEnter.bind(_this)(data, i, array)
      })
      .on(Event.MOUSELEAVE, _this._handleMouseLeave.bind(_this))
      .on(Event.CLICK, _this._handleClick.bind(_this))
      .html((d) => {
        let html = `<span class="contextmenu-item-label">${d.name}</span>`;
        if (d.children && d.children.length > 0) {
          html += `<svg class="icon" viewBox="0 0 1024 1024" width="14" height="14"><path d="M434.944 790.624l-45.248-45.248L623.04 512l-233.376-233.376 45.248-45.248L713.568 512z" fill="#434343"></path></svg>`;
        }
        return html;
      })
    // 固定高度模式超出长度显示省略号，鼠标移动显示全部内容
    if (option.mode == 'fixed') {
      ul.classed('fixed', true)
        .selectAll('li')
        .style('height', (data, i, array) => {
          array[i].style.height = `${array[i].offsetHeight}px`;
        })
    }
    return ul;
  }

  private _showChildMenu(data, i, el) {
    select(el.parentNode).style('overflow', 'unset');
    let childMenu = select(el).select(`.contextmenu-child-${i}`)
    if (!childMenu.node()) {
      childMenu = this._createMenu(
        { x: el.offsetWidth, y: 0 },
        select(el),
        {
          ...this.option,
          ulClassName: `contextmenu-child-${i}`,
          menus: data.children
        }
      )
    }

    const { width, height } = this._calc(childMenu);
    childMenu
      .style('width', `0px`)
      .style('height', `${height}px`)
      .transition()
      .duration(this.option.duration)
      .style('width', `${width}px`)
      .style('height', `${height}px`);
  }

  private _closeChildMenu(data, i, el) {
    const childUl: any = Array.from(el.children).find((e: HTMLElement) => e.tagName === 'UL');
    if (childUl) {
      select(childUl)
        .style('overflow', 'hidden')
        .transition()
        .duration(this.option.duration)
        .ease(easeLinear)
        .style('width', '0px')
    }
  }

  /**
   * 鼠标进入菜单事件
   * @param data 菜单数据
   * @param i 菜单索引
   * @param array 菜单元素集合
   */
  private _handleMouseEnter(data, i, array) {
    if (data.children && data.children.length > 0) {
      this._showChildMenu(data, i, array[i]);
    }
  }

  /**
   * 鼠标离开菜单事件
   * @param data 菜单数据
   * @param i 菜单索引
   * @param array 菜单元素集合
   */
  private _handleMouseLeave(data, i, array) {
    if (data.children && data.children.length > 0) {
      this._closeChildMenu(data, i, array[i]);
    }
  }

  /**
   * 鼠标点击菜单事件
   * @param data 菜单数据
   * @param i 菜单索引
   * @param array 菜单元素集合
   */
  private _handleClick = debounce((data, i, array) => {
    if (data.children && data.children.length > 0) {
      this._showChildMenu(data, i, array[i]);
    } else {
      if (data.handler && data.handler instanceof Function)
        data.handler();
      this.closeContextMenu();
    }
  }, this.option.duration, { leading: true, trailing: false })
}