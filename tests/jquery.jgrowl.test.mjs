import { createRequire } from "node:module";
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Script } from 'node:vm';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';

import { jqueryVersions } from './jquery-versions.mjs';
import { npmVersions } from './npm-versions.mjs';
const jquerySources = jqueryVersions.map(({ version: name }) => ({
  name,
  source: readFileSync(new URL('../.cache/jquery/' + name + '.js', import.meta.url), 'utf8'),
}));
const pluginSource = readFileSync(new URL('../jquery.jgrowl.js', import.meta.url), 'utf8');
let dom;
let $;

function notifications(container = '#jGrowl') {
  return $(container).find('.jGrowl-message').parent();
}

function update(container = '#jGrowl', count = 1) {
  for (let index = 0; index < count; index += 1) $(container).jGrowl('update');
}

function messages(container = '#jGrowl') {
  return notifications(container).find('.jGrowl-message').map(function () { return $(this).text(); }).get();
}

describe.each(jquerySources)('jGrowl with jQuery $name', ({ source }) => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
    // jQuery 3.0 skips animations when document.hidden is true.
    dom = new JSDOM('<!doctype html><html><body></body></html>', { runScripts: 'outside-only', url: 'https://example.test/', pretendToBeVisual: true });
    dom.window.Date = Date;
    dom.window.setInterval = setInterval;
    dom.window.clearInterval = clearInterval;
    dom.window.setTimeout = setTimeout;
    dom.window.clearTimeout = clearTimeout;
    dom.window.eval(source);
    new Script(pluginSource, { filename: resolve('jquery.jgrowl.js') }).runInContext(dom.getInternalVMContext());
    $ = dom.window.jQuery;
    $.fx.off = true;
  });

  afterEach(() => {
    dom.window.close();
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('shares the public defaults with the instance prototype', () => {
    expect($.jGrowl.defaults).toBe($.fn.jGrowl.prototype.defaults);
  });

  it('queues notifications until the configured update interval', () => {
    $.jGrowl.defaults.check = 100;
    $.jGrowl('Hello');
    expect(notifications()).toHaveLength(0);
    vi.advanceTimersByTime(99);
    expect(notifications()).toHaveLength(0);
    vi.advanceTimersByTime(1);
    expect(messages()).toEqual(['Hello']);
  });

  it('creates and reuses one default container', () => {
    $.jGrowl('First');
    $.jGrowl('Second');
    update('#jGrowl', 2);
    expect($('#jGrowl')).toHaveLength(1);
    expect($('#jGrowl').hasClass('top-right')).toBe(true);
    expect(messages()).toEqual(['First', 'Second']);
  });

  it('uses default appendTo and position values', () => {
    $('body').append('<nav id="navigation"></nav>');
    $.jGrowl.defaults.appendTo = '#navigation';
    $.jGrowl.defaults.position = 'bottom-left';
    $.jGrowl('Nested');
    update();
    expect($('#navigation > #jGrowl')).toHaveLength(1);
    expect($('#jGrowl').hasClass('bottom-left')).toBe(true);
    expect(messages()).toEqual(['Nested']);
  });

  it('uses per-call appendTo and position values', () => {
    $('body').append('<section id="target"></section>');
    $.jGrowl('Nested', { appendTo: '#target', position: 'center' });
    expect($('#target > #jGrowl.center')).toHaveLength(1);
  });

  it.each(['toString', 'constructor', 'hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', '__defineGetter__', '__defineSetter__', '__lookupGetter__', '__lookupSetter__', 'defaults', 'notifications', 'element', 'interval'])('renders the message %s when it is not a jGrowl command', (message) => {
    $.jGrowl(message);
    update();
    expect(messages()).toEqual([message]);
  });

  it.each(['custom', 'toString'])('runs an own instance command named %s only in its container', (command) => {
    $('body').append('<div id="one"></div><div id="two"></div>');
    $('#one, #two').jGrowl('update');
    const instance = $('#one').data('jGrowl.instance');
    instance[command] = function (message, options) {
      expect(this).toBe(instance);
      this.create(message, options);
    };

    const container = $('#one');
    expect(container.jGrowl(command, 'Custom message', { header: 'Custom header' })).toBe(container);
    $('#two').jGrowl(command);
    update('#one');
    update('#two');

    expect(messages('#one')).toEqual(['Custom message']);
    expect($('#one .jGrowl-header').text()).toBe('Custom header');
    expect(messages('#two')).toEqual([command]);
    expect(Object.prototype.hasOwnProperty.call($('#two').data('jGrowl.instance'), command)).toBe(false);
  });

  it('supports object shorthand and preserves jQuery chaining', () => {
    const container = $('<div id="custom"></div>').appendTo('body');
    expect(container.jGrowl({ message: 'Shorthand', header: 'Title' })).toBe(container);
    update('#custom');
    expect(messages('#custom')).toEqual(['Shorthand']);
    expect(container.find('.jGrowl-header').text()).toBe('Title');
  });

  it('supports object shorthand through the global wrapper', () => {
    $.jGrowl({ message: 'Shorthand', header: 'Title' });
    update();
    expect(messages()).toEqual(['Shorthand']);
    expect($('.jGrowl-header').text()).toBe('Title');
  });

  it('uses placement options from global object shorthand', () => {
    $('body').append('<section id="host"></section>');
    $.jGrowl({ message: 'Nested shorthand', appendTo: '#host', position: 'bottom-left' });
    update();
    expect($('#host > #jGrowl.bottom-left')).toHaveLength(1);
    expect(messages()).toEqual(['Nested shorthand']);
  });

  it('keeps queues and notification options independent between containers', () => {
    $('body').append('<div id="one"></div><div id="two"></div>');
    $('#one').jGrowl('First', { theme: 'manilla', sticky: true });
    $('#two').jGrowl('Second');
    update('#one');
    expect(messages('#one')).toEqual(['First']);
    expect(messages('#two')).toEqual([]);
    update('#two');
    expect(messages('#two')).toEqual(['Second']);
    expect(notifications('#two').data('jGrowl').sticky).toBe(false);
    expect(notifications('#two').hasClass('manilla')).toBe(false);
  });

  it('creates independent instances for every element in a collection', () => {
    $('body').append('<div class="container"></div><div class="container"></div>');
    $('.container').jGrowl('Both').jGrowl('update');
    expect($('.jGrowl-message').map(function () { return $(this).text(); }).get()).toEqual(['Both', 'Both']);
    const instances = $('.container').map(function () { return $(this).data('jGrowl.instance'); }).get();
    expect(instances[0]).not.toBe(instances[1]);
    expect(instances[0].notifications).not.toBe(instances[1].notifications);
  });

  it('preserves message and header HTML', () => {
    $.jGrowl('<strong>Hello</strong>', { header: '<em>Header</em>' });
    update();
    expect($('.jGrowl-message strong').text()).toBe('Hello');
    expect($('.jGrowl-header em').text()).toBe('Header');
  });

  it('applies theme, theme state, and Bootstrap group classes', () => {
    $.jGrowl('Styled', { theme: 'manilla', themeState: 'error', group: 'alert-danger' });
    update();
    for (const name of ['jGrowl-notification', 'alert', 'ui-state-error', 'ui-corner-all', 'manilla', 'alert-danger']) {
      expect(notifications().hasClass(name)).toBe(true);
    }
  });

  it('supports an empty theme state and group', () => {
    $.jGrowl('Plain', { themeState: '', group: '' });
    update();
    expect(notifications().attr('class')).not.toContain('ui-state-');
    expect(notifications().attr('class')).not.toContain('undefined');
  });

  it('does not mutate the caller options or persist per-message options', () => {
    const options = { theme: 'manilla', sticky: true, themeState: 'error' };
    $.jGrowl('First', options);
    $.jGrowl('Second');
    update('#jGrowl', 2);
    expect(options).toEqual({ theme: 'manilla', sticky: true, themeState: 'error' });
    expect(notifications().last().data('jGrowl').sticky).toBe(false);
    expect(notifications().last().hasClass('default')).toBe(true);
    expect($.jGrowl.defaults.themeState).toBe('highlight');
  });

  it('appends messages in arrival order by default', () => {
    ['First', 'Second', 'Third'].forEach((message) => $.jGrowl(message));
    update('#jGrowl', 3);
    expect(messages()).toEqual(['First', 'Second', 'Third']);
  });

  it('prepends messages when glue is before', () => {
    ['First', 'Second', 'Third'].forEach((message) => $.jGrowl(message, { glue: 'before' }));
    update('#jGrowl', 3);
    expect(messages()).toEqual(['Third', 'Second', 'First']);
  });

  it('limits visible notifications and releases queued messages after close', () => {
    $.jGrowl.defaults.pool = 2;
    ['First', 'Second', 'Third'].forEach((message) => $.jGrowl(message, { sticky: true }));
    update('#jGrowl', 3);
    expect(messages()).toEqual(['First', 'Second']);
    notifications().first().find('.jGrowl-close').trigger('click');
    update();
    expect(messages()).toEqual(['Second', 'Third']);
  });

  it('does not limit notifications when pool is zero', () => {
    for (let index = 0; index < 6; index += 1) $.jGrowl(String(index));
    update('#jGrowl', 6);
    expect(notifications()).toHaveLength(6);
  });

  it('expires a notification only after its full life', () => {
    $.jGrowl('Temporary', { life: 1000 });
    update();
    vi.setSystemTime(Date.now() + 1000);
    update();
    expect(messages()).toEqual(['Temporary']);
    vi.setSystemTime(Date.now() + 1);
    update();
    expect(messages()).toEqual([]);
  });

  it('accepts a numeric string for life', () => {
    $.jGrowl('Temporary', { life: '1000' });
    update();
    vi.setSystemTime(Date.now() + 1001);
    update();
    expect(messages()).toEqual([]);
  });

  it('keeps sticky notifications until explicit close', () => {
    $.jGrowl('Sticky', { sticky: true, life: 1 });
    update();
    vi.setSystemTime(Date.now() + 10000);
    update();
    expect(messages()).toEqual(['Sticky']);
    notifications().find('.jGrowl-close').trigger('click');
    expect(messages()).toEqual([]);
  });

  it('pauses every notification in the hovered container only', () => {
    $('body').append('<div id="other"></div>');
    $.jGrowl('One', { life: 1 });
    $.jGrowl('Two', { life: 1 });
    $('#other').jGrowl('Other', { life: 1 });
    update('#jGrowl', 2);
    update('#other');
    notifications().first().trigger('mouseover');
    vi.setSystemTime(Date.now() + 2);
    update();
    update('#other');
    expect(messages()).toEqual(['One', 'Two']);
    expect(messages('#other')).toEqual([]);
    notifications().first().trigger('mouseout');
    update();
    expect(messages()).toEqual([]);
  });

  it('keeps new arrivals paused until the hovered notification is left', () => {
    $.fx.off = false;
    $.jGrowl('Hovered', { life: 10, openDuration: 0, closeDuration: 0 });
    update();
    const hovered = notifications().first();
    hovered.trigger('mouseover');
    $.jGrowl('Arrival', { life: 10, openDuration: 0, closeDuration: 0 });
    update();
    vi.setSystemTime(Date.now() + 11);
    update();
    expect(messages()).toEqual(['Hovered', 'Arrival']);
    hovered.trigger('mouseout');
    update();
    expect(messages()).toEqual([]);
  });

  it.each(['close', 'remove'])('releases hover after its notification is removed by %s without mouseout', (action) => {
    $.jGrowl('Hovered');
    update();
    const hovered = notifications();
    hovered.trigger('mouseover');
    if (action === 'close') hovered.trigger('jGrowl.beforeClose');
    else hovered.remove();
    $.jGrowl('Arrival after removal', { life: 1 });
    update();
    vi.setSystemTime(Date.now() + 2);
    update();
    expect(messages()).toEqual([]);
    expect($('#jGrowl').data('jGrowl.pause')).toBe(false);
    expect($('#jGrowl').data('jGrowl.hover')).toBeUndefined();
  });

  it('keeps the hover owner paused when an unhovered sibling leaves or closes', () => {
    $.jGrowl('Hovered', { life: 1 });
    $.jGrowl('Sibling', { life: 1 });
    update('#jGrowl', 2);
    const hovered = notifications().first();
    const sibling = notifications().last();
    hovered.trigger('mouseover');
    sibling.trigger('mouseout').trigger('jGrowl.beforeClose');
    vi.setSystemTime(Date.now() + 2);
    update();
    expect(messages()).toEqual(['Hovered']);
    expect($('#jGrowl').data('jGrowl.pause')).toBe(true);
    expect($('#jGrowl').data('jGrowl.hover')).toBe(hovered[0]);
    hovered.trigger('mouseout');
    update();
    expect(messages()).toEqual([]);
  });

  it('does not clear a manual notification pause when hover ends', () => {
    $.jGrowl('Manually paused', { life: 1 });
    update();
    const notification = notifications();
    notification.data('jGrowl.pause', true).trigger('mouseover').trigger('mouseout');
    vi.setSystemTime(Date.now() + 2);
    update();
    expect(messages()).toEqual(['Manually paused']);
    notification.data('jGrowl.pause', false);
    update();
    expect(messages()).toEqual([]);
  });

  it('resets the container hover pause on shutdown', () => {
    $.jGrowl('Hovered');
    update();
    notifications().trigger('mouseover');
    expect($('#jGrowl').data('jGrowl.pause')).toBe(true);
    $('#jGrowl').jGrowl('shutdown');
    expect($('#jGrowl').data('jGrowl.pause')).toBeUndefined();
    expect($('#jGrowl').data('jGrowl.hover')).toBeUndefined();
    $.jGrowl('Restarted', { life: 1 });
    update();
    vi.setSystemTime(Date.now() + 2);
    update();
    expect(messages()).toEqual([]);
  });

  it('runs close callbacks once despite repeated clicks and hover during closing', () => {
    $.fx.off = false;
    let beforeClose = 0;
    let close = 0;
    $.jGrowl('Closing', {
      life: 1, openDuration: 0, closeDuration: 100, animateClose: { opacity: 0 },
      beforeClose: function () { beforeClose += 1; },
      close: function () { close += 1; },
    });
    update();
    const notification = notifications();
    notification.find('.jGrowl-close').trigger('click').trigger('click');
    notification.trigger('mouseover').trigger('mouseout');
    expect(notification.data('jGrowl.pause')).toBe(true);
    expect(notification.data('jGrowl.closing')).toBe(true);
    notification.trigger('jGrowl.beforeClose').trigger('jGrowl.close');
    notification.data('jGrowl.pause', false);
    vi.setSystemTime(Date.now() + 2);
    update();
    expect(beforeClose).toBe(1);
    expect(close).toBe(0);
    vi.advanceTimersByTime(200);
    expect(beforeClose).toBe(1);
    expect(close).toBe(1);
    expect(messages()).toEqual([]);
  });

  it('ignores repeated direct close events but permits retry after a close veto', () => {
    $.fx.off = false;
    let beforeClose = 0;
    let close = 0;
    $.jGrowl('Retry close', {
      openDuration: 0, closeDuration: 100, animateClose: { opacity: 0 },
      beforeClose: function () { beforeClose += 1; },
      close: function () { close += 1; return close === 1 ? false : undefined; },
    });
    update();
    const notification = notifications();
    notification.trigger('jGrowl.close').trigger('jGrowl.close').trigger('jGrowl.close');
    vi.advanceTimersByTime(200);
    expect(beforeClose).toBe(0);
    expect(close).toBe(1);
    expect(messages()).toEqual(['Retry close']);
    notification.trigger('jGrowl.beforeClose');
    vi.advanceTimersByTime(200);
    expect(beforeClose).toBe(1);
    expect(close).toBe(2);
    expect(messages()).toEqual([]);
  });

  it('permits a later close after beforeClose vetoes an attempt with animations enabled', () => {
    $.fx.off = false;
    let beforeClose = 0;
    let close = 0;
    $.jGrowl('Retry before close', {
      openDuration: 0, closeDuration: 100, animateClose: { opacity: 0 },
      beforeClose: function () { beforeClose += 1; return beforeClose === 1 ? false : undefined; },
      close: function () { close += 1; },
    });
    update();
    const notification = notifications();
    notification.trigger('jGrowl.beforeClose');
    expect(messages()).toEqual(['Retry before close']);
    notification.trigger('jGrowl.beforeClose').trigger('jGrowl.beforeClose');
    vi.advanceTimersByTime(200);
    expect(beforeClose).toBe(2);
    expect(close).toBe(1);
    expect(messages()).toEqual([]);
  });

  it('logs immediately with container context and the queued options', () => {
    let received;
    $.jGrowl('Logged', { theme: 'custom', log: function (...args) { received = { context: this, args }; } });
    expect(received.context[0]).toBe($('#jGrowl')[0]);
    expect(received.args[0][0]).toBe($('#jGrowl')[0]);
    expect(received.args[1]).toBe('Logged');
    expect(received.args[2].theme).toBe('custom');
    expect(notifications()).toHaveLength(0);
  });

  it('calls lifecycle callbacks in order with notification context and all arguments', () => {
    const calls = [];
    const options = {};
    for (const name of ['beforeOpen', 'open', 'afterOpen', 'beforeClose', 'close']) {
      options[name] = function (...args) { calls.push({ name, context: this, args }); };
    }
    $.jGrowl('Lifecycle', options);
    update();
    const notification = notifications()[0];
    notifications().find('.jGrowl-close').trigger('click');
    expect(calls.map(({ name }) => name)).toEqual(['beforeOpen', 'open', 'afterOpen', 'beforeClose', 'close']);
    for (const call of calls) {
      expect(call.context[0]).toBe(notification);
      expect(call.args[0][0]).toBe(notification);
      expect(call.args[1]).toBe('Lifecycle');
      expect(call.args[2].header).toBe('');
      expect(call.args[3][0]).toBe($('#jGrowl')[0]);
    }
  });

  it.each(['beforeOpen', 'open'])('cancels opening when %s returns false', (name) => {
    const calls = [];
    $.jGrowl('Cancelled', {
      [name]: function () { calls.push(name); return false; },
      afterOpen: function () { calls.push('afterOpen'); },
    });
    update();
    expect(notifications()).toHaveLength(0);
    expect(calls).toEqual([name]);
  });

  it('cancels closing when beforeClose returns false', () => {
    let closed = false;
    $.jGrowl('Protected', { beforeClose: function () { return false; }, close: function () { closed = true; } });
    update();
    notifications().find('.jGrowl-close').trigger('click');
    expect(messages()).toEqual(['Protected']);
    expect(closed).toBe(false);
  });

  it('retains the notification when close returns false', () => {
    $.jGrowl('Retained', { close: function () { return false; } });
    update();
    notifications().trigger('jGrowl.beforeClose');
    expect(messages()).toEqual(['Retained']);
  });

  it('removes a notification when the close callback is not a function', () => {
    $.jGrowl('No callback', { close: null });
    update();
    notifications().trigger('jGrowl.beforeClose');
    expect(messages()).toEqual([]);
  });

  it('allows a close retry after its callback throws and the effects queue is recovered', () => {
    const failure = new Error('Close failed once');
    let attempts = 0;
    $.jGrowl('Recover close', {
      openDuration: 0,
      closeDuration: 0,
      animateClose: { opacity: 0 },
      close: function () {
        attempts += 1;
        if (attempts === 1) throw failure;
      },
    });
    update();
    const notification = notifications();
    let caught;
    try {
      notification.trigger('jGrowl.beforeClose');
    } catch (error) {
      caught = error;
    }
    expect(caught).toBe(failure);
    expect(attempts).toBe(1);
    // jQuery retains its in-progress queue when an animation callback throws.
    notification.clearQueue().dequeue();
    notification.trigger('jGrowl.beforeClose');
    $.fx.tick();
    expect(attempts).toBe(2);
    expect(messages()).toEqual([]);
    expect($.hasData(notification[0])).toBe(false);
  });

  it('passes click callback arguments without closing the notification', () => {
    let received;
    $.jGrowl('Clickable', { click: function (...args) { received = { context: this, args }; } });
    update();
    const notification = notifications()[0];
    notifications().trigger('click');
    expect(received.context[0]).toBe(notification);
    expect(received.args[0][0]).toBe(notification);
    expect(received.args[1]).toBe('Clickable');
    expect(received.args[2].theme).toBe('default');
    expect(received.args[3][0]).toBe($('#jGrowl')[0]);
    expect(messages()).toEqual(['Clickable']);
  });

  it('closes from the custom close button without bubbling a message click', () => {
    let clicks = 0;
    $.jGrowl('Close me', { closeTemplate: '<span>Dismiss</span>', click: function () { clicks += 1; } });
    update();
    expect(notifications().find('.jGrowl-close span').text()).toBe('Dismiss');
    notifications().find('.jGrowl-close span').trigger('click');
    expect(messages()).toEqual([]);
    expect(clicks).toBe(0);
  });

  it('shows one custom closer for multiple notifications and closes all', () => {
    $.jGrowl.defaults.closerTemplate = '<div class="alert alert-info">Close All</div>';
    ['One', 'Two', 'Three'].forEach((message) => $.jGrowl(message));
    update('#jGrowl', 3);
    expect($('.jGrowl-closer')).toHaveLength(1);
    expect($('.jGrowl-closer').text()).toBe('Close All');
    expect($('.jGrowl-closer').hasClass('alert-info')).toBe(true);
    $('.jGrowl-closer').trigger('click');
    update();
    expect(messages()).toEqual([]);
    expect($('.jGrowl-closer')).toHaveLength(0);
  });

  it('passes the container to the closer callback', () => {
    let received;
    $.jGrowl.defaults.closer = function (container) { received = { context: this, container }; };
    $.jGrowl('One');
    $.jGrowl('Two');
    update('#jGrowl', 2);
    $('.jGrowl-closer').trigger('click');
    expect(received.context).toBe($('#jGrowl')[0]);
    expect(received.container).toBe($('#jGrowl')[0]);
  });

  it('disables the closer through the defaults', () => {
    $.jGrowl.defaults.closer = false;
    $.jGrowl('One');
    $.jGrowl('Two');
    update('#jGrowl', 2);
    expect(notifications()).toHaveLength(2);
    expect($('.jGrowl-closer')).toHaveLength(0);
  });

  it('removes the closer when only one notification remains', () => {
    $.jGrowl('One');
    $.jGrowl('Two');
    update('#jGrowl', 2);
    notifications().first().find('.jGrowl-close').trigger('click');
    update();
    expect(messages()).toEqual(['Two']);
    expect($('.jGrowl-closer')).toHaveLength(0);
  });

  it('honors individual close vetoes when closing the whole container', () => {
    $.jGrowl('Protected', { beforeClose: function () { return false; } });
    $.jGrowl('Normal');
    update('#jGrowl', 2);
    $('#jGrowl').jGrowl('close');
    expect(messages()).toEqual(['Protected']);
  });

  it('maps the legacy speed to both animation durations', () => {
    $.jGrowl('Legacy', { speed: 'slow', openDuration: 100, closeDuration: 200 });
    update();
    expect(notifications().data('jGrowl').openDuration).toBe('slow');
    expect(notifications().data('jGrowl').closeDuration).toBe('slow');
  });

  it('preserves custom animation properties and separate durations', () => {
    const animateOpen = { height: 'show', width: 'show' };
    const animateClose = { height: 'hide', width: 'show' };
    $.jGrowl('Animated', { animateOpen, animateClose, openDuration: 100, closeDuration: 200, easing: 'linear' });
    update();
    const options = notifications().data('jGrowl');
    expect(options.animateOpen).toEqual(animateOpen);
    expect(options.animateClose).toEqual(animateClose);
    expect(options.openDuration).toBe(100);
    expect(options.closeDuration).toBe(200);
    expect(options.easing).toBe('linear');
    notifications().find('.jGrowl-close').trigger('click');
    expect(messages()).toEqual([]);
  });

  it('clears the legacy opacity filter after opening', () => {
    $.support = $.support || {};
    $.support.opacity = false;
    $.jGrowl('Legacy opacity', {
      beforeOpen: function (notification) {
        notification[0].style.filter = 'alpha(opacity=90)';
        // Model the legacy browser API at the DOM boundary.
        notification[0].style.removeAttribute = function (name) { this.removeProperty(name); };
      },
    });
    update();
    expect(notifications()[0].style.filter).toBe('');
  });

  it('runs without the optional corners plugin', () => {
    expect($.fn.corner).toBeUndefined();
    $.jGrowl('No plugin');
    update();
    expect(messages()).toEqual(['No plugin']);
  });

  it('passes the radius and notification to an installed corners plugin', () => {
    const calls = [];
    $.fn.corner = function (radius) { calls.push({ element: this[0], radius }); return this; };
    $.jGrowl('Rounded', { corners: '5px' });
    update();
    expect(calls).toEqual([{ element: notifications()[0], radius: '5px' }]);
  });

  it('skips the corners plugin when the radius is empty', () => {
    let called = false;
    $.fn.corner = function () { called = true; return this; };
    $.jGrowl('Square', { corners: '' });
    update();
    expect(called).toBe(false);
  });

  it('clears notifications, pending work, and instance data on shutdown', () => {
    $.jGrowl('Visible');
    $.jGrowl('Pending');
    update();
    const instance = $('#jGrowl').data('jGrowl.instance');
    $('#jGrowl').jGrowl('shutdown');
    expect($('#jGrowl').children()).toHaveLength(0);
    expect($('#jGrowl').hasClass('jGrowl')).toBe(false);
    expect($('#jGrowl').data('jGrowl.instance')).toBeUndefined();
    expect(instance.notifications).toHaveLength(0);
    vi.advanceTimersByTime(1000);
    expect(messages()).toEqual([]);
  });

  it('restarts after shutdown without replaying old queued messages', () => {
    $.jGrowl('Old');
    $('#jGrowl').jGrowl('shutdown');
    $.jGrowl('New');
    vi.advanceTimersByTime($.jGrowl.defaults.check);
    expect(messages()).toEqual(['New']);
    expect($('#jGrowl').hasClass('jGrowl')).toBe(true);
  });

  it.each(['beforeOpen', 'open'])('keeps only the replacement when %s restarts its container', (hook) => {
    const callbacks = [];
    const cornerMessages = [];
    let retired;
    let replacement;
    let oldNotification;
    $.fn.corner = function () {
      cornerMessages.push(this.find('.jGrowl-message').text());
      return this.addClass('corners-applied');
    };
    const options = {
      beforeOpen: function () { callbacks.push('beforeOpen'); },
      open: function () { callbacks.push('open'); },
      afterOpen: function () { callbacks.push('afterOpen'); },
    };
    options[hook] = function (notification, message, config, container) {
      callbacks.push(hook);
      oldNotification = notification;
      retired = container.data('jGrowl.instance');
      container.jGrowl('shutdown');
      container.jGrowl('New', { sticky: true });
      replacement = container.data('jGrowl.instance');
      notification.trigger('jGrowl.beforeOpen').trigger('jGrowl.open').trigger('jGrowl.afterOpen');
    };
    $.jGrowl('Old', options);
    update();
    const expectedCallbacks = hook === 'beforeOpen' ? ['beforeOpen'] : ['beforeOpen', 'open'];
    expect(callbacks).toEqual(expectedCallbacks);
    expect(messages()).toEqual([]);
    expect(cornerMessages).toEqual([]);
    expect($('#jGrowl').hasClass('jGrowl')).toBe(true);
    expect($('#jGrowl').data('jGrowl.instance')).toBe(replacement);
    expect(replacement.interval).not.toBeNull();
    expect(replacement.notifications.map((pending) => pending.message)).toEqual(['New']);
    expect(retired.interval).toBeNull();
    expect(retired.notifications).toEqual([]);
    expect($.hasData(oldNotification[0])).toBe(false);
    expect(oldNotification[0].isConnected).toBe(false);
    expect(callbacks).toEqual(expectedCallbacks);
    vi.advanceTimersByTime($.jGrowl.defaults.check);
    expect(messages()).toEqual(['New']);
    expect(cornerMessages).toEqual(['New']);
    expect(replacement.notifications).toEqual([]);
  });

  it('preserves a replacement created during shutdown and ignores later retired shutdown calls', () => {
    let replacement;
    let oldClosed = 0;
    let replacementClosed = 0;
    $.jGrowl('Old', {
      close: function (notification, message, config, container) {
        oldClosed += 1;
        container.jGrowl('shutdown');
        container.jGrowl('Replacement', { sticky: true, close: function () { replacementClosed += 1; } });
        replacement = container.data('jGrowl.instance');
      },
    });
    update();
    const retired = $('#jGrowl').data('jGrowl.instance');
    $('#jGrowl').jGrowl('shutdown');
    const replacementTimer = replacement.interval;
    expect(oldClosed).toBe(1);
    expect($('#jGrowl').data('jGrowl.instance')).toBe(replacement);
    expect($('#jGrowl').hasClass('jGrowl')).toBe(true);
    expect(replacementTimer).not.toBeNull();
    expect(replacement.notifications.map((pending) => pending.message)).toEqual(['Replacement']);
    retired.create('Stale pending message');
    retired.shutdown();
    retired.shutdown();
    expect(retired.interval).toBeNull();
    expect(retired.notifications).toEqual([]);
    expect(replacement.notifications.map((pending) => pending.message)).toEqual(['Replacement']);
    vi.advanceTimersByTime($.jGrowl.defaults.check);
    expect(messages()).toEqual(['Replacement']);
    retired.shutdown();
    expect(messages()).toEqual(['Replacement']);
    expect($('#jGrowl').hasClass('jGrowl')).toBe(true);
    expect($('#jGrowl').data('jGrowl.instance')).toBe(replacement);
    expect(replacement.interval).toBe(replacementTimer);
    expect(replacementClosed).toBe(0);
    expect(oldClosed).toBe(1);
  });

  it.each(['detached', 'attached'])('cleans a retired %s notification when its opening animation completes', (placement) => {
    $.fx.off = false;
    let notification;
    let afterOpen = 0;
    $.jGrowl('Old', {
      openDuration: 100, animateOpen: { opacity: 1 },
      beforeOpen: function (element) { notification = element; },
      afterOpen: function () { afterOpen += 1; },
    });
    update();
    if (placement === 'detached') {
      notification.detach();
      $('#jGrowl').jGrowl('shutdown');
    } else {
      $('#jGrowl').removeData('jGrowl.instance');
    }
    $.jGrowl('Replacement', { sticky: true, openDuration: 0 });
    update();
    vi.advanceTimersByTime(200);
    expect(messages()).toEqual(['Replacement']);
    expect(afterOpen).toBe(0);
    expect(notification.data('jGrowl')).toBeUndefined();
    expect($.hasData(notification[0])).toBe(false);
    expect(notification[0].isConnected).toBe(false);
  });

  it('does not add a retired instance closer after its corners plugin replaces the container', () => {
    let replacement;
    $.fn.corner = function () {
      if (this.find('.jGrowl-message').text() === 'Old') {
        $('#jGrowl').jGrowl('shutdown');
        $.jGrowl('New one', { sticky: true });
        replacement = $('#jGrowl').data('jGrowl.instance');
        replacement.defaults = $.extend({}, $.jGrowl.defaults, { closer: false });
        $.jGrowl('New two', { sticky: true });
        update('#jGrowl', 2);
      }
      return this.addClass('corners-applied');
    };
    $.jGrowl('Old');
    update();
    expect(messages()).toEqual(['New one', 'New two']);
    expect($('#jGrowl').data('jGrowl.instance')).toBe(replacement);
    expect($('.jGrowl-closer')).toHaveLength(0);
    expect(notifications().filter('.corners-applied')).toHaveLength(2);
  });

  it('stops the interval after its container is removed', () => {
    $.jGrowl('Removed');
    const instance = $('#jGrowl').data('jGrowl.instance');
    $('#jGrowl').remove();
    vi.advanceTimersByTime($.jGrowl.defaults.check);
    expect(instance.interval).toBeNull();
    expect($('#jGrowl')).toHaveLength(0);
  });

  it('stops the old interval when the container instance is replaced', () => {
    $.jGrowl('Old pending message');
    const oldInstance = $('#jGrowl').data('jGrowl.instance');
    $('#jGrowl').removeData('jGrowl.instance');
    $.jGrowl('Replacement');
    const replacement = $('#jGrowl').data('jGrowl.instance');
    vi.advanceTimersByTime($.jGrowl.defaults.check);
    expect(oldInstance.interval).toBeNull();
    expect(replacement.interval).not.toBeNull();
    expect(messages()).toEqual(['Replacement']);
  });

  it('shuts down one container without stopping another', () => {
    $('body').append('<div id="one"></div><div id="two"></div>');
    $('#one').jGrowl('One');
    $('#two').jGrowl('Two');
    $('#one').jGrowl('shutdown');
    vi.advanceTimersByTime($.jGrowl.defaults.check);
    expect(messages('#one')).toEqual([]);
    expect(messages('#two')).toEqual(['Two']);
  });

  it('registers the AMD module with its jQuery dependency', () => {
    let definition;
    const define = function (dependencies, factory) { definition = { dependencies, factory }; };
    define.amd = {};
    new Script(pluginSource, { filename: resolve('jquery.jgrowl.js') }).runInNewContext({ define, setInterval, clearInterval });
    expect(Array.from(definition.dependencies)).toEqual(['jquery']);
    definition.factory($);
    $.jGrowl('AMD');
    update();
    expect(messages()).toEqual(['AMD']);
  });

  it('exports a CommonJS installer that accepts an explicit jQuery instance', () => {
    const module = { exports: {} };
    new Script(pluginSource, { filename: resolve('jquery.jgrowl.js') }).runInNewContext({ module, setInterval, clearInterval });
    expect(module.exports(dom.window, $)).toBe($);
    $.jGrowl('CommonJS');
    update();
    expect(messages()).toEqual(['CommonJS']);
  });

  it('clears the container and interval when a scheduled callback throws', () => {
    $.jGrowl('Broken', { beforeOpen: function () { throw new Error('Callback failed'); } });
    const instance = $('#jGrowl').data('jGrowl.instance');
    expect(() => vi.advanceTimersByTime($.jGrowl.defaults.check)).toThrow('Callback failed');
    expect(instance.interval).toBeNull();
    expect(instance.notifications).toHaveLength(0);
    expect($('#jGrowl').children()).toHaveLength(0);
    expect($('#jGrowl').data('jGrowl.instance')).toBeUndefined();
  });

  it('clears the interval and instance even if shutdown callbacks throw', () => {
    $.jGrowl('Broken close', { close: function () { throw new Error('Close failed'); } });
    update();
    const instance = $('#jGrowl').data('jGrowl.instance');
    expect(() => $('#jGrowl').jGrowl('shutdown')).toThrow('Close failed');
    expect(instance.interval).toBeNull();
    expect($('#jGrowl').children()).toHaveLength(0);
    expect($('#jGrowl').data('jGrowl.instance')).toBeUndefined();
  });


  it('survives closing while the opening animation is still running', () => {
    $.fx.off = false;
    let opened = 0;
    let closed = 0;
    $.jGrowl('Race', {
      openDuration: 100,
      closeDuration: 20,
      afterOpen: function () { opened += 1; },
      close: function () { closed += 1; },
    });
    update();
    expect(messages()).toEqual(['Race']);
    notifications().find('.jGrowl-close').trigger('click');
    vi.advanceTimersByTime(200);
    expect(opened).toBe(1);
    expect(closed).toBe(1);
    expect(messages()).toEqual([]);
  });

  it('does not reinsert a notification closed from its open callback', () => {
    $.jGrowl('Closed immediately', { open: function (notification) { notification.trigger('jGrowl.beforeClose'); } });
    update();
    expect(messages()).toEqual([]);
  });

  it('leaves a rejected close eligible for a later attempt', () => {
    let attempts = 0;
    $.jGrowl('Retry', { beforeClose: function () { attempts += 1; return attempts !== 1; } });
    update();
    notifications().trigger('jGrowl.beforeClose');
    expect(messages()).toEqual(['Retry']);
    notifications().trigger('jGrowl.beforeClose');
    expect(attempts).toBe(2);
    expect(messages()).toEqual([]);
  });

  it('does not call open when beforeOpen vetoes opening', () => {
    let called = false;
    $.jGrowl('Rejected', {
      beforeOpen: function () { return false; },
      open: function () { called = true; },
    });
    update();
    expect(called).toBe(false);
    expect(notifications()).toHaveLength(0);
  });


  it('loads jQuery from CommonJS when a global window exists', () => {
    const module = { exports: {} };
    const requests = [];
    const require = function (name) { requests.push(name); return $; };
    new Script(pluginSource, { filename: resolve('jquery.jgrowl.js') }).runInNewContext({ module, require, window: dom.window, setInterval, clearInterval });
    expect(module.exports()).toBe($);
    expect(requests).toEqual(['jquery']);
    $.jGrowl('Window');
    update();
    expect(messages()).toEqual(['Window']);
  });

  it('loads the jQuery 4 factory after its main entry rejects a missing global window', () => {
    const module = { exports: {} };
    const requests = [];
    let receivedRoot;
    const require = function (name) {
      requests.push(name);
      if (name === 'jquery') throw new Error('jQuery requires a window with a document');
      return { jQueryFactory: function (root) { receivedRoot = root; return $; } };
    };
    new Script(pluginSource, { filename: resolve('jquery.jgrowl.js') }).runInNewContext({ module, require, setInterval, clearInterval });
    expect(module.exports(dom.window)).toBe($);
    expect(requests).toEqual(['jquery', 'jquery/factory']);
    expect(receivedRoot).toBe(dom.window);
    $.jGrowl('Factory');
    update();
    expect(messages()).toEqual(['Factory']);
  });

  it('uses a legacy CommonJS factory without probing another jQuery package', () => {
    const module = { exports: {} };
    const requests = [];
    let receivedRoot;
    const require = function (name) {
      requests.push(name);
      return function (root) { receivedRoot = root; return $; };
    };
    new Script(pluginSource, { filename: resolve('jquery.jgrowl.js') }).runInNewContext({ module, require, setInterval, clearInterval });
    expect(module.exports(dom.window)).toBe($);
    expect(requests).toEqual(['jquery']);
    expect(receivedRoot).toBe(dom.window);
    $.jGrowl('Legacy factory');
    update();
    expect(messages()).toEqual(['Legacy factory']);
  });

  it('accepts a CommonJS jQuery module that is already initialized', () => {
    const module = { exports: {} };
    const requests = [];
    const require = function (name) { requests.push(name); return $; };
    new Script(pluginSource, { filename: resolve('jquery.jgrowl.js') }).runInNewContext({ module, require, setInterval, clearInterval });
    expect(module.exports(dom.window)).toBe($);
    expect(requests).toEqual(['jquery']);
  });

  it('propagates errors from the selected CommonJS package', () => {
    const module = { exports: {} };
    const failure = new Error('Dependency failed');
    const require = function () { throw failure; };
    new Script(pluginSource, { filename: resolve('jquery.jgrowl.js') }).runInNewContext({ module, require });
    expect(() => module.exports(dom.window)).toThrow(failure);
  });

  it('propagates errors from the jQuery 4 factory', () => {
    const module = { exports: {} };
    const failure = new Error('Invalid window');
    const require = function (name) {
      if (name === 'jquery') throw new Error('jQuery requires a window with a document');
      return { jQueryFactory: function () { throw failure; } };
    };
    new Script(pluginSource, { filename: resolve('jquery.jgrowl.js') }).runInNewContext({ module, require });
    expect(() => module.exports(dom.window)).toThrow(failure);
  });

});

const require = createRequire(import.meta.url);


describe('CommonJS entry point', () => {
  it('creates jQuery without a global window using the installed jQuery factory', () => {
    const dom = new JSDOM('<!doctype html><body></body>');
    try {
      const $ = require('../jquery.jgrowl.js')(dom.window);
      expect($.fn.jquery).toBe('4.1.0');
      $.fx.off = true;
      $.jGrowl('CommonJS', { sticky: true });
      $('#jGrowl').jGrowl('update');
      expect($('.jGrowl-message').text()).toBe('CommonJS');
      $('#jGrowl').jGrowl('shutdown');
    } finally {
      dom.window.close();
    }
  });
});


describe.each(npmVersions)('CommonJS with published npm jQuery $version', ({ version }) => {
  it('loads the actual package entry point and renders a notification', () => {
    const dom = new JSDOM('<!doctype html><body></body>');
    const consumerRequire = createRequire(resolve('.cache/npm', version, 'consumer.cjs'));
    let jquery;
    try {
      jquery = consumerRequire('jgrowl')(dom.window);
      expect(jquery.fn.jquery).toBe(version);
      jquery.fx.off = true;
      jquery.jGrowl('Published package', { sticky: true });
      jquery('#jGrowl').jGrowl('update');
      expect(jquery('.jGrowl-message').text()).toBe('Published package');
    } finally {
      if (jquery && jquery('#jGrowl').data('jGrowl.instance')) {
        jquery('#jGrowl').jGrowl('shutdown');
      }
      dom.window.close();
    }
  });
});
