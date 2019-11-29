import test from 'ava';
import {rollup} from 'rollup';
import i18n from '..';

const baseConfig = {
  plugins: [i18n({
    language: {
      'a': 'amy',
      'b': {
        'c': 'not_amy'
      }
    }
  })],
};

const escapedConfig = {
  plugins: [i18n({
    escape: true,
    language: {
      'a': 'amy',
      'b': {
        'c': 'not_amy'
      },
      'd': 'escaped_amy',
      'e': '"amy_escaped"'
    }
  })]
};

test('replace simple', async t => {
  for (let i = 1; i < 6; i++) {
    const bundle = await rollup({
      ...baseConfig,
      input: `test/fixture/fixture${i}.js`,
    });

    bundle.generate({format:'esm'})
      .then(({ output }) => {
        const { code } = output[0]

        t.true(code.indexOf('const a = "amy"') !== -1);
        t.true(code.indexOf('const c = "not_amy"') !== -1);
      });
  }
});

test('replace escaped', async t => {
  for (let i = 6; i <= 6; i++) {
    const bundle = await rollup({
      ...escapedConfig,
      input: `test/fixture/fixture${i}.js`,
    });
    bundle.generate({format:'esm'})
      .then(({ output }) => {
        const { code } = output[0]

        t.true(code.indexOf('const a = "amy"') !== -1);
        t.true(code.indexOf('const c = "not_amy"') !== -1);
        t.true(code.indexOf('const d = "\\\'escaped_amy\\\'"') !== -1);
        t.true(code.indexOf('const e = "\\"amy_escaped\\""') !== -1);
      });
  }

})
