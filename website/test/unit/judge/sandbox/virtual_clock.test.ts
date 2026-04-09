import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { VirtualClock } from '@judge/sandbox/virtual_clock'

describe('VirtualClock', () => {
  let clock: VirtualClock

  beforeEach(() => {
    clock = new VirtualClock()
  })

  afterEach(() => {
    clock.uninstall()
  })

  it('initial now is 0', () => {
    expect(clock.now).toBe(0)
  })

  describe('install/uninstall', () => {
    it('after install, setTimeout is replaced', () => {
      const original_settimeout = globalThis.setTimeout
      clock.install()
      expect(globalThis.setTimeout).not.toBe(original_settimeout)
    })

    it('after uninstall, setTimeout is restored', () => {
      const original_settimeout = globalThis.setTimeout
      clock.install()
      clock.uninstall()
      expect(globalThis.setTimeout).toBe(original_settimeout)
    })
  })

  describe('tick', () => {
    beforeEach(() => {
      clock.install()
    })

    it('setTimeout fires after tick reaches delay', () => {
      let called = false
      setTimeout(() => { called = true }, 100)
      clock.tick(100)
      expect(called).toBe(true)
    })

    it('setTimeout does not fire before delay is reached', () => {
      let called = false
      setTimeout(() => { called = true }, 200)
      clock.tick(100)
      expect(called).toBe(false)
    })

    it('multiple timers fire in correct order', () => {
      const results: number[] = []
      setTimeout(() => { results.push(1) }, 100)
      setTimeout(() => { results.push(2) }, 50)
      setTimeout(() => { results.push(3) }, 150)
      clock.tick(200)
      expect(results).toEqual([2, 1, 3])
    })
  })

  describe('clearTimeout', () => {
    beforeEach(() => {
      clock.install()
    })

    it('cancelled timer does not fire', () => {
      let called = false
      const id = setTimeout(() => { called = true }, 100)
      clearTimeout(id)
      clock.tick(100)
      expect(called).toBe(false)
    })
  })

  describe('setInterval', () => {
    beforeEach(() => {
      clock.install()
    })

    it('fires repeatedly at interval', () => {
      let count = 0
      setInterval(() => { count++ }, 100)
      clock.tick(100)
      expect(count).toBe(1)
      clock.tick(100)
      expect(count).toBe(2)
      clock.tick(100)
      expect(count).toBe(3)
    })
  })

  describe('clearInterval', () => {
    beforeEach(() => {
      clock.install()
    })

    it('stops repeated firing', () => {
      let count = 0
      const id = setInterval(() => { count++ }, 100)
      clock.tick(100)
      expect(count).toBe(1)
      clearInterval(id)
      clock.tick(100)
      expect(count).toBe(1)
    })
  })

  describe('Date.now', () => {
    beforeEach(() => {
      clock.install()
    })

    it('returns virtual clock time after install', () => {
      expect(Date.now()).toBe(0)
      clock.tick(100)
      expect(Date.now()).toBe(100)
    })

    it('tick advances now correctly', () => {
      clock.tick(500)
      expect(clock.now).toBe(500)
      expect(Date.now()).toBe(500)
      clock.tick(250)
      expect(clock.now).toBe(750)
      expect(Date.now()).toBe(750)
    })
  })
})
