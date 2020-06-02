import './style.scss';
import { ContextMenu } from './src/ContextMenu';
import { select } from "d3-selection";

export class Main {

  contextmenus: Array<ContextMenu> = new Array<ContextMenu>();

  constructor() {
    this.demo();
    select('body').on('click', () => {
      this.contextmenus.forEach(cm => {
        cm.closeContextMenu()
      })
    });
  }

  demo() {
    this.defaultModeDemo();
    this.fixModeDemo();
    this.sizeDemo();
  }

  // 1.1 默认，菜单大小自适应(default)
  defaultModeDemo() {
    select('.container .mode-default-wrap')
      .append('div')
      .classed('mode-default', true);
    const log = select('.mode-default-wrap>div:first-child');
    const contextmenu = new ContextMenu({
      selector: '.mode-default',
      menus: getMenus(log)
    });
    this.contextmenus.push(contextmenu);
  }

  // 1.2 固定菜单大小(fixed)
  fixModeDemo() {
    select('.container .mode-fixed-wrap')
      .append('div')
      .classed('mode-fixed', true);
    const log = select('.mode-fixed-wrap>div:first-child');
    const contextmenu = new ContextMenu({
      selector: '.mode-fixed',
      mode: 'fixed',
      menus: getMenus(log)
    });
    this.contextmenus.push(contextmenu);
  }

  // 2 菜单大小
  sizeDemo() {
    select('.container .size-wrap')
      .append('div')
      .classed('size-small', true);
    select('.container .size-wrap')
      .append('div')
      .classed('size-default', true);
    select('.container .size-wrap')
      .append('div')
      .classed('size-large', true);
    select('.size-small')
      .append('span')
      .style('position', 'absolute')
      .style('left', '10px')
      .style('top', '10px')
      .style('color', '#333')
      .html('<p>小</p><p>font-size:10px</p><p>min-height:24px</p>');
    select('.size-default')
      .append('span')
      .style('position', 'absolute')
      .style('left', '10px')
      .style('top', '10px')
      .style('color', '#333')
      .html('<p>默认</p><p>font-size:12px</p><p>min-height:32px</p>');
    select('.size-large')
      .append('span')
      .style('position', 'absolute')
      .style('left', '10px')
      .style('top', '10px')
      .style('color', '#333')
      .html('<p>大</p><p>font-size:14px</p><p>min-height:40px</p>');
    const log = select('.size-wrap>div:first-child');
    const smallContextmenu = new ContextMenu({
      selector: '.size-small',
      mode: 'fixed',
      size: 'small',
      menus: getMenus(log)
    });
    const defaultContextmenu = new ContextMenu({
      selector: '.size-default',
      mode: 'fixed',
      size: 'default',
      menus: getMenus(log)
    });
    const largeContextmenu = new ContextMenu({
      selector: '.size-large',
      mode: 'fixed',
      size: 'large',
      menus: getMenus(log)
    });
    this.contextmenus.push(smallContextmenu);
    this.contextmenus.push(defaultContextmenu);
    this.contextmenus.push(largeContextmenu);
  }
}

new Main();

export function getMenus(log) {
  const menus = [
    { name: '新增', handler: function () { log.append('p').html('你点击了新增按钮。'); } },
    { name: '修改', handler: () => { log.append('p').html('你点击了修改按钮。'); } },
    { name: '删除', handler: () => { log.append('p').html('你点击了删除按钮。'); } },
    {
      name: '更多1', children: [
        {
          name: '更多1-1', children: [
            { name: '更多1-1-1', handler: () => { log.append('p').html('你点击了更多1-1-1按钮。'); } },
            { name: '更多1-1-2', handler: () => { log.append('p').html('你点击了更多1-1-2按钮。'); } },
          ]
        },
        { name: '更多1-2', handler: function () { log.append('p').html('你点击了更多1-2按钮。'); } },
        { name: '更多1-3', handler: function () { log.append('p').html('你点击了更多1-3按钮。'); } },
      ]
    },
    { name: '这是一段很长的自适应内容，你可以通过调整maxWidth改变最长宽度限制，默认值160', handler: () => { log.append('p').html('你点击了这是一段很长的自适应内容按钮。'); } }
  ]
  return menus;
}