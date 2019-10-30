import { assert } from 'chai';
import { describe, it } from 'mocha';

import Scribio from '../src/Scribio';
import TextType from '../src/Type/TextType';

describe('Scribio singleton', () => {
  describe('Type registration', () => {
    Scribio.registerType('a', TextType, { type: 'number' });
    Scribio.registerType('b', TextType, { type: 'textarea' });

    it('Should contain two types', () => {
      assert(Scribio.getType({ name: 'a' }) !== null);
      assert(Scribio.getType({ name: 'b' }) !== null);
    });

    it('Should throw an error if an unknown type is expected', () => {
      assert.throws(() => Scribio.getType({ name: 'c' }), Error, 'Unknown type c');
    });
  });

  describe('Renderer registration', () => {
    Scribio.registerRenderer('a', 'a1');
    Scribio.registerRenderer('b', 'a2');

    it('Should contain two renderers', () => {
      assert(Scribio.getRenderer({ name: 'a' }) !== null);
      assert(Scribio.getRenderer({ name: 'b' }) !== null);
    });

    it('Should throw an error if an unknown type is expected', () => {
      assert.throws(() => Scribio.getRenderer({ name: 'c' }), Error, 'Unknown renderer c');
    });
  });
});
