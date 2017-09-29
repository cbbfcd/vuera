import Vue from 'vue'
import { VuePlugin } from '../src'
import VueComponent from './fixtures/VueComponent'
import ReactComponent from './fixtures/ReactComponent'
import ReactPureFunctionalComponent from './fixtures/ReactPureFunctionalComponent'
import VueRegisteredComponent from './fixtures/VueRegisteredComponent'
import VueSingleFileComponent from './fixtures/VueSingleFileComponent.vue'

Vue.use(VuePlugin)

describe('VuePlugin', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>'
  })

  it('wraps React components into Vue', () => {
    new Vue({
      el: '#app',
      components: {
        'react-component': ReactComponent,
        'react-pure-functional-component': ReactPureFunctionalComponent,
        'vue-component': VueComponent,
        'vue-registered-component': VueRegisteredComponent,
        'vue-single-file-component': VueSingleFileComponent,
      },
      render (createElement) {
        return createElement('div', [
          createElement('vue-component', {
            props: {
              message: 'VUE',
              reset: jest.fn(),
            },
          }),
          createElement('vue-registered-component', {
            props: {
              message: 'VUE REGISTERED',
              reset: jest.fn(),
            },
          }),
          createElement('vue-single-file-component', {
            props: {
              message: 'VUE SINGLE FILE',
              reset: jest.fn(),
            },
          }),
          createElement('react-component', {
            props: {
              passedProps: {
                message: 'REACT',
                reset: jest.fn(),
              },
            },
          }),
          createElement('react-pure-functional-component', {
            props: {
              passedProps: {
                message: 'REACT FUNC',
                reset: jest.fn(),
              },
            },
          }),
        ])
      },
    })
    return Vue.nextTick().then(() => {
      // React 15 compat
      document.querySelectorAll('[data-reactroot]').forEach(el => {
        el.removeAttribute('data-reactroot')
      })
      expect(document.body.innerHTML).toBe(
        normalizeHTMLString(
          `<div>
            <div>
              <span>VUE</span>
              <button></button>
            </div>
            <div>
              <span>VUE REGISTERED</span>
              <button></button>
            </div>
            <div>
              <span>VUE SINGLE FILE</span> <button></button>
            </div>
            <div>
              <div>
                <span>REACT</span>
                <button></button>
              </div>
            </div>
            <div>
              <div>
                <span>REACT FUNC</span>
                <button></button>
              </div>
            </div>
          </div>`
        )
      )
    })
  })
})